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
import {DebugMode} from "../commons/Commons.js";

class CellJS {
    static ELEMENTS = [
        BaiduMap, GoogleMap, TipsElement, FloatPage, FloatWindow, NotifyArea, MockSwitch, MockDialog, MockCheckBox,
        MockRadio, ProgressBar, ScrollBar, StarRating, StarScore, ButtonGroup, CheckBoxGroup, RadioGroup,
        Input.InputElement, Input.BaseInput, Input.StandardButton, Input.SubmitButton, Input.FavoriteButton, Input.LikeButton,
        Input.ResetButton, Input.PasswordInput, Input.HiddenInput, Input.TextInput, Input.SearchInput, Input.EmailInput,
        Input.NumberInput, Input.DateInput, Input.TimeInput, Input.DateTimeInput, Input.SelectInput,
        Input.TextAreaInput, Input.NumberIntervalInput, Input.DateIntervalInput, Input.TimeIntervalInput,
        Input.DateTimeIntervalInput, Input.DragUpload, FormItem, FormInfo, List.ListFilter, List.ListData,
        List.ListStatistics, List.ListTitle, List.ListRecord, List.RecordOperator, List.ListHeader,
        List.PropertyItem, List.PropertyDefine, List.MessageList, Details.UserDetails, List.CommentList,
        List.CommentData, SlideShow, SocialGroup, MenuItem, MenuElement, MultilingualMenu, CategoryMenu,
        Details.AttachFiles, Details.ModelDetails, Details.ModelList, Details.AccessoriesDetails, Details.AccessoriesList,
        Details.ResourceDetails, Details.MessageDetails, Details.PropertyDetails, Details.CorporateAddress,
        Details.CorporateDetails, Details.CorporatePreview, Details.LinkAvatar, Details.LinkBanner
    ];
    _languageCode = "";

    constructor() {
        this._config = Commons.Config;
        //  Freeze config
        Object.freeze(this._config);

        this._darkMode = false;
        this._multiInfo = {};
    }

    async init() {
        this._languageCode = this._config.languageCode;
        await Cell.Ajax(this.contextPath() + this._config.multiPath.replace("{languageCode}", this._languageCode))
            .then(responseText => {
                if (responseText.isJSON()) {
                    this._multiInfo = responseText.parseJSON();
                }
            });
        this._initCrypto();
        this.Render = new UIRender();
        this.Render.init(CellJS.ELEMENTS);
        this.Render.init(this._config.elements);
        if (this._config.scrollHeader.enabled) {
            window.onload = this.scrollPage;
            window.onscroll = this.scrollPage;
        }

        if (this._config.darkMode.enabled && Comment.GPS) {
            switch (this._config.darkMode.mode) {
                case Commons.DarkMode.Light:
                    Cell.debug("Light.Mode.Dark");
                    document.body.removeClass(this._config.darkMode.styleClass);
                    break;
                case Commons.DarkMode.Dark:
                    Cell.debug("Dark.Mode.Dark");
                    document.body.appendClass(this._config.darkMode.styleClass);
                    break;
                case Commons.DarkMode.Sun:
                    Cell.debug("Sun.Mode.Dark");
                    try {
                        navigator.geolocation.getCurrentPosition((position) =>
                            Cell.registerDarkMode(position.coords.longitude, position.coords.latitude));
                    } catch (e) {
                        Cell.error("GPS.Error.Data", e.toString());
                    }
                    break;
                case Commons.DarkMode.System:
                    Cell.debug("System.Mode.Dark");
                    const matchMedia = window.matchMedia("(prefers-color-scheme: light)");
                    matchMedia.addEventListener("change", (event) => this.systemDarkMode(event));
                    this.systemDarkMode(matchMedia);
                    break;
            }
        }
        if (this._config.notify.dataPath.length > 0) {
            window.setTimeout(Cell._scheduleNotify, this._config.notify.period);
        }
    }

    _scheduleNotify() {
        if (this._config.notify.dataPath.length > 0) {
            Cell.debug("Notify.Path.Data", this._config.notify.dataPath);
            Cell.Ajax(this._config.notify.dataPath)
                .then(responseText => {
                    if (responseText.isJSON()) {
                        let _jsonData = responseText.parseJSON();
                        if (_jsonData.hasOwnProperty("notify")) {
                            _jsonData.notify.forEach(notifyItem => Cell.notify(JSON.stringify(notifyItem)));
                        }
                    }
                });
            window.setTimeout(Cell._scheduleNotify, this._config.notify.period);
        }
    }

    _initMulti() {
        if (this._languageCode.length === 0) {
            this._languageCode = this._config.languageCode;
        }
        Cell.Ajax(this.contextPath() + this._config.multiPath.replace("{languageCode}", this._languageCode),
            {asynchronous: false})
            .then(responseText => {
                if (responseText.isJSON()) {
                    this._multiInfo = responseText.parseJSON();
                }
            });
    }

    debug(messageKey = "", ...args) {
        if (this._config.debugMode <= Commons.DebugMode.DEBUG) {
            this._log(Commons.DebugMode.DEBUG, this.multiMsg(messageKey, args));
        }
    }

    info(messageKey = "", ...args) {
        if (this._config.debugMode <= Commons.DebugMode.INFO) {
            this._log(Commons.DebugMode.INFO, this.multiMsg(messageKey, args));
        }
    }

    warn(messageKey = "", ...args) {
        if (this._config.debugMode <= Commons.DebugMode.WARN) {
            this._log(Commons.DebugMode.WARN, this.multiMsg(messageKey, args));
        }
    }

    error(messageKey = "", ...args) {
        if (this._config.debugMode <= Commons.DebugMode.ERROR) {
            this._log(Commons.DebugMode.ERROR, this.multiMsg(messageKey, args));
        }
    }

    _log(debugMode = DebugMode.ERROR, multiMsg = "") {
        if (multiMsg.length > 0) {
            switch (debugMode) {
                case DebugMode.DEBUG:
                    console.debug(multiMsg);
                    break;
                case DebugMode.INFO:
                    console.info(multiMsg);
                    break;
                case DebugMode.WARN:
                    console.warn(multiMsg);
                    break;
                case DebugMode.ERROR:
                    console.error(multiMsg);
                    break;
            }
        }
    }

    multiMsg(messageKey = "", ...args) {
        let multiMessage = this._multiInfo.hasOwnProperty(messageKey) ? this._multiInfo[messageKey] : "";
        if (multiMessage.length > 0) {
            let index = 1;
            args.forEach(arg => {
                multiMessage = multiMessage.replace("{" + index + "}", arg);
                index++;
            });
        }
        return multiMessage;
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
        Cell.debug("Component.Path.Data", urlAddress);
        Cell.Ajax(Cell.contextPath() + urlAddress)
            .then(responseText => element.data = responseText)
            .catch(errorMsg => console.error(errorMsg));
    }

    _parseResponse(responseData = {}, _floatWindow = false, linkAddress = "") {
        let title = "";
        if (responseData.hasOwnProperty("title")) {
            responseData.title.setTitle();
            title = responseData.title;
            Cell.debug("Title.Data.Response", title);
        }
        if (responseData.hasOwnProperty("keywords")) {
            responseData.keywords.setKeywords();
            Cell.debug("Keywords.Data.Response", responseData.keywords);
        }
        if (responseData.hasOwnProperty("description")) {
            responseData.description.setDescription();
            Cell.debug("Description.Data.Response", responseData.description);
        }
        if (responseData.hasOwnProperty("data")) {
            Cell.debug("Info.Data.Response", JSON.stringify(responseData.data), _floatWindow);
            if (!_floatWindow) {
                Cell.closeWindow();
            }
            Cell._renderElement(responseData.data, _floatWindow);
        }
        if (linkAddress.length > 0) {
            history.pushState(null, title, linkAddress);
        }
        if (responseData.hasOwnProperty("notify")) {
            Cell.debug("Notify.Data.Response", JSON.stringify(responseData.notify));
            responseData.notify.forEach(notifyItem => Cell.notify(JSON.stringify(notifyItem)));
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
                                        Cell.debug("Text.Data.Response", responseText);
                                        if (!_floatWindow) {
                                            Cell.closeWindow();
                                        }
                                        _element.innerHTML = ("" + responseText);
                                        history.pushState(null, "", linkAddress);
                                    }
                                })
                                .catch(errorMsg => Cell.error("Error.Message", errorMsg));
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
            Cell.debug("Submit.Form.Data", JSON.stringify(formData));
            Cell.Ajax(formElement.action, {
                method: formElement.getAttribute("method"),
                uploadFile: formData.uploadFile,
                uploadProgress: formData.uploadProgress
            }, formData.data)
                .then(responseText => {
                    Cell.debug("Text.Data.Response", responseText);
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
                .catch(errorMsg => Cell.error("Error.Message", errorMsg));
        }
        return false;
    }

    registerDarkMode(posLon, posLat) {
        if (this._config.darkMode.mode === Commons.DarkMode.Sun) {
            let Sun = new Date().sunTime(posLon, posLat);
            if (Sun.SunRise === -1 || Sun.SunSet === -1) {
                Cell.error("Sun.Data.Error");
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
        this._initMulti();
    }

    digest(data) {
        if (this._config.security.password.encrypt) {
            return this.digestData(this._config.security.password.digest, data);
        } else {
            Cell.warn("Digest.Password.Data");
            return data;
        }
    }

    encData(data) {
        if (this._config.security.RSA.exponent.length > 0 && this._config.security.RSA.modulus.length > 0) {
            return RSA.newInstance(this._config.security.RSA).encrypt(data);
        } else {
            return data;
        }
    }

    decData(data) {
        if (this._config.security.RSA.exponent.length > 0 && this._config.security.RSA.modulus.length > 0) {
            return RSA.newInstance(this._config.security.RSA).decrypt(data);
        } else {
            return data;
        }
    }

    digestData(method, data, key = "", outBit = -1) {
        let encryptor;
        if (method.startsWith("CRC")) {
            encryptor = CRC.newInstance(method);
        } else if (method.toUpperCase().indexOf("MD5") !== -1) {
            encryptor = MD5.newInstance(key);
        } else if (method.toUpperCase().indexOf("SHA") !== -1) {
            encryptor = SHA.newInstance(method, key, outBit);
        } else if (Cell.hasOwnProperty(method)) {
            encryptor = Cell[method].newInstance(method, key, outBit);
        } else {
            encryptor = null;
            Cell.error("Digest.Unknown.Algorithm");
        }
        if (encryptor === null) {
            return data;
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
            Cell.debug("Link.Path.Data", url, _options.method);
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
                    } else if (dataItem.hasOwnProperty("dataCode") && bindElement.loadData !== undefined) {
                        bindElement.dataset.code = dataItem.dataCode;
                        bindElement.loadData();
                    }
                }
            }
        });
    }

    _initCrypto() {
        let cryptoNames = [];
        [MD5, CRC, RSA, SHA].concat(this._config.security.providers)
            .forEach(provider => {
                let bundle = provider.CryptoName;
                this[bundle] = bundle;
                provider.initialize();
                cryptoNames.push(bundle);
            });
        Cell.debug("Names.Crypto", cryptoNames.join(", "));
    }

    static _parseResponse(_request, resolve, reject) {
        Cell.debug("Status.Data.Response", _request.status);
        let languageCode = _request.getResponseHeader("languageCode");
        if (languageCode !== null) {
            Cell.language = languageCode;
            Cell.debug("Modify.Language.Code", languageCode);
        }
        let _jwtToken = _request.getResponseHeader("Authentication");
        if (_jwtToken !== null) {
            sessionStorage.setItem("JWTToken", _jwtToken);
        }

        if (_request.status === 301 || _request.status === 302 || _request.status === 307) {
            let _redirectPath = _request.getResponseHeader("Location");
            if (_redirectPath.length !== 0) {
                Cell.debug("Redirect.Path.Data", _redirectPath);
                let _newOption = {};
                Object.extend(_newOption, _request._options || {});
                _newOption.method = "GET";
                Cell.Ajax(_redirectPath, _newOption).then(resolve).catch(reject);
            } else {
                reject(_request);
            }
        } else if (_request.status === 200) {
            let _responseText = _request.responseText;
            if (Boolean(_request.getResponseHeader("Data-Encrypted"))) {
                Cell.debug("Decrypt.Data.Response");
                _responseText = Cell.decData(_responseText);
            }
            resolve(_responseText);
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
)();