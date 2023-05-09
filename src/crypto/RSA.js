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
 * [New] RSA Utils Only Support RSA/ECB/NoPadding
 */
'use strict';
import {Crypto} from "./Crypto.js";
class RSAKey {
    constructor(_exponent = "", _modulus = "", _radix = 16) {
        let _prefix;
        switch (_radix) {
            case 16:
                _prefix = "0x";
                break;
            case 8:
                _prefix = "0o";
                break;
            case 2:
                _prefix = "0b";
                break;
            default:
                _prefix = "";
                break;
        }
        this._exponent = BigInt(_prefix + _exponent);
        this._modulus = BigInt(_prefix + _modulus);
        this._highIndex = 0n;
        let _value = this._modulus;
        while (Number(_value | 0n) !== 0) {
            this._highIndex++;
            _value >>= 1n;
        }
        let _b2k = 1n << (2n * this._highIndex);
        this._mu = _b2k / this._modulus;
        this._bkPlus = 1n << (this._highIndex + (2n << 3n));
    }
    powMod(_hexData) {
        let _result = 1n;
        let _tempValue = BigInt("0x" + _hexData);
        let _temp = this._exponent;
        while (true) {
            if ((_temp & 1n) !== 0n) {
                _result = this._modulo(_result * _tempValue);
            }
            _temp >>= 1n;
            if ((_temp | 0n) === 0n) {
                break;
            }
            _tempValue = this._modulo(_tempValue * _tempValue);
        }
        return _result;
    }
    _modulo(x = 0n) {
        let _modify = (2n << 3n);
        let _q1 = x >> (this._highIndex - _modify);
        let _q2 = _q1 * this._mu;
        let _q3 = _q2 >> (this._highIndex + _modify);
        let _r1 = x % (2n << (this._highIndex + _modify - 1n));
        let _r2term = _q3 * this._modulus;
        let _r2 = _r2term % (2n << (this._highIndex + _modify - 1n));
        let _result = _r1 - _r2;
        if (_result < 0n) {
            _result += this._bkPlus;
        }
        while (_result > this._modulus) {
            _result -= this._modulus;
        }
        return _result;
    }
}
export default class RSA extends Crypto {
    constructor(keyConfig = {exponent: "", modulus: "", radix: 16, keySize: 1024, padding: "NoPadding"}) {
        super();
        this._blockLength = (keyConfig.keySize >> 2);
        this._maxDigit = (keyConfig.keySize >> 3);
        switch (keyConfig.padding) {
            case "PKCS1Padding":
                this._blockSize = this._maxDigit - 11;
                break;
            case "OAEPWithMD5AndMGF1Padding":
                this._blockSize = this._maxDigit - 34;
                break;
            case "OAEPPadding":
            case "OAEPWithSHA1AndMGF1Padding":
                this._blockSize = this._maxDigit - 42;
                break;
            case "OAEPWithSHA3-224AndMGF1Padding":
            case "OAEPWithSHA224AndMGF1Padding":
                this._blockSize = this._maxDigit - 58;
                break;
            case "OAEPWithSHA3-256AndMGF1Padding":
            case "OAEPWithSHA256AndMGF1Padding":
                this._blockSize = this._maxDigit - 66;
                break;
            case "OAEPWithSHA3-384AndMGF1Padding":
            case "OAEPWithSHA384AndMGF1Padding":
                this._blockSize = this._maxDigit - 98;
                break;
            case "OAEPWithSHA3-512AndMGF1Padding":
            case "OAEPWithSHA512AndMGF1Padding":
                this._blockSize = this._maxDigit - 130;
                break;
            default:
                this._blockSize = this._maxDigit;
                break;
        }
        this._padding = keyConfig.padding;
        this._publicKey = (keyConfig.exponent === "10001");
        this._key = new RSAKey(keyConfig.exponent, keyConfig.modulus, keyConfig.radix);
    }
    static get CryptoName() {
        return "RSA";
    }
    static newInstance(keyConfig = {exponent: "", modulus: "", radix: 16, keySize: 1024, padding: "NoPadding"}) {
        return new RSA(keyConfig);
    }
    encrypt(str = "") {
        return this._encrypt(str.getBytes());
    }
    decrypt(str) {
        if ((str.length % this._blockLength) !== 0) {
            return "";
        }
        let position = 0, _dataBytes = [];
        while (position < str.length) {
            let _blockValue = this._key.powMod(str.substring(position, position + this._blockLength));
            _dataBytes = _dataBytes.concat(this._removePadding(_blockValue));
            position += this._blockLength;
        }
        return new TextDecoder().decode(new Uint8Array(_dataBytes.flat()));
    }
    _encrypt(_array) {
        let _position = 0, _result = "";
        while (_position < _array.length) {
            let _length = Math.min(_array.length - _position, this._blockSize),
                _blockData = this._processPadding(_array.slice(_position, _position + _length));
            let _blockResult = this._key.powMod(_blockData.toString(16)).toString(16);
            _result = _blockResult + _result;
            _position += _length;
        }
        return _result;
    }
    _processPadding(_block) {
        let _padding = 0n;
        switch (this._padding) {
            case "PKCS1Padding":
                let _paddingLength = this._maxDigit - 3 - _block.length;
                if (_paddingLength < 0) {
                    throw new Error(Cell.multiMsg("Value.Padding.Error"));
                }
                _padding = this._publicKey ? 0x2n : 0x1n;
                for (let _index = 0; _index < _paddingLength; _index++) {
                    _padding <<= 8n;
                    _padding += (this._publicKey) ? BigInt(Math.ceil(Math.random() * 255)) : 0xFFn;
                }
                _padding <<= 8n;
                break;
            default:
                break;
        }
        let _shift = _block.length - 1;
        while (_shift >= 0) {
            _padding <<= 8n;
            _padding += BigInt(_block[_shift]);
            _shift--;
        }
        return _padding;
    }
    _removePadding(_blockData = 0n) {
        let _blockBytes = [], _block = _blockData;
        while (_block > 0n) {
            _blockBytes.unshift(Number(_block & 0xFFn));
            _block >>= 8n;
        }
        switch (this._padding) {
            case "PKCS1Padding":
                if (_blockBytes[0] === 0x0 || _blockBytes[0] === 0x1 || _blockBytes[0] === 0x2) {
                    let _match = -1;
                    switch (_blockBytes[0]) {
                        case 0:
                            _match = 0;
                            break;
                        case 1:
                            _match = 255;
                            break;
                    }
                    let _position = 1;
                    while (_position < _blockBytes.length) {
                        if (_blockBytes[_position] === 0) {
                            break;
                        }
                        if (_match !== -1 && _blockBytes[_position] !== _match) {
                            throw Error(Cell.multiMsg("Value.Padding.Error"));
                        }
                        _position++;
                    }
                    if (_position < _blockBytes.length) {
                        _blockBytes = _blockBytes.slice(_position + 1);
                    }
                }
        }
        return _blockBytes;
    }
}