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
"use strict";

import {AbstractElement} from "./element.js";

/**
 * Base element of input/select/textarea
 */
class InputElement extends AbstractElement {
    constructor() {
        super();
    }

    _renderElement(tagName = "") {
        if (tagName.length > 0) {
            let element = document.createElement(tagName);
            element.setAttribute("slot", "element");
            this.appendChild(element);
            return element;
        }
        return null;
    }
}

class IntervalInput extends AbstractElement {
    constructor(type = "") {
        super();
        this.type = (type == null) ? "" : type;
        this.elementGroup = null;
        this.beginElement = null;
        this.endElement = null;
    }

    renderElement(data) {
        if (data.hasOwnProperty("id") && data.hasOwnProperty("beginName") && data.hasOwnProperty("endName")) {
            Object.keys(data).forEach(key => {
                switch (key) {
                    case "tips":
                    case "textContent":
                    case "beginName":
                    case "beginValue":
                    case "endName":
                    case "endValue":
                        this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key]);
                        break;
                    default:
                        this.setAttribute(key, data[key]);
                        break;
                }
            });
            this._render();
        }
    }

    connectedCallback() {
        super._removeProgress();
        this._render();
    }

    _render() {
        if (this.dataset.beginName === undefined || this.dataset.endName === undefined) {
            return;
        }
        super._renderLabel();
        super._addSlot("elements");
        if (this.elementGroup === null) {
            this.elementGroup = document.createElement("div");
            this.elementGroup.setAttribute("slot", "elements");
            this.appendChild(this.elementGroup);
        }
        if (this.beginElement === null) {
            this.beginElement = document.createElement("input");
            this.elementGroup.appendChild(this.beginElement);
        }
        this.beginElement.setAttribute("type", this.type);
        this.beginElement.setAttribute("name", this.dataset.beginName);
        if (this.dataset.beginValue !== undefined) {
            this.beginElement.setAttribute("value", this.dataset.beginValue);
        }
        if (this.endElement === null) {
            this.endElement = document.createElement("input");
            this.elementGroup.appendChild(this.endElement);
        }
        this.endElement.setAttribute("type", this.type);
        this.endElement.setAttribute("name", this.dataset.endName);
        if (this.dataset.endValue !== undefined) {
            this.endElement.setAttribute("value", this.dataset.endValue);
        }
        if (this.querySelector("span[id='concat']") === null) {
            let concatElement = document.createElement("span");
            concatElement.setAttribute("id", "concat");
            concatElement.innerText = "-";
            this.elementGroup.insertBefore(concatElement, this.endElement);
        }
    }
}

/**
 * Base element of input, default input type: text
 */
class BaseInput extends InputElement {
    constructor(elementType = "text") {
        super();
        this._elementType = elementType;
    }

    renderElement(data) {
        if (data.hasOwnProperty("id") && data.hasOwnProperty("name")) {
            Object.keys(data).forEach(key => {
                if (key.toLowerCase() === "value") {
                    if (this._elementType.toLowerCase() !== "password") {
                        this.setAttribute("value", data[key]);
                    }
                } else {
                    this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key]);
                }
            });
            this.connectedCallback();
        }
    }

    get disabled() {
        return this._checkAttribute("disabled");
    }

    set disabled(value) {
        if (value !== undefined) {
            if (Boolean(value)) {
                this._updateAttribute("disabled", value);
            } else {
                this._removeAttribute("disabled");
            }
        }
    }

    get value() {
        return this._checkAttribute("value");
    }

    set value(value) {
        if (this._elementType !== "password" && this._elementType !== "file") {
            this._updateAttribute("value", value);
        }
    }

    get checked() {
        if (this._elementType === "checkbox" || this._elementType === "radio") {
            return this._checkAttribute("checked");
        }
        return false;
    }

    set checked(value) {
        if (this._elementType === "checkbox" || this._elementType === "radio") {
            if (value !== undefined && Boolean(value)) {
                this._updateAttribute("checked", "");
            } else {
                this._removeAttribute("checked");
            }
        }
    }

    addEventListener(type, listener, options) {
        let inputElement = this.querySelector("input");
        if (inputElement) {
            inputElement.addEventListener(type, listener, options);
        } else {
            super.addEventListener(type, listener, options);
        }
    }

    _checkAttribute(attributeName) {
        let inputElement = this.querySelector("input");
        if (inputElement) {
            return inputElement[attributeName];
        }
        return false;
    }

    _updateAttribute(attributeName, attributeValue) {
        let inputElement = this.querySelector("input");
        if (inputElement) {
            inputElement.setAttribute(attributeName, attributeValue);
        }
    }

    _removeAttribute(attributeName) {
        let inputElement = this.querySelector("input");
        if (inputElement) {
            inputElement.removeAttribute(attributeName);
        }
    }
}

/**
 *
 * Abstract input element
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "placeholder": "Placeholder string",
 *      "textContent": "Element label text",
 *      "value": "Initialize value",
 *      "tips": {"content": "Tips message"}
 * }
 *
 * Attention: "id" and "name" is required
 *
 */
class AbstractInput extends BaseInput {
    constructor(elementType = "") {
        super(elementType);
    }

    connectedCallback() {
        super._removeProgress();
        if (this.dataset.id !== undefined && this.dataset.id.length > 0
            && this.dataset.name !== undefined && this.dataset.name.length > 0) {
            if (this._elementType.toLowerCase() !== "hidden") {
                super._renderLabel();
            }
            super._addSlot("element", "icon");
            let inputElement = this._inputElement();
            Object.keys(this.dataset).forEach(key => {
                inputElement.setAttribute(key, this.dataset[key]);
            })
            inputElement.addEventListener("blur", (event) => {
                event.stopPropagation();
                if (inputElement.validate()) {
                    inputElement.removeClass("error");
                } else {
                    inputElement.appendClass("error");
                }
            });
        }
    }

    _inputElement() {
        let inputElement = this.querySelector("input[type='" + this._elementType + "']");
        if (inputElement === null) {
            inputElement = document.createElement("input");
            inputElement.setAttribute("type", this._elementType);
            inputElement.setAttribute("slot", "element");
            this.appendChild(inputElement);
            switch (this._elementType.toLowerCase()) {
                case "button":
                case "submit":
                case "reset":
                    if (this.dataset.className !== undefined && this.dataset.className.length > 0) {
                        inputElement.appendClass(this.dataset.className);
                    }
                    break;
                case "password":
                    let iconElement = this.querySelector("span[slot='icon']");
                    if (iconElement === null) {
                        iconElement = document.createElement("span");
                        iconElement.setAttribute("slot", "icon");
                        iconElement.addEventListener("click", function(event) {
                            event.stopPropagation();
                            if (inputElement.getAttribute("type") === "password") {
                                inputElement.setAttribute("type", "text");
                            } else {
                                inputElement.setAttribute("type", "password");
                            }
                            inputElement.focus();
                        })
                        this.appendChild(iconElement);
                    }
                    break;
            }
        }
        return inputElement;
    }

    validate() {
        let hasError = false;
        if (this.hasAttribute("regex")) {

        }
        if (hasError) {

        }
    }
}

/**
 * Password input
 *
 * Render element:
 * <input type="password" ... />
 */
class PasswordInput extends AbstractInput {
    constructor() {
        super("password");
        this.removeAttribute("value");
    }

    static tagName() {
        return "password-input";
    }
}

/**
 * Hidden input
 *
 * Render element:
 * <input type="hidden" ... />
 */
class HiddenInput extends AbstractInput {
    constructor() {
        super("hidden");
    }

    static tagName() {
        return "hidden-input";
    }
}

/**
 * Text input
 *
 * Render element:
 * <input type="text" ... />
 */
class TextInput extends AbstractInput {
    constructor() {
        super("text");
    }

    static tagName() {
        return "text-input";
    }
}

/**
 * Search input
 *
 * Render element:
 * <input type="search" ... />
 */
class SearchInput extends AbstractInput {
    constructor() {
        super("search");
    }

    static tagName() {
        return "search-input";
    }
}

/**
 * Number input
 *
 * Render element:
 * <input type="number" ... />
 */
class NumberInput extends AbstractInput {
    constructor() {
        super("number");
    }

    static tagName() {
        return "number-input";
    }
}

/**
 * Date input
 *
 * Render element:
 * <input type="date" ... />
 */
class DateInput extends AbstractInput {
    constructor() {
        super("date");
    }

    static tagName() {
        return "date-input";
    }
}

/**
 * Time input
 *
 * Render element:
 * <input type="time" ... />
 */
class TimeInput extends AbstractInput {
    constructor() {
        super("time");
    }

    static tagName() {
        return "time-input";
    }
}

/**
 * Datetime input
 *
 * Render element:
 * <input type="datetime-local" ... />
 */
class DateTimeInput extends AbstractInput {
    constructor() {
        super("datetime-local");
    }

    static tagName() {
        return "datetime-input";
    }
}

class NumberIntervalInput extends IntervalInput {
    constructor() {
        super("number");
    }

    static tagName() {
        return "number-interval-input";
    }
}

class DateIntervalInput extends IntervalInput {
    constructor() {
        super("date");
    }

    static tagName() {
        return "date-interval-input";
    }
}

class TimeIntervalInput extends IntervalInput {
    constructor() {
        super("time");
    }

    static tagName() {
        return "time-interval-input";
    }
}

class DateTimeIntervalInput extends IntervalInput {
    constructor() {
        super("datetime-local");
    }

    static tagName() {
        return "datetime-interval-input";
    }
}

class DragUpload extends AbstractElement {
    constructor() {
        super();
        super._addSlot("preview", "dragWindow");
        this.dragWindow = null;
        this.previewElement = null;
        this.drawFiles = [];
    }

    static tagName() {
        return "drag-upload";
    }

    uploadFiles() {
        return this.drawFiles;
    }

    renderElement(data) {
        if (data !== undefined && data.hasOwnProperty("name")) {
            Object.keys(data).forEach(key => (this.dataset[key] = data[key]));
            this._render();
        }
    }

    _checkType(fileItem = null) {
        if (fileItem === null) {
            return false;
        }
        for (let existItem of this.drawFiles) {
            if (existItem.type === fileItem.type
                && existItem.size === fileItem.size
                && existItem.name === fileItem.name) {
                return false;
            }
        }
        if (this.dataset.fileType !== undefined && this.dataset.fileType !== null && fileItem.type.indexOf(this.dataset.fileType) === -1) {
            return false;
        }
        return !(this.dataset.fileSize !== undefined && this.dataset.fileSize !== null && (this.dataset.fileSize.parseInt() < fileItem.size));
    }

    _removeItem(identifyCode = "") {
        if (identifyCode === "" && this.dataset.multipartFile) {
            return;
        }
        if (this.dataset.multipleFile) {
            let newArrays = [];
            for (let fileItem of this.drawFiles) {
                if (fileItem.identifyCode !== identifyCode) {
                    newArrays.push(fileItem);
                }
            }
            this.drawFiles = newArrays;
            if (this.drawFiles.length === 0) {
                this.dragWindow.show();
            }
        } else {
            this.drawFiles = [];
            this.dragWindow.show();
        }
    }

    _renderItem(identifyCode = "") {
        if (identifyCode === "" && this.dataset.multipartFile) {
            return null;
        }
        let imgPreview = document.createElement("span");
        imgPreview.hide();
        let dragUpload = this;
        let closeBtn = document.createElement("i");
        closeBtn.setClass("icon-close");
        closeBtn.addEventListener("click", function () {
            dragUpload._removeItem(identifyCode);
            dragUpload.previewElement.removeChild(imgPreview);
        });
        imgPreview.appendChild(closeBtn);
        return imgPreview;
    }

    connectedCallback() {
        super._removeProgress();
        this._render();
        this.bindEvent("dragenter", function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
        this.bindEvent("dragover", function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
        this.bindEvent("drop", function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.dataset.multipleFile) {
                Array.from(event.dataTransfer.files)
                    .filter(fileItem => this._checkType(fileItem))
                    .forEach(fileItem => {
                        let identifyCode = Cell.calculateData("md5", fileItem.name);
                        fileItem.identifyCode = identifyCode;
                        this.drawFiles.push(fileItem);
                        if (fileItem.type.indexOf("image") !== -1) {
                            let imgPreview = this._renderItem(identifyCode);
                            if (imgPreview) {
                                this.previewElement.append(imgPreview);
                                let reader = new FileReader();
                                reader.onload = function(event) {
                                    imgPreview.style.backgroundImage = "url('" + event.currentTarget.result + "')";
                                    imgPreview.show();
                                }
                                reader.readAsDataURL(fileItem);
                            }
                        }
                        this.dragWindow.hide();
                    });
            } else {
                if (event.dataTransfer.files.length > 0) {
                    let fileItem = event.dataTransfer.files[0];
                    if (this._checkType(fileItem)) {
                        this.drawFiles = [];
                        this.drawFiles.push(fileItem);
                        if (fileItem.type.indexOf("image") !== -1) {
                            let imgPreview = this.previewElement.querySelector("span");
                            if (imgPreview === null) {
                                imgPreview = this._renderItem();
                                if (imgPreview) {
                                    this.previewElement.append(imgPreview);
                                }
                            }
                            if (imgPreview) {
                                let reader = new FileReader();
                                reader.onload = function(event) {
                                    imgPreview.style.backgroundImage = ("url('" + event.currentTarget.result + "')");
                                    imgPreview.show();
                                }
                                reader.readAsDataURL(fileItem);
                            }
                        }
                        this.dragWindow.hide();
                    }
                }
            }
        });
    }

    _checkExists(fileItem) {
        if (fileItem === null || fileItem === undefined) {
            return false;
        }

        for (let existItem in this.drawFiles) {
            if (existItem.type === fileItem.type
                && existItem.size === fileItem.size
                && existItem.name === fileItem.name) {
                return false;
            }
        }
        return true;
    }

    _render() {
        if (this.previewElement === null) {
            this.previewElement = document.createElement("div");
            this.previewElement.setAttribute("slot", "preview");
            this.appendChild(this.previewElement);
        }
        if (this.dragWindow === null) {
            this.dragWindow = document.createElement("div");
            this.dragWindow.setAttribute("slot", "dragWindow");
            this.appendChild(this.dragWindow);
        }
        this.drawFiles = [];
    }
}

/**
 *
 * Select element
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": "Initialize value",
 *      "textContent": "Element label text",
 *      "tips": {"content": "Tips message"},
 *      "options": [
 *          {"text":"option0","value":0},{"text":"option1","value":1},
 *          {"text":"option2","value":2},{"text":"option3","value":3},
 *          {"text":"option4","value":4},{"text":"option5","value":5},
 *          {"text":"option6","value":6},{"text":"option7","value":7},
 *          {"text":"option8","value":8},{"text":"option9","value":9}
 *      ]
 * }
 *
 * Attention: "id" and "name" is required
 *
 */
class SelectInput extends InputElement {
    constructor() {
        super();
    }

    static tagName() {
        return "select-input";
    }

    renderElement(data) {
        if (data.hasOwnProperty("id") && data.hasOwnProperty("name")) {
            Object.keys(data).forEach(key =>
                this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key]));
            this._render();
        }
    }

    connectedCallback() {
        super._removeProgress();
        this._render();
    }

    _render() {
        super._renderLabel();
        let currentValue = this.dataset.value;
        super._addSlot("element");
        let selectElement = this.querySelector("select");
        if (selectElement === null) {
            selectElement = this._renderElement("select");
        } else {
            selectElement.clearChildNodes();
        }
        Object.keys(this.dataset).forEach(attributeName =>
            selectElement.setAttribute(attributeName, this.dataset[attributeName]));

        if (this.dataset.options !== undefined) {
            this.dataset.options.parseJSON().forEach((optionItem, index) => {
                selectElement.options.add(
                    new Option(optionItem.text, optionItem.value,
                        currentValue ? false : index === 0,
                        optionItem.value.toString() === currentValue));
            });
        }
    }
}

/**
 *
 * Textarea element
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": "Initialize value",
 *      "textContent": "Element label text",
 *      "tips": {"content": "Tips message"}
 * }
 *
 * Attention: "id" and "name" is required
 *
 */
class TextAreaInput extends InputElement {
    constructor() {
        super();
    }

    static tagName() {
        return "textarea-input";
    }

    renderElement(data) {
        if (data.hasOwnProperty("id") && data.hasOwnProperty("name")) {
            Object.keys(data).forEach(key =>
                this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key]));
            this._render();
        }
    }

    connectedCallback() {
        super._removeProgress();
        this._render();
    }

    _render() {
        if (this.dataset.name === undefined) {
            return;
        }
        super._renderLabel();
        super._addSlot("element");
        let textareaElement = this.querySelector("textarea");
        if (textareaElement === null) {
            textareaElement = this._renderElement("textarea");
        }

        if (this.dataset.id !== undefined) {
            textareaElement.setAttribute("id", this.dataset.id);
        }
        textareaElement.setAttribute("name", this.dataset.name);
        if (this.dataset.placeHolder !== undefined) {
            textareaElement.setAttribute("placeholder", this.dataset.placeHolder);
        }
        let height = 200;
        let attributeValue = this.getAttribute("height");
        if (attributeValue !== null && attributeValue.isNum()) {
            height = attributeValue.parseInt();
        }
        textareaElement.style.minHeight = height + "px";
        if (this.dataset.value !== undefined) {
            textareaElement.innerHTML = this.dataset.value;
        }
    }
}

export {InputElement, BaseInput, AbstractInput, PasswordInput, HiddenInput, TextInput, SearchInput, NumberInput,
    DateInput, TimeInput, DateTimeInput, SelectInput, TextAreaInput, DragUpload,
    NumberIntervalInput, DateIntervalInput, TimeIntervalInput, DateTimeIntervalInput};