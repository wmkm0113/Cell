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
 * [New] Define Standard CRC Algorithms
 * [New] CRC Support From CRC3 to CRC32
 */
'use strict';

import {Crypto} from "./Crypto.js";
import {DebugMode} from "../commons/Commons.js";

const CRC_CONSTANT = {};
const CRC_TEST = {
    "CRC-16/ISO-IEC-14443-3-A": "0x264e",
    "CRC-32/JAMCRC": "0xf68d2c9e",
    "CRC-4/INTERLAKEN": "0x5",
    "CRC-16/TELEDISK": "0x2cd1",
    "CRC-32/MPEG-2": "0xd8f06c8f",
    "CRC-16/GSM": "0xdf1b",
    "CRC-6/GSM": "0x0e",
    "CRC-7/UMTS": "0x70",
    "CRC-32/BZIP2": "0x270f9370",
    "CRC-8/I-CODE": "0x5b",
    "CRC-16/IBM-SDLC": "0xe672",
    "CRC-16/LJ1200": "0x928f",
    "CRC-10/ATM": "0x3c8",
    "CRC-8/NRSC-5": "0x16",
    "CRC-5/USB": "0x00",
    "CRC-7/ROHC": "0x4d",
    "CRC-12/UMTS": "0x05d",
    "CRC-8/BLUETOOTH": "0xc4",
    "CRC-14/GSM": "0x36d0",
    "CRC-8/SMBUS": "0xfd",
    "CRC-8/TECH-3250": "0x8e",
    "CRC-5/G-704": "0x19",
    "CRC-16/MODBUS": "0x32e4",
    "CRC-12/DECT": "0xba0",
    "CRC-7/MMC": "0x7b",
    "CRC-16/CMS": "0xb1b6",
    "CRC-24/FLEXRAY-A": "0x5ca9c5",
    "CRC-24/FLEXRAY-B": "0x26eb8f",
    "CRC-32/ISO-HDLC": "0x0972d361",
    "CRC-21/CAN-FD": "0x185105",
    "CRC-8/LTE": "0x7f",
    "CRC-15/CAN": "0x1813",
    "CRC-24/LTE-A": "0xbcefc7",
    "CRC-30/CDMA": "0x1f4b73ce",
    "CRC-3/GSM": "0x4",
    "CRC-24/LTE-B": "0x021ebd",
    "CRC-24/OPENPGP": "0x341a7c",
    "CRC-12/CDMA2000": "0x169",
    "CRC-16/MAXIM-DOW": "0xd61b",
    "CRC-16/XMODEM": "0x20e4",
    "CRC-6/G-704": "0x0e",
    "CRC-24/OS-9": "0xfe0e46",
    "CRC-16/DNP": "0x57de",
    "CRC-32/AIXM": "0x7ccd1a36",
    "CRC-10/CDMA2000": "0x05e",
    "CRC-6/CDMA2000-A": "0x03",
    "CRC-6/CDMA2000-B": "0x3d",
    "CRC-16/TMS37157": "0xb6c9",
    "CRC-16/UMTS": "0xb16e",
    "CRC-32/XFER": "0xf036f1c2",
    "CRC-8/ROHC": "0x57",
    "CRC-16/DECT-R": "0x8ffe",
    "CRC-8/WCDMA": "0xab",
    "CRC-8/DVB-S2": "0xb0",
    "CRC-15/MPT1327": "0x4532",
    "CRC-16/DECT-X": "0x8fff",
    "CRC-6/DARC": "0x1f",
    "CRC-16/DDS-110": "0xb3be",
    "CRC-32/ISCSI": "0x41357186",
    "CRC-16/USB": "0xcd1b",
    "CRC-8/MIFARE-MAD": "0xe1",
    "CRC-8/AUTOSAR": "0x91",
    "CRC-16/KERMIT": "0x11fd",
    "CRC-16/IBM-3740": "0x2ef4",
    "CRC-4/G-704": "0x0",
    "CRC-16/RIELLO": "0x75c5",
    "CRC-16/EN-13757": "0x062a",
    "CRC-16/NRSC-5": "0x7cff",
    "CRC-14/DARC": "0x038c",
    "CRC-31/PHILIPS": "0x4190cf7c",
    "CRC-5/EPC-C1G2": "0x12",
    "CRC-32/BASE91-D": "0x0c61f70a",
    "CRC-16/ARC": "0x29e4",
    "CRC-16/MCRF4XX": "0x198d",
    "CRC-16/T10-DIF": "0x31c0",
    "CRC-24/INTERLAKEN": "0x3f68b2",
    "CRC-3/ROHC": "0x5",
    "CRC-13/BBC": "0x11ab",
    "CRC-11/UMTS": "0x697",
    "CRC-16/SPI-FUJITSU": "0x11da",
    "CRC-10/GSM": "0x262",
    "CRC-8/DARC": "0x11",
    "CRC-8/OPENSAFETY": "0x0e",
    "CRC-12/GSM": "0xa36",
    "CRC-32/CKSUM": "0x1d752f02",
    "CRC-16/PROFIBUS": "0x2d37",
    "CRC-8/GSM-B": "0x9b",
    "CRC-8/GSM-A": "0xde",
    "CRC-8/SAE-J1850": "0x28",
    "CRC-8/CDMA2000": "0xef",
    "CRC-8/MAXIM-DOW": "0xec",
    "CRC-16/GENIBUS": "0xd10b",
    "CRC-8/I-432-1": "0xa8",
    "CRC-17/CAN-FD": "0x09097",
    "CRC-16/OPENSAFETY-B": "0xbf4a",
    "CRC-32/CD-ROM-EDC": "0xd4a7186c",
    "CRC-16/OPENSAFETY-A": "0x4bb3",
    "CRC-32/AUTOSAR": "0xedbd99c1",
    "CRC-16/CDMA2000": "0x5059",
    "CRC-11/FLEXRAY": "0x578",
    "CRC-24/BLE": "0xa0afcd"
};

export default class CRC extends Crypto {
    constructor(name) {
        super();
        if (CRC_CONSTANT.hasOwnProperty(name)) {
            let _config = CRC_CONSTANT[name];
            this._bit = _config[0];
            this._refIn = _config[4];
            this._refOut = _config[5];
            this._polynomial = this._refIn
                ? CRC._REVERSE_BIT(_config[1], this._bit)
                : (this._bit < 8 ? (_config[1] << (8 - this._bit)) : _config[1]);
            this._init = this._refIn
                ? CRC._REVERSE_BIT(_config[2], this._bit)
                : (this._bit < 8 ? (_config[2] << (8 - this._bit)) : _config[2]);
            this._crc = this._init;
            this._xorOut = _config[3];
            if (this._refIn) {
                this._check = 0x1;
            } else {
                this._check = Math.pow(2, this._bit <= 8 ? 7 : this._bit - 1);
            }
            this._outLength = Math.floor(this._bit / 4);
            if (this._bit % 4 !== 0) {
                this._outLength++;
            }
            this._mask = Math.pow(2, this._bit <= 8 ? 8 : this._bit) - 1;
        } else {
            throw new Error(Cell.multiMsg("Unknown.Algorithm"));
        }
    }

    static initialize() {
        CRC.REGISTER("CRC-3/GSM", 3, 0x3, 0x0, 0x7, false, false);
        CRC.REGISTER("CRC-3/ROHC", 3, 0x3, 0x7, 0x0, true, true);
        CRC.REGISTER("CRC-4/G-704", 4, 0x3, 0x0, 0x0, true, true);
        CRC.REGISTER("CRC-4/INTERLAKEN", 4, 0x3, 0xF, 0xF, false, false);
        CRC.REGISTER("CRC-5/EPC-C1G2", 5, 0x09, 0x09, 0x00, false, false);
        CRC.REGISTER("CRC-5/G-704", 5, 0x15, 0x00, 0x00, true, true);
        CRC.REGISTER("CRC-5/USB", 5, 0x05, 0x1F, 0x1F, true, true);
        CRC.REGISTER("CRC-6/CDMA2000-A", 6, 0x27, 0x3F, 0x00, false, false);
        CRC.REGISTER("CRC-6/CDMA2000-B", 6, 0x07, 0x3F, 0x00, false, false);
        CRC.REGISTER("CRC-6/DARC", 6, 0x19, 0x00, 0x00, true, true);
        CRC.REGISTER("CRC-6/G-704", 6, 0x03, 0x00, 0x00, true, true);
        CRC.REGISTER("CRC-6/GSM", 6, 0x2F, 0x00, 0x3F, false, false);
        CRC.REGISTER("CRC-7/MMC", 7, 0x09, 0x00, 0x00, false, false);
        CRC.REGISTER("CRC-7/ROHC", 7, 0x4F, 0x7F, 0x00, true, true);
        CRC.REGISTER("CRC-7/UMTS", 7, 0x45, 0x00, 0x00, false, false);
        CRC.REGISTER("CRC-8/AUTOSAR", 8, 0x2F, 0xFF, 0xFF, false, false);
        CRC.REGISTER("CRC-8/BLUETOOTH", 8, 0xA7, 0x00, 0x00, true, true);
        CRC.REGISTER("CRC-8/CDMA2000", 8, 0x9B, 0xFF, 0x00, false, false);
        CRC.REGISTER("CRC-8/DARC", 8, 0x39, 0x00, 0x00, true, true);
        CRC.REGISTER("CRC-8/DVB-S2", 8, 0xD5, 0x00, 0x00, false, false);
        CRC.REGISTER("CRC-8/GSM-A", 8, 0x1D, 0x00, 0x00, false, false);
        CRC.REGISTER("CRC-8/GSM-B", 8, 0x49, 0x00, 0xFF, false, false);
        CRC.REGISTER("CRC-8/I-432-1", 8, 0x07, 0x00, 0x55, false, false);
        CRC.REGISTER("CRC-8/I-CODE", 8, 0x1D, 0xFD, 0x00, false, false);
        CRC.REGISTER("CRC-8/LTE", 8, 0x9B, 0x00, 0x00, false, false);
        CRC.REGISTER("CRC-8/MAXIM-DOW", 8, 0x31, 0x00, 0x00, true, true);
        CRC.REGISTER("CRC-8/MIFARE-MAD", 8, 0x1D, 0xC7, 0x00, false, false);
        CRC.REGISTER("CRC-8/NRSC-5", 8, 0x31, 0xFF, 0x00, false, false);
        CRC.REGISTER("CRC-8/OPENSAFETY", 8, 0x2F, 0x00, 0x00, false, false);
        CRC.REGISTER("CRC-8/ROHC", 8, 0x07, 0xFF, 0x00, true, true);
        CRC.REGISTER("CRC-8/SAE-J1850", 8, 0x1D, 0xFF, 0xFF, false, false);
        CRC.REGISTER("CRC-8/SMBUS", 8, 0x07, 0x00, 0x00, false, false);
        CRC.REGISTER("CRC-8/TECH-3250", 8, 0x1D, 0xFF, 0x00, true, true);
        CRC.REGISTER("CRC-8/WCDMA", 8, 0x9B, 0x00, 0x00, true, true);
        CRC.REGISTER("CRC-10/ATM", 10, 0x233, 0x000, 0x000, false, false);
        CRC.REGISTER("CRC-10/CDMA2000", 10, 0x3D9, 0x3FF, 0x000, false, false);
        CRC.REGISTER("CRC-10/GSM", 10, 0x175, 0x000, 0x3FF, false, false);
        CRC.REGISTER("CRC-11/FLEXRAY", 11, 0x385, 0x01A, 0x000, false, false);
        CRC.REGISTER("CRC-11/UMTS", 11, 0x307, 0x000, 0x000, false, false);
        CRC.REGISTER("CRC-12/CDMA2000", 12, 0xF13, 0xFFF, 0x000, false, false);
        CRC.REGISTER("CRC-12/DECT", 12, 0x80F, 0x000, 0x000, false, false);
        CRC.REGISTER("CRC-12/GSM", 12, 0xD31, 0x000, 0xFFF, false, false);
        CRC.REGISTER("CRC-12/UMTS", 12, 0x80F, 0x000, 0x000, false, true);
        CRC.REGISTER("CRC-13/BBC", 13, 0x1CF5, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-14/DARC", 14, 0x0805, 0x0000, 0x0000, true, true);
        CRC.REGISTER("CRC-14/GSM", 14, 0x202D, 0x0000, 0x3FFF, false, false);
        CRC.REGISTER("CRC-15/CAN", 15, 0x4599, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-15/MPT1327", 15, 0x6815, 0x0000, 0x0001, false, false);
        CRC.REGISTER("CRC-16/ARC", 16, 0x8005, 0x0000, 0x0000, true, true);
        CRC.REGISTER("CRC-16/CDMA2000", 16, 0xC867, 0xFFFF, 0x0000, false, false);
        CRC.REGISTER("CRC-16/CMS", 16, 0x8005, 0xFFFF, 0x0000, false, false);
        CRC.REGISTER("CRC-16/DDS-110", 16, 0x8005, 0x800D, 0x0000, false, false);
        CRC.REGISTER("CRC-16/DECT-R", 16, 0x0589, 0x0000, 0x0001, false, false);
        CRC.REGISTER("CRC-16/DECT-X", 16, 0x0589, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-16/DNP", 16, 0x3D65, 0x0000, 0xFFFF, true, true);
        CRC.REGISTER("CRC-16/EN-13757", 16, 0x3D65, 0x0000, 0xFFFF, false, false);
        CRC.REGISTER("CRC-16/GENIBUS", 16, 0x1021, 0xFFFF, 0xFFFF, false, false);
        CRC.REGISTER("CRC-16/GSM", 16, 0x1021, 0x0000, 0xFFFF, false, false);
        CRC.REGISTER("CRC-16/IBM-3740", 16, 0x1021, 0xFFFF, 0x0000, false, false);
        CRC.REGISTER("CRC-16/IBM-SDLC", 16, 0x1021, 0xFFFF, 0xFFFF, true, true);
        CRC.REGISTER("CRC-16/ISO-IEC-14443-3-A", 16, 0x1021, 0xC6C6, 0x0000, true, true);
        CRC.REGISTER("CRC-16/KERMIT", 16, 0x1021, 0x0000, 0x0000, true, true);
        CRC.REGISTER("CRC-16/LJ1200", 16, 0x6F63, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-16/MAXIM-DOW", 16, 0x8005, 0x0000, 0xFFFF, true, true);
        CRC.REGISTER("CRC-16/MCRF4XX", 16, 0x1021, 0xFFFF, 0x0000, true, true);
        CRC.REGISTER("CRC-16/MODBUS", 16, 0x8005, 0xFFFF, 0x0000, true, true);
        CRC.REGISTER("CRC-16/NRSC-5", 16, 0x080B, 0xFFFF, 0x0000, true, true);
        CRC.REGISTER("CRC-16/OPENSAFETY-A", 16, 0x5935, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-16/OPENSAFETY-B", 16, 0x755B, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-16/PROFIBUS", 16, 0x1DCF, 0xFFFF, 0xFFFF, false, false);
        CRC.REGISTER("CRC-16/RIELLO", 16, 0x1021, 0xB2AA, 0x0000, true, true);
        CRC.REGISTER("CRC-16/SPI-FUJITSU", 16, 0x1021, 0x1D0F, 0x0000, false, false);
        CRC.REGISTER("CRC-16/T10-DIF", 16, 0x8BB7, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-16/TELEDISK", 16, 0xA097, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-16/TMS37157", 16, 0x1021, 0x89EC, 0x0000, true, true);
        CRC.REGISTER("CRC-16/UMTS", 16, 0x8005, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-16/USB", 16, 0x8005, 0xFFFF, 0xFFFF, true, true);
        CRC.REGISTER("CRC-16/XMODEM", 16, 0x1021, 0x0000, 0x0000, false, false);
        CRC.REGISTER("CRC-17/CAN-FD", 17, 0x1685B, 0x00000, 0x00000, false, false);
        CRC.REGISTER("CRC-21/CAN-FD", 21, 0x102899, 0x000000, 0x000000, false, false);
        CRC.REGISTER("CRC-24/BLE", 24, 0x00065B, 0x555555, 0x000000, true, true);
        CRC.REGISTER("CRC-24/FLEXRAY-A", 24, 0x5D6DCB, 0xFEDCBA, 0x000000, false, false);
        CRC.REGISTER("CRC-24/FLEXRAY-B", 24, 0x5D6DCB, 0xABCDEF, 0x000000, false, false);
        CRC.REGISTER("CRC-24/INTERLAKEN", 24, 0x328B63, 0xFFFFFF, 0xFFFFFF, false, false);
        CRC.REGISTER("CRC-24/LTE-A", 24, 0x864CFB, 0x000000, 0x000000, false, false);
        CRC.REGISTER("CRC-24/LTE-B", 24, 0x800063, 0x000000, 0x000000, false, false);
        CRC.REGISTER("CRC-24/OPENPGP", 24, 0x864CFB, 0xB704CE, 0x000000, false, false);
        CRC.REGISTER("CRC-24/OS-9", 24, 0x800063, 0xFFFFFF, 0xFFFFFF, false, false);
        CRC.REGISTER("CRC-30/CDMA", 30, 0x2030B9C7, 0x3FFFFFFF, 0x3FFFFFFF, false, false);
        CRC.REGISTER("CRC-31/PHILIPS", 31, 0x04C11DB7, 0x7FFFFFFF, 0x7FFFFFFF, false, false);
        CRC.REGISTER("CRC-32/AIXM", 32, 0x814141AB, 0x00000000, 0x00000000, false, false);
        CRC.REGISTER("CRC-32/AUTOSAR", 32, 0xF4ACFB13, 0xFFFFFFFF, 0xFFFFFFFF, true, true);
        CRC.REGISTER("CRC-32/BASE91-D", 32, 0xA833982B, 0xFFFFFFFF, 0xFFFFFFFF, true, true);
        CRC.REGISTER("CRC-32/BZIP2", 32, 0x04C11DB7, 0xFFFFFFFF, 0xFFFFFFFF, false, false);
        CRC.REGISTER("CRC-32/CD-ROM-EDC", 32, 0x8001801B, 0x00000000, 0x00000000, true, true);
        CRC.REGISTER("CRC-32/CKSUM", 32, 0x04C11DB7, 0x00000000, 0xFFFFFFFF, false, false);
        CRC.REGISTER("CRC-32/ISCSI", 32, 0x1EDC6F41, 0xFFFFFFFF, 0xFFFFFFFF, true, true);
        CRC.REGISTER("CRC-32/ISO-HDLC", 32, 0x04C11DB7, 0xFFFFFFFF, 0xFFFFFFFF, true, true);
        CRC.REGISTER("CRC-32/JAMCRC", 32, 0x04C11DB7, 0xFFFFFFFF, 0x00000000, true, true);
        CRC.REGISTER("CRC-32/MPEG-2", 32, 0x04C11DB7, 0xFFFFFFFF, 0x00000000, false, false);
        CRC.REGISTER("CRC-32/XFER", 32, 0x000000AF, 0x00000000, 0x00000000, false, false);
    }

    static REGISTER(name, bit, polynomial, init = 0x00, xorOut = 0x00,
                    refIn = false, refOut = false, override = false) {
        if (bit > 32) {
            throw new Error(Cell.multiMsg("Bit.CRC.Error"));
        }
        if (CRC_CONSTANT.hasOwnProperty(name) && !override) {
            return;
        }
        CRC_CONSTANT[name] = [bit, polynomial, init, xorOut, refIn, refOut];
        if (Cell._modeEnabled(DebugMode.DEBUG)) {
            Cell.debug("Register.CRC.Config", name, bit, polynomial, init, xorOut, refIn, refOut);
        }
    }

    static _REVERSE_BIT(value = 0x00, bitWidth) {
        let _result = 0;
        for (let i = 0; i < bitWidth; i++) {
            if (value & 0x1) {
                _result |= 1 << (bitWidth - 1 - i);
            }
            value >>= 1;
        }
        return _result >>> 0;
    }

    static get CryptoName() {
        return "CRC";
    }

    static newInstance(name) {
        return new CRC(name);
    }

    static async test() {
        for (const name of Object.keys(CRC_TEST)) {
            Cell.debug("CRC.Test", name, await Cell.digestData(name, "123456"), CRC_TEST[name]);
        }
    }

    append(string = "") {
        this.appendBinary(string.toByteArray());
    }

    appendBinary(dataBytes) {
        let _length = dataBytes.length, i, j;
        for (i = 0; i < _length; i++) {
            if (this._bit > 8) {
                this._crc ^= ((this._refIn ? dataBytes[i] : (dataBytes[i] << (this._bit - 8))) & this._mask);
            } else {
                this._crc ^= dataBytes[i];
            }
            for (j = 0; j < 8; j++) {

                if ((this._crc & this._check) !== 0) {
                    this._crc = (this._refIn ? (this._crc >>> 1) : (this._crc << 1)) ^ this._polynomial;
                } else {
                    this._crc = (this._refIn ? (this._crc >>> 1) : (this._crc << 1));
                }
            }
        }
        this._crc &= this._mask;
    }

    finish(hex = true) {
        if (this._bit < 8 && !this._refIn) {
            this._crc >>= (8 - this._bit);
        }
        let _calc;
        if (this._refIn !== this._refOut && this._refOut) {
            //  Just using for CRC-12/UMTS
            _calc = this._crc & this._mask;
            _calc = ((CRC._REVERSE_BIT(_calc, _calc.toString(2).length) ^ this._xorOut) >>> 0);
        } else {
            _calc = (((this._crc ^ this._xorOut) & this._mask) >>> 0);
        }

        let _result;
        if (hex) {
            let _string = _calc.toString(16);
            while (_string.length < this._outLength) {
                _string = "0" + _string;
            }
            _result = "0x" + _string;
        } else {
            _result = [];
            while (true) {
                if (_calc === 0 || _calc === -1) {
                    break;
                }
                _result.unshift(_calc & 0xFF);
                _calc >>= 8;
            }
        }
        this.reset();
        return _result;
    }

    reset() {
        this._crc = this._init;
    }
}