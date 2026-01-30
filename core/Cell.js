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
import {TagRender} from "../components/Components.js";

const DEFAULT_COMPONENTS = ["Enhance", "Mock", "Calendar", "Charts", "Details", "Form", "List", "Slides"];

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

const confirmDialog = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target, element = target.parentElement;
    if (target.dataset.type === "confirm" && element.confirm) {
        element.confirm(event);
    }
    closeDialog(event);
}

const closeDialog = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target.parentElement;
    element.hide();
    delete element.dataset.category;
    delete element.confirm;
    document.body.removeClass("freeze");
}

class WindowRender extends TagRender {

    static newInstance(type = "") {
        if (type.length === 0) {
            return null;
        }
        const target = document.createElement("div");
        target.dataset.type = type;
        return target;
    }

    static selectors() {
        return ['body > div[data-type="dialog"]', 'body > div[data-type="float"]', 'body > div[data-type="notify"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.clearChildNodes();

        switch (element.dataset.type.toLowerCase()) {
            case "dialog":
                const message = document.createElement("span");
                message.dataset.type = "message";
                message.dataset.sortCode = "0";
                element.appendChild(message);

                const confirmBtn = document.createElement("button");
                confirmBtn.dataset.type = "confirm";
                confirmBtn.dataset.sortCode = "1";
                confirmBtn.dataset.multiKey = "OK.Button";
                element._appendChild(confirmBtn);
                confirmBtn.addEventListener("click", (event) => confirmDialog(event));

                const cancelBtn = document.createElement("button");
                cancelBtn.dataset.type = "cancel";
                cancelBtn.dataset.sortCode = "2";
                cancelBtn.dataset.multiKey = "Cancel.Button";
                element._appendChild(cancelBtn);
                cancelBtn.addEventListener("click", (event) => closeDialog(event));
                break;
            case "notify":
                const floatNotify = document.createElement("section");
                floatNotify.dataset.type = "float-notify";
                element.appendChild(floatNotify);
                floatNotify.hide();

                const notifyBtn = document.createElement("i");
                notifyBtn.setClass("icon-bell-ring");
                element.appendChild(notifyBtn);
                notifyBtn.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (element.hasClass("notify")) {
                        document.body.style.overflow = "auto";
                        element.removeClass("notify");
                    } else {
                        document.body.style.overflow = "hidden";
                        element.appendClass("notify");
                    }
                });

                const notification = document.createElement("section");
                notification.dataset.type = "notification";
                element.appendChild(notification);
                break;
            case "float":
                const closeBtn = document.createElement("i");
                closeBtn.setClass("icon-close");
                closeBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    document.body.removeClass("freeze");
                    element.hide();
                });
                element.appendChild(closeBtn);

                const details = document.createElement("div");
                details.dataset.type = "details";
                element.appendChild(details);

                const scrollBar = document.createElement("span");
                scrollBar.dataset.type = "scroll-bar";
                element._appendChild(scrollBar);
                break;
        }
        await Cell.multilingual(element);
    }

    async _setData(element = null, data) {
        if (element === null || data.length === 0) {
            return;
        }
        switch (element.dataset.type.toLowerCase()) {
            case "dialog":
                let textContent = "";
                if (data.hasOwnProperty("multiKey")) {
                    textContent = Cell.multiMsg(data.multiKey);
                } else if (data.hasOwnProperty("content")) {
                    textContent = data.content;
                }

                if (textContent.length === 0) {
                    return;
                }

                const message = element.querySelector('span[data-type="message"]');
                if (message) {
                    message.innerText = textContent;
                    element.dataset.category = data.hasOwnProperty("confirm") ? "confirm" : "alter";
                    if (data.hasOwnProperty("confirm")) {
                        element.confirm = data.confirm;
                    }
                    document.body.appendClass("freeze");
                    element.show();
                }
                break;
            case "notify":
                const elements = this._elements(element);
                if (elements) {
                    const dataArray = data instanceof Array ? data : [data];
                    dataArray.forEach((notifyData) => {
                        elements.float.appendChild(this._newNotify(notifyData));
                        elements.notification.appendChild(this._newNotify(notifyData));
                    });
                    if (elements.notification.querySelectorAll(":scope > a").length === 0) {
                        elements.button.setClass("icon-bell");
                        elements.notification.hide();
                        elements.float.hide();
                    } else {
                        elements.button.setClass("icon-bell-ring");
                        elements.float.show();
                        const timeout = element.dataset.hasOwnProperty("timeout") ? element.dataset.timeout.parseInt() : 5000;
                        window.setTimeout(() => elements.float.hide(), timeout);
                    }
                }
                break;
            case "float":
                this._details(element).then((details) => {
                    details.clearChildNodes();
                    const dataArray = data instanceof Array ? data : [data];
                    dataArray.filter(itemData => itemData.hasOwnProperty("tagName") && itemData.hasOwnProperty("data"))
                        .forEach(itemData => {
                            const tagElement = document.createElement(itemData.tagName);
                            if (itemData.hasOwnProperty("type")) {
                                tagElement.dataset.type = itemData.type;
                            }
                            details._appendChild(tagElement);
                            tagElement.data = itemData.data;
                        });
                    document.body.appendClass("freeze");
                    element.show();
                });
                break;
        }
    }

    _newNotify(data = {}) {
        if (data.hasOwnProperty("text") && data.hasOwnProperty("identify")) {
            const notify = document.createElement("a");
            notify.id = data.identify;
            notify.addEventListener("click", (event) => Cell.eventRequest(event));
            notify.title = data.text;
            notify.href = data.hasOwnProperty("link") ? data.link : "#";
            const closeBtn = document.createElement("i");
            closeBtn.dataset.type = "close-btn";
            closeBtn.dataset.sortCode = "0";
            closeBtn.setClass("icon-close");
            closeBtn.style.zIndex = "2";
            closeBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                const current = event.target.parentElement;
                const notify = current.parentElement.parentElement;
                const floatNotify = notify.querySelector(`:scope > section[data-type="float-notify"] > a[id="${current.id}"]`),
                    floatWindow = floatNotify == null ? null : floatNotify.parentElement;
                let emptyNotifications = false;
                if (floatNotify) {
                    floatWindow.removeChild(floatNotify);
                    if (floatWindow.childList().length === 0) {
                        emptyNotifications = true;
                    }
                }
                const notification = notify.querySelector(`:scope > section[data-type="notification"] > a[id="${current.id}"]`),
                    notifyWindow = notification === null ? null : notification.parentElement;
                if (notification) {
                    notifyWindow.removeChild(notification);
                    if (notifyWindow.childList().length === 0) {
                        emptyNotifications = true;
                    }
                }

                if (emptyNotifications) {
                    floatWindow.hide();
                    const notifyBtn = notify.querySelector(":scope > i");
                    if (notifyBtn) {
                        notifyBtn.setClass("icon-bell");
                        notifyBtn.hide();
                    }
                    notify.removeClass("notify");
                    document.body.style.overflow = "auto";
                }
            });
            notify.appendChild(closeBtn);
            if (data.hasOwnProperty("imgPath")) {
                notify.dataset.imgPath = data.imgPath;
                notify.setAttribute("style", `--icon: url('${data.imgPath}')`);
            } else if (data.hasOwnProperty("icon")) {
                notify.dataset.icon = data.icon;
            }
            return notify;
        }
        return null;
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            float: element.querySelector(':scope > section[data-type="float-notify"]'),
            button: element.querySelector(':scope > i'),
            notification: element.querySelector(':scope > section[data-type="notification"]')
        };
    }

    _details(element = null) {
        return new Promise((resolve, reject) => {
            const details = (element === null) ? null : element.querySelector('div[data-type="details"]');
            if (details) {
                resolve(details);
            } else {
                reject("Element not exists");
            }
        });
    }
}

const retrieveWindow = function (type = "") {
    if (type.length === 0) {
        return null;
    }
    let target = document.body.querySelector(`:scope > div[data-type="${type}"]`);
    if (target === null) {
        target = WindowRender.newInstance(type);
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
    _lazyObserver = null;
    _contentsObserver = null;
    _loadLanguages = [];
    _minimum = false;
    _rootPath = "";

    constructor() {
        this._config = JSON.stringify(Commons.Config).parseJSON();
        //  Freeze config
        Object.freeze(this._config);

        this._darkMode = false;
        this._multiInfo = {};
        this._minimum = import.meta.url.toLowerCase().endsWith(".min.js");
        this._rootPath = import.meta.url.substring(0, import.meta.url.length - `/core/Cell${this._minimum ? ".min" : ""}.js`.length);
    }

    async loadComponent(name = "") {
        if (name.length === 0) {
            return;
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.type = "module";
            script.src = `${this._rootPath}/components/impl/${name}.js`;
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Script load error for ${name}`));
            document.head.appendChild(script);
        });
    }

    init() {
        this._observer = new MutationObserver(() => this._render());
        this._observer.observe(document.body, {
            attributes: false,
            childList: true,
            subtree: true
        });
        this._lazyObserver = new IntersectionObserver(this._lazyLoad);
        this._contentsObserver = new IntersectionObserver(this._contents);
        if (this._config.multi.codes.length > 0 && this._config.multi.codes.indexOf(this._config.multi.default) === -1) {
            this._config.multi.default = this._config.multi.codes[0];
        }
        (async () => await this.languageCode(Comment.Language))();
        this._initStyles();
        (async () => await this._initMulti())();
        this._languageCode.setLanguage();
        // [CRC, MD5, SHA, RSA].forEach(crypto => this._registerCrypto(crypto));
        // Object.values(Renders).forEach(render => this.registerRender(render));
        // Object.values(Components).forEach(component => this.registerComponent(component));
        this.registerRenders(WindowRender);
        for (const name of DEFAULT_COMPONENTS.concat(this._config.components)) {
            (async () => await this.loadComponent(name))();
        }
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
            "iconfont.woff2?t=1679629706726", "iconfont.woff?t=1679629706726", "iconfont.ttf?t=1679629706726");
        this._render();

        if (this._config.maps.Google.ApiKey.length > 0) {
            this._scriptLoader("Google", "maps", "https://maps.googleapis.com/maps/api/js", {
                key: this._config.maps.Google.ApiKey,
                v: this._config.maps.Google.version
            });
        }
        if (this._config.maps.Baidu.ApiKey.length > 0) {
            this._scriptLoader("Baidu", "maps", "https://api.map.baidu.com/api", {
                ak: this._config.maps.Baidu.ApiKey,
                v: this._config.maps.Baidu.version,
                type: this._config.maps.Baidu.type
            }, () => {
                window["baidu"].maps.importLibrary = () => window.explain(this._config.maps.Baidu.paramName);
                delete window["baidu"].maps.__ib__;
            });
        }

        Cell.info("Success.Initialize.Result");
    }

    _scriptLoader(name = "", type = "", src = "", options = {}, callback = null) {
        let h, a, k, p = Cell.multiMsg("Map.API", name), c = name.toLowerCase(),
            l = "importLibrary", q = "__ib__", m = document, b = window;
        b = b[c] || (b[c] = {});
        let d = b[type] || (b[type] = {}), r = new Set, e = new URLSearchParams,
            u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                const names = [];
                r.forEach(value => {
                    if (value) {
                        names.push(value);
                    }
                })
                if (names.length > 0) {
                    e.set("libraries", names.join(","));
                }
                for (k in options) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), options[k]);
                e.set("callback", [c, type, q].join("."));
                a.src = src + "?" + e;
                d[q] = () => {
                    if (callback !== null) {
                        callback.apply(this);
                    }
                    f();
                };
                a.onerror = () => h = n(Error(Cell.multiMsg("Map.Load.Error", p)));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a);
            }));
        d[l] ? Cell.warn("Map.Reload.Warning", p, window[name.toLowerCase()]) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
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
        this._lazyObserver.disconnect();
        this._lazyObserver = null;
        this._contentsObserver.disconnect();
        this._contentsObserver = null;
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
                _paths.push(`${this._rootPath}/fonts/${path}`);
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

    _initStyles() {
        const scriptPath = import.meta.url, index = scriptPath.indexOf("core/Cell");
        const script = Array.from(document.head.querySelectorAll("script")).filter(script => script.src === scriptPath).at(0);
        const styles = document.createElement("link");
        styles.rel = "stylesheet";
        styles.type = "text/css";
        styles.href = scriptPath.substring(0, index) + "styles/Cell.css";
        document.head.insertBefore(styles, script);
    }

    async _initMulti() {
        if ((this._config.multi.path.length === 0) || (this._config.multi.path.indexOf("{languageCode}") === -1)
            || (this._config.multi.codes.indexOf(this._languageCode) === -1)) {
            console.debug("Multilingual was not configured or invalid, ignore load multilingual information");
            return false;
        }
        if (this._loadLanguages.indexOf(this._languageCode) !== -1) {
            return true;
        }

        let url = this._config.contextPath + this._config.multi.path;
        return Cell.sendRequest(url.replace("{languageCode}", this._languageCode))
            .then((responseText) => {
                if (responseText.isJSON()) {
                    this._multiInfo[this._languageCode] = responseText.parseJSON();
                }
                this._loggerBuffer.forEach(buffer => {
                    const args = buffer.args.split("|");
                    this._log(buffer.level, buffer.key, ...args);
                });
                this._loggerBuffer = [];
                return true;
            })
            .catch((errorMsg) => {
                console.error("Load multilingual resource failed! Path: " + url, errorMsg);
                return false;
            })
            .finally(() => {
                this._loadLanguages.push(this._languageCode);
            });
    }

    registerRenders(...renders) {
        renders.forEach(render => {
            render.selectors().forEach(selector => this._registeredRenders.set(selector, new render()));
        })
    }

    registerComponents(...components) {
        components.forEach(component => {
            if (component.tagName !== undefined && (typeof component.tagName) === "function") {
                const tagName = component.tagName();
                if (customElements.get(tagName) === undefined) {
                    customElements.define(tagName, component);
                }
            }
        });
    }

    observeContent(element = null) {
        if (element === null) {
            return;
        }
        this._contentsObserver.observe(element);
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

    _resize() {
        //  Resize all rendered elements
        this._registeredRenders.forEach((render, selector) =>
            $$(selector + "[data-render='true']")
                .forEach((item) => render.resize(item)));
    }

    _render() {
        this._registeredRenders.forEach((render, selector) =>
            $$(selector + ":not([data-render='true'])")
                .forEach(async (item) => {
                    this._renderElement(item, render);
                    await Cell.multilingual(item);
                }));
        $$('span[data-type="lazy"]:not([data-monitor="true"])').forEach((item) => {
            this._lazyObserver.observe(item);
            item.dataset.monitor = "true";
        });
    }

    _contents(entries) {
        entries.reverse().forEach(entry => {
            const target = entry.target;
            if (target.dataset.hasOwnProperty("selector") && target.dataset.selector.length > 0) {
                const contents = document.querySelector(target.dataset.selector);
                if (!!contents) {
                    if (entry.isIntersecting) {
                        target.dataset.top = entry.boundingClientRect.top.toString();
                        Array.from(contents.querySelectorAll(':scope > span[data-id]'))
                            .forEach(item => {
                                if (item.dataset.id === target.id) {
                                    item.appendClass("current");
                                } else {
                                    item.removeClass("current");
                                }
                            });
                    } else {
                        const current = contents.querySelector(`:scope > span[data-id="${target.id}"]`);
                        if (!!current && current.hasClass("current")) {
                            let next = null;
                            if (entry.boundingClientRect.top < entry.intersectionRect.top) {
                                next = current.nextElementSibling;
                            } else if (entry.boundingClientRect.top > entry.intersectionRect.top) {
                                next = current.previousElementSibling;
                            }
                            if (!!next) {
                                current.removeClass("current");
                                next.appendClass("current");
                            }
                        }
                    }
                }
            }
        });
    }

    _lazyLoad(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.loadResource();
                observer.unobserve(entry.target);
            }
        })
    }

    _colorMode() {
        this._registeredRenders.forEach((render, selector) =>
            $$(selector).forEach(async (item) => await render.colorMode(item, this._darkMode)));
    }

    _renderElement(element = null, render = null) {
        if (element === null || render === null) {
            return;
        }
        (async (element) => await render._enhance(element))(element);
        Object.defineProperty(element, "data", {
            set(data) {
                (async () => {
                await render._prepare(element, data);
                await render._setData(element, data);
                })();
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
            let _multiMsg = this.multiMsg(messageKey, ...args);
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
        if (Commons.RegexLibrary.Multilingual_Key.test(messageKey) || Commons.RegexLibrary.Language_Code.test(messageKey)) {
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

    async multilingual(element = document.body) {
        await this._initMulti().then(result => {
            if (result) {
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
        });
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
            if (responseData.hasOwnProperty("multiTemplate")) {
                document.body.dataset.multiTemplate = responseData.multiTemplate;
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
        if (linkAddress.length > 0 && linkAddress.endsWith(".html")) {
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
            if (url.startsWith(window.location.origin)) {
                _request.setRequestHeader("Cache-Control", "no-cache");
                _request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            }
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
            if (_options.method.toLowerCase() === "post") {
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
            }
            let processLength = 0;
            const stream = options.stream || false;
            _request.onreadystatechange = async function () {
                if (this.readyState === 3 || this.readyState === 4) {
                    if (this.readyState === 4 || stream) {
                        Cell.debug("Link.Path.Data", url, this.method, this.status);
                        const origin = url.startsWith(window.location.origin);
                        if (origin) {
                            let languageCode = this.getResponseHeader("languageCode");
                            if (languageCode !== null) {
                                await Cell.languageCode(languageCode);
                                Cell.debug("Modify.Language.Code", languageCode);
                            }
                            let _jwtToken = this.getResponseHeader("Authentication");
                            if (_jwtToken !== null) {
                                sessionStorage.setItem("JWTToken", _jwtToken);
                            }
                        }
                        if (this.status === 301 || this.status === 302 || this.status === 307) {
                            let _redirectPath = this.getResponseHeader("Location");
                            if (_redirectPath.length !== 0) {
                                Cell.debug("Redirect.Path.Data", _redirectPath);
                                let _newOption = JSON.stringify(Options).parseJSON();
                                Object.extend(_newOption, _options);
                                return Cell.sendRequest(_redirectPath, _newOption, parameters).then(resolve).catch(reject);
                            } else {
                                return reject(_request);
                            }
                        } else if (_request.status === 200) {
                            let _responseText = _request.responseText;
                            if (origin && Boolean(this.getResponseHeader("Data-Encrypted"))) {
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
                            return resolve(_responseText);
                        } else {
                            return reject(_request.status);
                        }
                    }
                }
            };
            _request.ontimeout = function () {
                return reject(_request);
            };
            _request.onerror = function () {
                return reject(_request);
            };
            if (_options.method === "head") {
                _request.send();
            } else {
                _request.send(parameters);
            }
        });
    }

    async eventRequest(event, options = {}, parameters = null) {
        if (!Commons.Comment.Browser.IE || Commons.Comment.Browser.IE11) {
            event.preventDefault();
        }
        event.stopPropagation();
        let target = event.currentTarget;
        if (target.dataset.disabled == null || target.dataset.disabled === "false") {
            if (target.tagName.toLowerCase() === "form") {
                return await this.submitForm(target);
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
                return target.tagName.toLowerCase() !== "a";
            }
        }
        return false;
    }

    closeWindow() {
        let floatWindow = retrieveWindow("float");
        if (floatWindow) {
            floatWindow.hide();
        }
    }

    async submitForm(formElement, parameters = {}) {
        if (formElement && !formElement.dataset.disabled && formElement.validate()) {
            for (const selector of this._registeredRenders.keys()) {
                for (const element of formElement.querySelectorAll(selector)) {
                    await this._registeredRenders.get(selector)._process(element);
                }
            }
            if (formElement.dataset.hasOwnProperty("targetId") && formElement.dataset.targetId.length > 0) {
                if (formElement.action.indexOf("#") >= 0) {
                    window.location.hash = formElement.action.substring(formElement.action.indexOf("#"));
                    return true;
                }
                const formData = await formElement.formData();
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
                    .then(async (responseText) =>
                        Cell._response(responseText, false, await formElement.url(), formElement.dataset.targetId))
                    .catch((errorMsg) => Cell.error("Error.Message", errorMsg));
            } else {
                formElement.submit();
            }
            return true;
        }
        return false;
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

    async languageCode(languageCode) {
        const langCode = (this._config.multi.codes.indexOf(languageCode) === -1) ? this._config.multi.default : languageCode;
        if (this._languageCode !== langCode) {
            document.documentElement.lang = langCode;
            this._languageCode = langCode;
            this._initMulti().then()
            await this.multilingual();
        }
    }

    async digest(data) {
        if (this._config.security.password.encrypt) {
            return this.digestData(this._config.security.password.digest, data);
        } else {
            Cell.warn("Digest.Password.Data");
            return data;
        }
    }

    async encData(data) {
        return this._initRSA().then(crypto => (crypto === null) ? data : crypto.encrypt(data));
    }

    async decData(data) {
        return this._initRSA().then(crypto => (crypto === null) ? data : crypto.decrypt(data));
    }

    async digestData(method, data, hex = true, key = "", outBit = -1) {
        return this._initDigest(method, key, outBit)
            .then(digest => {
                if (digest === null) {
                    Cell.error("Digest.Unknown.Algorithm");
                    return data;
                }
                digest.append(data);
                return digest.finish(hex);
            });
    }

    digestBinary(method, dataBytes = [], hex = true, key = "", outBit = -1) {
        return this._initDigest(method, key, outBit)
            .then(digest => {
                if (digest === null) {
                    Cell.error("Digest.Unknown.Algorithm");
                    return dataBytes;
                }
                digest.appendBinary(dataBytes);
                return digest.finish(hex);
            });
    }

    async _initRSA() {
        return this._initCrypto("RSA")
            .then(crypto => {
                if (this._config.security.RSA.exponent.length > 0 && this._config.security.RSA.modulus.length > 0) {
                    return crypto.newInstance(this._config.security.RSA);
                }
                return null;
            })
    }

    async _initDigest(method = "", key = "", outBit = -1) {
        return this._initCrypto(method)
            .then(digest => {
                if (digest !== null) {
                    if (method.startsWith("CRC")) {
                        return digest.newInstance(method);
                    } else if (method.toUpperCase().indexOf("MD5") !== -1) {
                        return digest.newInstance(key);
                    } else if (method.toUpperCase().indexOf("SHA") !== -1) {
                        return digest.newInstance(method, key, outBit);
                    } else if (this.hasOwnProperty(method) && this[method] instanceof Crypto) {
                        return digest.newInstance(method, key, outBit);
                    }
                }
                return null;
            });
    }

    async _initCrypto(method = "") {
        if (method.length === 0) {
            return null;
        }
        const moduleName = method.startsWith("CRC") ? "CRC" : method;
        if (!this.hasOwnProperty(moduleName)) {
            const modulePath = `../crypto/${moduleName}.js`;
            this.debug("Loading.Crypto", moduleName, modulePath);
            const crypto = await import(modulePath);
            this._registerCrypto(crypto.default);
        }
        return this[moduleName];
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
        Cell._resize();
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
        Cell.init();
        window.addEventListener("beforeunload", () => {
            window.Cell.destroy();
            delete window.$;
            delete window.$$;
            delete window.Cell;
        });
    }
})();