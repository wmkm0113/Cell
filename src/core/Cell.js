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
 * [New] Send Ajax Request
 * [New] Encode form data,
 * [New] Template Render
 * [New] Multilingual Support
 * [New] Extend Element/String/Number/Array/Date
 * [New] Core CellJS
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

const Comment = {
    Version:    "1.0.0",
    Language:   (navigator.language|| navigator.userLanguage).substring(0, 2),
    Html5:      !!window.applicationCache,
    MaxWidth :  Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
    MaxHeight : Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight),
    Browser: {
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
        Gecko:  	navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
        Version:	parseInt(navigator.appVersion)
    },
    HtmlTag : [
        "a", "abbr", "acronym", "address", "applet", "area", "b", "base", "bdo", "big", "blockquote", "body", "br", "button", "caption", "center", "cite",
        "code", "col", "colgroup", "dd", "del", "div", "dfn", "dl", "dt", "em", "embed", "fieldset", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6",
        "head", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "map", "meta", "noframes", "noscript", "object", "ol",
        "optgroup", "option", "p", "param", "pre", "q", "s", "samp", "script", "select", "small", "span", "strong", "style", "sub", "sup", "table", "tbody",
        "td", "textarea", "tfoot", "th", "thead", "title", "tr", "tt", "ul", "var"
    ],
    Html5Tag : [
        "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption",
        "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "div", "dfn", "dialog", "dl", "dt", "em", "embed", "fieldset", "figcaption",
        "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd",
        "keygen", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p",
        "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary",
        "sup", "table", "tbody", "td", "textarea", "template", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "ul", "var", "video", "wbr"
    ],
    Author: [
        {"Name":"Steven Wee", "EMail":"wmkm0113@Hotmail.com", "ORG":"Nervousync Studio"}
    ]
};

const RegexLibrary = {
    E_Mail : /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+(?:[A-Z]{2}|asia|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum|travel)\b/g,
    UUID : /^([0-9a-f]{8}((-[0-9a-f]{4}){3})-[0-9a-f]{12})|([0-9a-f]{32})\b/g,
    TrimBlank : /(^\s*)|(\s*$)/g,
    BlankText : /[\s]+/ig,
    Number : /\b\d+\b/g,
    Color : /^#[0-9A-F]{6}$/i,
    XML : /<[a-zA-Z0-9]+[^>]*>(?:.|[\r\n])*?<\/[a-zA-Z0-9]+>/ig,
    HtmlTag : /<[a-zA-Z0-9]+[^>]*>/ig,
    Date: /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/ig
};

function $() {
    if (arguments.length <= 0) {
        return null;
    } else {
        let argCount = arguments.length;
        if (argCount === 1) {
            return document.getElementById(arguments[0]);
        } else {
            let returnElements = [];
            for (let i = 0 ; i < argCount ; i++) {
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
}

//Get Elements by input elementId
function $V() {
    if (arguments.length <= 0) {
        return null;
    } else {
        let argCount = arguments.length;
        if (argCount === 1) {
            let currentElement = document.getElementById(arguments[0]);
            if (currentElement) {
                return currentElement.value;
            } else {
                console.log(Cell.message("Core", "Element.Null.ID", arguments[0]));
                return null;
            }
        } else {
            let returnValues = [];
            for (let i = 0 ; i < argCount ; i++) {
                let elementId = arguments[i];
                if (typeof elementId === 'string') {
                    let currentElement = document.getElementById(arguments[0]);
                    if (currentElement) {
                        returnValues.push(currentElement.value);
                    } else {
                        console.log(Cell.message("Core", "Element.Null.ID", elementId));
                        returnValues.push(null);
                    }
                }
            }
            return returnValues;
        }
    }
}

//Get Elements by input elementName
function $$() {
    if (arguments.length <= 0) {
        return [];
    } else {
        let returnElements = [];
        let argCount = arguments.length;
        for (let i = 0 ; i < argCount ; i++) {
            let elementName = arguments[i];
            if ((typeof elementName) === 'string') {
                returnElements.push(document.getElementsByName(elementName));
            } else {
                console.log(Cell.message("Core", "Element.Name.String"));
            }
        }
        return returnElements;
    }
}

function $$V() {
    if (arguments.length <= 0) {
        return [];
    } else {
        let returnValues = [];
        let argCount = arguments.length;
        for (let i = 0 ; i < argCount ; i++) {
            let element = null;
            let elementName = arguments[i];
            if (typeof elementName === 'string') {
                element = document.getElementsByName(elementName);
                if (element != null) {
                    let elementValues = new Array(element.length);
                    for (let j = 0 ; j < element.length ; j++) {
                        elementValues[j] = element[j].value;
                    }
                    returnValues.push(elementValues);
                } else {
                    console.log(Cell.message("Core", "Element.Null.Name", elementName));
                    returnValues.push([]);
                }
            } else {
                console.log(Cell.message("Core", "Element.Name.String"));
            }
        }
        return returnValues;
    }
}

function setFontSize(size) {
    document.body.style.fontSize = size + "px";
}

function safeAdd(x = 0, y = 0) {
    let _low = (x & 0xFFFF) + (y & 0xFFFF);
    let _high = (x >> 16) + (y >> 16) + (_low >> 16);
    return (_high << 16) | (_low & 0xFFFF);
}

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
    getClass : function() {
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

    hasClass : function(_className) {
        if (Comment.Html5) {
            return this.classList.contains(_className);
        }

        if (_className) {
            return this.getClass().indexOf(_className) !== -1;
        }
        return false;
    },

    appendClass : function(_className) {
        if (Comment.Html5) {
            this.classList.add(_className);
        } else {
            if (_className && !this.hasClass(_className)) {
                this.setClass(this.getClass() + " " + _className);
            }
        }
    },

    removeClass : function(_className) {
        if (Comment.Html5) {
            this.classList.remove(_className);
        } else {
            if (_className && this.hasClass(_className)) {
                this.setClass(this.getClass().replace(_className, ""));
            }
        }
    },

    setClass : function(_className) {
        if (_className !== null) {
            _className = _className.replace(RegexLibrary.BlankText, " ").trim();
            if (Comment.Browser.IE8) {
                this.setAttribute("className", _className);
            } else {
                this.setAttribute("class", _className);
            }
        }
    },

    setStyle : function(_cssText) {
        if (_cssText) {
            if (Comment.Browser.IE8) {
                this.setAttribute("cssText", _cssText);
            } else {
                this.setAttribute("style", _cssText);
            }
        }
    },

    addEvent : function(_eventName, _operateFunc) {
        if (Comment.Browser.IE && !Comment.Browser.IE11) {
            this.attachEvent("on" + _eventName, _operateFunc);
        } else {
            this.addEventListener(_eventName, _operateFunc, false);
        }
    },

    removeEvent : function(_eventName, _operateFunc) {
        if (Comment.Browser.IE && !Comment.Browser.IE11) {
            this.detachEvent("on" + _eventName, _operateFunc);
        } else {
            this.removeEventListener(_eventName, _operateFunc, false);
        }
    },

    clearChildNodes : function() {
        let _childCount = this.childNodes.length;
        while (_childCount > 0) {
            this.removeChild(this.childNodes[0]);
            _childCount--;
        }
    },

    hide : function() {
        this.style.display = "none";
    },

    show : function() {
        this.style.display = "block";
    },

    formData : function() {
        if (this.tagName.toLowerCase() === "form") {
            let _formData = new FormData(this);
            _formData.uploadFile = false;
            Array.from(this.getElementsByTagName("input")).forEach(input => {
                switch (input.type.toLowerCase()) {
                    case "password":
                        _formData.delete(input.name);
                        _formData.append(input.name, Cell.encryptPassword(input.value));
                        break;
                    case "date":
                    case "datetime-local":
                        _formData.delete(input.name);
                        _formData.append(input.name, Cell.convertDateTime(input.value));
                        break;
                    case "file":
                        _formData.uploadFile = true;
                        break;
                }
            });
            return _formData;
        }
    },

    sortChildrenBy : function(tagName, attributeName, _sortDesc = false) {
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
    }
});

Object.extend(String.prototype, {

    trim : function() {
        return this.replace(RegexLibrary.TrimBlank, "");
    },

    reverse : function() {
        return Array.from(this).reverse().join('');
    },

    cleanBlank : function() {
        return this.isEmpty() ? "" : this.replace(RegexLibrary.BlankText, "");
    },

    isEmpty : function() {
        return this === "" || this.trim() === "";
    },

    startsWith : function(startString) {
        if (startString == null || startString.length === 0
            || this.length === 0 || startString.length > this.length) {
            return false;
        }
        return this.indexOf(startString) === 0;
    },

    endsWith : function(endString) {
        if (endString == null || endString.length === 0
            || this.length === 0 || endString.length > this.length) {
            return false;
        }

        return this.substr(this.length - endString.length) === endString;
    },

    isEmail : function() {
        return RegexLibrary.E_Mail.test(this);
    },

    isJSON : function() {
        let _string = this.replace(/\\["\\\/bfnrtu]/g, '@');
        _string = _string.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        _string = _string.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        return /^[\],:{}\s]*$/.test(_string);
    },

    parseJSON : function() {
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

    isColorCode : function() {
        return RegexLibrary.Color.test(this);
    },

    isXml : function() {
        return RegexLibrary.XML.test(this);
    },

    isHtml : function() {
        let _matchResult = this.isXml();
        if (_matchResult) {
            this.match(RegexLibrary.HtmlTag).forEach(_tagName => {
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
            });
        }
        return _matchResult;
    },

    parseXml : function() {
        let _xmlDoc = null;

        if (Comment.Browser.IE) {
            let _xmlDomVersions = ["MSXML.2.DOMDocument.6.0", "'MSXML.2.DOMDocument.3.0", "Microsoft.XMLDOM"];

            _xmlDomVersions.forEach(name => {
                if (_xmlDoc != null) {
                    try {
                        _xmlDoc = new ActiveXObject(name);
                        _xmlDoc.async = false;
                        _xmlDoc.loadXML(this);
                    } catch (e) {
                        _xmlDoc = null;
                    }
                }
            });

            if (_xmlDoc == null) {
                console.log(Cell.message("Core", "Data.Invalid.XML"));
            }
        } else {
            try {
                _xmlDoc = new DOMParser().parseFromString(this, "text/xml");
            } catch (e) {
                console.log(Cell.message("Core", "Data.Invalid.XML") + e);
            }
        }

        return _xmlDoc;
    },

    isNum : function() {
        return (this.match(RegexLibrary.Number) != null);
    },

    parseInt : function(radix = 10) {
        return parseInt(this, radix);
    },

    parseFloat : function() {
        return parseFloat(this);
    },

    setTitle : function() {
        document.title = this;
    },

    setKeywords : function() {
        let element = $$("keywords");
        if (element && element.length > 0) {
            element[0].setAttribute("content", this);
        }
    },

    setDescription : function() {
        let element = $$("description");
        if (element && element.length > 0) {
            element[0].setAttribute("content", this);
        }
    },

    encodeBase64 : function() {
        if (typeof btoa === "function") {
            return btoa(unescape(encodeURIComponent(this)));
        }
        return this.toByteArray().base64();
    },

    decodeBase64 : function() {
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

    encodeByRegExp : function () {
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

    decodeByRegExp : function () {
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

    toByteArray : function() {
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

    getBytes : function(littleEndian = true) {
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
    parseTime : function(utc = true) {
        let offset = 0;
        if (utc) {
            offset = (new Date().getTimezoneOffset() * 60 * 1000);
        }
        let _date = new Date();
        _date.setTime(this - offset);
        return _date;
    },

    toHex : function () {
        if (this >= 48 && this <= 57) {
            return this - 48;
        } else if (this >= 65 && this <= 90) {
            return 10 + this - 65;
        } else if (this >= 97 && this <= 122) {
            return 10 + this - 97;
        } else {
            return 0;
        }
    },

    safeRotateLeft : function(_count) {
        return (this << _count) | (this >>> (32 - _count));
    },

    safeRotateRight : function(_count) {
        return (this >>> _count) | (this << (32 - _count));
    },

    rotateRight : function(_count) {
        return this >>> _count;
    }
});

Object.extend(Date.prototype, {
    format : function(pattern = "MM/dd/yyyy") {
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
                let replaceValue = null;
                if (RegExp.$1.length === 1) {
                    replaceValue = Pattern[regex];
                } else {
                    replaceValue = (""+ Pattern[regex]);
                }
                if (RegExp.$1.length > replaceValue.length) {
                    for (let i = 0 ; i < (RegExp.$1.length - replaceValue.length) ; i++) {
                        replaceValue = "0" + replaceValue;
                    }
                }

                pattern = pattern.replace(RegExp.$1, replaceValue);
            }
        }

        return pattern;
    }
});

Object.extend(Array.prototype, {
    toHex : function(littleEndian = true) {
        let _result = "";
        for (let i = 0 ; i < this.length ; i++) {
            for (let j = 0 ; j < 4 ; j++) {
                if (littleEndian) {
                    _result += BASE16[(this[i] >> ((2 * j + 1) * 4)) & 0x0F] + BASE16[(this[i] >> ((2 * j) * 4)) & 0x0F];
                } else {
                    _result += BASE16[(this[i] >> (28 - ((2 * j) * 4))) & 0x0F] + BASE16[(this[i] >> (28 - ((2 * j + 1) * 4))) & 0x0F];
                }
            }
        }
        return _result;
    },

    base64 : function(padding = null) {
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
            _result += ((padding !== null) ? padding : BASE64[64]);
        }

        return _result;
    },

    toString : function() {
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

class HttpClient {
    constructor(url, options, paramters) {
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
        this._parameters = paramters;
        this._request = HttpClient._initialize(url, this._options);
        if (this._parameters && this._parameters.uploadFile) {
            let uploadEvent = Cell.uploadEvent();
            if (uploadEvent.onProgress) {
                this._request.upload.onprogress = uploadEvent.onProgress;
            }
            if (uploadEvent.onLoadStart) {
                this._request.upload.onloadstart = uploadEvent.onLoadStart;
            }
            if (uploadEvent.onLoadEnd) {
                this._request.upload.onloadend = uploadEvent.onLoadEnd;
            }
            if (uploadEvent.onError) {
                this._request.upload.onerror = uploadEvent.onError;
            }
            if (uploadEvent.onAbort) {
                this._request.upload.onabort = uploadEvent.onAbort;
            }
        }
    }

    addHeader(headerName, headerValue) {
        this._request.setRequestHeader(headerName, headerValue);
    }

    send() {
        this.addHeader("cache-control", "no-cache");
        this.addHeader("X-Requested-With", "XMLHttpRequest");
        let _jwtToken = sessionStorage.getItem("JWTToken");
        if (_jwtToken != null) {
            this.addHeader("Authorization", _jwtToken);
        }

        this._request.send(this._parameters);

        if (!this._options.asynchronous) {
            return HttpClient._parseResponse(this._request, this._options);
        }
    }

    static _parseResponse(_request, _options) {
        if (_options.onFinished) {
            _options.onFinished(_request);
        }

        if (Cell.developmentMode()) {
            console.log(Cell.message("Core", "HttpClient.Status.Code", _request.status));
        }

        if (_request.status === 200) {
            if (_options.onComplete) {
                return _options.onComplete(_request);
            }

            if (_options.elementId.length > 0 && $(_options.elementId)) {
                $(_options.elementId).data = _request.responseText;
            }
        } else if (_request.status === 301 || _request.status === 302 || _request.status === 307) {
            let _redirectPath = _request.getResponseHeader("Location");
            if (Cell.developmentMode()) {
                console.log(Cell.message("Core", "HttpClient.Redirect", _redirectPath));
            }
            if (_redirectPath.length !== 0) {
                let _newOption = {};
                Object.extend(_newOption, _options || {});
                _newOption.method = "GET";
                new HttpClient(_redirectPath, _newOption).send();
            }
        } else {
            if (_options.onError) {
                _options.onError(_request);
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
                    console.error(Cell.message("Core", "HttpClient.Request"));
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

class CellJS {
    constructor(Config = {}) {
        this._config = {
            developmentMode: false,
            //  Current language
            language : Comment.Language,
            //  Template Config
            templates : {
                //  Define list url address
                url : "",
                //  Verify data is same as current
                //  Options: See Cell.CRC.REGISTERED_ALGORITHMS()
                CRC : "CRC-16/KERMIT"
            },
            form : {
                encryptPassword : true,
                //  Form password encrypt method
                //  Options:    MD5/RSA/SHA1/SHA224/SHA256/SHA384/SHA512/SHA3_224/SHA3_256/SHA3_384/SHA3_512
                //              SHAKE128/SHAKE256/Keccak224/Keccak256/Keccak384/Keccak512
                encryptMethod : "MD5",
                convertDateTime : false
            },
            security : {
                //  RSA Key Config
                RSA : {
                    exponent : "",
                    modulus : "",
                    radix : 16,
                    keySize : 1024
                }
            },
            uploadEvent : {
                onProgress : null,
                onLoadStart : null,
                onLoadEnd : null,
                onError : null,
                onAbort : null
            }
        };
        Object.extend(this._config, Config);
        if (this._config.security.RSA.exponent.length > 0
            && this._config.security.RSA.modulus.length > 0 && Cell.hasOwnProperty("RSA")) {
            this._rsa = new Cell.RSA(this._config.security.RSA.exponent, this._config.security.RSA.modulus,
                this._config.security.RSA.radix, this._config.security.RSA.keySize);
        }
        this._resources = {};
        this._templates = {};
        if (((typeof this._config.templates.url) === 'string') && this._config.templates.url.length > 0) {
            new HttpClient(this._config.templates.url, {
                onComplete : function(_request) {
                    let _responseText = _request.responseText;
                    if (_responseText.isXml()) {
                        Array.from(_responseText.parseXml().documentElement.getElementsByTagName("template"))
                            .forEach(template => {
                                if (template.textContent && template.textContent.length > 0
                                    && template.hasAttribute("name")) {
                                    Cell.registerTemplate(template.getAttribute("name"),
                                        template.textContent.decodeByRegExp());
                                }
                            });
                    } else if (_responseText.isJSON()) {
                        let _jsonObj = _responseText.parseJSON()["templates"];
                        if (Array.isArray(_jsonObj)) {
                            _jsonObj.forEach(_jsonItem => {
                                if (_jsonItem.hasOwnProperty("name") && _jsonItem.hasOwnProperty("url")) {
                                    Cell.registerTemplate(_jsonItem["name"], _jsonItem["url"]);
                                }
                            });
                        }
                    } else {
                        console.log(Cell.message("Core", "Template.Unknown"));
                    }
                }
            }).send();
        }
    }

    developmentMode() {
        return this._config.developmentMode;
    }

    sendRequest(event, elementId) {
        if (!Comment.Browser.IE || Comment.Browser.IE11) {
            event.preventDefault();
            event.stopPropagation();
        }
        new HttpClient(event.target.getAttribute("href"), {
            elementId: elementId
        }).send();
        if (event.target.tagName.toLowerCase() === "a" && Comment.Browser.IE && !Comment.Browser.IE11) {
            return false;
        }
    }

    submitForm(event, formId = "", elementId = "") {
        if (!Comment.Browser.IE || Comment.Browser.IE11) {
            event.preventDefault();
            event.stopPropagation();
        }
        let _formElement = $(formId);
        if (_formElement) {
            new HttpClient(_formElement.action, {
                method : _formElement.method,
                elementId : elementId
            }, _formElement.formData()).send();
        }
    }

    uploadEvent() {
        return this._config.uploadEvent;
    }

    registerResources(bundle, resources = {}) {
        if ((typeof bundle) !== "string") {
            throw new Error(Cell.message("Core", "Multi.Bundle.Type"));
        }
        for (let language in resources) {
            let _resourceKey = this._resourceKey(bundle, language);
            if (this._resources.hasOwnProperty(_resourceKey)) {
                console.log(Cell.message("Core", "Multi.Resource.Override", _resourceKey));
            }
            this._resources[_resourceKey] = resources[language];
        }
    }

    registerTemplate(name, urlAddress) {
        if (Cell.developmentMode()) {
            console.log(Cell.message("Core", "Template.Register", name, urlAddress));
        }
        let _template = {
            urlAddress : urlAddress,
            content : null};
        if (this._templates.hasOwnProperty(name)) {
            console.log(Cell.message("Core", "Template.Exists", name));
        }
        this._templates[name] = _template;
    }

    bindUpdater(elementId, name, override) {
        let element = $(elementId);
        if (element) {
            if (this._templates.hasOwnProperty(name)) {
                Object.defineProperty(element, "data", {
                    set(data) {
                        if (element.tagName.toLowerCase() === "form") {
                            if (data.isJSON()) {
                                let _jsonData = data.parseJSON();
                                Array.from(element.getElementsByTagName("input"))
                                    .forEach(input => {
                                        if (_jsonData.hasOwnProperty(input.name)) {
                                            Render.processInput(_jsonData[input.name], input);
                                        }
                                    });
                            }
                        } else {
                            let _process = true;
                            if (element.bindData !== null) {
                                let _crc = new Cell.CRC(this._config.templates.CRC);
                                _crc.append(data.cleanBlank());
                                _process = _crc.finish() !== element.crc;
                            }
                            if (_process) {
                                let _template = Cell._templates[name];
                                if (_template.content === null) {
                                    new HttpClient(_template.urlAddress, {
                                        onComplete: function (_request) {
                                            let content = _request.responseText;
                                            if (content && content.isXml()) {
                                                _template.content = content.parseXml().documentElement;
                                                Cell._templates[name] = _template;
                                            }
                                            if (_template.content === null) {
                                                throw new Error(Cell.message("Core", "Template.Not.Exists", name));
                                            }
                                            Render.processRender(element, data, override, _template.content);
                                        }
                                    }).send();
                                } else {
                                    Render.processRender(element, data, override, _template.content);
                                }

                                let _crc = new Cell.CRC(this._config.templates.CRC);
                                _crc.append(data.cleanBlank());
                                element.crc = _crc.finish();
                                element.bindData = data;
                            }
                        }
                    }
                })
            } else {
                console.log(Cell.message("Core", "Template.Not.Exists", name));
            }
        } else {
            console.log(Cell.message("Core", "Element.Null.ID", elementId));
        }
    }

    message(bundle, key = "", ...args) {
        let _resourceKey = this._resourceKey(bundle, this._config.language);
        if (this._resources.hasOwnProperty(_resourceKey)) {
            if (this._resources[_resourceKey].hasOwnProperty(key)) {
                let _resource = this._resources[_resourceKey][key];
                for (let i = 0 ; i < args.length ; i++) {
                    _resource = _resource.replace("{" + i + "}", args[i]);
                }
                return _resource;
            }
        }
        return _resourceKey + "." + key;
    }

    language(language) {
        this._config.language = language;
    }

    _resourceKey(bundle = "", language) {
        if (typeof bundle === "string" && bundle.length > 0) {
            return bundle + "_" + language;
        }
        throw new Error(Cell.message("Core", "Multi.Bundle.Type"));
    }

    encryptPassword(password) {
        if (!this._config.form.encryptPassword) {
            return password;
        }
        if (this._config.form.encryptMethod === "RSA" && this._rsa !== null) {
            return this._rsa.encrypt(password);
        }
        let encryptor;
        switch (this._config.form.encryptMethod) {
            case "MD5":
                encryptor = Cell.MD5.newInstance();
                break;
            case "SHA1":
                encryptor = Cell.SHA1.newInstance();
                break;
            case "SHA224":
                encryptor = Cell.SHA224.newInstance();
                break;
            case "SHA256":
                encryptor = Cell.SHA256.newInstance();
                break;
            case "SHA384":
                encryptor = Cell.SHA384.newInstance();
                break;
            case "SHA512":
                encryptor = Cell.SHA512.newInstance();
                break;
            case "SHA3_224":
                encryptor = Cell.SHA3.SHA3_224();
                break;
            case "SHA3_256":
                encryptor = Cell.SHA3.SHA3_256();
                break;
            case "SHA3_384":
                encryptor = Cell.SHA3.SHA3_384();
                break;
            case "SHA3_512":
                encryptor = Cell.SHA3.SHA3_512();
                break;
            case "SHAKE128":
                encryptor = Cell.SHA3.SHAKE128();
                break;
            case "SHAKE256":
                encryptor = Cell.SHA3.SHAKE256();
                break;
            case "Keccak224":
                encryptor = Cell.SHA3.Keccak224();
                break;
            case "Keccak256":
                encryptor = Cell.SHA3.Keccak256();
                break;
            case "Keccak384":
                encryptor = Cell.SHA3.Keccak384();
                break;
            case "Keccak512":
                encryptor = Cell.SHA3.Keccak512();
                break;
            default:
                return password;
        }
        encryptor.append(password);
        return encryptor.finish();
    }

    convertDateTime(value) {
        return this._config.form.convertDateTime ? Date.parse(value) : value;
    }
}

(function() {
    if (typeof window.Cell === "undefined") {
        window.Cell = new CellJS(Config);
    }

    Cell.registerResources("Core", {
        "zh" : {
            "Multi.Bundle.Type" : "包的名称必须为字符串",
            "Multi.Resource.Override" : "覆盖已存在的多语言信息：{0}",
            "Element.Null.ID" : "无法找到对象，标识ID：{0}",
            "Element.Null.Name" : "无法找到对象，标识名称：{0}",
            "Element.Name.String" : "指定的对象名称必须为字符串",
            "Data.Invalid.JSON" : "解析JSON字符串错误，这不是一个正确的JSON字符串",
            "Data.Invalid.XML" : "解析XML字符串错误，不是一个正确的XML字符串",
            "HttpClient.Status.Code" : "请求状态代码为：{0}",
            "HttpClient.Redirect" : "请求跳转地址为：{0}",
            "HttpClient.Request" : "无法生成XMLHttpRequest对象",
            "Template.Unknown" : "读取到的模板注册列表格式不正确",
            "Template.Register" : "注册模板名称：{0}，读取地址：{1}",
            "Template.Exists" : "覆盖已存在的模板信息，模板名称：{0}",
            "Template.Not.Exists" : "模板未找到，模板名称：{0}"
        },
        "en" : {
            "Multi.Bundle.Type" : "Type of bundle name must be string",
            "Multi.Resource.Override" : "Override resource key: {0}",
            "Element.Null.ID" : "Can't found target element, Element ID: {0}",
            "Element.Null.Name" : "Can't found target element, Element Name: {0}",
            "Element.Name.String" : "Name of target element must be a string",
            "Data.Invalid.JSON" : "Parse JSON error，given string was not a valid JSON string",
            "Data.Invalid.XML" : "Parse XML error, given string was not a valid XML string",
            "HttpClient.Status.Code" : "Response Status Code：{0}",
            "HttpClient.Redirect" : "Redirect Path：{0}",
            "HttpClient.Request" : "Generate XMLHttpRequest Instance Failed",
            "Template.Unknown" : "Type of template define list invalid.",
            "Template.Register" : "Register template, name: {0}，url address: {1}",
            "Template.Exists" : "Override exists template define, template name: {0}",
            "Template.Not.Exists" : "Template define not found, template name: {0}"
        },
    });
})();

class Render {
    static ATTRIBUTE = ["iterator", "timeformat", "utc", "elementid"];
    constructor() {
    }

    static processRender(element, data, override = true, template) {
        if (template == null) {
            return;
        }
        if (override) {
            element.clearChildNodes();
        }

        if (!data.isJSON()) {
            throw new Error(Cell.message("Core", ""));
        }

        let jsonData = data.parseJSON(), _childList = template.children, _length = _childList.length , i;
        for (i = 0 ; i < _length ; i++) {
            if (_childList[i].hasAttribute("iterator")) {
                let _dataName = _childList[i].getAttribute("iterator");
                _dataName = _dataName.substring(1, _dataName.length - 1).trim();
                jsonData[_dataName].forEach(jsonItem => {
                    Render.processBasicElement(element,
                        Render.processTemplate(_childList[i], jsonItem).outerHTML, false);
                });
            } else {
                Render.processBasicElement(element,
                    Render.processTemplate(_childList[i], jsonData).outerHTML, false);
            }
        }
    }

    static cloneTemplate(template, jsonData) {
        let _node = template.cloneNode(false);
        template.getAttributeNames().forEach(attrName => {
            if (Render.ATTRIBUTE.indexOf(attrName.toLowerCase()) === -1) {
                if (attrName.toLowerCase() !== "onclick" || !_node.hasAttribute(attrName)) {
                    let _attrValue = template.getAttribute(attrName);
                    if (_attrValue !== null) {
                        _attrValue = _attrValue.trim();
                        let paramName;
                        while ((paramName = Render.match(_attrValue)) !== null) {
                            _attrValue = _attrValue.replace(paramName,
                                jsonData[paramName.substring(1, paramName.length - 1).trim()] || "");
                        }
                        if (attrName === "value" && _node.tagName === "input" && _attrValue.isNum()) {
                            if (_node.getAttribute("type").toLowerCase() === "date") {
                                _attrValue = _attrValue.parseInt().parseTime().format("yyyy-MM-dd");
                            } else if (_node.getAttribute("type").toLowerCase() === "time") {
                                _attrValue = _attrValue.parseInt().parseTime().format("HH:mm");
                            } else if (_node.getAttribute("type").toLowerCase() === "datetime-local") {
                                _attrValue = _attrValue.parseInt().parseTime().format("yyyy-MM-ddTHH:mm");
                            }
                        }
                        _node.setAttribute(attrName, _attrValue);
                    }
                }
            } else {
                if (attrName.toLowerCase() === "timeformat") {
                    _node.convert = true;
                    _node.pattern = _node.getAttribute(attrName).trim();
                }
                if (attrName.toLowerCase() === "utc") {
                    _node.utc = true;
                }
                if (attrName.toLowerCase() === "elementid") {
                    _node.setAttribute("onClick", "Cell.sendRequest(event, '" + _node.getAttribute(attrName).trim() + "');");
                }
                _node.removeAttribute(attrName);
            }
        });
        return _node;
    }

    static processTemplate(template, jsonData) {
        let _node = Render.cloneTemplate(template, jsonData);
        let _childList = template.children, _length = _childList.length , i;
        if (_length > 0) {
            for (i = 0 ; i < _length ; i++) {
                if (_childList[i].hasAttribute("iterator")) {
                    let _dataName = _childList[i].getAttribute("iterator");
                    let _child = Render.cloneTemplate(_childList[i], jsonData);
                    jsonData[_dataName.substring(1, _dataName.length - 1).trim()].forEach(jsonItem => {
                        _node.appendChild(Render.processTemplate(_childList[i], jsonItem, false));
                    });
                    _node.appendChild(_child);
                } else {
                    _node.appendChild(Render.processTemplate(_childList[i], jsonData));
                }
            }
        } else if (template.textContent.length > 0) {
            let _content = template.textContent.trim(), paramName;
            if (_content.length > 0) {
                while ((paramName = Render.match(_content)) !== null) {
                    _content = _content.replace(paramName,
                        jsonData[paramName.substring(1, paramName.length - 1).trim()] || "");
                }
                Render.processBasicElement(_node, _content, true);
            }
        } else if (Array.isArray(jsonData)) {
            jsonData.forEach(jsonItem => {
                Render.processBasicElement(_node, jsonItem, false);
            });
        } else {
            Render.processBasicElement(_node, jsonData, false);
        }


        return _node;
    }

    static processInput(data, element) {
        if (element.getAttribute("type") === null) {
            return;
        }

        let _type = element.getAttribute("type").toLowerCase();
        switch (_type) {
            case "checkbox":
            case "radio":
                $$(element.name())
                    .filter(_element => _element.getAttribute("type") === _type)
                    .forEach(_element => {
                        _element.checked = (_element.value() !== data);
                    });
                break;
            case "color":
                element.value = data.isColorCode() ? data : element.value;
                break;
            case "email":
                element.value = data.isEmail() ? data : element.value;
                break;
            case "image":
                element.src = data;
                break;
            case "date":
                if (data.isNum()) {
                    element.value = data.parseInt().parseTime().format("yyyy-MM-dd");
                } else {
                    element.value = data;
                }
                break;
            case "time":
                if (data.isNum()) {
                    element.value = data.parseInt().parseTime().format("HH:mm");
                } else {
                    element.value = data;
                }
                break;
            case "datetime-local":
                if (data.isNum()) {
                    element.value = data.parseInt().parseTime().format("yyyy-MM-ddTHH:mm");
                } else {
                    element.value = data;
                }
                break;
            case "file":
            case "password":
                //  Ignore for data bind
                break;
            default:
                element.value = data;
                break;

        }
    }

    static appendOptions(element, dataList) {
        dataList.forEach(dataItem => {
            let _option = document.createElement("option");
            _option.value = dataItem["value"];
            _option.text = dataItem["text"];
            let _checked = dataItem["checked"];
            if (_checked === "true" || ((typeof _checked) === "boolean") && _checked) {
                _option.checked = "checked";
            }
            element.options.add(_option);
        });
    }

    static match(content) {
        let startIndex = content.indexOf('{'), endIndex = content.indexOf('}');
        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
            return null;
        }
        return content.substring(startIndex, endIndex + 1);
    }

    static processBasicElement(element, data, override) {
        if (element.convert && data.isNum()) {
            let _date = data.parseInt().parseTime(element.utc != null ? element.utc : false);
            data = _date.format(element.pattern != null ? element.pattern : "MM/dd/yyyy");
        }
        switch (element.tagName.toLowerCase()) {
            case "select":
            case "datalist":
                if (override) {
                    element.clearChildNodes();
                }
                Render.appendOptions(element, data.parseJSON());
                break;
            case "input":
                Render.processInput(data, element);
                break;
            default:
                if ((typeof data) === "string") {
                    element.innerHTML = override ? data : (element.innerHTML + data);
                }
                break;
        }
    }
}