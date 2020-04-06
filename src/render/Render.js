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

import HttpClient from "../commons/HttpClient.js";

export default class RenderProcessor {
    constructor() {
        this._templates = {};
        this._processor = {};
    }

    init(defineUrl = "") {
        if (defineUrl.length > 0) {
            new HttpClient(defineUrl, {
                onComplete : function(_request) {
                    let _responseText = _request.responseText;
                    if (_responseText.isXml()) {
                        Array.from(_responseText.parseXml().getElementsByTagName("template"))
                            .forEach(template => {
                                if (template.textContent && template.textContent.length > 0
                                    && template.hasAttribute("name")) {
                                    Cell.Render.registerTemplate(template.getAttribute("name"),
                                        template.textContent.decodeByRegExp());
                                }
                            });
                    } else if (_responseText.isJSON()) {
                        let _jsonObj = _responseText.parseJSON()["templates"];
                        if (Array.isArray(_jsonObj)) {
                            _jsonObj.forEach(_jsonItem => {
                                if (_jsonItem.hasOwnProperty("name") && _jsonItem.hasOwnProperty("url")) {
                                    Cell.Render.registerTemplate(_jsonItem["name"], _jsonItem["url"]);
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
        let _template = Cell._templates[element.dataset.template];
        if (_template.content === null) {
            new HttpClient(_template.urlAddress, {
                onComplete: function (_request) {
                    let content = _request.responseText;
                    if (content && content.isHtml()) {
                        _template.content = content.parseXml();
                        Cell.Render._templates[element.dataset.template] = _template;
                    }
                    if (_template.content === null) {
                        throw new Error(Cell.message("Core", "Template.Not.Exists", name));
                    }
                    Cell.Render.processRender(element, jsonData, override, _template.content);
                }
            }).send();
        } else {
            Cell.Render.processRender(element, jsonData, override, _template.content);
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
