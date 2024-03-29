/*
 * Licensed to the Nervousync Studio (NSYC) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * 1.0.0
 * [New] MD5 and HmacMD5 Support
 */
'use strict';
import {Crypto, CryptoUtils} from "./Crypto.js";
const HASH_INDEX_NORMAL = [
    [1, 2, 3, 1],
    [0, 1, 2, 0],
    [3, 0, 1, 3],
    [2, 3, 0, 2]
];
const HASH_INDEX_FINAL = [
    [2, 1, 3, 1],
    [1, 0, 2, 0],
    [0, 3, 1, 3],
    [3, 2, 0, 2]
];
const RC_FF = [
    0xD76AA478, 0xE8C7B756, 0x242070DB, 0xC1BDCEEE, 0xF57C0FAF, 0x4787C62A, 0xA8304613, 0xFD469501,
    0x698098D8, 0x8B44F7AF, 0xFFFF5BB1, 0x895CD7BE, 0x6B901122, 0xFD987193, 0xA679438E, 0x49B40821
];
const RC_GG = [
    0xF61E2562, 0xC040B340, 0x265E5A51, 0xE9B6C7AA, 0xD62F105D, 0x02441453, 0xD8A1E681, 0xE7D3FBC8,
    0x21E1CDE6, 0xC33707D6, 0xF4D50D87, 0x455A14ED, 0xA9E3E905, 0xFCEFA3F8, 0x676F02D9, 0x8D2A4C8A
];
const RC_HH = [
    0xFFFA3942, 0x8771F681, 0x6D9D6122, 0xFDE5380C, 0xA4BEEA44, 0x4BDECFA9, 0xF6BB4B60, 0xBEBFBC70,
    0x289B7EC6, 0xEAA127FA, 0xD4EF3085, 0x04881D05, 0xD9D4D039, 0xE6DB99E5, 0x1FA27CF8, 0xC4AC5665
];
const RC_II = [
    0xF4292244, 0x432AFF97, 0xAB9423A7, 0xFC93A039, 0x655B59C3, 0x8F0CCC92, 0xFFEFF47D, 0x85845DD1,
    0x6FA87E4F, 0xFE2CE6E0, 0xA3014314, 0x4E0811A1, 0xF7537E82, 0xBD3AF235, 0x2AD7D2BB, 0xEB86D391
];
export default class MD5 extends Crypto {
    constructor(key = "") {
        super();
        this.reset();
        if (key.length > 0) {
            this._inPad = [];
            this._outPad = [];
            this._inPad[15] = this._outPad[15] = 0;
            let _keyBytes = key.getBytes(false);
            if (_keyBytes.length > 16) {
                this.append(key);
                _keyBytes = this.finish(false);
                this.reset();
            }
            for (let i = 0 ; i < 16 ; i++) {
                this._inPad[i] = _keyBytes[i] ^ 0x36363636;
                this._outPad[i] = _keyBytes[i] ^ 0x5C5C5C5C;
            }
            this._calculate(this._inPad);
            this._length = 64;
        }
        this._hmac = key.length > 0;
    }
    static get CryptoName() {
        return "MD5";
    }
    static newInstance(key) {
        return new MD5(key);
    }
    append(string = "") {
        this.appendBinary(string.getBytes(false), string.toUTF8().length);
    }
    appendBinary(dataBytes, dataLength) {
        this._buffer = this._buffer.concat(dataBytes);
        this._length += dataLength;
        this._preCalc();
    }
    _final(dataBytes, length, total) {
        if (length !== -1) {
            dataBytes[length >> 2] |= 0x80 << ((length % 4) << 3);
        }
        if (total !== -1) {
            dataBytes[14] = (total & 0xFFFFFFFF);
            dataBytes[15] = Math.floor(total / 0x100000000);
        }
        this._calculate(dataBytes);
    }
    finish(hex = true) {
        let _tail = this._buffer.slice();
        let _length = this._length % 64;
        if (this._buffer.length > 13) {
            this._final(_tail, _length, -1);
            _length = -1;
            _tail = [];
        }
        this._final(_tail, _length, this._length * 8);
        if (this._hmac) {
            _tail = this._hash.slice();
            this.reset();
            this._calculate(this._outPad);
            this._final(_tail, 16, this._hmacTotal());
        }
        let _result = this._hash.slice();
        if (hex) {
            _result = _result.toHex();
        }
        this.reset();
        return _result;
    }
    reset() {
        this._buffer = [];
        this._length = 0;
        this._hash = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
    }
    _preCalc() {
        while (this._buffer.length > 16) {
            this._calculate(this._buffer.slice(0, 16));
            this._buffer = this._buffer.slice(16);
        }
    }
    _hmacTotal() {
        return 80 * 8;
    }
    static _rotateAndAdd(x = 0, y = 0, _count) {
        return CryptoUtils.SAFE_ADD(x.safeRotateLeft(_count), y);
    }
    static _md5FF(i = 0, j = 0, k = 0, x = 0, y = 0) {
        return CryptoUtils.SAFE_ADD(((i & j | ~i & k)), x + y);
    }
    static _md5GG(i = 0, j = 0, k = 0, x = 0, y = 0) {
        return CryptoUtils.SAFE_ADD(((i & k | j & ~k)), x + y);
    }
    static _md5HH(i = 0, j = 0, k = 0, x = 0, y = 0) {
        return CryptoUtils.SAFE_ADD((i ^ j ^ k), x + y);
    }
    static _md5II(i = 0, j = 0, k = 0, x = 0, y = 0) {
        return CryptoUtils.SAFE_ADD(((i ^ (j | ~k))), x + y);
    }
    _calculate(_tmp) {
        let _hash = this._hash.slice();
        this._md5Cycle(_tmp, 0, 1, MD5._md5FF, RC_FF, [7, 12, 17, 22]);
        this._md5Cycle(_tmp, 1, 5, MD5._md5GG, RC_GG, [5,  9, 14, 20]);
        this._md5Cycle(_tmp, 5, 3, MD5._md5HH, RC_HH, [4, 11, 16, 23]);
        this._md5Cycle(_tmp, 0, 7, MD5._md5II, RC_II, [6, 10, 15, 21], true);
        this._hash[0] = CryptoUtils.SAFE_ADD(_hash[0], this._hash[0]);
        this._hash[1] = CryptoUtils.SAFE_ADD(_hash[1], this._hash[1]);
        this._hash[2] = CryptoUtils.SAFE_ADD(_hash[2], this._hash[2]);
        this._hash[3] = CryptoUtils.SAFE_ADD(_hash[3], this._hash[3]);
    }
    _md5Cycle(tmp, begin, step, cycleFunc, rc, r, final = false) {
        let hashIndex = final ? HASH_INDEX_FINAL : HASH_INDEX_NORMAL;
        let _tmpIndex = begin;
        for (let i = 0 ; i < 16 ; i++) {
            let _cnt = i % 4;
            let _index = 4 - _cnt;
            if (_index === 4) {
                _index = 0;
            }
            this._hash[_index] = MD5._rotateAndAdd(
                CryptoUtils.SAFE_ADD(this._hash[_index],
                    cycleFunc.call(this, this._hash[hashIndex[_cnt][0]], this._hash[hashIndex[_cnt][1]],
                        this._hash[hashIndex[_cnt][2]], tmp[_tmpIndex], rc[i])),
                this._hash[hashIndex[_cnt][3]], r[_cnt]);
            _tmpIndex += step;
            if (_tmpIndex >= 16) {
                _tmpIndex -= 16;
            }
        }
    }
}