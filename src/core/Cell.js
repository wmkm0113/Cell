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

import * as Commons from "../commons/Commons.js";
import CRC from "../crypto/CRC.js";
import MD5 from "../crypto/MD5.js";
import RSA from "../crypto/RSA.js";
import SHA from "../crypto/SHA.js";
import UIRender from "../render/Render.js";
import {FloatWindow, FloatPage, NotifyArea, MockSwitch, MockDialog, MockCheckBox, MockRadio} from "../ui/mock.js";
import * as Details from "../ui/details.js";
import {TipsElement, ProgressBar, ScrollBar, StarRating, StarScore} from "../ui/element.js";
import {BaiduMap, GoogleMap} from "../ui/maps.js";
import {FormItem, FormInfo} from "../ui/form.js";
import {ButtonGroup, CheckBoxGroup, RadioGroup} from "../ui/group.js";
import * as Input from "../ui/input.js";
import * as List from "../ui/list.js";
import SlideShow from "../ui/slide.js";
import SocialGroup from "../ui/social.js";
import {MenuElement, MenuItem, MultilingualMenu, CategoryMenu} from "../ui/menu.js";

class CellJS {
    _languageCode = null;

    constructor() {
        this._config = {
            contextPath: "",
            componentPath: "",
            languageCode: Comment.Language,
            scrollHeader: {
                enabled: false,
                selectors: [],
                styleClass: "fixed"
            },
            //  Config the dark mode by sunrise and sunset
            darkMode: {
                mode: Commons.DarkMode.Sun,
                styleClass: "darkMode"
            },
            //  Config for form data
            formConfig: {
                //  Convert date/time from 'yyyy-MM-dd [HH:mm]' to number of milliseconds between that date and midnight, January 1, 1970.
                convertDateTime: false,
                //  Convert value is UTC number of milliseconds between that date and midnight, January 1, 1970.
                utcDateTime: false
            },
            security: {
                providers: [MD5, CRC, SHA, RSA],
                //  Encrypt value of input[type='password']
                encryptPassword: true,
                //  Encrypt method for input[type='password']
                //  Options:    MD5/RSA/SHA1/SHA224/SHA256/SHA384/SHA512/SHA512_224/SHA512_256
                //              SHA3_224/SHA3_256/SHA3_384/SHA3_512/SHAKE128/SHAKE256
                //              Keccak224/Keccak256/Keccak384/Keccak512
                encryptMethod: "MD5",
                //  RSA Key Config
                RSA: {
                    //  RSA Key data
                    exponent: "",
                    modulus: "",
                    //  Exponent and modulus data radix, default is 16
                    radix: 16,
                    //  Public Key Size
                    keySize: 1024
                }
            },
            elements: [
                BaiduMap, GoogleMap, TipsElement, FloatPage, FloatWindow, NotifyArea, MockSwitch, MockDialog, MockCheckBox,
                MockRadio, ProgressBar, ScrollBar, StarRating, StarScore, ButtonGroup, CheckBoxGroup, RadioGroup,
                Input.InputElement, Input.BaseInput, Input.StandardButton, Input.SubmitButton, Input.FavoriteButton, Input.LikeButton,
                Input.ResetButton, Input.PasswordInput, Input.HiddenInput, Input.TextInput, Input.SearchInput,
                Input.NumberInput, Input.DateInput, Input.TimeInput, Input.DateTimeInput, Input.SelectInput,
                Input.TextAreaInput, Input.NumberIntervalInput, Input.DateIntervalInput, Input.TimeIntervalInput,
                Input.DateTimeIntervalInput, Input.DragUpload, FormItem, FormInfo, List.ListFilter, List.ListData,
                List.ListStatistics, List.ListTitle, List.ListRecord, List.RecordOperator, List.ListHeader,
                List.PropertyItem, List.PropertyDefine, List.MessageList, Details.UserDetails, List.CommentList,
                List.CommentData, SlideShow, SocialGroup, MenuItem, MenuElement, MultilingualMenu, CategoryMenu,
                Details.AttachFiles, Details.ModelDetails, Details.ModelList, Details.AccessoriesDetails, Details.AccessoriesList,
                Details.ResourceDetails, Details.MessageDetails, Details.PropertyDetails, Details.CorporateAddress,
                Details.CorporateDetails, Details.CorporatePreview, Details.LinkAvatar, Details.LinkBanner
            ]
        };
        Object.assign(this._config, (Commons.Config || {}));
        //  Freeze config
        Object.freeze(this._config);

        if (this._config.darkMode.enabled && Comment.GPS) {
            try {
                navigator.geolocation.getCurrentPosition(function (position) {
                    Cell.registerDarkMode(position.coords.longitude, position.coords.latitude);
                });
            } catch (e) {
                console.log("Access geolocation failed! ");
            }
        }
        this._darkMode = false;
    }

    init() {
        this.language = this._config.languageCode;
        this._initCrypto();
        this.Render = new UIRender();
        this.Render.init(this._config.elements);
        if (this._config.scrollHeader.enabled) {
            window.onload = this.scrollPage;
            window.onscroll = this.scrollPage;
        }
        switch (this._config.darkMode.mode) {
            case Commons.DarkMode.Light:
                document.body.removeClass(this._config.darkMode.styleClass);
                break;
            case Commons.DarkMode.Dark:
                document.body.appendClass(this._config.darkMode.styleClass);
                break;
            case Commons.DarkMode.Sun:
                try {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        Cell.registerDarkMode(position.coords.longitude, position.coords.latitude);
                    });
                } catch (e) {
                    console.log("Access geolocation failed! ");
                }
                break;
            case Commons.DarkMode.System:
                const matchMedia = window.matchMedia("(prefers-color-scheme: light)");
                matchMedia.addEventListener("change", (event) => this.systemDarkMode(event));
                this.systemDarkMode(matchMedia);
                break;
        }
    }

    alert(message = "") {
        this.Render.message("alert", message);
    }

    confirm(message = "", confirmFunc = null) {
        this.Render.message("confirm", message, confirmFunc);
    }

    notify(message = null) {
        if (message === null || message === undefined) {
            return;
        }
        this.Render.message("notify", message);
    }

    contextPath() {
        return this._config.contextPath;
    }

    initData(dataCode = "", element) {
        if (this._config.componentPath.length === 0 || dataCode.length === 0
            || element === undefined || element === null) {
            return;
        }
        let urlAddress = this._config.componentPath.replace("{dataCode}", dataCode);
        Cell.Ajax(Cell.contextPath() + urlAddress)
            .then(responseText => element.data = responseText)
            .catch(errorMsg => console.error(errorMsg));
    }

    _parseResponse(responseData = {}, _floatWindow = false, linkAddress = "") {
        let title = "";
        if (responseData.hasOwnProperty("title")) {
            responseData.title.setTitle();
            title = responseData.title;
        }
        if (responseData.hasOwnProperty("keywords")) {
            responseData.keywords.setKeywords();
        }
        if (responseData.hasOwnProperty("description")) {
            responseData.description.setDescription();
        }
        if (responseData.hasOwnProperty("data")) {
            if (!_floatWindow) {
                Cell.closeWindow();
            }
            Cell._renderElement(responseData.data, _floatWindow);
        }
        if (linkAddress.length > 0) {
            history.pushState(null, title, linkAddress);
        }
        if (responseData.hasOwnProperty("notify")) {
            Cell.notify(JSON.stringify(responseData.notify));
        }
    }

    sendRequest(event) {
        if (!Commons.Comment.Browser.IE || Commons.Comment.Browser.IE11) {
            event.preventDefault();
            event.stopPropagation();
        }

        let target = event.currentTarget;
        if (target.dataset.disabled == null || target.dataset.disabled === "false") {
            if (target.tagName.toLowerCase() === "form") {
                return this.submitForm(target);
            } else {
                let linkAddress = target.tagName.toLowerCase() === "a"
                    ? target.getAttribute("href")
                    : target.dataset.link;
                if (linkAddress !== undefined && linkAddress.length > 0 && linkAddress !== "#") {
                    if (target.dataset.openWindow === "true" ||
                        (target.dataset.targetId !== undefined && target.dataset.targetId !== null
                            && target.dataset.targetId.length > 0)) {
                        let _floatWindow = Boolean(target.dataset.openWindow);
                        let _element = _floatWindow ? Cell._floatWindow() : $(target.dataset.targetId);
                        if (_element) {
                            Cell.Ajax(linkAddress)
                                .then(responseText => {
                                    if (responseText.isJSON()) {
                                        Cell._parseResponse(responseText.parseJSON(), _floatWindow, linkAddress);
                                    } else {
                                        if (!_floatWindow) {
                                            Cell.closeWindow();
                                        }
                                        _element.innerHTML = ("" + responseText);
                                        history.pushState(null, "", linkAddress);
                                    }
                                })
                                .catch(errorMsg => console.error(errorMsg));
                        }
                    } else {
                        window.location = linkAddress;
                    }
                }
                if (target.tagName.toLowerCase() === "a") {
                    return false;
                }
            }
        }
    }

    openWindow(data) {
        Cell._floatWindow().data = data;
    }

    closeWindow() {
        let floatWindow = Cell._floatWindow();
        if (floatWindow) {
            document.body.removeChild(floatWindow);
        }
    }

    submitForm(formElement) {
        if (formElement && !formElement.dataset.disabled && formElement.validate()) {
            let formData = formElement.formData();
            Cell.Ajax(formElement.action, {
                method: formElement.getAttribute("method"),
                uploadFile: formData.uploadFile,
                uploadProgress: formData.uploadProgress
            }, formData.data)
                .then(responseText => {
                    if (responseText.isJSON()) {
                        Cell._parseResponse(responseText.parseJSON());
                        if (formElement.method.toLowerCase() === "get") {
                            let urlAddress = formElement.action;
                            if (formData.data != null) {
                                let queryString = "";
                                for (let key of formData.data.keys()) {
                                    queryString += ("&" + key + "=" + formData.data.get(key));
                                }
                                if (queryString.length > 0) {
                                    urlAddress += ("?" + queryString.substring(1));
                                }
                            }
                            history.pushState(null, null, urlAddress);
                        }
                    }
                })
                .catch(errorMsg => console.error(errorMsg));
        }
        return false;
    }

    registerDarkMode(posLon, posLat) {
        if (this._config.darkMode.mode === Commons.DarkMode.Sun) {
            let Sun = new Date().sunTime(posLon, posLat);
            if (Sun.SunRise === -1 || Sun.SunSet === -1) {
                return;
            }
            this._sunRise = Sun.SunRise;
            this._sunSet = Sun.SunSet;
            this.switchDarkMode();
            setInterval(function () {
                Cell.switchDarkMode();
            }, 60 * 1000);
        }
    }

    switchDarkMode() {
        if (this._config.darkMode.mode === Commons.DarkMode.Sun) {
            let _currDate = new Date(),
                _currTime = _currDate.getTime() + (_currDate.getTimezoneOffset() * 60 * 1000);
            if (_currTime > this._sunRise && this._darkMode) {
                this._disableDarkMode();
            } else if (_currTime > this._sunSet && !this._darkMode) {
                this._enableDarkMode();
            }
        }
    }

    systemDarkMode(event) {
        if (event.matches) {
            this._disableDarkMode();
        } else {
            this._enableDarkMode();
        }
    }

    _enableDarkMode() {
        document.body.appendClass(this._config.darkMode.styleClass);
    }

    _disableDarkMode() {
        document.body.removeClass(this._config.darkMode.styleClass);
    }

    get language() {
        return this._languageCode;
    }

    set language(languageCode) {
        if (this._languageCode === languageCode) {
            return;
        }
        document.documentElement.lang = languageCode;
        this._languageCode = languageCode;
    }

    encData(data) {
        return this.calculateData(this._config.security.encryptMethod, data);
    }

    decData(data) {
        return this.calculateData(this._config.security.encryptMethod, data, "true");
    }

    calculateData(method, data, key = "") {
        if (method === "RSA") {
            if (Boolean(key)) {
                return Cell["RSA"].newInstance(this._config.security.RSA).decrypt(data);
            } else {
                return Cell["RSA"].newInstance(this._config.security.RSA).encrypt(data);
            }
        }
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
                method: "get",
                userName: null,
                passWord: null,
                asynchronous: true,
                uploadFile: false,
                uploadProgress: null
            };
            Object.assign(_options, options);
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
                _request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        CellJS._parseResponse(_request, resolve, reject);
                    }
                };
            }

            _request.ontimeout = function () {
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
                        _request.upload.onprogress = function (event) {
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

    _floatWindow() {
        let floatWindow = document.body.querySelector("float-window");
        if (floatWindow === null) {
            floatWindow = new FloatWindow();
            document.body.append(floatWindow);
        }
        return floatWindow;
    }

    _renderElement(dataList = [], floatWindow = false) {
        dataList.forEach(dataItem => {
            if (dataItem.hasOwnProperty("id") && dataItem.hasOwnProperty("tagName")) {
                if (floatWindow) {
                    let floatWindow = document.body.querySelector("float-window");
                    if (floatWindow) {
                        floatWindow.data = JSON.stringify(dataItem);
                    }
                } else {
                    let parentElement;
                    if (dataItem.hasOwnProperty("parentId")) {
                        parentElement = $(dataItem.parentId);
                    } else {
                        parentElement = document.body;
                    }
                    let bindElement = parentElement.querySelector(dataItem.tagName + "[id=\"" + dataItem.id + "\"]");
                    if (bindElement === null) {
                        bindElement = document.createElement(dataItem.tagName);
                        bindElement.id = dataItem.id;
                        parentElement.appendChild(bindElement);
                    }
                    if (dataItem.hasOwnProperty("data")) {
                        bindElement.data = JSON.stringify(dataItem.data);
                    } else if (dataItem.hasOwnProperty("dataCode") && bindElement.dataLoad !== undefined) {
                        bindElement.dataset.code = dataItem.dataCode;
                        bindElement.dataLoad();
                    }
                }
            }
        });
    }

    _initCrypto() {
        this._config.security.providers.forEach(provider => {
            let bundle = provider.CryptoName;
            this[bundle] = bundle;
            provider.initialize();
        })
    }

    static _parseResponse(_request, resolve, reject) {
        let languageCode = _request.getResponseHeader("languageCode");
        if (languageCode !== null) {
            Cell.language = languageCode;
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

    scrollPage() {
        Cell._config.scrollHeader.selectors
            .filter(selector => selector.length > 0)
            .forEach(selector => {
                let pinnedElement = document.body.querySelector(selector);
                if (pinnedElement) {
                    if (!pinnedElement.dataset.hasOwnProperty("offsetTop")) {
                        pinnedElement.dataset.offsetTop = pinnedElement.offsetTop;
                    }
                    if (pinnedElement.scrollOut()) {
                        pinnedElement.appendClass(Cell._config.scrollHeader.styleClass);
                    } else {
                        pinnedElement.removeClass(Cell._config.scrollHeader.styleClass);
                    }
                }
            })
    }
}

(

    function () {
        if (typeof window.Cell === "undefined") {
            window.$ = Commons.$;
            window.Cell = new CellJS();
            window.Cell.init();
        }
    }

)()
;