/*
 * Licensed to the Nervousync Studio (NSYC) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * 1.0.0
 * [New] SHA Utils for Calculate String and Binary Data SHA Signature.
 *      Support Algorithms: SHA1/SHA224/SHA256/SHA384/SHA512/SHA3_224/SHA3_256/SHA3_384/SHA3_512/
 *                          SHAKE128/SHAKE256/Keccak224/Keccak256/Keccak384/Keccak512
 */
'use strict';

import Crypto from "./Crypto.js";

class Int64 {
    constructor(high, low) {
        this._high = high;
        this._low = low;
    }

    clone() {
        return new Int64(this._high, this._low);
    }

    safeRotateRight(bit) {
        return new Int64(((this._high >>> bit) | (this._low << (32 - bit))),
            ((this._low >>> bit) | (this._high << (32 - bit))));
    }

    safeRotateLeft(bit) {
        if (bit > 32) {
            return new Int64(((this._low << (bit - 32)) | (this._high >>> (64 - bit))),
                ((this._high << (bit - 32)) | (this._low >>> (64 - bit))));
        } else if (bit !== 0) {
            return new Int64(((this._high << bit) | (this._low >>> (32 - bit))),
                ((this._low << bit) | (this._high >>> (32 - bit))));
        } else {
            return new Int64(this._high, this._low);
        }
    }

    reverseAndRotate(bit) {
        return new Int64(((this._low >>> bit) | (this._high << (32 - bit))),
            ((this._high >>> bit) | (this._low << (32 - bit))));
    }

    shiftRight(bit) {
        return new Int64((this._high >>> bit), ((this._low >>> bit) | this._high << (32 - bit)));
    }

    NOT() {
        return new Int64(~this._high, ~this._low);
    }

    /**
     * @return {Int64}
     */
    static add() {
        let _a = 0, _b = 0, _c = 0, _d = 0;
        let _length = arguments.length;
        for (let i = 0 ; i < _length ; i++) {
            _a += (arguments[i]._low & 0xFFFF);
            _b += (arguments[i]._low >>> 16);
            _c += (arguments[i]._high & 0xFFFF);
            _d += (arguments[i]._high >>> 16);
        }
        _b += (_a >>> 16);
        _c += (_b >>> 16);
        _d += (_c >>> 16);
        return new Int64(((_c & 0xFFFF) | (_d << 16)), ((_a & 0xFFFF) | (_b << 16)));
    }

    static XOR(x, ...codes) {
        let _high = x._high | 0, _low = x._low | 0;
        let _length = codes.length;
        for (let i = 0 ; i < _length ; i++) {
            _high ^= codes[i]._high;
            _low ^= codes[i]._low;
        }
        return new Int64(_high, _low);
    }

    static AND(x, ...codes) {
        let _high = x._high | 0, _low = x._low | 0;
        let _length = codes.length;
        for (let i = 0 ; i < _length ; i++) {
            _high &= codes[i]._high;
            _low &= codes[i]._low;
        }
        return new Int64(_high, _low);
    }
}

const K = [
    new Int64(0x428A2F98, 0xD728AE22), new Int64(0x71374491, 0x23EF65CD),
    new Int64(0xB5C0FBCF, 0xEC4D3B2F), new Int64(0xE9B5DBA5, 0x8189DBBC),
    new Int64(0x3956C25B, 0xF348B538), new Int64(0x59F111F1, 0xB605D019),
    new Int64(0x923F82A4, 0xAF194F9B), new Int64(0xAB1C5ED5, 0xDA6D8118),
    new Int64(0xD807AA98, 0xA3030242), new Int64(0x12835B01, 0x45706FBE),
    new Int64(0x243185BE, 0x4EE4B28C), new Int64(0x550C7DC3, 0xD5FFB4E2),
    new Int64(0x72BE5D74, 0xF27B896F), new Int64(0x80DEB1FE, 0x3B1696B1),
    new Int64(0x9BDC06A7, 0x25C71235), new Int64(0xC19BF174, 0xCF692694),
    new Int64(0xE49B69C1, 0x9EF14AD2), new Int64(0xEFBE4786, 0x384F25E3),
    new Int64(0x0FC19DC6, 0x8B8CD5B5), new Int64(0x240CA1CC, 0x77AC9C65),
    new Int64(0x2DE92C6F, 0x592B0275), new Int64(0x4A7484AA, 0x6EA6E483),
    new Int64(0x5CB0A9DC, 0xBD41FBD4), new Int64(0x76F988DA, 0x831153B5),
    new Int64(0x983E5152, 0xEE66DFAB), new Int64(0xA831C66D, 0x2DB43210),
    new Int64(0xB00327C8, 0x98FB213F), new Int64(0xBF597FC7, 0xBEEF0EE4),
    new Int64(0xC6E00BF3, 0x3DA88FC2), new Int64(0xD5A79147, 0x930AA725),
    new Int64(0x06CA6351, 0xE003826F), new Int64(0x14292967, 0x0A0E6E70),
    new Int64(0x27B70A85, 0x46D22FFC), new Int64(0x2E1B2138, 0x5C26C926),
    new Int64(0x4D2C6DFC, 0x5AC42AED), new Int64(0x53380D13, 0x9D95B3DF),
    new Int64(0x650A7354, 0x8BAF63DE), new Int64(0x766A0ABB, 0x3C77B2A8),
    new Int64(0x81C2C92E, 0x47EDAEE6), new Int64(0x92722C85, 0x1482353B),
    new Int64(0xA2BFE8A1, 0x4CF10364), new Int64(0xA81A664B, 0xBC423001),
    new Int64(0xC24B8B70, 0xD0F89791), new Int64(0xC76C51A3, 0x0654BE30),
    new Int64(0xD192E819, 0xD6EF5218), new Int64(0xD6990624, 0x5565A910),
    new Int64(0xF40E3585, 0x5771202A), new Int64(0x106AA070, 0x32BBD1B8),
    new Int64(0x19A4C116, 0xB8D2D0C8), new Int64(0x1E376C08, 0x5141AB53),
    new Int64(0x2748774C, 0xDF8EEB99), new Int64(0x34B0BCB5, 0xE19B48A8),
    new Int64(0x391C0CB3, 0xC5C95A63), new Int64(0x4ED8AA4A, 0xE3418ACB),
    new Int64(0x5B9CCA4F, 0x7763E373), new Int64(0x682E6FF3, 0xD6B2B8A3),
    new Int64(0x748F82EE, 0x5DEFB2FC), new Int64(0x78A5636F, 0x43172F60),
    new Int64(0x84C87814, 0xA1F0AB72), new Int64(0x8CC70208, 0x1A6439EC),
    new Int64(0x90BEFFFA, 0x23631E28), new Int64(0xA4506CEB, 0xDE82BDE9),
    new Int64(0xBEF9A3F7, 0xB2C67915), new Int64(0xC67178F2, 0xE372532B),
    new Int64(0xCA273ECE, 0xEA26619C), new Int64(0xD186B8C7, 0x21C0C207),
    new Int64(0xEADA7DD6, 0xCDE0EB1E), new Int64(0xF57D4F7F, 0xEE6ED178),
    new Int64(0x06F067AA, 0x72176FBA), new Int64(0x0A637DC5, 0xA2C898A6),
    new Int64(0x113F9804, 0xBEF90DAE), new Int64(0x1B710B35, 0x131C471B),
    new Int64(0x28DB77F5, 0x23047D84), new Int64(0x32CAAB7B, 0x40C72493),
    new Int64(0x3C9EBE0A, 0x15C9BEBC), new Int64(0x431D67C4, 0x9C100D4C),
    new Int64(0x4CC5D4BE, 0xCB3E42B6), new Int64(0x597F299C, 0xFC657E2A),
    new Int64(0x5FCB6FAB, 0x3AD6FAEC), new Int64(0x6C44198C, 0x4A475817)
];

const R = [
    [ 0, 36,  3, 41, 18],
    [ 1, 44, 10, 45,  2],
    [62,  6, 43, 15, 61],
    [28, 55, 25, 21, 56],
    [27, 20, 39,  8, 14]
];
const RC = [
    new Int64(0x00000000, 0x00000001), new Int64(0x00000000, 0x00008082),
    new Int64(0x80000000, 0x0000808A), new Int64(0x80000000, 0x80008000),
    new Int64(0x00000000, 0x0000808B), new Int64(0x00000000, 0x80000001),
    new Int64(0x80000000, 0x80008081), new Int64(0x80000000, 0x00008009),
    new Int64(0x00000000, 0x0000008A), new Int64(0x00000000, 0x00000088),
    new Int64(0x00000000, 0x80008009), new Int64(0x00000000, 0x8000000A),
    new Int64(0x00000000, 0x8000808B), new Int64(0x80000000, 0x0000008B),
    new Int64(0x80000000, 0x00008089), new Int64(0x80000000, 0x00008003),
    new Int64(0x80000000, 0x00008002), new Int64(0x80000000, 0x00000080),
    new Int64(0x00000000, 0x0000800A), new Int64(0x80000000, 0x8000000A),
    new Int64(0x80000000, 0x80008081), new Int64(0x80000000, 0x00008080),
    new Int64(0x00000000, 0x80000001), new Int64(0x80000000, 0x80008008)
];

class SHA extends Crypto{
    constructor(bit, outBit, delimiter, blockSize, blockLength, key = "") {
        if (typeof bit === "undefined" || typeof outBit === "undefined" || typeof blockSize === "undefined") {
            throw new Error("Invalid initialize arguments");
        }
        super();
        this._bit = bit;
        this._outBit = outBit;
        this._delimiter = delimiter;
        this._blockSize = blockSize;
        this._blockLength = blockLength;
        this.reset();
        if (key.length > 0) {
            this._inPad = new Array(this._blockLength);
            this._outPad = new Array(this._blockLength);
            let _keyBytes = key.getBytes(this._bit !== 1600);
            if (_keyBytes.length > this._blockLength) {
                this.append(key);
                _keyBytes = this.finish(false);
                this.reset();
            }
            if (this._bit === 1600) {
                _keyBytes[this._blockLength - 1] &= 0xFFFFFF00;
            }

            for (let i = 0 ; i < this._blockLength ; i++) {
                this._inPad[i] = (_keyBytes[i] | 0) ^ 0x36363636;
                this._outPad[i] = (_keyBytes[i] | 0) ^ 0x5C5C5C5C;
            }
            this._calculate(this._inPad);
            if (this._bit === 1600) {
                this._length = 0;
            } else {
                this._length = blockSize;
            }
        }
        this._hmac = key.length > 0;
    }

    append(string) {
        this.appendBinary(string.getBytes(this._bit !== 1600), string.toUTF8().length);
    }

    appendBinary(dataBytes, dataLength) {
        this._buffer = this._buffer.concat(dataBytes);
        this._length += dataLength;
        this._preCalc();
    }

    reset() {
        this._buffer = [];
        this._length = 0;
        this._reset();
        this._hash = this._initHash();
    }

    _final(dataBytes, length, total) {
        switch (this._bit) {
            case 1600:
                dataBytes[length >> 5] ^= this._delimiter << (8 * ((length >> 3) % 4));
                dataBytes[(this._blockSize >>> 5) - 1] ^= 0x80000000;
                break;
            case 512:
                dataBytes[length >> 5] |= this._delimiter << (24 - (length & 0x1F));
                dataBytes[((length + 128 >> 10) << 5) + 30] = Math.floor(total / 0x100000000);
                dataBytes[((length + 128 >> 10) << 5) + 31] = (total & 0xFFFFFFFF);
                break;
            default:
                dataBytes[length >>> 5] |= this._delimiter << (24 - length % 32);
                dataBytes[((length + 64 >>> 9) << 4) + 14] = Math.floor(total / 0x100000000);
                dataBytes[((length + 64 >>> 9) << 4) + 15] = (total & 0xFFFFFFFF);
                break;
        }
        this._calculate(dataBytes);
    }

    finish(hex = true) {
        let _length = (this._bit === 1600)
            ? ((this._length * 8) % this._blockSize)
            : ((this._length % this._blockSize) * 8);
        this._final(this._buffer, _length, this._length * 8);

        if (this._hmac) {
            let _tail = this._array();
            this.reset();
            this._calculate(this._outPad);
            let _total = this._hmacTotal();
            _length = (this._bit === 1600)
                ? ((_tail.length * 32) % this._blockSize)
                : ((Math.floor(_total / 8) % this._blockSize) * 8);
            this._final(_tail, _length, _total);
        }
        let _result = this._array();
        if (hex) {
            _result = _result.toHex(this._bit === 1600);
        }

        this.reset();
        return _result;
    }

    _preCalc() {
        while (this._buffer.length >= this._blockLength) {
            this._calculate(this._buffer.slice(0, this._blockLength));
            this._buffer = this._buffer.slice(this._blockLength);
        }
    }
}

class SHA1 extends SHA {

    constructor(key = "") {
        super(160, 160, 0x80, 64, 16, key);
    }

    static newInstance(key) {
        return new SHA1(key);
    }

    _reset() {
        this._words = new Array(80);
    }

    _initHash() {
        return [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
    }

    _hmacTotal() {
        return 84 * 8;
    }

    _calculate(dataBytes) {
        for (let i = 0 ; i < dataBytes.length ; i += this._blockLength) {
            let _tmp = this._hash.slice();
            let _num = [];
            let _length = this._words.length;
            for (let j = 0 ; j < _length ; j++) {
                if (j < 16) {
                    this._words[j] = dataBytes[i + j] | 0;
                } else {
                    this._words[j] = (this._words[j - 3] ^ this._words[j - 8] ^ this._words[j - 14] ^ this._words[j - 16]).safeRotateLeft(1);
                }
                if (j < 20) {
                    _num[0] = (_tmp[1] & _tmp[2] | ~_tmp[1] & _tmp[3]);
                    _num[1] = 1518500249;
                } else if (j < 40) {
                    _num[0] = (_tmp[1] ^ _tmp[2] ^ _tmp[3]);
                    _num[1] = 1859775393;
                } else if (j < 60) {
                    _num[0] = (_tmp[1] & _tmp[2] | _tmp[1] & _tmp[3] | _tmp[2] & _tmp[3]);
                    _num[1] = -1894007588;
                } else {
                    _num[0] = (_tmp[1] ^ _tmp[2] ^ _tmp[3]);
                    _num[1] = -899497514;
                }

                let _t = ((_tmp[0] << 5) | (_tmp[0] >>> 27)) + _tmp[4] + (this._words[j] >>> 0) + _num[0] + _num[1];
                _tmp[4] = _tmp[3];
                _tmp[3] = _tmp[2];
                _tmp[2] = _tmp[1].safeRotateLeft(30);
                _tmp[1] = _tmp[0];
                _tmp[0] = _t;
            }
            for (let i = 0 ; i < this._hash.length ; i++) {
                this._hash[i] = Crypto.safeAdd(_tmp[i], this._hash[i]);
            }
        }
    }

    _array() {
        return this._hash.slice(0, Math.floor(this._outBit / 32));
    }
}

class SHA224 extends SHA {

    constructor(outBit = 224, key) {
        super(256, outBit, 0x80, 64, 16, key);
    }

    static newInstance() {
        return new SHA224();
    }

    static HmacSHA224(key) {
        return new SHA224(224, key);
    }

    _initHash() {
        return [0xC1059ED8, 0x367CD507, 0x3070DD17, 0xF70E5939, 0xFFC00B31, 0x68581511, 0x64F98FA7, 0xBEFA4FA4];
    }

    _reset() {
        this._words = new Array(64);
    }

    _hmacTotal() {
        return 96 * 8 - (this._bit - this._outBit);
    }

    _calculate(dataBytes) {
        for (let i = 0 ; i < dataBytes.length ; i += this._blockLength) {
            let _tmp = this._hash.slice(0);
            let _num = [];
            let _length = this._words.length;
            for (let j = 0 ; j < _length ; j++) {
                if (j < 16) {
                    this._words[j] = dataBytes[i + j] | 0;
                } else {
                    this._words[j] =
                        Crypto.safeAdd(
                            Crypto.safeAdd(Crypto.safeAdd(this._words[j - 2].safeRotateRight(17) ^ this._words[j - 2].safeRotateRight(19) ^ this._words[j - 2].rotateRight(10), this._words[j - 7]),
                                this._words[j - 15].safeRotateRight(7) ^ this._words[j - 15].safeRotateRight(18) ^ this._words[j - 15].rotateRight(3)),
                            this._words[j - 16]);
                }

                _num[0] = Crypto.safeAdd(
                    Crypto.safeAdd(
                        Crypto.safeAdd(Crypto.safeAdd(_tmp[7], _tmp[4].safeRotateRight(6) ^ _tmp[4].safeRotateRight(11) ^ _tmp[4].safeRotateRight(25)),
                            ((_tmp[4] & _tmp[5]) ^ ((~_tmp[4]) & _tmp[6]))),
                        K[j]._high),
                    this._words[j]);
                _num[1] = Crypto.safeAdd(_tmp[0].safeRotateRight(2) ^ _tmp[0].safeRotateRight(13) ^ _tmp[0].safeRotateRight(22),
                    ((_tmp[0] & _tmp[1]) ^ (_tmp[0] & _tmp[2]) ^ (_tmp[1] & _tmp[2])));

                _tmp[7] = _tmp[6];
                _tmp[6] = _tmp[5];
                _tmp[5] = _tmp[4];
                _tmp[4] = Crypto.safeAdd(_tmp[3], _num[0]);
                _tmp[3] = _tmp[2];
                _tmp[2] = _tmp[1];
                _tmp[1] = _tmp[0];
                _tmp[0] = Crypto.safeAdd(_num[0], _num[1]);
            }
            for (let i = 0 ; i < this._hash.length ; i++) {
                this._hash[i] = Crypto.safeAdd(_tmp[i], this._hash[i]);
            }
        }
    }

    _array() {
        return this._hash.slice(0, Math.floor(this._outBit / 32));
    }
}

class SHA256 extends SHA224 {

    constructor(outBit = 256, key = "") {
        super(outBit, key);
    }

    static newInstance(key) {
        return new SHA256(256, key);
    }

    _initHash() {
        return [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
    }
}

class SHA384 extends SHA {
    constructor(outBit = 384, key = "") {
        super(512, outBit, 0x80, 128, 32, key);
    }

    static newInstance() {
        return new SHA384();
    }

    static HmacSHA384(key) {
        return new SHA384(384, key);
    }

    _reset() {
        this._words = new Array(80);
        for (let i = 0 ; i < 80 ; i++) {
            this._words[i] = new Int64(0, 0);
        }
    }

    _initHash() {
        return [
            new Int64(0xCBBB9D5D, 0xC1059ED8),  new Int64(0x629A292A, 0x367CD507),
            new Int64(0x9159015A, 0x3070DD17),  new Int64(0x152FECD8, 0xF70E5939),
            new Int64(0x67332667, 0xFFC00B31),  new Int64(0x8EB44A87, 0x68581511),
            new Int64(0xDB0C2E0D, 0x64F98FA7),  new Int64(0x47B5481D, 0xBEFA4FA4)
        ];
    }

    _hmacTotal() {
        return 192 * 8 - (this._bit - this._outBit);
    }

    _calculate(dataBytes) {
        for (let i = 0 ; i < dataBytes.length ; i += this._blockLength) {
            let _tmp = this._hash.slice(0);
            let _num = [];
            let _length = this._words.length;
            for (let j = 0 ; j < _length ; j++) {
                if (j < 16) {
                    this._words[j]._high = dataBytes[i + 2 * j];
                    this._words[j]._low = dataBytes[i + 2 * j + 1];
                } else {
                    this._words[j] =
                        Int64.add(
                            Int64.XOR(this._words[j - 2].safeRotateRight(19), this._words[j - 2].reverseAndRotate(29),
                                this._words[j - 2].shiftRight(6)),
                            this._words[j - 7],
                            Int64.XOR(this._words[j - 15].safeRotateRight(1), this._words[j - 15].safeRotateRight(8),
                                this._words[j - 15].shiftRight(7)),
                            this._words[j - 16]);
                }
            }
            for (let j = 0 ; j < _length ; j++) {
                _num[0] = new Int64(((_tmp[4]._high & _tmp[5]._high) ^ (~_tmp[4]._high & _tmp[6]._high)),
                    ((_tmp[4]._low & _tmp[5]._low) ^ (~_tmp[4]._low & _tmp[6]._low)));
                _num[1] = Int64.XOR(_tmp[4].safeRotateRight(14), _tmp[4].safeRotateRight(18), _tmp[4].reverseAndRotate(9));
                _num[2] = Int64.XOR(_tmp[0].safeRotateRight(28), _tmp[0].reverseAndRotate(2), _tmp[0].reverseAndRotate(7));
                _num[3] = new Int64(((_tmp[0]._high & _tmp[1]._high) ^ (_tmp[0]._high & _tmp[2]._high) ^ (_tmp[1]._high & _tmp[2]._high)),
                    ((_tmp[0]._low & _tmp[1]._low) ^ (_tmp[0]._low & _tmp[2]._low) ^ (_tmp[1]._low & _tmp[2]._low)));

                _num[4] = Int64.add(_tmp[7], _num[1], _num[0], K[j], this._words[j]);
                _num[5] = Int64.add(_num[2], _num[3]);

                _tmp[7] = _tmp[6].clone();
                _tmp[6] = _tmp[5].clone();
                _tmp[5] = _tmp[4].clone();
                _tmp[4] = Int64.add(_tmp[3], _num[4]);
                _tmp[3] = _tmp[2].clone();
                _tmp[2] = _tmp[1].clone();
                _tmp[1] = _tmp[0].clone();
                _tmp[0] = Int64.add(_num[4], _num[5]);
            }
            for (let i = 0 ; i < this._hash.length ; i++) {
                this._hash[i] = Int64.add(_tmp[i], this._hash[i]);
            }
        }
    }

    _array() {
        let _limit = Math.floor(this._outBit / 32);
        let _result = [];
        let _length = this._hash.length;
        for (let i = 0 ; i < _length && _result.length < _limit ; i++) {
            _result[i * 2] = this._hash[i]._high;
            _result[i * 2 + 1] = this._hash[i]._low;
        }
        _result = _result.slice(0, _limit);
        return _result;
    }
}

class SHA512 extends SHA384 {

    constructor(outBit = 512, key = "") {
        super(outBit, key);
    }

    static newInstance(key) {
        return new SHA512(512, key);
    }

    static SHA512_224(key) {
        return new SHA512(224, key);
    }

    static SHA512_256(key) {
        return new SHA512(256, key);
    }

    _initHash() {
        switch (this._outBit) {
            case 224:
                return [
                    new Int64(0x8C3D37C8, 0x19544DA2),  new Int64(0x73E19966, 0x89DCD4D6),
                    new Int64(0x1DFAB7AE, 0x32FF9C82),  new Int64(0x679DD514, 0x582F9FCF),
                    new Int64(0x0F6D2B69, 0x7BD44DA8),  new Int64(0x77E36F73, 0x04C48942),
                    new Int64(0x3F9D85A8, 0x6A1D36C8),  new Int64(0x1112E6AD, 0x91D692A1)
                ];
            case 256:
                return [
                    new Int64(0x22312194, 0xFC2BF72C),  new Int64(0x9F555FA3, 0xC84C64C2),
                    new Int64(0x2393B86B, 0x6F53B151),  new Int64(0x96387719, 0x5940EABD),
                    new Int64(0x96283EE2, 0xA88EFFE3),  new Int64(0xBE5E1E25, 0x53863992),
                    new Int64(0x2B0199FC, 0x2C85B8AA),  new Int64(0x0EB72DDC, 0x81C52CA2)
                ];
            case 512:
                return [
                    new Int64(0x6A09E667, 0xF3BCC908),  new Int64(0xBB67AE85, 0x84CAA73B),
                    new Int64(0x3C6EF372, 0xFE94F82B),  new Int64(0xA54FF53A, 0x5F1D36F1),
                    new Int64(0x510E527F, 0xADE682D1),  new Int64(0x9B05688C, 0x2B3E6C1F),
                    new Int64(0x1F83D9AB, 0xFB41BD6B),  new Int64(0x5BE0CD19, 0x137E2179)
                ];
            default:
                throw new Error("Current outBit not support!");
        }
    }
}

class SHA3 extends SHA {
    constructor(outBit, delimiter, blockSize, key) {
        super(1600, outBit, delimiter, blockSize, Math.floor(blockSize / 32), key);
    }

    static Keccak224(key) {
        return new SHA3(224, 0x01, 1152, key);
    }

    static Keccak256(key) {
        return new SHA3(256, 0x01, 1088, key);
    }

    static Keccak384(key) {
        return new SHA3(384, 0x01, 832, key);
    }

    static Keccak512(key) {
        return new SHA3(512, 0x01, 576, key);
    }

    static SHA3_224(key) {
        return new SHA3(224, 0x06, 1152, key);
    }

    static SHA3_256(key) {
        return new SHA3(256, 0x06, 1088, key);
    }

    static SHA3_384(key) {
        return new SHA3(384, 0x06, 832, key);
    }

    static SHA3_512(key) {
        return new SHA3(512, 0x06, 576, key);
    }

    static SHAKE128(outBit = 256) {
        return new SHA3(outBit, 0x1F, 1344);
    }

    static SHAKE256(outBit = 512) {
        return new SHA3(outBit, 0x1F, 1088);
    }

    _reset() {
        this._words = new Array(5);
        for (let x = 0 ; x < 5 ; x++) {
            this._words[x] = new Array(5);
            for (let y = 0 ; y < 5 ; y++) {
                this._words[x][y] = new Int64(0, 0);
            }
        }
    }

    _initHash() {
        let _hash = new Array(5);
        for (let x = 0 ; x < 5 ; x++) {
            _hash[x] = new Array(5);
            for (let y = 0 ; y < 5 ; y++) {
                _hash[x][y] = new Int64(0, 0);
            }
        }
        return _hash;
    }

    _calculate(dataBytes) {
        if (dataBytes !== null) {
            let _length = dataBytes.length;
            for (let x = 0 ; x < _length ;  x += 2) {
                this._hash[(x >>> 1) % 5][((x >>> 1) / 5) | 0] =
                    Int64.XOR(this._hash[(x >>> 1) % 5][((x >>> 1) / 5) | 0], new Int64(dataBytes[x + 1], dataBytes[x]));
            }
        }

        // Rounds
        for (let  j = 0; j < 24; j++) {
            this._reset();

            let _tmp = [];
            // Theta
            for (let x = 0; x < 5; x++) {
                _tmp[x] = Int64.XOR(this._hash[x][0], this._hash[x][1], this._hash[x][2], this._hash[x][3], this._hash[x][4]);
            }

            for (let x = 0; x < 5; x++) {
                let _num = Int64.XOR(_tmp[(x + 4) % 5], _tmp[(x + 1) % 5].safeRotateLeft(1));
                for (let y = 0; y < 5; y++) {
                    this._hash[x][y] = Int64.XOR(_num, this._hash[x][y]);
                }
            }

            // Rho Pi
            for (let x = 0; x < 5; x++) {
                for (let y = 0 ; y < 5 ; y++) {
                    this._words[y][(2 * x + 3 * y) % 5] = this._hash[x][y].safeRotateLeft(R[x][y]);
                }
            }

            // Chi
            for (let x = 0; x < 5; x++) {
                for (let y = 0; y < 5; y++) {
                    this._hash[x][y] =
                        Int64.XOR(this._words[x][y],
                            Int64.AND(this._words[(x + 1) % 5][y].NOT(), this._words[(x + 2) % 5][y]));
                }
            }

            this._hash[0][0] = Int64.XOR(this._hash[0][0], RC[j]);
        }
    }

    _array() {
        let _result = [], _offset = 0, _limit = Math.floor(this._outBit / 32);
        while (_result.length < _limit) {
            let _tmp = this._hash[_offset % 5][(_offset / 5) | 0];
            _result.push(_tmp._low, _tmp._high);
            _offset++;
            if (((_offset * 64) % this._blockSize) === 0) {
                this._calculate(null);
            }
        }
        _result = _result.slice(0, _limit);
        return _result;
    }
}

(function () {
    if (typeof Cell !== "undefined") {
        Cell.registerComponent("SHA1", SHA1);
        Cell.registerComponent("SHA224", SHA224);
        Cell.registerComponent("SHA256", SHA256);
        Cell.registerComponent("SHA384", SHA384);
        Cell.registerComponent("SHA512", SHA512);
        Cell.registerComponent("SHA3", SHA3);
    } else {
        window.SHA1 = SHA1;
        window.SHA224 = SHA224;
        window.SHA256 = SHA256;
        window.SHA384 = SHA384;
        window.SHA512 = SHA512;
        window.SHA3 = SHA3;
    }
})();