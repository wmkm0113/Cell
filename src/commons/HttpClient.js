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
 *
 * 1.0.0
 * [New] Simple Http Client
 *
 */
export default class HttpClient {
    constructor(url, options) {
        this._options = {
            method : "get",
            elementId : "",
            userName : null,
            passWord : null,
            asynchronous : true,
            onCreate : null,
            onComplete : null,
            onError : null,
            onFinished : null
        };
        Object.extend(this._options, options || {});
        this._request = HttpClient._initialize(url, this._options);
    }

    addHeader(headerName, headerValue) {
        this._request.setRequestHeader(headerName, headerValue);
    }

    send(parameters = null) {
        this.addHeader("cache-control", "no-cache");
        this.addHeader("X-Requested-With", "XMLHttpRequest");
        let _jwtToken = sessionStorage.getItem("JWTToken");
        if (_jwtToken != null) {
            this.addHeader("Authorization", _jwtToken);
        }

        if (parameters && parameters.uploadFile && parameters.uploadProgress) {
            this._request.upload.onprogress = function(event) {
                $(parameters.uploadProgress).setAttribute("value", (event.loaded / event.total).toString());
            };
        }

        this._request.send(parameters);

        if (!this._options.asynchronous) {
            return HttpClient._parseResponse(this._request, this._options);
        }
    }

    static _parseResponse(_request, _options) {
        if (_options.onFinished) {
            _options.onFinished(_request);
        }

        if (_request.status === 200) {
            if (_options.onComplete) {
                return _options.onComplete(_request);
            }

            if (_options.elementId.length > 0) {
                let _element = $(_options.elementId);
                if (_element) {
                    _element.data = _request.responseText;
                }
            }
        } else if (_request.status === 301 || _request.status === 302 || _request.status === 307) {
            let _redirectPath = _request.getResponseHeader("Location");
            if (_redirectPath.length !== 0) {
                let _newOption = {};
                Object.extend(_newOption, _options || {});
                _newOption.method = "GET";
                new HttpClient(_redirectPath, _newOption).send();
            }
        } else {
            if (_options.onError) {
                return _options.onError(_request);
            }
        }
    }

    static _initialize(url, _options) {
        let _request;
        // If XMLHttpRequest is a javascript object in the local
        if (window.XMLHttpRequest) {
            _request = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // Support the ActiveX
            try {
                // Create XMLHttpRequest object by instance an ActiveXObject
                _request = new ActiveXObject("Microsoft.XMLHTTP"); // higher than msxml3
            } catch (e) {
                try {
                    // Create XMLHttpRequest object by instance an ActiveXObject
                    _request = new ActiveXObject("Msxml2.XMLHTTP"); // lower than msxml3
                } catch (e) {
                    console.error(e.toString());
                    throw e;
                }
            }
        }

        if (_options.asynchronous) {
            _request.onreadystatechange = function() {
                switch (this.readyState) {
                    case 1:
                        if (_options.onCreate) {
                            _options.onCreate(this);
                        }
                        break;
                    case 2:
                        let _jwtToken = this.getResponseHeader("Authentication");
                        if (_jwtToken !== null) {
                            sessionStorage.setItem("JWTToken", _jwtToken);
                        }
                        break;
                    case 4:
                        HttpClient._parseResponse(this, _options);
                        break;
                }
            };
        }

        if (_options.userName !== null && _options.passWord !== null) {
            _request.open(_options.method, url, _options.asynchronous,
                _options.userName, _options.passWord);
        } else {
            _request.open(_options.method, url, _options.asynchronous);
        }

        return _request;
    }
}
