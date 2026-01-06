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
 * 1.0.2
 * [Update] Rewrite custom element define, compatible enhance exist html element
 *
 * 1.0.1
 * [New] Extend String for Verify CHN ID Card Code and CHN Social Credit Code
 *
 * 1.0.0
 * [New] Extend Element/String/Number/Array/Date
 *
 */
'use strict';

const Comment = {
    Version: "1.0.2",
    Language: navigator.language,
    Html5: ((typeof Worker) !== "undefined"),
    MaxWidth: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
    MaxHeight: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight),
    GPS: !!navigator.geolocation,
    Icons: {
        Connector: "-",
        Multilingual: Number.parseInt("eb8e", 16),
        Score: {
            Fill: Number.parseInt("eab5", 16),
            Half: Number.parseInt("eac0", 16),
            Empty: Number.parseInt("eac2", 16)
        },
        Favorite: {
            Yes: Number.parseInt("eab5", 16),
            No: Number.parseInt("eac2", 16),
        },
        Like: {
            Yes: Number.parseInt("eb0d", 16),
            No: Number.parseInt("eafa", 16)
        },
        Pager: {
            First: Number.parseInt("e733", 16),
            Previous: Number.parseInt("e737", 16),
            Next: Number.parseInt("e738", 16),
            Last: Number.parseInt("e734", 16),
        },
        List: {
            Text: Number.parseInt("eb61", 16),
            View: Number.parseInt("eb62", 16),
            Image: Number.parseInt("eb60", 16)
        },
        Select: {
            Yes: Number.parseInt("e72e", 16),
            No: Number.parseInt("e721", 16),
        },
        Picker: {
            Calendar: Number.parseInt("e6e5", 16),
            Timer: Number.parseInt("e8eb", 16)
        }
    },
    DateTime: {
        Convert: false,
        UTC: false,
        TimeZoneOffset: new Date().getTimezoneOffset() * 60 * 1000,
        ISO8601DATEPattern: "yyyy-MM-dd",
        ISO8601TIMEPattern: "HH:mm:ss",
        ISO8601DATETIMEPattern: "yyyy-MM-ddTHH:mm:ss"
    },
    BASE16: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
    BASE36: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ],
    BASE64: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/', '='
    ],
    MONTH: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    SocialCreditCode: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X', 'Y'
    ],
    Browser: {
        Version: -1,
        //	Internet Explorer
        IE: !!window.ActiveXObject || "ActiveXObject" in window,
        //	Internet Explorer 11
        IE11: (!(navigator.userAgent.toUpperCase().indexOf('TRIDENT') > -1
            && navigator.userAgent.toUpperCase().indexOf('RV:') > -1)),
        //	Microsoft Edge
        Edge: navigator.userAgent.toUpperCase().indexOf('EDGE') > -1,
        //	Opera Explorer
        Opera: navigator.userAgent.toUpperCase().indexOf('OPERA') > -1,
        //	Firefox Explorer
        Firefox: navigator.userAgent.toUpperCase().indexOf('FIREFOX') > -1,
        // 	Apple Safari Explorer
        Safari: !!window.openDatabase && navigator.userAgent.toUpperCase().indexOf('SAFARI') > -1,
        //	Chrome Explorer
        Chrome: !!window.MessageEvent && navigator.userAgent.toUpperCase().indexOf('CHROME') > -1,
        //	Apple Safari and Google Chrome
        WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        //	Mozilla Firefox, Apple Safari and Google Chrome
        Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
        //  QQBrowser
        QQBrowser: /QQBROWSER/.test(navigator.userAgent.toUpperCase()),
        //  WeiXinBrowser
        WXBrowser: /MICROMESSENGER/i.test(navigator.userAgent.toUpperCase())
    },
    Author: [
        {"Name": "Steven Wee", "EMail": "wmkm0113@gmail.com", "ORG": "Nervousync Studio"}
    ]
};
Object.freeze(Comment);
Comment.Browser.Version = () => {
    let userAgent = navigator.userAgent.toUpperCase();
    if (Comment.Browser.IE) {
        return parseInt(userAgent.match(/(MSIE\s|TRIDENT.*RV:)([\w.]+)/)[2]);
    } else if (Comment.Browser.IE11) {
        let version = parseInt(userAgent.match(/(MSIE\s|TRIDENT.*RV:)([\w.]+)/)[2]);
        if (version !== 11) {
            Comment.Browser.IE = true;
            Comment.Browser.IE11 = false;
        }
        return version;
    } else if (Comment.Browser.Chrome) {
        return parseInt(userAgent.match(/CHROME\/([\d.]+)/)[1]);
    } else if (Comment.Browser.Firefox) {
        return parseInt(userAgent.match(/FIREFOX\/([\d.]+)/)[1]);
    } else if (Comment.Browser.Opera) {
        return parseInt(userAgent.match(/OPERA\/([\d.]+)/)[1]);
    } else if (Comment.Browser.Safari) {
        return parseInt(userAgent.match(/VERSION\/([\d.]+)/)[1]);
    } else if (Comment.Browser.Edge) {
        return parseInt(userAgent.match(/EDGE\/([\d.]+)/)[1]);
    } else if (Comment.Browser.QQBrowser) {
        return parseInt(userAgent.match(/QQBROWSER\/([\d.]+)/)[1]);
    } else if (Comment.Browser.WXBrowser) {
        return parseInt(userAgent.match(/MICROMESSENGER\/([\d.]+)/)[1]);
    }
}
const RegexLibrary = {
    E_Mail: /^([A-Za-z\d_\-.])+@([A-Za-z\d_\-.])+\.([A-Za-z]{2,4})$/i,
    UUID: /^([\da-f]{8}((-[\da-f]{4}){3})-[\da-f]{12})|([\da-f]{32})\b/g,
    BlankText: /\s+/ig,
    Number: {
        Float: /^\b\d+\.\d+\b$/g,
        Zero_Number: /^-?0*$/g,
        Default: /^\b\d+\b$/g
    },
    Color: /^#[\dA-F]{6}$/i,
    XML: /<[a-zA-Z\d]+[^>]*>(?:.|[\r\n])*?<\/[a-zA-Z\d]+>/ig,
    HtmlTag: /<[a-zA-Z\d]+[^>]*>/ig,
    Luhn: /^[0-9]+/g,
    CHN_ID_Card: /^[1-9](\d{17}|(\d{16}X))$/g,
    CHN_Social_Credit: /^([1-9]|A|N|Y)[\dA-Z]{17}$/g,
    Language_Code: /^[a-z]{2,3}(-[A-Z]{2})?(-[a-zA-Z]{4})?$/ig,
    Multilingual_Key: /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/
};
const ColorMode = {
    Light: 0,
    Dark: 1,
    Sun: 2,
    System: 3
}
Object.freeze(ColorMode);
const DebugMode = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
}
Object.freeze(DebugMode);
const SlideType = {
    ScrollLeft: 0,
    ScrollTop: 1,
    ScrollRight: 2,
    ScrollBottom: 3,
    ZoomIn: 4,
    ZoomOut: 5,
    OpacityIn: 6,
    OpacityOut: 7
}
Object.freeze(SlideType);
const Config = {
    contextPath: "",
    componentPath: "",
    debugMode: DebugMode.INFO,
    multi: {
        codes: [],
        default: "",
        path: "/scripts/multi/{languageCode}.json"
    },
    notify: {
        dataPath: "",
        period: 15 * 1000
    },
    freeze: [],
    //  Config the dark mode by sunrise and sunset
    colorMode: ColorMode.Light,
    security: {
        providers: [],
        password: {
            //  Encrypt value of input[type='password']
            encrypt: true,
            //  Digest method for input[type='password']
            //  Options:    MD5(*)/SHA1(*)/CRC/SHA224/SHA256/SHA384/SHA512/SHA512_224/SHA512_256
            //              SHA3_224/SHA3_256/SHA3_384/SHA3_512/SHAKE128/SHAKE256
            //              Keccak224/Keccak256/Keccak384/Keccak512
            //  *: Low security level, just using for compatible old system
            digest: "SHA256"
        },
        //  RSA Key Config
        RSA: {
            exponent: "",
            modulus: "",
            //  Exponent and modulus data radix, default is 16
            radix: 16,
            //  Public Key Size
            keySize: 1024,
            padding: "NoPadding"
        }
    },
    maps: {
        Google: {
            ApiKey: "",
            version: "weekly"
        },
        Baidu: {
            ApiKey: "",
            version: "1.0",
            type: "webgl",
            paramName: "BMapGL"
        }
    },
    elements: []
};
Object.seal(Config);

const DragUpload = {
    identifyCode: "",
    fileName: "",
    content: null
};
Object.seal(DragUpload);

const $ = function () {
    if (arguments.length <= 0) {
        return [];
    }
    let argCount = arguments.length;
    if (argCount === 1) {
        return document.getElementById(arguments[0]);
    } else {
        let returnElements = [];
        for (let i = 0; i < argCount; i++) {
            let element = null;
            let elementId = arguments[i];
            if (typeof elementId === 'string') {
                element = document.getElementById(elementId);
            }
            returnElements.push(element);
        }
        return returnElements;
    }
}

const $$ = function () {
    if (arguments.length <= 0) {
        return [];
    }
    let argCount = arguments.length;
    if (argCount === 1) {
        return document.querySelectorAll(arguments[0]);
    } else {
        let returnElements = [];
        for (let i = 0; i < argCount; i++) {
            let element = null;
            let selector = arguments[i];
            if (typeof selector === 'string') {
                element = document.querySelectorAll(selector);
            }
            returnElements.push(element);
        }
        return returnElements;
    }
}

export {Comment, RegexLibrary, Config, DragUpload, ColorMode, DebugMode, SlideType, $, $$};

const validate = function (element = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    let _result = true;
    if (element.value.length > 0) {
        let _value = element.value;
        if (element.dataset.hasOwnProperty("regex")) {
            _result = _result && new RegExp(element.dataset.regex).test(_value);
        }
        if (element.dataset.hasOwnProperty("minValue") && element.dataset.minValue.isNum()) {
            _result = _result && _value.isNum() && (element.dataset.minValue.parseFloat() <= _value.parseFloat());
        }
        if (element.dataset.hasOwnProperty("maxValue") && element.dataset.maxValue.isNum()) {
            _result = _result && _value.isNum() && (_value.parseFloat() <= this.dataset.maxValue.parseFloat());
        }
        if (Boolean(element.dataset.xml)) {
            _result = _result && _value.isXml();
        }
        if (Boolean(element.dataset.html)) {
            _result = _result && _value.isHtml();
        }
        if (Boolean(element.dataset.email)) {
            _result = _result && _value.isEmail();
        }
        if (Boolean(element.dataset.luhn)) {
            _result = _result && _value.isLuhn();
        }
        if (Boolean(element.dataset.color)) {
            _result = _result && _value.isColorCode();
        }
        if (Boolean(element.dataset.CHNID)) {
            _result = _result && _value.isCHNID();
        }
        if (Boolean(element.dataset.CHNSocialCredit)) {
            _result = _result && _value.isCHNSocialCredit();
        }
    } else {
        _result = (element.dataset.notNull === undefined || element.dataset.notNull === "false");
    }
    if (_result) {
        delete element.dataset["validate"];
    } else {
        element.dataset.validate = "" + _result;
    }
    return _result;
}

const countDown = function (element = null) {
    if (element === null || element.tagName.toLowerCase() !== "input" || !element.dataset.hasOwnProperty("timer")) {
        return;
    }
    const label = (element.type.toLowerCase() === "button") ? this.nextElementSibling : element;
    if (element.dataset.hasOwnProperty("countDown")) {
        let countDown = element.dataset.countDown.parseInt();
        countDown--;
        if (countDown <= 0) {
            window.clearInterval(element.dataset.timer.parseInt());
            element.enable();
            label.dataset.value = element.dataset.originalText;
            label.value = element.dataset.originalText;
            delete element.dataset.originalText;
            delete element.dataset.countDown;
        } else {
            element.dataset.countDown = countDown.toString();
            label.dataset.value = countDown.toString();
            label.value = countDown.toString();
        }
    }
}

Object.assign(Document.prototype, {
    remWidth() {
        return this.documentElement.styles().fontSize.parseInt();
    },
    scrollPosition() {
        return {
            top: document.documentElement.scrollTop || document.body.scrollTop,
            left: document.documentElement.scrollLeft || document.body.scrollLeft
        }
    }
})

Object.assign(Window.prototype, {
    explain(parameterName = "") {
        if (parameterName.length === 0) {
            return {};
        }
        const d = window.hasOwnProperty(parameterName) ? window[parameterName] : {};
        for (const [k, v] of Object.entries(d))
            v === void 0 && delete d[k];
        return Object.freeze({...d});
    }
})

Object.assign(Element.prototype, {
    styles() {
        return window.getComputedStyle(this);
    },
    generateId() {
        if (this.id.length === 0) {
            this.id = Math.trunc(Math.random() * 1000000).toString(16);
        }
    },
    getClass() {
        let _className;
        if (Comment.Browser.IE && !Comment.Browser.IE11) {
            _className = this.getAttribute("className");
        } else {
            _className = this.getAttribute("class");
        }
        if (_className == null) {
            _className = "";
        }
        return _className;
    },
    hasClass(_className = "") {
        if (_className.length === 0) {
            return true;
        }
        if (Comment.Html5) {
            return this.classList.contains(_className);
        }
        if (_className) {
            return this.getClass().indexOf(_className) !== -1;
        }
        return false;
    },
    _appendChild(childNode = null) {
        if (childNode === null) {
            return;
        }
        this.appendChild(childNode);
        if (Cell) {
            Cell._preRender(childNode);
        }
    },
    appendClass(_className = "") {
        if (_className.length > 0) {
            if (Comment.Html5) {
                this.classList.add(_className);
            } else {
                if (_className && !this.hasClass(_className)) {
                    this.setClass(this.getClass() + " " + _className);
                }
            }
        }
    },
    removeClass(_className = "") {
        if (_className.length > 0) {
            if (Comment.Html5) {
                this.classList.remove(_className);
            } else {
                if (_className && this.hasClass(_className)) {
                    this.setClass(this.getClass().replace(_className, ""));
                }
            }
        }
    },
    setClass(_className = "") {
        if (_className.length > 0) {
            this.setAttribute("class", _className.replace(RegexLibrary.BlankText, " ").trim());
        } else {
            this.removeAttribute("class");
        }
    },
    setStyle(_cssText = "") {
        if (_cssText.length > 0) {
            this.setAttribute("style", this.getStyle() + _cssText);
        }
    },
    getStyle() {
        return this.hasAttribute("style") ? this.getAttribute("style") : "";
    },
    bindEvent(_eventName, _operateFunc) {
        this.removeEvent(_eventName, _operateFunc);
        this.addEventListener(_eventName, _operateFunc, false);
    },
    scrollOut() {
        if (this.dataset.hasOwnProperty("offsetTop")) {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            return scrollTop > this.dataset.offsetTop.parseInt();
        }
        return false;
    },
    inViewPort() {
        const viewPortHeight = window.innerHeight || document.documentElement.clientHeight,
            viewPortWidth = window.innerWidth || document.documentElement.clientWidth,
            scrollPosition = document.scrollPosition();
        let {top, left} = this.getBoundingClientRect();
        return (top - scrollPosition.top) < viewPortHeight && (left - scrollPosition.left) < viewPortWidth;
    },
    removeEvent(_eventName, _operateFunc) {
        this.removeEventListener(_eventName, _operateFunc, false);
    },
    clearChildNodes() {
        let _childCount = this.childNodes.length;
        while (_childCount > 0) {
            this.removeChild(this.childNodes[0]);
            _childCount--;
        }
    },
    hide() {
        this.appendClass("hidden");
    },
    show() {
        this.removeClass("hidden");
    },
    disable() {
        this.setAttribute("disabled", "true");
        this.dataset.disabled = "true";
        if (this.tagName.toLowerCase() === "html" || this.tagName.toLowerCase() === "body") {
            document.body.style.overflow = "hidden";
        }
    },
    enable() {
        this.removeAttribute("disabled");
        this.dataset.disabled = "false";
        if (this.tagName.toLowerCase() === "html" || this.tagName.toLowerCase() === "body") {
            document.body.style.overflow = "auto";
        }
    },
    after(element = null) {
        if (element && this.parentElement) {
            let posNode = this.nextElementSibling;
            if (posNode) {
                this.parentElement.insertBefore(element, posNode);
            } else {
                this.parentElement.appendChild(element);
            }
        }
    },
    sortChildrenBy(selectors = "", attributeName = "", _sortDesc = false) {
        if (!attributeName || !selectors || attributeName.length === 0) {
            return;
        }
        if (this.hasChildNodes()) {
            let childNodes = [];
            this.querySelectorAll(selectors).forEach(childNode => childNodes.push(childNode));
            childNodes.sort((a, b) => {
                try {
                    let aValue = a.getAttribute(attributeName);
                    let bValue = b.getAttribute(attributeName);
                    if (aValue.isNum() && bValue.isNum()) {
                        return _sortDesc ? bValue.parseFloat() > aValue.parseFloat() : bValue.parseFloat() < aValue.parseFloat();
                    }
                    if (bValue.length !== aValue.length) {
                        return _sortDesc ? bValue.length > aValue.length : bValue.length < aValue.length;
                    }
                    return _sortDesc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                } catch (e) {
                    return 0;
                }
            });
            childNodes.forEach(childNode => {
                this.removeChild(childNode);
                this.appendChild(childNode);
            });
        }
    },
    attrNames() {
        if (Comment.Browser.IE || Comment.Browser.IE11) {
            let _attrNames = [], _attrList = this.attributes, _length = _attrList.length, i;
            for (i = 0; i < _length; i++) {
                _attrNames.push(_attrList[i].name);
            }
            return _attrNames;
        } else {
            return this.getAttributeNames();
        }
    },
    childList() {
        if (Comment.Browser.IE || Comment.Browser.IE11) {
            let _children = [], _nodeList = this.childNodes, _length = _nodeList.length, i;
            for (i = 0; i < _length; i++) {
                if (_nodeList[i].nodeType === 1) {
                    _children.push(_nodeList[i]);
                }
            }
            return _children;
        } else {
            return this.children;
        }
    },
    render() {
        if (Comment.Browser.IE || Comment.Browser.IE11) {
            let _html = "<" + this.tagName;
            for (let attributesKey in this.attributes) {
                _html += (" " + attributesKey + "=\"" + this.getAttribute(attributesKey) + "\"");
            }
            if (this.tagName.toLowerCase() === "input") {
                _html += "/>";
            } else {
                _html += ">";
                const _childList = this.childList();
                if (_childList.length === 0) {
                    if (this.innerHTML !== undefined) {
                        _html += this.innerHTML;
                    }
                } else {
                    _childList.forEach(child => {
                        _html += child.render();
                    });
                }
                _html += ("</" + this.tagName + ">");
            }
            return _html;
        } else {
            return this.outerHTML;
        }
    },
    slide(force = false) {
        if (this.tagName.toLowerCase() === "section"
            && this.dataset.hasOwnProperty("type") && this.dataset.type === "slide") {
            if (!force && this.dataset.hasOwnProperty("paused") && this.dataset.paused.toLowerCase() === "true") {
                return;
            }
            const transitionTime = this.dataset.hasOwnProperty("transitionTime") ? this.dataset.transitionTime.parseInt() : 0;
            const total = this.querySelectorAll(':scope > span[data-type="sort-container"] > i').length,
                current = this.dataset.hasOwnProperty("current") ? this.dataset.current.parseInt() : 0,
                next = this.dataset.hasOwnProperty("next") ? this.dataset.next.parseInt() : nextIndex(current, total);
            const sortArray = this.querySelectorAll(`:scope > span[data-type="sort-container"] > i`),
                slideArray = this.querySelectorAll(':scope > span[data-type="slide-container"] > a');

            if (sortArray.length === 0 || slideArray.length === 0) {
                return;
            }

            const slideType = this.dataset.hasOwnProperty("slideType") ? this.dataset.slideType.parseInt() : SlideType.ScrollLeft;
            slideArray[next].appendClass("next");
            switch (slideType) {
                case SlideType.ScrollLeft:
                    slideArray[current].style.left = "-100%";
                    break;
                case SlideType.ScrollTop:
                    slideArray[current].style.top = "-100%";
                    break;
                case SlideType.ScrollRight:
                    slideArray[current].style.left = "100%";
                    break;
                case SlideType.ScrollBottom:
                    slideArray[current].style.top = "100%";
                    break;
                case SlideType.ZoomIn:
                    slideArray[next].style.scale = "1";
                    break;
                case SlideType.ZoomOut:
                    slideArray[current].style.scale = "0";
                    break;
                case SlideType.OpacityIn:
                    slideArray[next].style.opacity = "1";
                    break;
                case SlideType.OpacityOut:
                    slideArray[current].style.opacity = "0";
                    break;
            }
            sortArray.forEach((sort, index) => {
                sort.removeClass("current");
                if (index === next) {
                    sort.appendClass("current");
                }
            });
            this.dataset.current = next.toString();
            this.dataset.next = nextIndex(next, total).toString();

            window.setTimeout(() => {
                slideArray.forEach((slide, index) => {
                    slide.removeClass("current");
                    if (index === next) {
                        slide.setClass("current");
                    }
                });
                switch (slideType) {
                    case SlideType.ScrollLeft:
                    case SlideType.ScrollRight:
                        slideArray[current].style.left = "0";
                        break;
                    case SlideType.ScrollTop:
                    case SlideType.ScrollBottom:
                        slideArray[current].style.top = "0";
                        break;
                    case SlideType.ZoomIn:
                        slideArray[current].style.scale = "0";
                        break;
                    case SlideType.ZoomOut:
                        slideArray[current].style.scale = "1";
                        break;
                    case SlideType.OpacityIn:
                        slideArray[current].style.opacity = "0";
                        break;
                    case SlideType.OpacityOut:
                        slideArray[current].style.opacity = "1";
                        break;
                }
            }, transitionTime);
        }
    }
});

function nextIndex(current = 0, total = 0) {
    if (current === total) {
        return current;
    }
    return ((current + 1) === total) ? 0 : (current + 1);
}

Object.assign(HTMLInputElement.prototype, {
    validate() {
        return validate(this);
    },

    currentDateTime() {
        switch (this.type.toLowerCase()) {
            case "date":
                this.value = new Date().format(Comment.DateTime.ISO8601DATEPattern);
                break;
            case "time":
                this.value = new Date().format(Comment.DateTime.ISO8601TIMEPattern);
                break;
            case "datetime-local":
                this.value = new Date().format(Comment.DateTime.ISO8601DATETIMEPattern);
                break;
        }
    },

    countDown() {
        const type = this.type.toLowerCase();
        const intervalTime = this.dataset.hasOwnProperty("intervalTime") ? this.dataset.intervalTime.parseInt() : 0;
        if (["button", "submit", "reset"].indexOf(type) === -1 || intervalTime <= 0) {
            return;
        }
        const label = type === "button" ? this.nextElementSibling : this;
        if (label) {
            if (!this.dataset.hasOwnProperty("timer")) {
                this.dataset.originalText = label.dataset.value;
                this.dataset.countDown = intervalTime.toString();
                label.dataset.value = intervalTime.toString();
                label.value = intervalTime.toString();
                this.disable();
                this.dataset.timer = window.setInterval(() => countDown(this), 1000).toString();
            }
        }
    },

    parseValue() {
        switch (this.type.toLowerCase()) {
            case "password":
                if (Cell) {
                    return Cell.digest(this.value);
                }
                break
            case "date":
            case "time":
            case "datetime-local":
                if (Comment.DateTime.Convert) {
                    let milliseconds = Date.parse(this.value);
                    if (Comment.DateTime.UTC) {
                        milliseconds += Comment.DateTime.TimeZoneOffset;
                    }
                    return milliseconds;
                }
                break;
            case "file":
                if (this.dragFiles) {
                    return this.dragFiles;
                }
                break;
            case "text":
            case "search":
            case "url":
                if (Cell) {
                    return Boolean(this.dataset.encrypt) ? Cell.encData(this.value) : this.value;
                }
                break;
        }
        return this.value;
    }
});

Object.assign(HTMLSelectElement.prototype, {
    validate() {
        return validate(this);
    },

    items(data = []) {
        const currentValue = this.dataset.value || "",
            multiKey = this.dataset.multiKey || "",
            multilingual = multiKey.length > 0;
        if (data.length === 0) {
            if (multilingual) {
                Array.from(this.options).forEach(option => option.innerText = Cell.multiMsg(multiKey, option.value));
            }
        } else {
            this.clearChildNodes();
            data.forEach((item, index) => {
                const text = multilingual ? Cell.multiMsg(multiKey, item.value) : item.text;
                this.options.add(new Option(text, item.value, index === 0, item.value.toString() === currentValue));
            });
        }
    },

    parseValue() {
        return this.value;
    }
});

Object.assign(HTMLTextAreaElement.prototype, {
    validate() {
        return validate(this);
    },

    parseValue() {
        return this.value.encodeByRegExp();
    }
});

Object.assign(HTMLFormElement.prototype, {
    url() {
        let url = this.action;
        if (this.method.toLowerCase() === "get") {
            const formData = this.formData();
            if (formData.data != null) {
                let queryString = "";
                for (let key of formData.data.keys()) {
                    queryString += ("&" + key + "=" + formData.data.get(key));
                }
                if (queryString.length > 0) {
                    url += ("?" + queryString.substring(1));
                }
            }
        }
        return url;
    },
    formData() {
        let uploadFile = false, data = new FormData(), uploadProgress = "";
        Array.from(this.querySelectorAll("input, select, textarea"))
            .filter(input => {
                if (input.name.length === 0) {
                    return false;
                }
                if (input.type.toLowerCase() === "checkbox" || input.type.toLowerCase() === "radio") {
                    return input.checked;
                } else if (input.type.toLowerCase() === "file") {
                    return (input.dragFiles !== undefined);
                } else {
                    return input.value !== null && input.value.length > 0;
                }
            })
            .forEach(input => {
                const value = input.parseValue();
                if (value instanceof Array) {
                    uploadFile = true;
                    value.forEach(file => {
                        if (file instanceof File) {
                            data.append(input.name, file, file.name);
                        } else {
                            data.append(input.name, file.content, file.fileName);
                        }
                    });
                } else {
                    data.append(input.name, value);
                }
            });
        if (uploadFile && this.dataset.uploadProgress) {
            uploadProgress = this.dataset.uploadProgress;
        }
        return {
            uploadFile: uploadFile,
            data: data,
            uploadProgress: uploadProgress
        };
    },
    validate() {
        const elements = this.querySelectorAll("input, select, textarea");
        const successCount = Array.from(elements).filter(input => input.validate()).length;
        return successCount === elements.length;
    }
});

Object.assign(HTMLSpanElement.prototype, {
    isLazyLoad() {
        return this.dataset.hasOwnProperty("type") && this.dataset.type === "lazy";
    },
    playVideo() {
        const styles = this.styles();
        if (styles.display === "none" || styles.visibility === "hidden" || !this.dataset.loaded || this.dataset.loaded !== "true") {
            return;
        }
        if (this.dataset.hasOwnProperty("mimeType") && this.dataset.mimeType.startsWith("video")) {
            const video = this._elements().video;
            if (!video.isPlaying()) {
                video.muted = true;
                video.play();
            }
        }
    },
    pauseVideo() {
        if (this.dataset.hasOwnProperty("mimeType") && this.dataset.mimeType.startsWith("video")) {
            const video = this._elements().video;
            if (!Boolean(this.dataset.autoplay) && video.isPlaying()) {
                video.pause();
            }
        }
    },
    loadResource() {
        if (!this.isLazyLoad() || this.dataset.loaded === "true" || !this.inViewPort()) {
            return;
        }
        if (this.dataset.hasOwnProperty("mimeType") && this.dataset.hasOwnProperty("resourcePath")) {
            const _elements = this._elements();
            if (this.dataset.mimeType.startsWith("image")) {
                _elements.img.src = this.dataset.resourcePath;
            } else {
                _elements.video.show();
                if (this.dataset.hasOwnProperty("disableDownload") && Boolean(this.dataset.disableDownload)) {
                    _elements.video.setAttribute("controlslist", "nodownload");
                } else {
                    _elements.video.setAttribute("controlslist", "");
                }
                _elements.video.addEventListener("contextmenu", () => {
                    return this.dataset.hasOwnProperty("disableDownload") && Boolean(this.dataset.disableDownload);
                });
                _elements.video.disablePictureInPicture = this.dataset.hasOwnProperty("disableDownload") && Boolean(this.dataset.disableDownload);
                if (this.dataset.hasOwnProperty("controls") && Boolean(this.dataset.controls)) {
                    _elements.video.setAttribute("controls", "");
                } else {
                    _elements.video.removeAttribute("controls");
                }
                if (this.dataset.hasOwnProperty("loop") && Boolean(this.dataset.loop)) {
                    _elements.video.setAttribute("loop", "");
                } else {
                    _elements.video.removeAttribute("loop");
                }
                _elements.video.setPath(this.dataset.mimeType, this.dataset.resourcePath);
                _elements.video.load();
            }
            this.dataset.loaded = "true";
        }
    },
    _elements() {
        const elements = {img: null, video: null};
        let imgArray = this.getElementsByTagName("img");
        if (imgArray.length === 0) {
            const imgElement = document.createElement("img");
            this.appendChild(imgElement);
            imgElement.addEventListener("error", (event) => event.target.parentElement.style.opacity = "0");
            imgElement.addEventListener("load", (event) =>
                event.target.parentElement.style.backgroundImage = 'url("' + event.target.src + '")');
            elements.img = imgElement;
        } else {
            elements.img = imgArray[0];
            if (imgArray.length > 1) {
                imgArray.filter((imgElement, index) => index > 0)
                    .forEach(imgElement => this.removeChild(imgElement));
            }
        }

        const videoArray = this.querySelectorAll(":scope > video");
        if (videoArray.length === 0) {
            const videoElement = document.createElement("video");
            videoElement.addEventListener("canplay", (event) => {
                const video = event.target;
                if (Boolean(video.parentElement.dataset.autoplay)) {
                    video.muted = true;
                    video.play();
                }
            });
            this.appendChild(videoElement);
            elements.video = videoElement;
        } else {
            elements.video = videoArray[0];
            if (videoArray.length > 1) {
                videoArray.filter((video, index) => index > 0).forEach(video => this.removeChild(video));
            }
        }
        if (this.dataset.mimeType.startsWith("video")) {
            elements.video.show();
        } else {
            elements.video.hide();
        }
        elements.img.hide();
        return elements;
    }
});

Object.assign(HTMLVideoElement.prototype, {
    setPath(mimeType = "", resPath = "") {
        if (mimeType.length > 0 && resPath.length > 0 && mimeType.toLowerCase().startsWith("video")) {
            let _source;
            const sourceArray = this.getElementsByTagName("source");
            if (sourceArray.length === 0) {
                _source = document.createElement("source");
                this.appendChild(_source);
            } else {
                _source = sourceArray[0];
                if (sourceArray.length > 1) {
                    sourceArray.filter((sourceElement, index) => index > 0)
                        .forEach(sourceElement => this.removeChild(sourceElement));
                }
            }
            _source.src = resPath;
            _source.type = mimeType;
        }
    },
    isPlaying() {
        return this.currentTime > 0 && !this.paused && !this.ended && this.readyState > HTMLMediaElement.HAVE_CURRENT_DATA;
    }
});

Object.assign(FormData.prototype, {
    toMap() {
        const map = new Map();
        this.keys().forEach((key) => {
            if (map.has(key)) {
                map.set(key, this.getAll(key));
            } else {
                map.set(key, this.get(key));
            }
        });
        return map;
    }
});

Object.assign(String.prototype, {
    cleanBlank() {
        return this.isEmpty() ? "" : this.replace(RegexLibrary.BlankText, "");
    },
    isEmpty() {
        return this === "" || this.trim() === "";
    },
    isEmail() {
        return RegexLibrary.E_Mail.test(this.cleanBlank());
    },
    isLuhn() {
        if (this.trim().search(RegexLibrary.Luhn) !== -1) {
            let _numArray = this.trim().split('').reverse();
            let _result = 0;
            for (let _index = 0; _index < _numArray.length; _index++) {
                let _current = _numArray[_index].parseInt();
                if (_index % 2) {
                    _current *= 2;
                    if (_current > 9) {
                        _current -= 9;
                    }
                }
                _result += _current;
            }
            return (_result % 10) === 0;
        }
        return false;
    },
    isCHNID() {
        if (this.trim().search(RegexLibrary.CHN_ID_Card) !== -1) {
            let _sigma = 0, _code, i;
            for (i = 0; i < 17; i++) {
                _code = this.charAt(i).parseInt();
                if (_code !== 0) {
                    _sigma += _code * (Math.pow(2, 17 - i) % 11);
                }
            }
            let _authCode = (12 - (_sigma % 11)) % 11;
            return (_authCode === 10) ? this.toUpperCase().endsWith("X") : (this.charAt(17).parseInt() === _authCode);
        }
        return false;
    },
    isCHNSocialCredit() {
        if (this.trim().search(RegexLibrary.CHN_Social_Credit) !== -1) {
            let _sigma = 0, _validateCode = Comment.SocialCreditCode.indexOf(this.charAt(17)), _code, i;
            for (i = 0; i < 17; i++) {
                _code = Comment.SocialCreditCode.indexOf(this.charAt(i));
                if (_code !== 0) {
                    _sigma += _code * (Math.pow(3, i) % 31);
                }
            }
            let _authCode = 31 - (_sigma % 31);
            return (_authCode === 31) ? (_validateCode === 0) : (_authCode === _validateCode);
        }
        return false;
    },
    isJSON() {
        try {
            let obj = JSON.parse(this);
            return (typeof obj) === "object" && obj;
        } catch (e) {
            return false;
        }
    },
    isColorCode() {
        return this.trim().search(RegexLibrary.Color) !== -1;
    },
    isXml() {
        return this.trim().search(RegexLibrary.XML) !== -1;
    },
    isHtml() {
        return this.isXml() && this.match(RegexLibrary.HtmlTag)
            .filter(tag => {
                const tagName = tag.substring(1, tag.indexOf(" ") === -1 ? tag.length - 1 : tag.indexOf(" "));
                return customElements.get(tagName) === null;
            })
            .length === 0;
    },
    parseJSON() {
        if (!this.isJSON()) {
            throw new Error("Data invalid");
        }
        if (typeof JSON !== 'undefined') {
            return JSON.parse(this);
        }

        if (Comment.Browser.Gecko) {
            return new Function("return " + this)();
        }

        return eval('(' + this + ')');
    },
    parseXml() {
        let _xmlDoc = null;
        if (Comment.Browser.IE && !Comment.Browser.IE11) {
            ["MSXML.2.DOMDocument.6.0", "MSXML.2.DOMDocument.3.0", "Microsoft.XMLDOM"]
                .forEach(_xmlDomVersion => {
                    if (_xmlDoc == null) {
                        try {
                            _xmlDoc = new ActiveXObject(_xmlDomVersion);
                            _xmlDoc.async = false;
                            if (!_xmlDoc.loadXML(this)) {
                                _xmlDoc = null;
                            }
                        } catch (e) {
                            _xmlDoc = null;
                            console.log("XML data invalid" + e);
                        }
                    }
                });
        } else {
            try {
                _xmlDoc = new DOMParser().parseFromString(this, "text/xml");
            } catch (e) {
                console.log("XML data invalid" + e);
            }
        }

        return _xmlDoc == null ? null : _xmlDoc.documentElement;
    },
    isNum() {
        if (this.length === 0) {
            return false;
        }
        return Object.values(RegexLibrary.Number).filter(regex => regex.test(this.trim())).length > 0;
    },
    parseInt(radix) {
        return parseInt(this, radix === null ? 10 : radix);
    },
    parseFloat() {
        return parseFloat(this);
    },
    setTitle() {
        document.title = this;
    },
    setKeywords() {
        let metaElement = document.head.querySelector("meta[name='keywords']");
        if (metaElement === null) {
            metaElement = document.createElement("meta");
            metaElement.setAttribute("name", "keywords");
            document.head.appendChild(metaElement);
        }
        metaElement.setAttribute("content", this);
    },
    setDescription() {
        let metaElement = document.head.querySelector("meta[name='description']");
        if (metaElement === null) {
            metaElement = document.createElement("meta");
            metaElement.setAttribute("name", "description");
            document.head.appendChild(metaElement);
        }
        metaElement.setAttribute("content", this);
    },
    setLanguage() {
        if (RegexLibrary.Language_Code.test(this)) {
            document.documentElement.lang = this;
        }
    },
    decodeBase64() {
        let _result = [], i = 0, _length = this.length;
        while (i < _length) {
            _result.push((Comment.BASE64.indexOf(this.charAt(i)) << 2) | (Comment.BASE64.indexOf(this.charAt(i + 1)) >> 4));
            let _code = Comment.BASE64.indexOf(this.charAt(i + 2));
            if (_code !== 64) {
                _result.push(((Comment.BASE64.indexOf(this.charAt(i + 1)) & 0xF) << 4) | (Comment.BASE64.indexOf(this.charAt(i + 2)) >> 2));
            }
            _code = Comment.BASE64.indexOf(this.charAt(i + 2));
            if (_code !== 64) {
                _result.push(((Comment.BASE64.indexOf(this.charAt(i + 2)) & 0x3) << 6) | Comment.BASE64.indexOf(this.charAt(i + 3)));
            }
            i += 4;
        }
        return _result;
    },
    encodeByRegExp() {
        let _result = "";
        if (this.length > 0) {
            _result = this.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/ /g, "&nbsp;")
                .replace(/'/g, "&#39;")
                .replace(/"/g, "&quot;");
        }
        return _result;
    },
    decodeByRegExp() {
        let _result = "";
        if (this.length > 0) {
            _result = this.replace(/&quot;/g, "\"")
                .replace(/&#39;/g, "\'")
                .replace(/&nbsp;/g, " ")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&");
        }
        return _result;
    },
    toUTF8: function () {
        return /[\u0080-\uFFFF]/.test(this) ? decodeURI(encodeURIComponent(this)) : this;
    },
    toByteArray(bigEndian = false) {
        let _array = this.split(''), _length = _array.length, _result = [], _tmp, i, j;
        for (i = 0; i < _length; i++) {
            _tmp = encodeURI(_array[i]);
            if (_tmp.length === 1) {
                _result.push(_tmp.charCodeAt(0));
            } else {
                _tmp = _tmp.split('%');
                let _itemLen = _tmp.length;
                for (j = 0; j < _itemLen; j++) {
                    if (_tmp[j].length > 0) {
                        _result.push(parseInt('0x' + _tmp[j]));
                    }
                }
            }
        }
        if (bigEndian) {
            let _convResult = [];
            for (let position = 0; position < _result.length; position += 4) {
                _convResult[position + 3] = _result[position];
                _convResult[position + 2] = ((position + 1) < _result.length) ? _result[position + 1] : 0;
                _convResult[position + 1] = ((position + 2) < _result.length) ? _result[position + 2] : 0;
                _convResult[position] = ((position + 3) < _result.length) ? _result[position + 3] : 0;
            }
            return _convResult;
        }
        return _result;
    },
    getBytes() {
        let encode = encodeURIComponent(this);
        let _dataBytes = [];
        let code;
        for (let _i = 0; _i < encode.length; _i++) {
            let ch = encode.charAt(_i);
            if (ch === '%') {
                code = parseInt(encode.charAt(_i + 1) + encode.charAt(_i + 2), 16);
                _i += 2;
            } else {
                code = ch.charCodeAt(0);
            }
            _dataBytes.push(code);
        }
        return _dataBytes;
    },
    formatDate(pattern = Comment.DateTime.ISO8601DATETIMEPattern, utc = Comment.DateTime.UTC) {
        if (this.isNum() && Comment.DateTime.Convert) {
            return this.parseInt().parseTime(utc).format(pattern);
        }
        return this;
    }
});

Object.assign(Number.prototype, {
    parseTime(utc = Comment.DateTime.UTC) {
        let _date = new Date();
        if (utc) {
            _date.setTime(this - Comment.DateTime.TimeZoneOffset);
        } else {
            _date.setTime(this);
        }
        return _date;
    },
    safeRotateLeft(_count) {
        return (this << _count) | (this >>> (32 - _count));
    },
    safeRotateRight(_count) {
        return (this >>> _count) | (this << (32 - _count));
    },
    rotateRight(_count) {
        return this >>> _count;
    },
    parseInt() {
        return parseInt(this.toString());
    },
    parseFloat() {
        return parseFloat(this.toString());
    },
    formatDate(pattern = Comment.DateTime.ISO8601DATETIMEPattern, utc = Comment.DateTime.UTC) {
        if (Comment.DateTime.Convert) {
            return this.parseTime(utc).format(pattern);
        }
        return this.toString();
    },
    toBytes() {
        const _result = [];
        let _number = this, count = 0;
        while (count < 4) {
            _result.unshift(_number & 0xFF);
            _number >>= 8;
            count++;
        }
        return _result;
    }
});

Object.assign(BigInt.prototype, {
    toByteArray(maxDigit = -1) {
        const _result = [];
        let _num = this, i = 0;
        while (_num > 0n) {
            _result.unshift(Number(_num & 0xFFn));
            _num >>= 8n;
            i++;
        }
        if (maxDigit > 0) {
            while (_result.length < maxDigit) {
                _result.unshift(0x00);
            }
        }
        return _result;
    },
});

Object.assign(Date.prototype, {
    format(pattern = "MM/dd/yyyy") {
        let Pattern = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "S+": this.getMilliseconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3)
        };
        let returnValue = pattern;
        for (let regex in Pattern) {
            let matchResult = pattern.match(regex);
            if (matchResult !== null) {
                let matchKey = matchResult[0];
                let replaceValue;
                if (matchKey === "MMM") {
                    replaceValue = Comment.MONTH[Pattern[regex] - 1];
                } else {
                    replaceValue = "" + Pattern[regex];
                    if (matchKey.length < replaceValue.length) {
                        replaceValue = replaceValue.substring(replaceValue.length - matchKey.length);
                    } else {
                        while (replaceValue.length < matchKey.length) {
                            replaceValue = ("0" + replaceValue);
                        }
                    }
                }
                returnValue = returnValue.replace(matchKey, replaceValue);
            }
        }
        return returnValue;
    },
    weekOfMonth(beginIndex = 0) {
        const offset = 7 - ((beginIndex === 0) ? 7 : beginIndex);
        const w = (this.getDay() === 0) ? 7 : this.getDay();
        return Math.ceil((this.getDate() + 6 - w + offset) / 7);
    },
    weekOfYear(beginIndex = 0) {
        const offset = 7 - ((beginIndex === 0) ? 7 : beginIndex);
        const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
        const dayCount = Math.round((this.valueOf() - firstDayOfYear.valueOf()) / (24 * 60 * 60 * 1000));
        return Math.ceil((dayCount + firstDayOfYear.getDay() + offset) / 7);
    },
    lastDayOfPreviousMonth() {
        return new Date(this.getFullYear(), this.getMonth(), 0).getDate();
    },
    lastDayOfCurrentMonth() {
        if (this.getMonth() === 11) {
            return new Date(this.getFullYear() + 1, 0, 0).getDate();
        } else {
            return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
        }
    },
    matches(year = -1, month = -1, day = -1) {
        return this.getFullYear() === year && this.getMonth() === month && this.getDate() === day;
    },
    before(year = -1, month = -1, day = -1) {
        let result = true;
        if (year >= 0) {
            result &= this.getFullYear() <= year;
        }
        if (month > 0 && month <= 12) {
            result &= this.getMonth() < month;
        }
        if (day > 0) {
            result &= this.getDate() <= day;
        }
        return (result === true);
    },
    after(year = -1, month = -1, day = -1) {
        return !this.before(year, month, day);
    },
    /**
     * Calculate sunrise/sunset/noon by given gps location
     * @param posLon    GPS longitude
     * @param posLat    GPS latitude
     * @return Sun      Sun.Polar:  "Night" for Polar Night, SunRise: -1, SunSet: -1, Noon: -1
     *                              "Day" for Polar Day,     SunRise: -1, SunSet: -1, Noon: 12:00
     *                              "Normal" for Calculate,  SunRise: sunrise UTC time,
     *                                                       SunSet: sunset UTC time,
     *                                                       Noon: noon UTC time,
     *                                                       data unit: milliseconds
     */
    sunTime(posLon, posLat) {
        if (posLon === null || posLon < -180 || posLon > 180
            || posLat === null || posLat < -90 || posLat > 90) {
            throw new Error("GPS location unknown");
        }
        let _fixTime = Math.floor(Math.abs(posLon) / 15) * 60 * 60 * 1000;
        if (Math.abs(posLon) % 15 > 7.5) {
            _fixTime += 60 * 60 * 1000;
        }
        if (posLon < 0) {
            _fixTime *= -1;
        }
        let _currentUTC = new Date().getTime() + Comment.DateTime.TimeZoneOffset,
            _gpsTime = new Date(_currentUTC + _fixTime),
            _gpsMonth = _gpsTime.getMonth() + 1, _gpsDay = _gpsTime.getDate(),
            RD = 180 / Math.PI, B5 = Math.PI * posLat / 180,
            N = (275 * _gpsMonth / 9) - 2 * ((_gpsMonth + 9) / 12) + _gpsDay - 30,
            L0 = 4.8771 + 0.0172 * (N + 0.5 - posLon / 360), C = 0.03342 * Math.sin(L0 + 1.345),
            C2 = RD * (Math.atan(Math.tan(L0 + C)) - Math.atan(0.9175 * Math.tan(L0 + C)) - C),
            SD = 0.3978 * Math.sin(L0 + C), CD = Math.sqrt(1 - SD * SD),
            SC = (SD * Math.sin(B5) + 0.0145) / (Math.cos(B5) * CD);
        let Sun = {};
        let UTC;
        if (SC < -1) {
            //  Polar Night
            Sun.Polar = "Night";
            Sun.SunRise = -1;
            Sun.SunSet = -1;
            Sun.Noon = -1;
        } else if (SC > 1) {
            //  Polar Day
            Sun.Polar = "Day";
            Sun.SunRise = -1;
            Sun.SunSet = -1;
            UTC = new Date(_currentUTC);
            UTC.setHours(12);
            UTC.setMinutes(0);
            Sun.Noon = UTC.getTime();
        } else {
            Sun.Polar = "Normal";
            let C3 = RD * Math.atan(SC / Math.sqrt(1 - Math.pow(SC, 2))), R1 = 6 - (posLon + C2 + C3) / 15,
                HR = Math.floor(R1), MR = Math.floor((R1 - HR) * 60);
            UTC = new Date(_currentUTC);
            UTC.setHours(HR);
            UTC.setMinutes(MR);
            Sun.SunRise = UTC.getTime();
            let S1 = 18 - (posLon + C2 - C3) / 15,
                HS = Math.floor(S1), MS = Math.floor((S1 - HS) * 60);
            UTC = new Date(_currentUTC);
            UTC.setHours(HS);
            UTC.setMinutes(MS);
            Sun.SunSet = UTC.getTime();
            Sun.Noon = Math.floor((Sun.SunRise + Sun.SunSet) / 2);
        }
        return Sun;
    }
});

Object.assign(Array.prototype, {
    XOR(data = []) {
        if (this.length !== data.length) {
            throw new Error("Array length not matched!");
        }
        const _result = [];
        for (let i = 0 ; i < this.length ; i++) {
            _result[i] = this[i] ^ data[i];
        }
        return _result;
    },
    toHex(separator = "") {
        let _result = "";
        this.forEach(_byte => {
            let _string = Number(_byte).toString(16);
            if (_string.length < 2) {
                _string = "0" + _string;
            }
            _result += (separator + _string);
        });
        return _result;
    },
    toString() {
        let _result = "";
        this.forEach(_byte => {
            if (_byte < 0) {
                //  Compatible Java getBytes() result
                _byte += 256;
            }
            if (_byte < 128) {
                _result += String.fromCharCode(_byte);
            } else {
                _result += ("%" + _byte.toString().parseInt().toString(16));
            }
        });
        return decodeURIComponent(_result);
    },
    toBigInt() {
        let _result = 0x00n;
        this.forEach(b => {
            _result <<= 8n;
            _result += BigInt(b);
        });
        return _result;
    },
    encodeBase16(littleEndian = true) {
        let _result = "", _byte;
        for (let i = 0; i < this.length; i++) {
            _byte = this[i];
            for (let j = 0; j < 4; j++) {
                if (littleEndian) {
                    _result += Comment.BASE16[(_byte >> ((2 * j + 1) * 4)) & 0x0F]
                        + Comment.BASE16[(_byte >> ((2 * j) * 4)) & 0x0F];
                } else {
                    _result += Comment.BASE16[(_byte >> (28 - ((2 * j) * 4))) & 0x0F]
                        + Comment.BASE16[(_byte >> (28 - ((2 * j + 1) * 4))) & 0x0F];
                }
            }
        }
        return _result;
    },
    encodeBase64(padding = "") {
        let _result = "", _length = this.length, i;
        for (i = 0; i < _length; i += 3) {
            _result += (Comment.BASE64[this[i] >> 2] + Comment.BASE64[((this[i] & 0x3) << 4) | (this[i + 1] >> 4)]);
            if (i + 1 < _length) {
                _result += Comment.BASE64[((this[i + 1] & 0xF) << 2) | (this[i + 2] >> 6)];
            }
            if (i + 2 < _length) {
                _result += Comment.BASE64[this[i + 2] & 0x3F];
            }
        }
        while (_result.length % 4 !== 0) {
            _result += ((padding.length === 0) ? Comment.BASE64[64] : padding);
        }
        return _result;
    }
});