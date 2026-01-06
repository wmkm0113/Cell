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
        this._exponent = BigInt(_prefix + _exponent);   // e or d
        this._modulus = BigInt(_prefix + _modulus); // n
    }

    powMod(_data = 0n) {
        let _result = 1n;
        let _tempValue = _data % this._modulus;
        let _temp = this._exponent;
        while (_temp > 0n) {
            const _check = _temp & 1n;
            if (_check) {
                _result = (_result * _tempValue) % this._modulus;
            }
            _temp >>= 1n;
            _tempValue = (_tempValue * _tempValue) % this._modulus;
        }
        return _result;
    }
}

class PRNG {
    _seed = [];
    _i = 0;
    _j = 0;

    constructor() {
        const _randomKey = PRNG._randomKey(new Date().getTime());
        while (this._i < 256) {
            this._seed[this._i] = this._i;
            this._i++;
        }
        this._i = 0;
        let _t;
        while (this._i < 256) {
            this._j = (this._j + this._seed[this._i] + _randomKey[this._i % _randomKey.length]) & 0xFF;
            _t = this._seed[this._i];
            this._seed[this._i] = this._seed[this._j];
            this._seed[this._j] = _t;
            this._i++;
        }
        this._i = 0;
        this._j = 0;
    }

    static _randomKey(_seed = new Date().getTime()) {
        const _key = [];
        let _index = 0;
        if (window.crypto !== undefined && window.crypto.getRandomValues) {
            const _seed = new Uint8Array(32);
            crypto.getRandomValues(_seed);
            for (let i = 0; i < 32; ++i) {
                _key[_index++] = _seed[i];
            }
        }
        while (_index < 256) {
            const random = Math.floor(65536 * Math.random());
            _key[_index++] = random >>> 8;
            _key[_index++] = random & 0xFF;
        }
        _index = 0;
        _key[_index++] ^= _seed & 0xFF;
        _key[_index++] ^= (_seed >> 8) & 0xFF;
        _key[_index++] ^= (_seed >> 16) & 0xFF;
        _key[_index++] ^= (_seed >> 24) & 0xFF;
        return _key;
    }

    getByte() {
        this._i = (this._i + 1) & 0xFF;
        this._j = (this._j + this._seed[this._i]) & 0xFF;
        const t = this._seed[this._i];
        this._seed[this._i] = this._seed[this._j];
        this._seed[this._j] = t;
        return this._seed[(t + this._seed[this._i]) & 0xFF];
    }

    getBytes(array = []) {
        for (let i = 0; i < array.length; ++i) {
            array[i] = this.getByte();
        }
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
            case "OAEPWithSHA-1AndMGF1Padding":
                this._blockSize = this._maxDigit - 42;
                break;
            case "OAEPWithSHA3-224AndMGF1Padding":
            case "OAEPWithSHA-224AndMGF1Padding":
                this._blockSize = this._maxDigit - 58;
                break;
            case "OAEPWithSHA3-256AndMGF1Padding":
            case "OAEPWithSHA-256AndMGF1Padding":
                this._blockSize = this._maxDigit - 66;
                break;
            case "OAEPWithSHA3-384AndMGF1Padding":
            case "OAEPWithSHA-384AndMGF1Padding":
                this._blockSize = this._maxDigit - 98;
                break;
            case "OAEPWithSHA3-512AndMGF1Padding":
            case "OAEPWithSHA-512AndMGF1Padding":
                this._blockSize = this._maxDigit - 130;
                break;
            default:
                this._blockSize = this._maxDigit;
                break;
        }
        if (this._blockSize <= 0) {
            throw new Error(Cell.multiMsg("KeySize_Too_Small"));
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
        let _encData = str.decodeBase64();
        if ((_encData.length % this._maxDigit) !== 0) {
            return "";
        }
        let position = 0, _dataBytes = [];
        while (position < _encData.length) {
            const _block = _encData.slice(position, position + this._maxDigit);
            const _blockValue = this._key.powMod(_block.toBigInt());
            _dataBytes = _dataBytes.concat(this._removePadding(_blockValue));
            position += this._maxDigit;
        }
        return _dataBytes.toString();
    }

    _encrypt(_array) {
        let _debug = "";
        _array.forEach(str => {
            _debug += (", " + str);
        })
        console.log(_debug.substring(1, _debug.length));
        let _position = 0, _result = [];
        while (_position < _array.length) {
            let _length = Math.min(_array.length - _position, this._blockSize),
                _blockData = this._processPadding(_array.slice(_position, _position + _length));
            this._key.powMod(_blockData.toBigInt()).toByteArray().forEach(b => _result.push(b));
            _position += _length;
        }
        return _result.encodeBase64();
    }

    _processPadding(_block) {
        if (this._padding === "NoPadding") {
            return _block;
        } else if (this._padding === "PKCS1Padding") {
            return this._pkcs1Padding(_block);
        } else {
            return this._oaepPadding(_block);
        }
    }

    _removePadding(_blockData = 0n) {
        let _blockBytes = _blockData.toByteArray(this._maxDigit);
        if (this._padding === "NoPadding") {
            return _blockBytes;
        } else if (this._padding === "PKCS1Padding") {
            return this._pkcs1Remove(_blockBytes);
        } else {
            return this._oaepRemove(_blockBytes);
        }
    }

    _pkcs1Padding(_block = []) {
        let _paddingLength = this._maxDigit - 3 - _block.length;
        if (_paddingLength < 0) {
            throw new Error(Cell.multiMsg("Value.Padding.Error"));
        }
        const _result = [];
        _result.push(this._publicKey ? 0x02 : 0x01);
        for (let _index = 0; _index < _paddingLength; _index++) {
            _result.push((this._publicKey) ? Math.ceil(Math.random() * 255) : 0xFF);
        }
        _result.push(0x00);
        _block.forEach(b => {
            _result.push(b);
        });
        return _result;
    }

    _pkcs1Remove(_blockData = []) {
        if (_blockData.length > 0
            && (_blockData[0] === 0x0 || _blockData[0] === 0x1 || _blockData[0] === 0x2)) {
            let _match = -1, _blockBytes = _blockData;
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
            return _blockBytes;
        }
        return _blockData;
    }

    _oaepPadding(_block = []) {
        let _hash = this._oaep_hash_name();
        if (_hash.length === 0) {
            return _block;
        }

        //  hLen
        let _seedLength = this._seedLength(_hash);
        if (_block.length > (this._maxDigit - 2 * _seedLength - 2)) {
            throw new Error(Cell.multiMsg("Value.Padding.Error"));
        }
        //  lHash
        const _dataBlock = Cell.digestData(_hash, "", false);
        //  PS
        const _padLength = this._maxDigit - _block.length - 2 * _seedLength - 2;
        for (let i = 0; i < _padLength; i++) {
            _dataBlock.push(0x00);
        }
        //  Split flag
        _dataBlock.push(0x01);
        //  M
        _block.forEach(b => _dataBlock.push(b));

        //  Seed
        const _seed = new Array(_seedLength);
        new PRNG().getBytes(_seed);

        const dbMask = this._oaep_mgf1(_seed, this._maxDigit - _seedLength - 1, _hash);
        console.log(dbMask.length);
        const maskedDB = [];
        for (let i = 0; i < dbMask.length; i++) {
            maskedDB[i] = _dataBlock[i] ^ dbMask[i];
        }
        const seedMask = this._oaep_mgf1(maskedDB, _seedLength, _hash);
        const _result = [];
        let position = 0;
        _result[position] = 0x00;
        position++;
        seedMask.forEach((b, index) => {
            _result[position] = _seed[index] ^ b;
            position++;
        });

        maskedDB.forEach(b => {
            _result[position] = b;
            position++;
        });

        return _result;
    }

    _oaepRemove(_block = []) {
        let _hash = this._oaep_hash_name();
        if (_hash.length === 0) {
            return _block;
        }
        for (let i = 0; i < _block.length; i++) {
            _block[i] &= 0xFF;
        }
        while (_block.length < this._maxDigit) {
            _block.unshift(0x00);
        }

        //  hLen
        const _seedLength = this._seedLength(_hash);
        const Y = _block[0], maskedSeed = _block.slice(1, _seedLength + 1), maskedDB = _block.slice(_seedLength + 1);
        let bad = 0;
        bad |= Y !== 0x00;

        const lHash = Cell.digestData(_hash, "", false);
        const seedMask = this._oaep_mgf1(maskedDB, _seedLength, _hash);
        const seed = maskedSeed.XOR(seedMask);
        const dbMask = this._oaep_mgf1(seed, maskedDB.length, _hash);
        const dataBlock = maskedDB.XOR(dbMask);
        for (let i = 0; i < _seedLength; i++) {
            bad |= dataBlock[i] ^ lHash[i];
        }

        let position = -1, found = false;
        for (let i = _seedLength; i < dataBlock.length; i++) {
            const b = dataBlock[i];
            if (!found) {
                if (b === 0x01) {
                    found = true;
                    position = i + 1;
                } else {
                    bad |= b !== 0x00;
                }
            }
        }
        bad |= !found;

        if (bad !== 0) {
            throw new Error(Cell.multiMsg("Value.Padding.Error"));
        }

        return dataBlock.slice(position);
    }

    _oaep_hash_name() {
        switch (this._padding) {
            case "OAEPWithSHA-1AndMGF1Padding":
                return "SHA1";
            case "OAEPWithSHA-224AndMGF1Padding":
                return "SHA224";
            case "OAEPWithSHA-256AndMGF1Padding":
                return "SHA256";
            case "OAEPWithSHA-384AndMGF1Padding":
                return "SHA384";
            case "OAEPWithSHA-512AndMGF1Padding":
                return "SHA512";
            case "OAEPWithSHA3-224AndMGF1Padding":
                return "SHA3-224";
            case "OAEPWithSHA3-256AndMGF1Padding":
                return "SHA3-256";
            case "OAEPWithSHA3-384AndMGF1Padding":
                return "SHA3-384";
            case "OAEPWithSHA3-512AndMGF1Padding":
                return "SHA3-512";
            default:
                return "";
        }
    }

    _seedLength(_hash = "") {
        let _seedLength = 0;
        switch (_hash) {
            case "SHA1":
                _seedLength = 160;
                break;
            case "SHA224":
            case "SHA3-224":
                _seedLength = 224;
                break;
            case "SHA256":
            case "SHA3-256":
                _seedLength = 256;
                break;
            case "SHA384":
            case "SHA3-384":
                _seedLength = 384;
                break;
            case "SHA512":
            case "SHA3-512":
                _seedLength = 512;
                break;
        }
        return _seedLength >> 3;  //hLen
    }

    _oaep_mgf1(_seed, _length, _hash) {
        let _result = [], _hLen = this._seedLength(_hash);
        let offset = 0, counter = 0;
        while (offset < _length) {
            const length = Math.min(_hLen, _length - offset);
            const _block = this._hashToBytes(Cell.digestBinary(_hash, _seed.concat(counter.toBytes()), false));
            _result = _result.concat(_block.slice(0, length));
            offset += length;
            counter++;
        }
        return _result;
    }

    _hashToBytes(_hash = []) {
        const _block = [];
        _hash.forEach(b => {
            let count = 4;
            while (count > 0) {
                _block.unshift(b & 0xFF);
                b >>= 8;
                count--;
            }
        });
        return _block;
    }
}