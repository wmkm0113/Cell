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
 * [New] Interface for MD5/SHA
 */
export default class Crypto {

    static safeAdd(x = 0, y = 0) {
        let _low = (x & 0xFFFF) + (y & 0xFFFF);
        let _high = (x >> 16) + (y >> 16) + (_low >> 16);
        return (_high << 16) | (_low & 0xFFFF);
    }

    append(string = "") {
        //  TODO: Override for crypto append string data
    }

    appendBinary(dataBytes = [], dataLength = 0) {
        //  TODO: Override for crypto append binary data
    }
}