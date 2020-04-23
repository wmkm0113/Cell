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
 * [New] Template Render Processor
 *
 */
'use strict';

export default class RenderProcessor {
    constructor() {
        this._templates = {};
        this._processor = {};
    }

    init(defineUrl = "") {
        if (defineUrl.length > 0) {
            Cell.Ajax(defineUrl, {}).then(responseText => {
                if (responseText.isXml()) {
                    Array.from(responseText.parseXml().getElementsByTagName("template"))
                        .forEach(template => {
                            if (template.textContent && template.textContent.length > 0
                                && template.hasAttribute("name")) {
                                this.registerTemplate(template.getAttribute("name"),
                                    template.textContent.decodeByRegExp());
                            }
                        });
                } else if (responseText.isJSON()) {
                    let _jsonObj = responseText.parseJSON()["templates"];
                    if (Array.isArray(_jsonObj)) {
                        _jsonObj.forEach(_jsonItem => {
                            if (_jsonItem.hasOwnProperty("name") && _jsonItem.hasOwnProperty("url")) {
                                this.registerTemplate(_jsonItem["name"], _jsonItem["url"]);
                            }
                        });
                    }
                } else {
                    console.log(Cell.message("Core", "Template.Unknown"));
                }
                this.registerUIProcessors(DEFAULT_PROCESSORS);
                this.processOnload();
            }).catch(errorMsg => {
                console.log(errorMsg);
            });
        }
    }

    registerUIProcessor(selectors, callback) {
        if (this._processor.hasOwnProperty(selectors)) {
            console.log(Cell.message("UI", "UI.Registered.Processor", selectors));
        } else {
            this._processor[selectors] = callback;
        }
    }

    registerUIProcessors(processors = {}) {
        for (let selectors in processors) {
            if (processors.hasOwnProperty(selectors)) {
                if (this._processor.hasOwnProperty(selectors)) {
                    console.log(Cell.message("UI", "UI.Registered.Processor", selectors));
                } else {
                    this._processor[selectors] = processors[selectors];
                }
            }
        }
    }

    processOnload() {
        for (let selectors in this._processor) {
            let callback = this._processor[selectors];
            document.querySelectorAll(selectors).forEach(element => {
                if (element.dataset.renderProcessed !== "true") {
                    callback.call(this, element);
                    element.dataset.renderProcessed = "true";
                }
            });
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

    hasTemplate(name) {
        return this._templates.hasOwnProperty(name);
    }

    renderTemplate(element, jsonData, override) {
        let _template = this._templates[element.dataset.template];
        if (_template.content === null) {
            Cell.Ajax(_template.urlAddress)
                .then(responseText => {
                    if (responseText && responseText.isHtml()) {
                        _template.content = responseText.parseXml();
                        Cell.Render._templates[element.dataset.template] = _template;
                    }
                    if (_template.content === null) {
                        throw new Error(Cell.message("Core", "Template.Not.Exists", name));
                    }
                    this.processRender(element, jsonData, override, _template.content);
                })
                .catch(errorMsg => {
                    if (Cell.developmentMode()) {
                        console.log(errorMsg);
                    }
                });
        } else {
            this.processRender(element, jsonData, override, _template.content);
        }
    }

    processRender(element, jsonData, override = true, template) {
        if (template == null) {
            return;
        }
        if (override) {
            element.clearChildNodes();
        }

        let _childList = template.childList(), _length = _childList.length , i;
        for (i = 0 ; i < _length ; i++) {
            if (_childList[i].hasAttribute("data-iterator")) {
                let _dataName = _childList[i].getAttribute("data-iterator");
                _dataName = _dataName.substring(1, _dataName.length - 1).trim();
                jsonData[_dataName].forEach(jsonItem => {
                    let _childElement = Cell.Render.processTemplate(_childList[i], jsonItem);
                    _childElement.removeAttribute("data-iterator");
                    Cell.Render.processBasicElement(element, _childElement.render(), false);
                });
            } else {
                Cell.Render.processBasicElement(element,
                    Cell.Render.processTemplate(_childList[i], jsonData).render(), false);
            }
        }
    }

    cloneTemplate(template, jsonData) {
        let _node = template.cloneNode(false);
        template.attrNames().forEach(attrName => {
            let _attrValue = template.getAttribute(attrName);
            if (_attrValue !== null) {
                _attrValue = _attrValue.trim();
                let paramName;
                while ((paramName = Cell.Render.match(_attrValue)) !== null) {
                    _attrValue = _attrValue.replace(paramName,
                        jsonData[paramName.substring(1, paramName.length - 1).trim()] || "");
                }
                _node.setAttribute(attrName, _attrValue);
            }
        });
        return _node;
    }

    processTemplate(template, jsonData) {
        let _node = Cell.Render.cloneTemplate(template, jsonData);
        let _childList = template.childList(), _length = _childList.length , i;
        if (_length > 0) {
            for (i = 0 ; i < _length ; i++) {
                if (_childList[i].hasAttribute("data-iterator")) {
                    let _dataName = _childList[i].getAttribute("data-iterator");
                    jsonData[_dataName.substring(1, _dataName.length - 1).trim()].forEach(jsonItem => {
                        let _child = Cell.Render.processTemplate(_childList[i], jsonItem, false);
                        _child.removeAttribute("data-iterator");
                        _node.appendChild(_child);
                    });
                } else {
                    _node.appendChild(Cell.Render.processTemplate(_childList[i], jsonData));
                }
            }
        } else if (template.textContent.length > 0) {
            let _content = template.textContent.trim(), paramName;
            if (_content.length > 0) {
                while ((paramName = Cell.Render.match(_content)) !== null) {
                    _content = _content.replace(paramName,
                        jsonData[paramName.substring(1, paramName.length - 1).trim()] || "");
                }
                Cell.Render.processBasicElement(_node, _content, true);
            }
        } else if (Array.isArray(jsonData)) {
            jsonData.forEach(jsonItem => {
                Cell.Render.processBasicElement(_node, jsonItem, false);
            });
        } else {
            Cell.Render.processBasicElement(_node, jsonData, false);
        }

        return _node;
    }

    processInput(data, element) {
        if (element.getAttribute("type") === null) {
            return;
        }

        let _type = element.getAttribute("type").toLowerCase();
        switch (_type) {
            case "checkbox":
            case "radio":
                let _name = element.getAttribute("name");
                document.querySelectorAll("input[type='" + _type + "'][name='" + _name + "']")
                    .forEach(_element => {
                        let _value = _element.getAttribute("value");
                        if (Array.isArray(data)) {
                            _element.checked = (data.indexOf(_value) !== -1);
                        } else {
                            _element.checked = (_value === data);
                        }
                    });
                break;
            case "color":
                if (((typeof data) === "string") && data.isColorCode()) {
                    element.value = data;
                    // element.setAttribute("value", data);
                }
                break;
            case "email":
                if (((typeof data) === "string") && data.isEmail()) {
                    element.value = data;
                    // element.setAttribute("value", data);
                }
                break;
            case "image":
                element.src = data;
                break;
            case "date":
                if (((typeof data) === "string") && data.isNum()) {
                    element.setAttribute("value", data.parseInt().parseTime().format("yyyy-MM-dd"));
                } else {
                    element.setAttribute("value", data);
                }
                break;
            case "time":
                if (((typeof data) === "string") && data.isNum()) {
                    element.setAttribute("value", data.parseInt().parseTime().format("HH:mm"));
                } else {
                    element.setAttribute("value", data);
                }
                break;
            case "datetime-local":
                if (((typeof data) === "string") && data.isNum()) {
                    element.setAttribute("value", data.parseInt().parseTime().format("yyyy-MM-ddTHH:mm"));
                } else {
                    element.setAttribute("value", data);
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

    appendOptions(element, dataList) {
        let _currentValue = element.hasAttribute("value") ? element.getAttribute("value") : "";
        dataList.forEach(dataItem => {
            let _option = document.createElement("option");
            _option.value = dataItem["value"];
            _option.text = dataItem["text"];
            _option.selected = _currentValue === _option.value;
            element.options.add(_option);
        });
    }

    match(content) {
        let startIndex = content.indexOf('{'), endIndex = content.indexOf('}');
        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
            return null;
        }
        return content.substring(startIndex, endIndex + 1);
    }

    processBasicElement(element, data, override) {
        if (element.hasAttribute("data-pattern") && data.isNum()) {
            let _date = data.parseInt().parseTime(element.hasAttribute("data-utc"));
            data = _date.format(element.getAttribute("data-pattern"));
        }
        switch (element.tagName.toLowerCase()) {
            case "select":
            case "datalist":
                if (element.hasAttribute("data-iterator")) {
                    let _dataName = element.getAttribute("data-iterator");
                    _dataName = _dataName.substring(1, _dataName.length - 1).trim();
                    if (data.hasOwnProperty(_dataName)) {
                        if (override) {
                            element.clearChildNodes();
                        }
                        Cell.Render.appendOptions(element, data[_dataName]);
                    }
                }
                break;
            case "input":
                let _value = element.getAttribute("value");
                if ((_value == null || _value.length === 0) && element.hasAttribute("name")) {
                    _value = data[element.getAttribute("name")];
                }
                Cell.Render.processInput(_value, element);
                break;
            default:
                if ((typeof data) === "string") {
                    element.innerHTML = override ? data : (element.innerHTML + data);
                }
                break;
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
                        Cell.Render.renderTemplate(element, _jsonData, override);
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
            element.bindEvent("click", function(event) {
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
            element.bindEvent("click", function(event) {
                let _sortDesc = event.target.dataset.sortType === undefined ? false
                    : event.target.dataset.sortType.toLowerCase() === "true";
                $(event.target.dataset.elementId).sortChildrenBy(event.target.dataset.tagName,
                    event.target.dataset.sortItem, _sortDesc);
            });
        }
    },
    "a[data-form-id], button[data-form-id]" : function (element) {
        if (element.dataset.formId !== null) {
            element.bindEvent("click", function(event) {
                Cell.submitForm(event);
            });
        }
    },
    "input[data-validate='true'], select[data-validate='true'], textarea[data-validate='true']" : function (element) {
        element.bindEvent("blur", function(event) {
            event.target.validate();
        });
    }
};
