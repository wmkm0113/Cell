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
 * 1.0.1
 * [New] Extend String for Verify CHN ID Card Code and CHN Social Credit Code
 *
 * 1.0.0
 * [New] Extend Element/String/Number/Array/Date
 *
 */
'use strict';

const BASE64 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/', '='
];

const BASE16 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

const CHN_SOCIAL_CREDIT_CODE = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X', 'Y'
];

const Comment = {
    Version:    "1.0.1",
    Language:   (navigator.language || navigator.userLanguage).substring(0, 2),
    Html5:      !!window.applicationCache,
    MaxWidth :  Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
    MaxHeight : Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight),
    GPS :       !!navigator.geolocation,
    Browser: {
        Version:	parseInt(navigator.appVersion),
        //	Internet Explorer
        IE:     	!!window.ActiveXObject || "ActiveXObject" in window,
        //	Internet Explorer Under Version 8
        IE8:		(parseInt(navigator.appVersion) >= 8),
        //	Internet Explorer 11
        IE11:		(!(navigator.userAgent.toUpperCase().indexOf('TRIDENT') > -1
                        && navigator.userAgent.toUpperCase().indexOf('RV:') > -1
                        && parseInt(navigator.appVersion) === 11)),
        //	Microsoft Edge
        Edge:		navigator.userAgent.indexOf('Edge') > -1,
        //	Opera Explorer
        Opera:  	!!window.opera && navigator.userAgent.toUpperCase().indexOf('OPERA') > -1,
        //	Firefox Explorer
        Firefox: 	!!document.getBoxObjectFor && navigator.userAgent.toUpperCase().indexOf('FIREFOX') > -1,
        // 	Apple Safari Explorer
        Safari:		!!window.openDatabase && navigator.userAgent.toUpperCase().indexOf('SAFARI') > -1,
        //	Chrome Explorer
        Chrome:		!!window.MessageEvent && !document.getBoxObjectFor,
        //	Apple Safari and Google Chrome
        WebKit: 	navigator.userAgent.indexOf('AppleWebKit/') > -1,
        //	Mozilla Firefox, Apple Safari and Google Chrome
        Gecko:  	navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1
    },
    HtmlTag : [
        "a", "abbr", "acronym", "address", "applet", "area", "b", "base", "bdo", "big", "blockquote", "body", "br",
        "button", "caption", "center", "cite", "code", "col", "colgroup", "dd", "del", "div", "dfn", "dl", "dt", "em",
        "embed", "fieldset", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "html", "i",
        "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "map", "meta", "noframes", "noscript",
        "object", "ol", "optgroup", "option", "p", "param", "pre", "q", "s", "samp", "script", "select", "small",
        "span", "strong", "style", "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "title",
        "tr", "tt", "ul", "var"
    ],
    Html5Tag : [
        "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote",
        "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist",
        "dd", "del", "details", "div", "dfn", "dialog", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure",
        "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "html",
        "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark",
        "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param",
        "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small",
        "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "template",
        "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "ul", "var", "video", "wbr"
    ],
    Author: [
        {"Name":"Steven Wee", "EMail":"wmkm0113@Hotmail.com", "ORG":"Nervousync Studio"}
    ]
};

const RegexLibrary = {
    E_Mail : /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/i,
    UUID : /^([0-9a-f]{8}((-[0-9a-f]{4}){3})-[0-9a-f]{12})|([0-9a-f]{32})\b/g,
    TrimBlank : /(^\s*)|(\s*$)/g,
    BlankText : /[\s]+/ig,
    Number : /\b\d+\b/g,
    Color : /^#[0-9A-F]{6}$/i,
    XML : /<[a-zA-Z0-9]+[^>]*>(?:.|[\r\n])*?<\/[a-zA-Z0-9]+>/ig,
    HtmlTag : /<[a-zA-Z0-9]+[^>]*>/ig,
    Date: /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/ig,
    CHN_ID_Card : /^[1-9]([0-9]{17}|([0-9]{16}X))$/g,
    CHN_Social_Credit : /^([1-9]|A|N|Y)[0-9A-Z]{17}$/g
};

const Config = {
    developmentMode: false,
    templates : "",
    components : "",
    //  Internationalization
    i18n : {
        //  Current language
        language : Comment.Language,
        resPath : ""
    },
    //  Config the dark mode by sunrise and sunset
    darkMode : {
        enabled : false,
        styleClass : "darkMode"
    },
    //  Config for form data
    form : {
        //  Encrypt value of input[type='password']
        encryptPassword : true,
        //  Encrypt method for input[type='password']
        //  Options:    MD5/RSA/SHA1/SHA224/SHA256/SHA384/SHA512/SHA512_224/SHA512_256
        //              SHA3_224/SHA3_256/SHA3_384/SHA3_512/SHAKE128/SHAKE256
        //              Keccak224/Keccak256/Keccak384/Keccak512
        encryptMethod : "MD5",
        //  Convert date/time from 'yyyy-MM-dd [HH:mm]' to number of milliseconds between that date and midnight, January 1, 1970.
        convertDateTime : false,
        //  Convert value is UTC number of milliseconds between that date and midnight, January 1, 1970.
        utcDateTime : false
    },
    security : {
        //  RSA Key Config
        RSA : {
            //  Private Key using for encrypt send data and generate digital signature
            PrivateKey : {
                exponent : "",
                modulus : "",
                //  Exponent and modulus data radix, default is 16
                radix : 16,
                //  Private Key Size
                keySize : 1024
            },
            //  Public Key using for decrypt receive data and verify digital signature
            PublicKey : {
                exponent : "",
                modulus : "",
                //  Exponent and modulus data radix, default is 16
                radix : 16,
                //  Public Key Size
                keySize : 1024
            },
        }
    }
};
Object.seal(Config);
export {Comment, Config};

Object.extend = function(destination, source) {
    for (let _property in source) {
        if (source.hasOwnProperty(_property)
            && (typeof source[_property]).toString().toLowerCase() === 'object') {
            Object.extend(destination[_property], source[_property]);
        } else {
            destination[_property] = source[_property];
        }
    }
    return destination;
};

Object.extend(Element.prototype, {
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
            _className = _className.replace(RegexLibrary.BlankText, " ").trim();
            if (Comment.Browser.IE8) {
                this.setAttribute("className", _className);
            } else {
                this.setAttribute("class", _className);
            }
        }
    },

    setStyle(_cssText = "") {
        if (_cssText.length > 0) {
            if (Comment.Browser.IE8) {
                this.setAttribute("cssText",
                    this.hasAttribute("cssText") ? this.getAttribute("cssText") + _cssText : _cssText);
            } else {
                this.setAttribute("style",
                    this.hasAttribute("style") ? this.getAttribute("style") + _cssText : _cssText);
            }
        }
    },

    getStyle() {
        if (Comment.Browser.IE8) {
            return this.hasAttribute("cssText") ? this.getAttribute("cssText") : "";
        } else {
            return this.hasAttribute("style") ? this.getAttribute("style") : "";
        }
    },

    bindEvent(_eventName, _operateFunc) {
        if (Comment.Browser.IE && !Comment.Browser.IE11) {
            this.attachEvent("on" + _eventName, _operateFunc);
        } else {
            this.addEventListener(_eventName, _operateFunc, false);
        }
    },

    removeEvent(_eventName, _operateFunc) {
        if (Comment.Browser.IE && !Comment.Browser.IE11) {
            this.detachEvent("on" + _eventName, _operateFunc);
        } else {
            this.removeEventListener(_eventName, _operateFunc, false);
        }
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

    formData() {
        if (this.tagName.toLowerCase() === "form") {
            let _formData = new FormData();
            _formData.uploadFile = false;
            let _inputName, _inputValue;
            this.querySelectorAll("input, select, textarea").forEach(input => {
                _inputName = input.name;
                _inputValue = input.tagName.toLowerCase() === "textarea" ? input.innerHTML : input.value;
                if (_inputValue !== null && _inputValue.length > 0) {
                    if (input.tagName.toLowerCase() === "input") {
                        switch (input.type.toLowerCase()) {
                            case "password":
                                _inputValue = Cell.encryptPassword(_inputValue);
                                break;
                            case "date":
                            case "datetime-local":
                                _inputValue = Cell.convertDateTime(_inputValue);
                                break;
                            case "file":
                                _formData.uploadFile = true;
                                break;
                        }
                        _formData.append(_inputName, _inputValue);
                    } else if (input.tagName.toLowerCase() === "select") {
                        _formData.append(_inputName, _inputValue);
                    } else {
                        _formData.append(_inputName, _inputValue.encodeByRegExp());
                    }
                }
            });
            if (_formData.uploadFile && this.dataset.uploadProgress) {
                _formData.uploadProgress = this.dataset.uploadProgress;
            }
            return _formData;
        }
    },

    validate() {
        let _result = true;
        if (this.tagName.toLowerCase() === "form") {
            this.querySelectorAll("input, select, textarea").forEach(input => {
                _result = _result && input.validate();
            });
        } else if (this.dataset.validate === "true"
            && (this.tagName.toLowerCase() === "input" || this.tagName.toLowerCase() === "select")) {
            if (this.value.length > 0) {
                let _value = this.value;
                if (this.dataset.regex) {
                    _result = _result && (_value.match(this.dataset.regex) !== null);
                }
                if (this.dataset.minValue && this.dataset.minValue.isNum() && _value.isNum()) {
                    _result = _result && (Number(this.dataset.minValue) <= Number(_value));
                }
                if (this.dataset.maxValue && this.dataset.maxValue.isNum() && _value.isNum()) {
                    _result = _result && (Number(_value) <= Number(this.dataset.maxValue));
                }
                if (this.dataset.email === "true") {
                    _result = _result && _value.isEmail();
                }
                if (this.dataset.idCard === "true") {
                    _result = _result && _value.isIDCardCode();
                }
                if (this.dataset.socialCredit === "true") {
                    _result = _result && _value.isSocialCreditCode();
                }
            } else {
                _result = this.dataset.notNull === undefined || this.dataset.notNull === "false";
            }

            this.dataset.verifyResult = _result.toString();
        }
        return _result;
    },

    sortChildrenBy(tagName = "", attributeName = "", _sortDesc = false) {
        if (!attributeName || !tagName) {
            return;
        }

        let _sortFunc = function(a, b) {
            try {
                let aValue = a.getAttribute(attributeName);
                let bValue = b.getAttribute(attributeName);

                let sortValue = 0;
                if (aValue.toString().toLowerCase() < bValue.toString().toLowerCase()) {
                    sortValue = -1;
                } else if (aValue.toString().toLowerCase() > bValue.toString().toLowerCase()) {
                    sortValue = 1;
                }

                if (_sortDesc) {
                    sortValue *= -1;
                }

                return sortValue;
            } catch (e) {
                return 0;
            }
        };

        if (this.hasChildNodes()) {
            let sortNodes = this.getElementsByTagName(tagName);
            sortNodes = sortNodes.sort(_sortFunc);

            let childNodes = this.childNodes;
            tagName = tagName.toLowerCase();

            for (let i = 0 ; i < childNodes.length ; i++) {
                if (childNodes[i].tagName && childNodes[i].tagName.toLowerCase() === tagName) {
                    this.removeChild(childNodes[i]);
                }
            }

            while (sortNodes.length > 0) {
                this.appendChild(sortNodes.shift());
            }
        }
    },

    attrNames() {
        if (Comment.Browser.IE || Comment.Browser.IE11) {
            let _attrNames = [], _attrList = this.attributes, _length = _attrList.length, i;
            for (i = 0 ; i < _length ; i++) {
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
            for (i = 0 ; i < _length ; i++) {
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
            let _attributes = this.attributes, _attrLength = _attributes.length, i;
            for (i = 0 ; i < _attrLength ; i++) {
                _html += (" " + _attributes[i].name + "=\"" + this.getAttribute(_attributes[i].name) + "\"");
            }

            if (this.tagName.toLowerCase() === "input") {
                _html += "/>";
            } else {
                _html += ">";
                let _childList = this.childList(), _childLength = _childList.length;
                if (_childLength > 0) {
                    for (i = 0 ; i < _childLength ; i++) {
                        _html += _childList[i].render();
                    }
                } else if (this.innerHTML !== undefined) {
                    _html += this.innerHTML;
                }
                _html += ("</" + this.tagName + ">");
            }
            return _html;
        } else {
            return this.outerHTML;
        }
    }
});

Object.extend(String.prototype, {
    trim() {
        return this.replace(RegexLibrary.TrimBlank, "");
    },

    reverse() {
        return Array.from(this).reverse().join('');
    },

    cleanBlank() {
        return this.isEmpty() ? "" : this.replace(RegexLibrary.BlankText, "");
    },

    isEmpty() {
        return this === "" || this.trim() === "";
    },

    startsWith(startString) {
        if (startString == null || startString.length === 0
            || this.length === 0 || startString.length > this.length) {
            return false;
        }
        return this.indexOf(startString) === 0;
    },

    endsWith(endString) {
        if (endString == null || endString.length === 0
            || this.length === 0 || endString.length > this.length) {
            return false;
        }
        return this.substr(this.length - endString.length) === endString;
    },

    isEmail() {
        return RegexLibrary.E_Mail.test(this.cleanBlank());
    },

    isIDCardCode() {
        if (this.trim().search(RegexLibrary.CHN_ID_Card) !== -1) {
            let _sigma = 0, _code, i;
            for (i = 0 ; i < 17 ; i++) {
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

    isSocialCreditCode() {
        if (this.trim().search(RegexLibrary.CHN_Social_Credit) !== -1) {
            let _sigma = 0, _validateCode = CHN_SOCIAL_CREDIT_CODE.indexOf(this.charAt(17)),_code, i;
            for (i = 0 ; i < 17 ; i++) {
                _code = CHN_SOCIAL_CREDIT_CODE.indexOf(this.charAt(i));
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
        let _string = this.replace(/\\["\\\/bfnrtu]/g, '@');
        _string = _string.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        _string = _string.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        return /^[\],:{}\s]*$/.test(_string);
    },

    isColorCode() {
        return this.trim().search(RegexLibrary.Color) !== -1;
    },

    isXml() {
        return this.trim().search(RegexLibrary.XML) !== -1;
    },

    isHtml() {
        let _matchResult = this.isXml();
        if (_matchResult) {
            let _length = RegexLibrary.HtmlTag.length, _tagName;
            for (let i = 0 ; i < _length ; i++) {
                _tagName = this.match(RegexLibrary.HtmlTag[i]);
                if (_tagName !== null) {
                    _tagName = _tagName.substr(1, _tagName.length - 2);
                    if (_tagName.indexOf(" ") > 0) {
                        _tagName = _tagName.substr(0, _tagName.indexOf(" "));
                    }
                    if (Comment.Html5) {
                        if (Comment.Html5Tag.indexOf(_tagName) === -1) {
                            _matchResult = false;
                        }
                    } else {
                        if (Comment.HtmlTag.indexOf(_tagName) === -1) {
                            _matchResult = false;
                        }
                    }
                }
            }
        }
        return _matchResult;
    },

    parseJSON() {
        if (!this.isJSON()) {
            throw new Error(Cell.message("Core", "Data.Invalid.JSON"));
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
                            console.log(Cell.message("Core", "Data.Invalid.XML") + e);
                        }
                    }
                });
        } else {
            try {
                _xmlDoc = new DOMParser().parseFromString(this, "text/xml");
            } catch (e) {
                console.log(Cell.message("Core", "Data.Invalid.XML") + e);
            }
        }

        return _xmlDoc == null ? null : _xmlDoc.documentElement;
    },

    isNum() {
        return (this.match(RegexLibrary.Number) != null);
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
        let _keyWords = document.querySelector("keywords");
        if (_keyWords) {
            _keyWords.setAttribute("content", this);
        }
    },

    setDescription() {
        let _description = document.querySelector("description");
        if (_description) {
            _description.setAttribute("content", this);
        }
    },

    encodeBase64() {
        return (typeof btoa === "function") ? btoa(unescape(encodeURIComponent(this))) : this.toByteArray().base64();
    },

    decodeBase64() {
        if (typeof atob === "function") {
            return decodeURIComponent(escape(atob(this)));
        }
        let _result = [], i = 0, _length = this.length;
        while (i < _length) {
            _result.push((BASE64.indexOf(this.charAt(i)) << 2) | BASE64.indexOf(this.charAt(i + 1)) >> 4);
            let _code = BASE64.indexOf(this.charAt(i + 2));
            if (_code !== 64) {
                _result.push(((BASE64.indexOf(this.charAt(i + 1)) & 0xF) << 4) | (BASE64.indexOf(this.charAt(i + 2)) >> 2));
            }
            _code = BASE64.indexOf(this.charAt(i + 2));
            if (_code !== 64) {
                _result.push(((BASE64.indexOf(this.charAt(i + 2)) & 0x3) << 6) | BASE64.indexOf(this.charAt(i + 3)));
            }
            i += 4;
        }
        return _result;
    },

    encodeByRegExp () {
        let _result = "";
        if(this.length > 0) {
            _result = this.replace(/&/g,"&amp;");
            _result = _result.replace(/</g,"&lt;");
            _result = _result.replace(/>/g,"&gt;");
            _result = _result.replace(/ /g,"&nbsp;");
            _result = _result.replace(/'/g,"&#39;");
            _result = _result.replace(/"/g,"&quot;");
        }
        return _result;
    },

    decodeByRegExp () {
        let _result = "";
        if(this.length > 0) {
            _result = this.replace(/&amp;/g,"&");
            _result = _result.replace(/&lt;/g,"<");
            _result = _result.replace(/&gt;/g,">");
            _result = _result.replace(/&nbsp;/g," ");
            _result = _result.replace(/&#39;/g,"\'");
            _result = _result.replace(/&quot;/g,"\"");
        }
        return _result;
    },

    toUTF8 : function() {
        return /[\u0080-\uFFFF]/.test(this) ? unescape(encodeURIComponent(this)) : this;
    },

    toByteArray() {
        let _array = this.split(''), _length = _array.length, _result = [], _tmp, i, j;
        for (i = 0 ; i < _length ; i++) {
            _tmp = encodeURI(_array[i]);
            if (_tmp.length === 1) {
                _result.push(_tmp.charCodeAt(0));
            } else {
                _tmp = _tmp.split('%');
                let _itemLen = _tmp.length;
                for (j = 0 ; j < _itemLen ; j++) {
                    if (_tmp[j].length > 0) {
                        _result.push(parseInt('0x' + _tmp[j]));
                    }
                }
            }
        }
        return _result;
    },

    getBytes(littleEndian = true) {
        let _dataBytes = [];
        let _charCode, _cnt = 0, _intOffset;
        let _length = this.length * 8;
        for (let _index = 0 ; _index < _length ; _index += 8) {
            let _tmpBytes = [];
            _charCode = this.charCodeAt(_index / 8);
            if (_charCode < 0x80) {
                _tmpBytes.push(_charCode);
            } else if (_charCode < 0x800) {
                _tmpBytes.push((_charCode >>> 6) | 0xC0);
                _tmpBytes.push((_charCode & 0x3F) | 0x80);
            } else if ((_charCode < 0xD800) || (_charCode >= 0xE000)) {
                _tmpBytes.push((_charCode >>> 12) | 0xE0);
                _tmpBytes.push(((_charCode >>> 6) & 0x3F) | 0x80);
                _tmpBytes.push((_charCode & 0x3F) | 0x80);
            } else {
                //  Using for UTF-16
                _index += 1;
                _charCode = 0x10000 + (((_charCode & 0x3FF) << 10) | (this.charCodeAt(_index) & 0x3FF));
                _tmpBytes.push((_charCode >>> 18) | 0xF0);
                _tmpBytes.push(((_charCode >>> 12) & 0x3F) | 0x80);
                _tmpBytes.push(((_charCode >>> 6) & 0x3F) | 0x80);
                _tmpBytes.push((_charCode & 0x3F) | 0x80);
            }

            for (let j = 0; j < _tmpBytes.length; j++) {
                _intOffset = _cnt >>> 2;
                while (_dataBytes.length <= _intOffset) {
                    _dataBytes.push(0);
                }
                if (littleEndian) {
                    _dataBytes[_intOffset] |= _tmpBytes[j] << (24 - (8 * (_cnt % 4)));
                } else {
                    _dataBytes[_intOffset] |= _tmpBytes[j] << (8 * (_cnt % 4));
                }
                _cnt++;
            }
        }
        return _dataBytes;
    }
});

Object.extend(Number.prototype, {
    parseTime(utc = false) {
        let offset = 0;
        if (utc) {
            offset = (new Date().getTimezoneOffset() * 60 * 1000);
        }
        let _date = new Date();
        _date.setTime(this - offset);
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
    }
});

Object.extend(Date.prototype, {
    format(pattern = "MM/dd/yyyy") {
        let Pattern = {
            "y+" : this.getFullYear(),
            "M+" : this.getMonth() + 1,
            "d+" : this.getDate(),
            "H+" : this.getHours(),
            "m+" : this.getMinutes(),
            "s+" : this.getSeconds(),
            "S+"  : this.getMilliseconds(),
            "q+" : Math.floor((this.getMonth() + 3) / 3)
        };

        for (let regex in Pattern) {
            if (new RegExp("(" + regex + ")").test(pattern)) {
                let replaceValue = "" + Pattern[regex];
                if (RegExp.$1.length > replaceValue.length) {
                    let _limit = RegExp.$1.length - replaceValue.length;
                    for (let i = 0 ; i < _limit ; i++) {
                        replaceValue = "0" + replaceValue;
                    }
                }

                pattern = pattern.replace(RegExp.$1, replaceValue);
            }
        }

        return pattern;
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
            throw new Error(Cell.message("Core", "Location.GPS.Unknown"));
        }

        let _fixTime = Math.floor(Math.abs(posLon) / 15) * 60 * 60 * 1000;
        if (Math.abs(posLon) % 15 > 7.5) {
            _fixTime += 60 * 60 * 1000;
        }
        if (posLon < 0) {
            _fixTime *= -1;
        }

        let _currentUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000,
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

Object.extend(Array.prototype, {
    toHex(littleEndian = true) {
        let _result = "", _byte;
        for (let i = 0 ; i < this.length ; i++) {
            _byte = this[i];
            for (let j = 0 ; j < 4 ; j++) {
                if (littleEndian) {
                    _result += BASE16[(_byte >> ((2 * j + 1) * 4)) & 0x0F] + BASE16[(_byte >> ((2 * j) * 4)) & 0x0F];
                } else {
                    _result += BASE16[(_byte >> (28 - ((2 * j) * 4))) & 0x0F] + BASE16[(_byte >> (28 - ((2 * j + 1) * 4))) & 0x0F];
                }
            }
        }
        return _result;
    },

    base64(padding = "") {
        let _result = "", _length = this.length, i;
        for (i = 0 ; i < _length ; i += 3) {
            _result += (BASE64[this[i] >> 2] + BASE64[((this[i] & 0x3) << 4) | (this[i + 1] >> 4)]);
            if (i + 1 < _length) {
                _result += BASE64[((this[i + 1] & 0xF) << 2) | (this[i + 2] >> 6)];
            }
            if (i + 2 < _length) {
                _result += BASE64[this[i + 2] & 0x3F];
            }
        }
        while (_result.length % 4 !== 0) {
            _result += ((padding.length === 0) ? padding : BASE64[64]);
        }

        return _result;
    },

    toString() {
        let _result = "", i = 0, _length = this.length;
        while (i < _length) {
            if (this[i] < 0x80) {
                _result += String.fromCharCode(this[i]);
                i++;
            } else if (this[i] >= 0xC0 && this[i] < 0xE0) {
                _result += String.fromCharCode(((this[i] & 0x1F) << 6) | (this[i + 1] & 0x80));
                i += 2;
            } else if (this[i] >= 0xE0 && this[i] < 0xF0) {
                _result += String.fromCharCode(((this[i] & 0xF) << 12) | ((this[i + 1] & 0x3F) << 6) | (this[i + 2] & 0x3F));
                i += 3;
            } else {
                //  Using for UTF-16
                _result += String.fromCharCode(((this[i] & 0x7) << 18) | ((this[i + 1] & 0x3F) << 12) | ((this[i + 2] & 0x3F) << 6) | (this[i + 3] & 0x3F));
                i += 4;
            }
        }
        return _result;
    }
});