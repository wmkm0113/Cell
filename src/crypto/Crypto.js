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
 * [New] Interface for MD5/SHA
 */
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

    static add(x, ...args) {
        let _a = x._low & 0xFFFF, _b = x._low >>> 16, _c = x._high & 0xFFFF, _d = x._high >>> 16;
        let _length = args.length;
        for (let i = 0 ; i < _length ; i++) {
            _a += (args[i]._low & 0xFFFF);
            _b += (args[i]._low >>> 16);
            _c += (args[i]._high & 0xFFFF);
            _d += (args[i]._high >>> 16);
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

class Crypto {
    static safeAdd(x = 0, y = 0) {
        if ((typeof x).toLowerCase() === "number" && (typeof y).toLowerCase() === "number") {
            let _low = (x & 0xFFFF) + (y & 0xFFFF);
            let _high = (x >> 16) + (y >> 16) + (_low >> 16);
            return (_high << 16) | (_low & 0xFFFF);
        } else {
            return Int64.add(x, y)
        }
    }
}

export {Int64, Crypto}