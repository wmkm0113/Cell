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
 *
 * 1.0.0
 * [New] Send Ajax Request
 * [New] Encode form data
 * [New] Template Render
 * [New] Multilingual Support
 * [New] Core CellJS
 *
 */
'use strict';

import {Comment, Config, $} from "../commons/Commons.js";
import RSA from "../crypto/RSA.js";
import UIRender from "../render/Render.js";
import {FloatWindow, FloatPage, NotifyArea, MockSwitch, MockDialog, MockCheckBox, MockRadio} from "../ui/mock.js";
import {StandardButton, SubmitButton, ResetButton} from "../ui/button.js";
import * as Details from "../ui/details.js";
import {ProgressBar, ScrollBar, StarRating, StarScore} from "../ui/element.js";
import {FormItem, FormInfo} from "../ui/form.js";
import {ButtonGroup, CheckBoxGroup, RadioGroup} from "../ui/group.js";
import * as Input from "../ui/input.js";
import * as List from "../ui/list.js";
import SlideShow from "../ui/slide.js";
import SocialGroup from "../ui/social.js";
import TipsElement from "../ui/tips.js";
import {MenuElement, MenuItem} from "../ui/menu.js";

class CellJS {
    _languageCode = null;

    constructor() {
        this._config = {
            developmentMode: false,
            contextPath : "",
            resPath : "/src/i18n",
            languageCode : Comment.Language,
            //  Config the dark mode by sunrise and sunset
            darkMode : {
                enabled : false,
                styleClass : "darkMode"
            },
            //  Config for form data
            formConfig : {
                //  Convert date/time from 'yyyy-MM-dd [HH:mm]' to number of milliseconds between that date and midnight, January 1, 1970.
                convertDateTime : false,
                //  Convert value is UTC number of milliseconds between that date and midnight, January 1, 1970.
                utcDateTime : false
            },
            security : {
                //  Encrypt value of input[type='password']
                encryptPassword : true,
                //  Encrypt method for input[type='password']
                //  Options:    MD5/RSA/SHA1/SHA224/SHA256/SHA384/SHA512/SHA512_224/SHA512_256
                //              SHA3_224/SHA3_256/SHA3_384/SHA3_512/SHAKE128/SHAKE256
                //              Keccak224/Keccak256/Keccak384/Keccak512
                encryptMethod : "MD5",
                //  RSA Key Config
                RSA : {
                    //  Public Key data
                    exponent : "",
                    modulus : "",
                    //  Exponent and modulus data radix, default is 16
                    radix : 16,
                    //  Public Key Size
                    keySize : 1024
                }
            },
            elements : [
                TipsElement, FloatPage, FloatWindow, NotifyArea, MockSwitch, MockDialog, MockCheckBox, MockRadio,
                StandardButton, SubmitButton, ResetButton, ProgressBar, ScrollBar, StarRating, StarScore,
                ButtonGroup, CheckBoxGroup, RadioGroup, FormItem, FormInfo,
                Input.InputElement, Input.BaseInput, Input.AbstractInput, Input.PasswordInput, Input.HiddenInput,
                Input.TextInput, Input.SearchInput, Input.NumberInput, Input.DateInput, Input.TimeInput,
                Input.DateTimeInput, Input.SelectInput, Input.TextAreaInput, Input.NumberIntervalInput,
                Input.DateIntervalInput, Input.TimeIntervalInput, Input.DateTimeIntervalInput, Input.DragUpload,
                List.ListFilter, List.ListData, List.ListStatistics, List.ListTitle, List.ListRecord,
                List.RecordOperator, List.ListHeader, List.PropertyItem, List.PropertyDefine, List.MessageList,
                List.CategoryList, SlideShow, SocialGroup, MenuItem, MenuElement, Details.AttachFiles, Details.MessageDetails,
                Details.ModelList, Details.CategoryAccessories, Details.AccessoriesList, Details.CorporateAddress,
                Details.CorporateResource, Details.CorporateDetails, Details.CorporateAbstract, Details.WidgetButton,
                Details.ContentBanner
            ]
        };
        Object.extend(this._config, (Config || {}));
        //  Freeze config
        Object.freeze(this._config);
        this._languageCode = this._config.languageCode;

        this._resources = {};
        this._modules = {};

        if (this._config.darkMode.enabled && Comment.GPS) {
            try {
                navigator.geolocation.getCurrentPosition(function (position) {
                    Cell.registerDarkMode(position.coords.longitude, position.coords.latitude);
                });
            } catch (e) {
                if (this._config.developmentMode) {
                    console.log("Access geolocation failed! ");
                }
            }
        }
        this._darkMode = false;
        this._rsaPublic = null;
    }

    init() {
        this.language(this._languageCode);
        if (this._config.security.RSA.exponent.length > 0 && this._config.security.RSA.modulus.length > 0) {
            this._rsaPublic = new RSA(this._config.security.RSA);
        }
        this.Render = new UIRender();
        this.Render.init(this._config.elements);
    }

    alert(message = null) {
        if (message === null || message === undefined) {
            return;
        }
        this.Render.message("alert", message);
    }

    confirm(message = null, confirmFunc = null) {
        if (message === null || message === undefined) {
            this.Render.message("confirm", message, confirmFunc);
        }
    }

    notify(message = null) {
        if (message === null || message === undefined) {
            return;
        }
        this.Render.message("notify", message);
    }

    developmentMode() {
        return this._config.developmentMode;
    }

    contextPath() {
        return this._config.contextPath;
    }

    sendRequest(event) {
        if (!Comment.Browser.IE || Comment.Browser.IE11) {
            event.preventDefault();
            event.stopPropagation();
        }

        let target = event.currentTarget;
        if (target.dataset.disabled == null || target.dataset.disabled === "false") {
            let linkAddress = target.tagName.toLowerCase() === "a"
                ? target.getAttribute("href")
                : target.dataset.link;
            if (linkAddress !== undefined && linkAddress.length > 0 && linkAddress !== "#") {
                if (target.dataset.targetId === undefined || target.dataset.targetId === null
                    || target.dataset.targetId.length === 0) {
                    window.location = linkAddress;
                } else {
                    Cell.Ajax(linkAddress)
                        .then(responseText => {
                            let _element = $(target.dataset.targetId);
                            if (_element) {
                                if (responseText.isJSON()) {
                                    _element.clearChildNodes();
                                    let responseData = responseText.parseJSON();
                                    if (responseData.hasOwnProperty("title")) {
                                        responseData.title.setTitle();
                                    }
                                    if (responseData.hasOwnProperty("keywords")) {
                                        responseData.keywords.setKeywords();
                                    }
                                    if (responseData.hasOwnProperty("description")) {
                                        responseData.description.setDescription();
                                    }
                                    if (responseData.hasOwnProperty("data")) {
                                        Cell._renderElement(_element, responseData);
                                    }
                                } else {
                                    _element.innerHTML = ("" + responseText);
                                }
                                history.pushState(null, null, linkAddress);
                            }
                        })
                        .catch(errorMsg => {
                            console.error(errorMsg);
                        });
                }
            }
        }
        if (target.tagName.toLowerCase() === "a" && Comment.Browser.IE && !Comment.Browser.IE11) {
            return false;
        }
    }

    openWindow(data) {
        let floatWindow = document.body.querySelector("float-window");
        if (floatWindow === null) {
            floatWindow = new FloatWindow();
            document.body.append(floatWindow);
        }
        floatWindow.data = data;
    }

    _renderElement(element, jsonData = []) {
        jsonData.data.forEach(dataItem => {
            if (dataItem.hasOwnProperty("tagName")
                && dataItem.hasOwnProperty("data")) {
                let selector = dataItem.tagName;
                if (dataItem.data.hasOwnProperty("id")) {
                    selector += ("[id=\"" + dataItem.data.id + "\"]");
                }
                let bindElement = element.querySelector(selector);
                if (bindElement === null) {
                    bindElement = document.createElement(dataItem.tagName);
                    element.appendChild(bindElement);
                }
                if (dataItem.hasOwnProperty("targetId")) {
                    bindElement.dataset.targetId = dataItem.targetId;
                }
                bindElement.data = JSON.stringify(dataItem.data);
            }
        });
    }

    submitForm(formElement) {
        if (formElement && !formElement.dataset.disabled && formElement.validate()) {
            if (formElement.dataset.targetId === undefined || formElement.dataset.targetId === null
                || formElement.dataset.targetId.length === 0) {
                formElement.submit();
            } else {
                let jsonData = formElement.formData();
                Cell.Ajax(formElement.action, {
                    method : formElement.getAttribute("method"),
                    uploadFile : jsonData.uploadFile,
                    uploadProgress : jsonData.uploadProgress
                }, jsonData.formData)
                    .then(responseText => {
                        let _element = $(formElement.dataset.targetId);
                        if (_element) {
                            if (responseText.isJSON()) {
                                _element.clearChildNodes();
                                Cell._renderElement(_element, responseText.parseJSON());
                            } else {
                                _element.innerHTML = ("" + responseText);
                            }
                        }
                        if (formElement.method.toLowerCase() === "get") {
                            let urlAddress = formElement.action;
                            if (jsonData.formData != null) {
                                let queryString = "";
                                for (let key of jsonData.formData.keys()) {
                                    queryString += ("&" + key + "=" + jsonData.formData.get(key));
                                }
                                if (queryString.length > 0) {
                                    urlAddress += ("?" + queryString.substring(1));
                                }
                            }
                            history.pushState(null, null, urlAddress);
                        }
                    })
                    .catch(errorMsg => {
                        console.error(errorMsg);
                    });
            }
        }
        return false;
    }

    registerDarkMode(posLon, posLat) {
        if (this._config.darkMode.enabled) {
            let Sun = new Date().sunTime(posLon, posLat);
            if (Sun.SunRise === -1 || Sun.SunSet === -1) {
                return;
            }
            this._sunRise = Sun.SunRise;
            this._sunSet = Sun.SunSet;
            this.switchDarkMode();
            setInterval(function() {
                Cell.switchDarkMode();
            }, 60 * 1000);
        }
    }

    switchDarkMode() {
        if (this._config.darkMode.enabled) {
            let _currDate = new Date(), _currTime = _currDate.getTime() + (_currDate.getTimezoneOffset() * 60 * 1000);
            if (_currTime > this._sunRise && this._darkMode) {
                document.body.removeClass(this._config.darkMode.styleClass);
            } else if (_currTime > this._sunSet && !this._darkMode) {
                document.body.appendClass(this._config.darkMode.styleClass);
            }
        }
    }

    loadResource(bundle = "", initFunc = null) {
        let _url = this.contextPath() + this._config.resPath;
        _url += this._config.resPath.endsWith("/") ? "" : "/";
        _url += bundle + "/" + this._languageCode + ".json";
        Cell.Ajax(_url).then(responseData => {
            this._resources[bundle] = responseData.parseJSON();
            if (initFunc != null) {
                initFunc.apply(this);
            }
        }).catch(errorMsg => {
            console.log(errorMsg);
            this._resources[bundle] = {};
        });
    }

    message(bundle = "", key = "", ...args) {
        if ((typeof bundle) !== "string") {
            throw new Error(Cell.message("Core", "Multi.Bundle.Type"));
        }
        if (this._resources.hasOwnProperty(bundle)) {
            if (this._resources[bundle].hasOwnProperty(key)) {
                let _resource = this._resources[bundle][key];
                for (let i = 0 ; i < args.length ; i++) {
                    _resource = _resource.replace("{" + i + "}", args[i]);
                }
                return _resource;
            }
        }
        return bundle + "." + key;
    }

    language(languageCode) {
        if (this._languageCode === languageCode) {
            return;
        }

        this._languageCode = languageCode;
        this._resources = {};
        //  Load Core Resource
        this.loadResource("Core");
        for (let bundle in this._modules) {
            if (this._modules.hasOwnProperty(bundle) && this._modules[bundle]) {
                this.loadResource(bundle)
            }
        }
    }

    registerModule(bundle, module, loadResource = false, initFunc = null) {
        if (Object.hasOwnProperty(bundle)) {
            if (initFunc != null) {
                initFunc.apply(this);
            }
            return;
        }
        this[bundle] = module;
        if (!this._modules.hasOwnProperty(bundle)) {
            this._modules[bundle] = loadResource;
            if (loadResource) {
                this.loadResource(bundle, initFunc);
            }
        }
    }

    encryptPassword(password) {
        if (this._config.security.encryptPassword) {
            if (this._config.security.encryptMethod === "RSA") {
                if (this._rsaPublic === null) {
                    console.error("RSA key not initialized");
                    return "";
                }
                return this._rsaPublic.encrypt(password);
            }
            return this.calculateData(this._config.security.encryptMethod, password);
        }
        return password;
    }

    calculateData(method, data, key = "") {
        let encryptor;
        if (method.startsWith("CRC")) {
            encryptor = Cell["CRC"].newInstance(method);
        } else {
            switch (method) {
                case "MD5":
                    encryptor = Cell["MD5"].newInstance(key);
                    break;
                case "SHA1":
                    encryptor = Cell["SHA"].SHA1(key);
                    break;
                case "SHA224":
                    encryptor = Cell["SHA"].SHA224(key);
                    break;
                case "SHA256":
                    encryptor = Cell["SHA"].SHA256(key);
                    break;
                case "SHA384":
                    encryptor = Cell["SHA"].SHA384(key);
                    break;
                case "SHA512":
                    encryptor = Cell["SHA"].SHA512(key);
                    break;
                case "SHA512_224":
                    encryptor = Cell["SHA"].SHA512_224(key);
                    break;
                case "SHA512_256":
                    encryptor = Cell["SHA"].SHA512_256(key);
                    break;
                case "SHA3_224":
                    encryptor = Cell["SHA"].SHA3_224(key);
                    break;
                case "SHA3_256":
                    encryptor = Cell["SHA"].SHA3_256(key);
                    break;
                case "SHA3_384":
                    encryptor = Cell["SHA"].SHA3_384(key);
                    break;
                case "SHA3_512":
                    encryptor = Cell["SHA"].SHA3_512(key);
                    break;
                case "SHAKE128":
                    encryptor = Cell["SHA"].SHAKE128();
                    break;
                case "SHAKE256":
                    encryptor = Cell["SHA"].SHAKE256();
                    break;
                case "Keccak224":
                    encryptor = Cell["SHA"].Keccak224(key);
                    break;
                case "Keccak256":
                    encryptor = Cell["SHA"].Keccak256(key);
                    break;
                case "Keccak384":
                    encryptor = Cell["SHA"].Keccak384(key);
                    break;
                case "Keccak512":
                    encryptor = Cell["SHA"].Keccak512(key);
                    break;
                default:
                    return data;
            }
        }
        encryptor.append(data);
        return encryptor.finish();
    }

    dateToMilliseconds(value = "") {
        if (this._config.formConfig.convertDateTime) {
            let milliseconds = Date.parse(value);
            if (this._config.formConfig.utcDateTime) {
                milliseconds += Comment.TimeZoneOffset;
            }
            return milliseconds;
        }
        return value;
    }

    millisecondsToDate(value = null, pattern = Comment.ISO8601DATETIMEPattern,
                       utc = this._config.formConfig.utcDateTime) {
        if (Number.isFinite(value)) {
            return value.parseTime(utc).format(pattern);
        }
        if (Object.prototype.toString.call(value) === "[object String]" && value.isNum()) {
            return value.parseInt().parseTime(utc).format(pattern);
        }
        return value;
    }

    Ajax(url, options = {}, parameters = null) {
        return new Promise(function (resolve, reject) {
            let _options = {
                method : "get",
                userName : null,
                passWord : null,
                asynchronous : true,
                uploadFile : false,
                uploadProgress : null
            };
            Object.extend(_options, options);
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
                        reject(e.toString());
                        throw e;
                    }
                }
            }

            if (_options.asynchronous) {
                _request.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        CellJS._parseResponse(_request, resolve, reject);
                    }
                };
            }

            _request.ontimeout = function () {
                console.log(Cell.message("Core", "HttpClient.TimeOut", url));
                reject(_request);
            };
            if (_options.userName !== null && _options.passWord !== null) {
                _request.open(_options.method, url, _options.asynchronous, _options.userName, _options.passWord);
            } else {
                _request.open(_options.method, url, _options.asynchronous);
            }

            _request.setRequestHeader("Cache-Control", "no-cache");
            _request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            let _jwtToken = sessionStorage.getItem("JWTToken");
            if (_jwtToken != null) {
                _request.setRequestHeader("Authorization", _jwtToken);
            }

            if (parameters) {
                if (_options.uploadFile) {
                    if (_options.uploadProgress) {
                        _request.upload.onprogress = function(event) {
                            $(_options.uploadProgress).setAttribute("value", (event.loaded / event.total).toString());
                        };
                    }
                }
            }
            _request.send(parameters);

            if (!_options.asynchronous) {
                CellJS._parseResponse(_request, resolve, reject);
            }
        });
    }

    static _parseResponse(_request, resolve, reject) {
        let languageCode = _request.getResponseHeader("languageCode");
        if (languageCode !== null) {
            Cell.language(languageCode);
        }
        let _jwtToken = _request.getResponseHeader("Authentication");
        if (_jwtToken !== null) {
            sessionStorage.setItem("JWTToken", _jwtToken);
        }

        if (_request.status === 301 || _request.status === 302 || _request.status === 307) {
            let _redirectPath = _request.getResponseHeader("Location");
            if (_redirectPath.length !== 0) {
                let _newOption = {};
                Object.extend(_newOption, _request._options || {});
                _newOption.method = "GET";
                Cell.Ajax(_redirectPath, _newOption).then(resolve).catch(reject);
            } else {
                reject(_request);
            }
        } else if (_request.status === 200) {
            resolve(_request.responseText);
        } else {
            reject(_request.status);
        }
    }
}

(function() {
    if (typeof window.Cell === "undefined") {
        window.$ = $;
        window.Cell = new CellJS();
        window.Cell.init();
    }
})();