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
 * [New] Send Ajax Request
 * [New] Encode form data
 * [New] Template Render
 * [New] Multilingual Support
 * [New] Core CellJS
 *
 */
'use strict';

import HttpClient from "../commons/HttpClient.js";
import RenderProcessor from "../render/Render.js";

class CellJS {
    constructor() {
        this._config = {
            developmentMode: false,
            templates : "",
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
        Object.extend(this._config, (Config || {}));
        //  Freeze config
        Object.freeze(this._config);
        this._resources = {};
        this._components = {};

        if (this._config.darkMode.enabled && Comment.GPS) {
            navigator.geolocation.getCurrentPosition(function (position) {
                Cell.registerDarkMode(position.coords.longitude, position.coords.latitude);
            });
        }
        this._darkMode = false;
        this._rsaPrivate = null;
        this._rsaPublic = null;
    }

    init() {
        this.Render = new RenderProcessor();
        this.Render.init(this._config.templates);
        this.language(this._config.i18n.language);
        if (this._config.security.RSA.PrivateKey.exponent.length > 0
            && this._config.security.RSA.PrivateKey.modulus.length > 0) {
            this._rsaPrivate = new Cell.RSA(this._config.security.RSA.PrivateKey);
        }
        if (this._config.security.RSA.PublicKey.exponent.length > 0
            && this._config.security.RSA.PublicKey.modulus.length > 0) {
            this._rsaPublic = new Cell.RSA(this._config.security.RSA.PublicKey);
        }
    }

    developmentMode() {
        return this._config.developmentMode;
    }

    sendRequest(event) {
        if (!Comment.Browser.IE || Comment.Browser.IE11) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.target.dataset.disabled == null || event.target.dataset.disabled === "false") {
            new HttpClient(event.target.getAttribute("href"), {
                elementId: event.target.dataset.elementId
            }).send();
        }
        if (event.target.tagName.toLowerCase() === "a" && Comment.Browser.IE && !Comment.Browser.IE11) {
            return false;
        }
    }

    submitForm(event) {
        if (!Comment.Browser.IE || Comment.Browser.IE11) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (event.target.dataset.disabled == null || event.target.dataset.disabled === "false") {
            let _formElement = $(event.target.dataset.formId);
            if (_formElement && _formElement.validate()) {
                new HttpClient(_formElement.action, {
                    method : _formElement.method,
                    elementId : _formElement.dataset.elementId,
                    onCreate: openCover,
                    onFinished: closeCover
                }).send(_formElement.formData());
            }
        }
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

    loadResource(bundle = "") {
        let _url = this._config.i18n.resPath;
        _url += this._config.i18n.resPath.endsWith("/") ? "" : "/";
        _url += bundle + "/" + this._language + ".json";
        this._resources[bundle] = new HttpClient(_url, {
            asynchronous: false,
            onComplete : function (_request) {
                let _responseText = _request.responseText;
                return _responseText.isJSON ? _responseText.parseJSON() : {};
            },
            onError : function (_request) {
                return {};
            }
        }).send();
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

    language(language) {
        if (this._language === language) {
            return;
        }
        this._language = language;
        this._resources = {};
        //  Load Core Resource
        this.loadResource("Core");
        for (let bundle in this._components) {
            if (this._components.hasOwnProperty(bundle) && this._components[bundle]) {
                this.loadResource(bundle)
            }
        }
    }

    registerComponent(bundle, component, loadResource = false) {
        if (Object.hasOwnProperty(bundle)) {
            return;
        }
        this[bundle] = component;
        if (!this._components.hasOwnProperty(bundle)) {
            this._components[bundle] = loadResource;
            if (loadResource) {
                this.loadResource(bundle);
            }
        }
    }

    encryptPassword(password) {
        if (!this._config.form.encryptPassword) {
            return password;
        }
        if (this._config.form.encryptMethod === "RSA" && this._rsaPrivate !== null) {
            return this._rsaPrivate.encrypt(password);
        }
        return this.calculateData(this._config.form.encryptMethod, password);
    }

    calculateData(method, data, key = "") {
        let encryptor;
        if (method.startsWith("CRC")) {
            encryptor = Cell.CRC.newInstance(method);
        } else {
            switch (method) {
                case "MD5":
                    encryptor = Cell.MD5.newInstance(key);
                    break;
                case "SHA1":
                    encryptor = Cell.SHA.SHA1(key);
                    break;
                case "SHA224":
                    encryptor = Cell.SHA.SHA224(key);
                    break;
                case "SHA256":
                    encryptor = Cell.SHA.SHA256(key);
                    break;
                case "SHA384":
                    encryptor = Cell.SHA.SHA384(key);
                    break;
                case "SHA512":
                    encryptor = Cell.SHA.SHA512(key);
                    break;
                case "SHA512_224":
                    encryptor = Cell.SHA.SHA512_224(key);
                    break;
                case "SHA512_256":
                    encryptor = Cell.SHA.SHA512_256(key);
                    break;
                case "SHA3_224":
                    encryptor = Cell.SHA.SHA3_224(key);
                    break;
                case "SHA3_256":
                    encryptor = Cell.SHA.SHA3_256(key);
                    break;
                case "SHA3_384":
                    encryptor = Cell.SHA.SHA3_384(key);
                    break;
                case "SHA3_512":
                    encryptor = Cell.SHA.SHA3_512(key);
                    break;
                case "SHAKE128":
                    encryptor = Cell.SHA.SHAKE128();
                    break;
                case "SHAKE256":
                    encryptor = Cell.SHA.SHAKE256();
                    break;
                case "Keccak224":
                    encryptor = Cell.SHA.Keccak224(key);
                    break;
                case "Keccak256":
                    encryptor = Cell.SHA.Keccak256(key);
                    break;
                case "Keccak384":
                    encryptor = Cell.SHA.Keccak384(key);
                    break;
                case "Keccak512":
                    encryptor = Cell.SHA.Keccak512(key);
                    break;
                default:
                    return data;
            }
        }
        encryptor.append(data);
        return encryptor.finish();
    }

    convertDateTime(value = "") {
        if (this._config.form.convertDateTime) {
            let milliseconds = Date.parse(value);
            if (this._config.form.utcDateTime) {
                milliseconds += (new Date().getTimezoneOffset() * 60 * 1000);
            }
            return milliseconds;
        }
        return value;
    }

    enableElement(element) {
        return function() {
            element.dataset.disabled = "false";
            if (Comment.Browser.IE) {
                document.body.style.overflow = "hidden";
                document.body.style.overflow = "auto";
            }
        }
    }

    static openCover() {
        document.querySelectorAll("div[data-cover-window='true']")
            .forEach(element => {
                if (element.getStyle().length === 0) {
                    let _cssText = "width: 100%; height: 100%; position: absolute; top: 0; left: 0;";
                    _cssText += ("background-color: " + element.dataset.backgroundColor + "; ");
                    _cssText += ("opacity: " + element.dataset.opacity + "; ");
                    _cssText += ("z-index: " + element.dataset.zIndex + ";");
                    element.setStyle(_cssText);
                }
                element.show();
                document.body.style.overflow = "hidden";
            });
    }

    static closeCover() {
        document.querySelectorAll("div[data-cover-window='true']").forEach(element => element.hide());
        document.body.style.overflow = "auto";
    }

    static $() {
        if (arguments.length <= 0) {
            return [];
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
}

const DEFAULT_PROCESSORS = {
    "*[data-bind-updater]" : function (element) {
        if (element.id && element.id.length > 0) {
            let name = element.dataset.template || "", override = (element.dataset.override === "true");
            if (name.length > 0 && !Cell.Render.hasTemplate(name)) {
                throw new Error(Cell.message("Core", "Template.Not.Exists", name));
            }
            Object.defineProperty(element, "data", {
                set(data) {
                    if (!data.isJSON()) {
                        throw new Error(Cell.message("Core", "Data.Invalid.JSON"));
                    }

                    let _jsonData = data.parseJSON();
                    if (element.tagName.toLowerCase() === "form") {
                        element.querySelectorAll("input")
                            .forEach(input => {
                                let _name = input.getAttribute("name");
                                if (_name && _jsonData.hasOwnProperty(_name)) {
                                    Cell.Render.processInput(_jsonData[_name], input);
                                }
                            });
                        element.querySelectorAll("select, datalist")
                            .forEach(select => {
                                let _name = select.getAttribute("name");
                                if (_name && _jsonData.hasOwnProperty(_name)) {
                                    select.setAttribute("value", _jsonData[_name]);
                                }
                                if (select.hasAttribute("data-iterator")) {
                                    let _paramName = select.getAttribute("data-iterator");
                                    if (_jsonData.hasOwnProperty(_paramName)) {
                                        select.clearChildNodes();
                                        Cell.Render.appendOptions(select, _jsonData[_paramName]);
                                    }
                                }
                            });
                    } else {
                        Cell.renderTemplate(element, _jsonData, override);
                    }
                    Cell.Render.processOnload();
                    if (_jsonData.hasOwnProperty("title")) {
                        _jsonData["title"].setTitle();
                    }
                    if (_jsonData.hasOwnProperty("keywords")) {
                        _jsonData["keywords"].setKeywords();
                    }
                    if (_jsonData.hasOwnProperty("description")) {
                        _jsonData["description"].setDescription();
                    }
                    if (element.dataset.floatWindow) {
                        openCover();
                        element.show();
                        if (_jsonData.hasOwnProperty("timeout") && _jsonData["timeout"].isNum()) {
                            setTimeout(function() {
                                element.hide();
                                closeCover();
                            }, _jsonData["timeout"].parseInt());
                        }
                    }
                }
            });
        }
    },
    "*[data-float-window='true'" : function (element) {
        element.hide();
    },
    "*[href][data-element-id]" : function (element) {
        if (element.dataset.elementId !== null && element.hasAttribute("href")) {
            element.addEvent("click", function(event) {
                Cell.sendRequest(event);
            });
        }
        if (element.dataset.disabled === "true" && element.dataset.activeDelay
            && element.dataset.activeDelay.isNum()) {
            setTimeout(Cell.enableElement(element), element.dataset.activeDelay.parseInt());
        }
    },
    "*[data-sort-child='true']" : function (element) {
        if (element.dataset.tagName && element.dataset.elementId && element.dataset.sortItem) {
            element.addEvent("click", function(event) {
                let _sortDesc = event.target.dataset.sortType === undefined ? false
                    : event.target.dataset.sortType.toLowerCase() === "true";
                $(event.target.dataset.elementId).sortChildrenBy(event.target.dataset.tagName,
                    event.target.dataset.sortItem, _sortDesc);
            });
        }
    },
    "a[data-form-id], button[data-form-id]" : function (element) {
        if (element.dataset.formId !== null) {
            element.addEvent("click", function(event) {
                Cell.submitForm(event);
            });
        }
    },
    "input[data-validate='true'], select[data-validate='true'], textarea[data-validate='true']" : function (element) {
        element.addEvent("blur", function(event) {
            event.target.validate();
        });
    }
};

(function() {
    if (typeof window.Cell === "undefined") {
        window.$ = CellJS.$;
        window.openCover = CellJS.openCover;
        window.closeCover = CellJS.closeCover;
        window.Cell = new CellJS();
        window.Cell.init();
    }

    let _onload = window.onload;
    window.onload = function () {
        Cell.Render.registerUIProcessors(DEFAULT_PROCESSORS);
        if (_onload) {
            _onload.apply(this);
        }
        Cell.Render.processOnload();
    };
})();