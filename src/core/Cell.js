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
import {Crypto} from "../crypto/Crypto.js";
import CRC from "../crypto/CRC.js";
import MD5 from "../crypto/MD5.js";
import RSA from "../crypto/RSA.js";
import SHA from "../crypto/SHA.js";
import * as Renders from "../render/Renders.js";
import * as Components from "../components/Components.js";

const Options = {
    async: true,
    stream: false,
    method: "get",
    contentType: "",
    headers: [],
    userName: null,
    passWord: null,
    uploadFile: false,
    uploadProgress: ""
}

const ELEMENTS = [
    Components.TipsElement, Components.ProgressElement, Components.ScoreElement, Components.ResourceElement,
    Components.BannerElement, Components.ButtonElement, Components.ChartElement, Components.MessageDetailsElement,
    Components.CorporateDetailsElement, Components.MultiMenuElement, Components.MenuElement,
    Components.MessageListElement, Components.CommentListElement, Components.PropertyElement,
    Components.SocialGroupElement, Components.SlideElement, Components.CalendarElement,
    Components.FormItemElement, Components.FormInfoElement, Components.GroupItemElement, Components.TabsItemElement
];

const listener = function () {
    document.querySelectorAll("span[data-type='lazy']")
        .forEach(resource => {
            if (resource.inViewPort()) {
                resource.loadResource();
            }
        });
}

const retrieveWindow = function (type = "") {
    if (type.length === 0) {
        return null;
    }
    let target = document.body.querySelector(`:scope > div[data-type="${type}"]`);
    if (target === null) {
        target = Renders.WindowRender.newInstance(type);
        if (target !== null) {
            document.body._appendChild(target);
        }
    }
    return target;
}

class CellJS {
    _multilingual = false;
    _languageCode = "";
    _loggerBuffer = [];
    _notify = -1;
    _colorListener = -1;
    _registeredRenders = new Map();
    _observer = null;

    constructor() {
        this._config = JSON.stringify(Commons.Config).parseJSON();
        //  Freeze config
        Object.freeze(this._config);

        this._darkMode = false;
        this._multiInfo = {};
    }

    init() {
        this._observer = new MutationObserver(() => this._render());
        this._observer.observe(document.body, {
            attributes: false,
            childList: true,
            subtree: true
        });
        this._languageCode = this._config.multi.default;
        this._initMulti();
        this._languageCode.setLanguage();
        [CRC, MD5, SHA, RSA].forEach(crypto => this._registerCrypto(crypto));
        Object.values(Renders).forEach(render => this._register(render));
        ELEMENTS.concat(this._config.elements)
            .filter(component => component.tagName !== undefined && (typeof component.tagName) === "function")
            .forEach(component => {
                let tagName = component.tagName();
                if (tagName !== null) {
                    if (customElements.get(tagName) === undefined) {
                        customElements.define(tagName, component);
                    }
                }
            });
        window.onload = this.scrollPage;
        window.onscroll = this.scrollPage;
        window.onresize = this.scale;

        switch (this._config.colorMode) {
            case Commons.ColorMode.Light:
                Cell.debug("Light.Mode.Dark");
                document.body.removeClass("dark");
                break;
            case Commons.ColorMode.Dark:
                Cell.debug("Dark.Mode.Dark");
                document.body.appendClass("dark");
                break;
            case Commons.ColorMode.Sun:
                Cell.debug("Sun.Mode.Dark");
                if (Commons.Comment.GPS) {
                    try {
                        navigator.geolocation.getCurrentPosition((position) =>
                            Cell._registerDarkMode(position.coords.longitude, position.coords.latitude));
                    } catch (e) {
                        Cell.error("GPS.Error.Data", e.toString());
                    }
                }
                break;
            case Commons.ColorMode.System:
                Cell.debug("System.Mode.Dark");
                const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
                if (matchMedia.matches) {
                    this._switchColor();
                }
                matchMedia.addEventListener("change", (event) => {
                    if (event.matches !== this._darkMode) {
                        this._switchColor();
                    }
                });
                break;
        }
        this._notify = setInterval(Cell._scheduleNotify, this._config.notify.period);
        this.loadFont("iconfont", {display: "block"},
            "/fonts/iconfont.woff2?t=1679629706726", "/fonts/iconfont.woff?t=1679629706726", "/fonts/iconfont.ttf?t=1679629706726");
        this._render();

        if (this._config.maps.Google.ApiKey.length > 0) {
            (g => {
                let h, a, k, p = Cell.multiMsg("Map.API", "Google"), c = "google", l = "importLibrary", q = "__ib__",
                    m = document, b = window;
                b = b[c] || (b[c] = {});
                let d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
                    u = () => h || (h = new Promise(async (f, n) => {
                        await (a = m.createElement("script"));
                        e.set("libraries", [...r] + "");
                        for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                        e.set("callback", c + ".maps." + q);
                        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                        d[q] = f;
                        a.onerror = () => h = n(Error(Cell.multiMsg("Map.Load.Error", p)));
                        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                        m.head.append(a)
                    }));
                d[l] ? Cell.warn("Map.Reload.Warning", p, g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
            })({
                key: this._config.maps.Google.ApiKey,
                v: this._config.maps.Google.version
            });
        }
        if (this._config.maps.Baidu.ApiKey.length > 0) {
            (b => {
                let h, a, k, p = Cell.multiMsg("Map.API", "Baidu"), c = "baidu", l = "importLibrary", q = "__ib__",
                    d = document, w = window;
                w = w[c] || (w[c] = {});
                const m = w.maps || (w.maps = {}), e = new URLSearchParams,
                    u = () => h || (h = new Promise(async (f, n) => {
                        await (a = d.createElement("script"));
                        for (k in b) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), b[k]);
                        e.set("callback", c + ".maps." + q);
                        a.src = "https://api.map.baidu.com/api?" + e;
                        a.onerror = () => h = n(new Error(Cell.multiMsg("Map.Load.Error", p)));
                        m[q] = () => {
                            m[l] = () => window.explain(this._config.maps.Baidu.paramName);
                            delete m[q];
                            f();
                        };
                        d.head.append(a);
                    }));
                m[l] ? Cell.warn("Map.Reload.Warning", p, b) : m[l] = (f, n) => u().then(() => m[l](f, n));
            })({
                ak: this._config.maps.Baidu.ApiKey,
                v: this._config.maps.Baidu.version,
                type: this._config.maps.Baidu.type
            });
        }

        Cell.info("Success.Initialize.Result");

        if (Cell._modeEnabled(Commons.DebugMode.DEBUG)) {
            CRC.test();
        }
    }

    destroy() {
        if (this._notify > 0) {
            clearInterval(this._notify);
        }
        if (this._colorListener > 0) {
            clearInterval(this._colorListener);
        }
        this._observer.disconnect();
        this._observer = null;
        this._multiInfo = {};
        this._multilingual = false;
        this._loggerBuffer = [];
    }

    loadFont(name = "", descriptors = {}, ...paths) {
        const webFont = new Commons.WebFont(name, descriptors);
        const _paths = [];
        paths.forEach(path => {
            if (path.startsWith("http")) {
                //  Font file storage at CDN
                _paths.push(path);
            } else {
                //  Load local font file
                _paths.push(this._config.fontPrefixPath + path);
            }
        })
        webFont.paths(..._paths);
        const fontFace = webFont.generate();
        if (fontFace !== null) {
            fontFace.load().then(font => document.fonts.add(font));
        }
    }

    _scheduleNotify() {
        if (Cell._config.notify.dataPath.length > 0) {
            Cell.debug("Notify.Path.Data", Cell._config.notify.dataPath);
            Cell.sendRequest(Cell._config.notify.dataPath)
                .then((responseText) => {
                    if (responseText.isJSON()) {
                        Cell.notify(responseText.parseJSON());
                    }
                })
                .catch((errorMsg) => Cell.error("Error.Message", errorMsg));
        }
    }

    _initMulti() {
        if (this._multilingual) {
            return;
        }
        if ((this._config.multi === null) || (this._config.multi.codes.length === 0)
            || (this._config.multi.path.length === 0) || (this._config.multi.path.indexOf("{languageCode}") === -1)
            || (this._config.multi.codes.indexOf(this._config.multi.default) === -1)) {
            console.debug("Multilingual was not configured or invalid, ignore load multilingual information");
            return;
        }

        let url = this._config.contextPath + this._config.multi.path;
        let _loadLanguages = [];
        this._config.multi.codes
            .filter(languageCode => typeof languageCode === "string")
            .forEach(languageCode => {
                //  Use synchronous request to initialize multilingual information
                Cell.sendRequest(url.replace("{languageCode}", languageCode))
                    .then((responseText) => {
                        if (responseText.isJSON()) {
                            this._multiInfo[languageCode] = responseText.parseJSON();
                        }
                    })
                    .catch((errorMsg) => {
                        console.error("Load multilingual resource failed! Path: " + url, errorMsg);
                    })
                    .finally(() => {
                        _loadLanguages.push(languageCode);
                        this._initMultiCount(_loadLanguages.length);
                    });
            });
    }

    _initMultiCount(count = 0) {
        this._multilingual = (this._config.multi.codes.length === count);
        if (this._multilingual) {
            this._loggerBuffer.forEach(buffer => {
                const args = buffer.args.split("|");
                this._log(buffer.level, buffer.key, ...args);
            });
            this._loggerBuffer = [];
            this.multilingual();
        }
    }

    _register(render) {
        if (render) {
            const enhanceRender = new render();
            if (enhanceRender.selectors().length > 0) {
                enhanceRender.selectors().forEach(selector => this._registeredRenders.set(selector, enhanceRender));
            }
        }
    }

    _preRender(element = null) {
        if (element === null) {
            return;
        }
        this._registeredRenders.forEach((render, selector) => {
            if (element.matches(selector + ":not([data-render='true'])")) {
                this._renderElement(element, render);
            }
        })
    }

    _render() {
        this._registeredRenders.forEach((render, selector) =>
            $$(selector + ":not([data-render='true'])")
                .forEach((item) => {
                    this._renderElement(item, render);
                    Cell.multilingual(item);
                }));
    }

    _colorMode() {
        this._registeredRenders.forEach((render, selector) =>
            $$(selector).forEach((item) => render.colorMode(item, this._darkMode)));
    }

    _renderElement(element = null, render = null) {
        if (element === null || render === null) {
            return;
        }
        render._enhance(element);
        Object.defineProperty(element, "data", {
            set(data) {
                render._prepare(element, data);
                render._setData(element, data);
            }
        })
        element.dataset.render = "true";
        if (element.dataset.initData && element.dataset.initData.isJSON()) {
            element.data = element.dataset.initData.parseJSON();
        }
    }

    debug(messageKey = "", ...args) {
        this._log(Commons.DebugMode.DEBUG, messageKey, ...args);
    }

    info(messageKey = "", ...args) {
        this._log(Commons.DebugMode.INFO, messageKey, ...args);
    }

    warn(messageKey = "", ...args) {
        this._log(Commons.DebugMode.WARN, messageKey, ...args);
    }

    error(messageKey = "", ...args) {
        this._log(Commons.DebugMode.ERROR, messageKey, ...args);
    }

    _modeEnabled(loggerLevel = Commons.DebugMode.ERROR) {
        return this._config.debugMode <= loggerLevel;
    }

    _log(debugMode = Commons.DebugMode.ERROR, messageKey = "", ...args) {
        if (this._modeEnabled(debugMode) && messageKey.length > 0) {
            if ((this._config.debugMode <= debugMode) && (messageKey.length > 0) && !this._multilingual) {
                const logDetails = {
                    level: debugMode,
                    key: messageKey,
                    args: args.join("|")
                };
                this._loggerBuffer.push(logDetails);
                return;
            }
            let _multiMsg = Cell.multiMsg(messageKey, ...args);
            switch (debugMode) {
                case Commons.DebugMode.DEBUG:
                    console.debug(_multiMsg);
                    break;
                case Commons.DebugMode.INFO:
                    console.info(_multiMsg);
                    break;
                case Commons.DebugMode.WARN:
                    console.warn(_multiMsg);
                    break;
                case Commons.DebugMode.ERROR:
                    console.error(_multiMsg);
                    break;
            }
        }
    }

    multiMsg(messageKey = "", ...args) {
        let multiMessage = "";
        if (Commons.RegexLibrary.Multilingual_Key.test(messageKey)) {
            let languageCode = this._langCurrent();
            if (languageCode.length > 0 && this._multiInfo.hasOwnProperty(languageCode)) {
                if (this._multiInfo[languageCode].hasOwnProperty(messageKey)) {
                    multiMessage = this._multiInfo[languageCode][messageKey];
                } else if (this._multiInfo[this._config.multi.default].hasOwnProperty(messageKey)) {
                    multiMessage = this._multiInfo[this._config.multi.default][messageKey];
                }
                if (multiMessage.length > 0) {
                    args.forEach((arg, index) => {
                        multiMessage = multiMessage.replace("{" + (index + 1) + "}", arg);
                    });
                }
            }
        }
        return multiMessage.length === 0 ? messageKey : multiMessage;
    }

    _langCurrent() {
        let languageCode = document.documentElement.lang;
        if (languageCode.length === 0) {
            const params = new URLSearchParams(window.location.search);
            if (params.has("lang")) {
                languageCode = params.get("lang");
            }
        }
        if (languageCode.length === 0) {
            languageCode = this._languageCode;
        }
        if (languageCode.length === 0) {
            languageCode = this._config.multi.default;
        }
        return languageCode;
    }

    multilingual(element = document.body) {
        element.querySelectorAll('[data-multi-key]')
            .forEach(element => {
                const textContent = Cell.multiMsg(element.dataset.multiKey);
                if (element.tagName.toLowerCase() === "input") {
                    if (element.dataset.hasOwnProperty("category")
                        && ["score", "like", "favorite", "select-all"].indexOf(element.dataset.category.toLowerCase()) >= 0) {
                        return;
                    }
                    switch (element.type.toLowerCase()) {
                        case "submit":
                        case "reset":
                            element.value = textContent;
                            element.dataset.value = textContent;
                            break;
                        case "checkbox":
                        case "radio":
                        case "button":
                            const label = element.nextElementSibling;
                            if (label) {
                                label.innerText = textContent;
                            }
                            break;
                        default:
                            element.placeholder = textContent;
                            break;
                    }
                } else if (element.tagName.toLowerCase() === "textarea") {
                    element.placeholder = textContent;
                } else if (element.tagName.toLowerCase() === "select") {
                    element.items();
                } else if (element.matches('i[data-type="tips"]')) {
                    element.dataset.content = textContent;
                } else {
                    element.innerText = textContent;
                    if (element.tagName.toLowerCase() === "a" || element.tagName.toLowerCase() === "span") {
                        element.setAttribute("title", textContent);
                    }
                }
            });
        this._registeredRenders.forEach((render, selector) =>
            element.querySelectorAll(selector + "[data-multi='true']")
                .forEach(renderElement => render._multilingual(renderElement)));
    }

    alert(message = "") {
        const window = retrieveWindow("dialog");
        if (window) {
            window.data = {
                content: message
            }
        }
    }

    confirm(message = "", confirmFunc = null) {
        const window = retrieveWindow("dialog");
        if (window) {
            window.data = {
                content: message,
                confirm: confirmFunc
            }
        }
    }

    notify(message = null) {
        if (message !== null) {
            const notify = retrieveWindow("notify");
            if (notify) {
                notify.data = message;
            }
        }
    }

    _initData(element = null) {
        if (element === null) {
            return;
        }
        const dataCode = element.dataset.hasOwnProperty("code") ? element.dataset.code : "",
            parameters = element.dataset.hasOwnProperty("parameter") ? element.dataset.parameter : "";
        if (this._config.componentPath.length > 0 && dataCode.length > 0) {
            let urlAddress = this._config.componentPath.replace("{dataCode}", dataCode);
            if (parameters.length > 0) {
                urlAddress += ("?" + parameters);
            }
            this.debug("Component.Path.Data", urlAddress);
            this.sendRequest(this._config.contextPath + urlAddress)
                .then((responseText) => element.data = responseText.parseJSON())
                .catch((errorMsg) => this.error("Error.Message", errorMsg));
        }
    }

    _response(responseText = "", _floatWindow = false, linkAddress = "", targetId = "") {
        Cell.debug("Text.Data.Response", responseText);
        let title = document.title;
        if (responseText.isJSON()) {
            const responseData = responseText.parseJSON();
            if (responseData.hasOwnProperty("title")) {
                responseData.title.setTitle();
                title = responseData.title;
                this.debug("Title.Data.Response", title);
            }
            if (responseData.hasOwnProperty("keywords")) {
                responseData.keywords.setKeywords();
                this.debug("Keywords.Data.Response", responseData.keywords);
            }
            if (responseData.hasOwnProperty("description")) {
                responseData.description.setDescription();
                this.debug("Description.Data.Response", responseData.description);
            }
            if (responseData.hasOwnProperty("data")) {
                this.debug("Info.Data.Response", JSON.stringify(responseData.data), _floatWindow);
                if (!_floatWindow) {
                    this.closeWindow();
                }
                if (_floatWindow) {
                    retrieveWindow("float").data = responseData.data;
                } else {
                    const data = responseData.data;
                    Object.keys(data).forEach(key => {
                        const element = $(key);
                        if (element) {
                            data[key].forEach(childData => {
                                if (childData.hasOwnProperty("id") && childData.hasOwnProperty("tagName") && childData.hasOwnProperty("data")) {
                                    let target = element.querySelector(`:scope > ${childData.tagName}[id="${childData.id}"]`);
                                    if (target === null) {
                                        target = document.createElement(childData.tagName);
                                        target.id = childData.id;
                                        element.appendChild(target);
                                    }
                                    target.data = childData.data;
                                }
                            });
                        }
                    });
                }
            }
            if (responseData.hasOwnProperty("notify")) {
                this.debug("Notify.Data.Response", JSON.stringify(responseData.notify));
                this.notify(responseData.notify);
            }
        } else if (responseText.isHtml()) {
            if (!_floatWindow) {
                Cell.closeWindow();
            }
            const _element = _floatWindow ? retrieveWindow("float") : $(targetId);
            if (_element) {
                _element.innerHTML = ("" + responseText);
            }
        }
        if (linkAddress.length > 0) {
            history.pushState(null, title, linkAddress);
        }
        return true;
    }

    sendRequest(url, options = {}, parameters = null) {
        return new Promise((resolve, reject) => {
            const _options = JSON.stringify(Options).parseJSON();
            Object.assign(_options, options);
            let _request;
            // If XMLHttpRequest is a JavaScript object in the local
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
                        throw e;
                    }
                }
            }

            if (_options.userName !== null && _options.passWord !== null) {
                _request.open(_options.method, url, _options.async, _options.userName, _options.passWord);
            } else {
                _request.open(_options.method, url, _options.async);
            }
            _request.method = _options.method;
            _request.setRequestHeader("Cache-Control", "no-cache");
            _request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (_options.stream) {
                _request.setRequestHeader("Accept", "text/event-stream");
            }
            let _jwtToken = sessionStorage.getItem("JWTToken");
            if (_jwtToken != null) {
                _request.setRequestHeader("Authorization", _jwtToken);
            }
            if (_options.headers.length > 0) {
                _options.headers.forEach(header => _request.setRequestHeader(header.name, header.value));
            }
            if (_options.contentType.length > 0) {
                _request.setRequestHeader("Content-Type", _options.contentType);
            }
            if (_options.uploadFile) {
                _request.setRequestHeader("Content-Type", "multipart/form-data");
                if (_options.uploadProgress.length > 0) {
                    _request.upload.addEventListener("progress",
                        (event) => {
                            const progress = $(_options.uploadProgress);
                            const percent = (event.loaded / event.total) * 100;
                            progress.setAttribute("value", percent.toString());
                            progress.data = {
                                "processed": event.loaded.toString(),
                                "total": event.total.toString()
                            }
                        });
                }
            }
            let processLength = 0;
            const stream = options.stream || false;
            _request.onreadystatechange = function () {
                if (this.readyState === 3 || this.readyState === 4) {
                    if (this.readyState === 4 || stream) {
                        Cell.debug("Link.Path.Data", url, this.method);
                        Cell.debug("Status.Data.Response", this.status);

                        let languageCode = this.getResponseHeader("languageCode");
                        if (languageCode !== null) {
                            Cell.language = languageCode;
                            Cell.debug("Modify.Language.Code", languageCode);
                        }
                        let _jwtToken = this.getResponseHeader("Authentication");
                        if (_jwtToken !== null) {
                            sessionStorage.setItem("JWTToken", _jwtToken);
                        }
                        if (this.status === 301 || this.status === 302 || this.status === 307) {
                            let _redirectPath = this.getResponseHeader("Location");
                            if (_redirectPath.length !== 0) {
                                Cell.debug("Redirect.Path.Data", _redirectPath);
                                let _newOption = JSON.stringify(Options).parseJSON();
                                Object.extend(_newOption, _options);
                                Cell.sendRequest(_redirectPath, _newOption, parameters).then(resolve).catch(reject);
                            } else {
                                reject(_request);
                            }
                        } else if (_request.status === 200) {
                            let _responseText = _request.responseText;
                            if (Boolean(this.getResponseHeader("Data-Encrypted"))) {
                                Cell.debug("Decrypt.Data.Response");
                                _responseText = Cell.decData(_responseText);
                            }
                            if (stream) {
                                let _partData = _responseText.substring(processLength);
                                processLength = _responseText.length;
                                if (_partData.length === 0) {
                                    return;
                                }
                                if (_partData.startsWith("data:")) {
                                    _partData = _partData.substring("data:".length).trim();
                                }
                                let _index = _partData.indexOf("\n");
                                if (_index > 0) {
                                    _partData = _partData.substring(0, _index);
                                }
                                _responseText = _partData;
                            }
                            resolve(_responseText);
                        } else {
                            reject(_request.status);
                        }
                    }
                }
            };
            _request.ontimeout = function () {
                reject(_request);
            };
            _request.onerror = function () {
                reject(_request);
            };
            _request.send(parameters);
        });
    }

    eventRequest(event, options = {}, parameters = null) {
        if (!Commons.Comment.Browser.IE || Commons.Comment.Browser.IE11) {
            event.preventDefault();
        }
        event.stopPropagation();
        let target = event.currentTarget;
        if (target.dataset.disabled == null || target.dataset.disabled === "false") {
            if (target.tagName.toLowerCase() === "form") {
                return this.submitForm(target);
            } else {
                let url = target.tagName.toLowerCase() === "a" ? target.href : target.dataset.link;
                if (url !== undefined && url.length > 0 && url !== "#") {
                    if (target.dataset.openWindow === "true" ||
                        (target.dataset.targetId !== undefined && target.dataset.targetId !== null && target.dataset.targetId.length > 0)) {
                        const floatWindow = target.dataset.openWindow === "true",
                            targetId = target.dataset.targetId || "";
                        Cell.sendRequest(url, options, parameters)
                            .then((responseText) => Cell._response(responseText, floatWindow, url, targetId))
                            .catch((errorMsg) => Cell.error("Error.Message", errorMsg));
                    } else {
                        window.location = url;
                    }
                }
                if (target.tagName.toLowerCase() === "a") {
                    return false;
                }
            }
        }
    }

    closeWindow() {
        let floatWindow = retrieveWindow("float");
        if (floatWindow) {
            floatWindow.hide();
        }
    }

    submitForm(formElement, parameters = {}) {
        if (formElement && !formElement.dataset.disabled && formElement.validate()) {
            if (formElement.dataset.hasOwnProperty("targetId") && formElement.dataset.targetId.length > 0) {
                if (formElement.action.indexOf("#") >= 0) {
                    window.location.hash = formElement.action.substring(formElement.action.indexOf("#"));
                    return;
                }
                const formData = formElement.formData();
                Object.keys(parameters).forEach((key) => formData.data.append(key, parameters[key]));
                if (Cell._modeEnabled(Commons.DebugMode.DEBUG)) {
                    Cell.debug("Submit.Form.Data", formData.uploadFile, formData.uploadProgress, JSON.stringify(Object.fromEntries(formData.data.toMap())));
                }
                Cell.sendRequest(formElement.action, {
                        method: formElement.getAttribute("method"),
                        uploadFile: formData.uploadFile,
                        uploadProgress: formData.uploadProgress
                    },
                    formData.data)
                    .then((responseText) =>
                        Cell._response(responseText, false, formElement.url(), formElement.dataset.targetId))
                    .catch((errorMsg) => Cell.error("Error.Message", errorMsg));
            } else {
                formElement.querySelectorAll('input[type="password"]')
                    .forEach(input => {
                        if (input.dataset.hasOwnProperty("encResult") && input.value === input.dataset.encResult) {
                            //  Password value was encrypted and not modified, ignore process
                            return;
                        }
                        const encResult = Cell.digest(input.value);
                        input.value = encResult
                        input.dataset.encResult = encResult;
                    });
                formElement.submit();
            }
        }
    }

    darkMode() {
        return this._darkMode;
    }

    _registerDarkMode(posLon, posLat) {
        if (this._config.colorMode === Commons.ColorMode.Sun) {
            let Sun = new Date().sunTime(posLon, posLat);
            if (Sun.SunRise === -1 || Sun.SunSet === -1) {
                Cell.error("Sun.Data.Error");
                return;
            }
            this._sunRise = Sun.SunRise;
            this._sunSet = Sun.SunSet;
            this._switchDarkMode();
            this._colorListener = setInterval(Cell._switchDarkMode, 60 * 1000);
        }
    }

    _switchDarkMode() {
        if (this._config.colorMode === Commons.ColorMode.Sun) {
            let _currDate = new Date(),
                _currTime = _currDate.getTime() + (_currDate.getTimezoneOffset() * 60 * 1000);
            if ((_currTime > this._sunRise && this._darkMode) || (_currTime > this._sunSet && !this._darkMode)) {
                this._switchColor();
            }
        }
    }

    _switchColor() {
        if (this._darkMode) {
            document.body.removeClass("dark");
        } else {
            document.body.appendClass("dark");
        }

        this._darkMode = !this._darkMode;
        this._colorMode();
    }

    set language(languageCode) {
        if (this._languageCode !== languageCode) {
            document.documentElement.lang = languageCode;
            this._languageCode = languageCode;
            this.multilingual();
        }
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
            return this["RSA"].newInstance(this._config.security.RSA).encrypt(data);
        } else {
            return data;
        }
    }

    decData(data) {
        if (this._config.security.RSA.exponent.length > 0 && this._config.security.RSA.modulus.length > 0) {
            return this["RSA"].newInstance(this._config.security.RSA).decrypt(data);
        } else {
            return data;
        }
    }

    digestData(method, data, hex = true, key = "", outBit = -1) {
        let digest = this._initDigest(method, key, outBit);
        if (digest === null) {
            Cell.error("Digest.Unknown.Algorithm");
            return data;
        }
        digest.append(data);
        return digest.finish(hex);
    }

    digestBinary(method, dataBytes = [], hex = true, key = "", outBit = -1) {
        let digest = this._initDigest(method, key, outBit);
        if (digest === null) {
            Cell.error("Digest.Unknown.Algorithm");
            return dataBytes;
        }
        digest.appendBinary(dataBytes);
        return digest.finish(hex);
    }

    _initDigest(method = "", key = "", outBit = -1) {
        if (method.startsWith("CRC")) {
            return this["CRC"].newInstance(method);
        } else if (method.toUpperCase().indexOf("MD5") !== -1) {
            return this["MD5"].newInstance(key);
        } else if (method.toUpperCase().indexOf("SHA") !== -1) {
            return this["SHA"].newInstance(method, key, outBit);
        } else if (this.hasOwnProperty(method) && this[method] instanceof Crypto) {
            return this[method].newInstance(method, key, outBit);
        }
        return null;
    }

    _registerCrypto(provider) {
        if (provider) {
            const name = provider.CryptoName;
            if (this.hasOwnProperty(name)) {
                Cell.warn("", name);
            }
            this[name] = provider;
            provider.initialize();
        }
    }

    scale() {
        const clientWidth = window.screen.width;
        if (clientWidth <= 576) {
            document.body.style.scale = ("" + (clientWidth / 576));
        } else if (clientWidth <= 1280) {
            document.body.style.scale = ("" + (clientWidth / 1280));
        } else if (clientWidth <= 1440) {
            document.body.style.scale = ("" + (clientWidth / 1440));
        } else if (clientWidth <= 1920) {
            document.body.style.scale = ("" + (clientWidth / 1920));
        } else if (clientWidth <= 2560) {
            document.body.style.scale = ("" + (clientWidth / 2560));
        } else {
            document.body.style.scale = ("" + (clientWidth / 3840));
        }
    }

    scrollPage() {
        Cell._config.freeze
            .filter(selector => selector.length > 0)
            .forEach(selector => {
                let pinnedElement = document.body.querySelector(selector);
                if (pinnedElement) {
                    if (!pinnedElement.dataset.hasOwnProperty("offsetTop")) {
                        const offsetTop = pinnedElement.getBoundingClientRect().top + window.pageYOffset;
                        pinnedElement.dataset.offsetTop = Math.trunc(offsetTop).toString();
                    }
                    if (pinnedElement.scrollOut()) {
                        pinnedElement.appendClass("freeze");
                    } else {
                        pinnedElement.removeClass("freeze");
                    }
                }
            });
    }
}

(function () {
    if (typeof window.Cell === "undefined") {
        window.$ = Commons.$;
        window.$$ = Commons.$$;
        window.Cell = new CellJS();
        window.Cell.init();
        window.addEventListener("scroll", listener);
        window.addEventListener("beforeunload", () => {
            window.removeEventListener("scroll", listener);
            window.Cell.destroy();
            delete window.$;
            delete window.$$;
            delete window.Cell;
        });
    }
})();