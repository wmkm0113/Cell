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

import {Comment} from "../commons/Commons.js";
import {AbstractElement} from "./element.js";
import {ResourceDetails} from "./details.js";

/**
 * Base element of input/select/textarea
 */
class InputElement extends AbstractElement {
    constructor() {
        super();
    }

    _createElement(tagName = "") {
        if (tagName.length > 0 && tagName.toLowerCase()) {
            let element = document.createElement(tagName);
            element.setAttribute("slot", "element");
            this.appendChild(element);
            return element;
        }
        return null;
    }

    renderElement(data) {
        if (data.hasOwnProperty("id") && data.hasOwnProperty("name")) {
            Object.keys(data).forEach(key =>
                this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key]));
            super._renderLabel();
            this._render();
        }
    }
}

class IntervalInput extends AbstractElement {
    constructor(type = "") {
        super();
        this.type = type;
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
                    case "endName":
                        this.dataset[key] = data[key];
                        break;
                    case "beginValue":
                    case "endValue":
                        switch (this.type.toLowerCase()) {
                            case "date":
                                this.dataset[key] = Cell.millisecondsToDate(data[key], Comment.ISO8601DATEPattern);
                                break;
                            case "time":
                                this.dataset[key] = Cell.millisecondsToDate(data[key], Comment.ISO8601TIMEPattern);
                                break;
                            case "datetime-local":
                                this.dataset[key] = Cell.millisecondsToDate(data[key], Comment.ISO8601DATETIMEPattern);
                                break;
                        }
                        break;
                    default:
                        this.setAttribute(key, data[key]);
                        break;
                }
            });
            this.connectedCallback();
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
        if (this.dataset.beginPlaceHolder !== undefined) {
            this.beginElement.setAttribute("placeholder", this.dataset.beginPlaceHolder);
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
        if (this.dataset.endPlaceHolder !== undefined) {
            this.endElement.setAttribute("placeholder", this.dataset.endPlaceHolder);
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
                        switch (this._elementType.toLowerCase()) {
                            case "date":
                                this.dataset.value = Cell.millisecondsToDate(data[key], Comment.ISO8601DATEPattern);
                                break;
                            case "time":
                                this.dataset.value = Cell.millisecondsToDate(data[key], Comment.ISO8601TIMEPattern);
                                break;
                            case "datetime-local":
                                this.dataset.value = Cell.millisecondsToDate(data[key], Comment.ISO8601DATETIMEPattern);
                                break;
                            default:
                                this.dataset.value = data[key];
                                break;
                        }
                    }
                } else {
                    this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key]);
                }
            });
            super._renderLabel();
            this._render();
        }
    }

    enable() {
        this._removeAttribute("disabled");
    }

    disable() {
        this._updateAttribute("disabled", true);
    }

    disabled() {
        return this._checkAttribute("disabled");
    }

    value() {
        return this._attributeValue("value");
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
        if (this._elementType === "checkbox" || this._elementType === "radio") {
            super.addEventListener(type, listener, options);
            return;
        }
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
            return inputElement.hasAttribute(attributeName);
        }
        return false;
    }

    _attributeValue(attributeName) {
        let inputElement = this.querySelector("input");
        if (inputElement) {
            return inputElement.getAttribute(attributeName);
        }
        return null;
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
        super._addSlot("element", "icon", "error", "reference");
        this.inputElement = null;
        this.referenceElement = null;
        this.errorElement = null;
    }

    connectedCallback() {
        super._removeProgress();
        if (this.inputElement === null) {
            this.inputElement = (this._elementType.toLowerCase() === "textarea")
                ? super._createElement("textarea")
                : super._createElement("input");
            this.inputElement.setAttribute("type", this._elementType);
            this.appendChild(this.inputElement);
            switch (this._elementType.toLowerCase()) {
                case "button":
                case "submit":
                case "reset":
                    if (this.dataset.className !== undefined && this.dataset.className.length > 0) {
                        this.inputElement.appendClass(this.dataset.className);
                    }
                    break;
                case "password":
                    let iconElement = this.querySelector("span[slot='icon']");
                    if (iconElement === null) {
                        iconElement = document.createElement("span");
                        iconElement.setAttribute("slot", "icon");
                        iconElement.addEventListener("click", function (event) {
                            event.stopPropagation();
                            if (this.inputElement.getAttribute("type") === "password") {
                                this.inputElement.setAttribute("type", "text");
                            } else {
                                this.inputElement.setAttribute("type", "password");
                            }
                            this.inputElement.focus();
                        })
                        this.appendChild(iconElement);
                    }
                    break;
            }
        }
        if (["text", "textarea"].indexOf(this._elementType.toLowerCase()) !== -1) {
            if (this.referenceElement === null) {
                this.referenceElement = document.createElement("span");
                this.referenceElement.setAttribute("slot", "reference");
                this.appendChild(this.referenceElement);
            }
        }
        if (this.errorElement === null) {
            this.errorElement = document.createElement("span");
            this.errorElement.setAttribute("slot", "error");
            this.appendChild(this.errorElement);
        }
        this._render();
    }

    _render() {
        if (this._elementType.toLowerCase() !== "hidden") {
            super._renderLabel();
        }
        Object.keys(this.dataset)
            .forEach(key => {
                if (["id", "name", "placeholder", "value"].indexOf(key.toLowerCase()) !== -1) {
                    this.inputElement.setAttribute(key, this.dataset[key]);
                } else if (key.toLowerCase() === "autocomplete"
                    && ["text", "password", "email", "textarea", "hidden"].indexOf(this._elementType.toLowerCase()) !== -1) {
                    this.inputElement.setAttribute(key, this.dataset[key]);
                } else if (key.toLowerCase() === "verify") {
                    if (this.inputElement.dataset.validate === "true") {
                        let validateConfig = this.dataset[key].parseJSON();
                        Object.keys(validateConfig)
                            .forEach(validateKey => {
                                if (validateKey.toLowerCase() === "type") {
                                    this.inputElement.dataset[validateConfig[validateKey]] = "true";
                                } else {
                                    this.inputElement.dataset[validateKey] = validateConfig[validateKey];
                                }
                            })
                    }
                } else if (key.toLowerCase() === "reference"
                    && ["text", "textarea"].indexOf(this._elementType.toLowerCase()) !== -1) {
                    this.referenceElement.innerText = this.dataset[key];
                } else if (key.toLowerCase() === "error") {
                    this.errorElement.innerText = this.dataset[key];
                } else if (key.toLowerCase() !== "tips") {
                    this.inputElement.dataset[key] = this.dataset[key];
                }
            });
        this.inputElement.addEventListener("blur", (event) => {
            event.stopPropagation();
            if (this.inputElement.validate()) {
                this.removeClass("error");
            } else {
                this.appendClass("error");
            }
        });
    }
}

class BaseButton extends AbstractInput {
    constructor(elementType = "button") {
        if (!["button", "submit", "reset"].includes(elementType.toLowerCase())) {
            throw new Error("Invalid element type");
        }
        super(elementType);
        this._timer = null;
    }

    set value(data) {
        if (this.inputElement !== null) {
            this.inputElement.setAttribute("value", data);
        }
    }

    set id(id) {
        super.setAttribute("id", id);
    }

    renderElement(data) {
        if (data.hasOwnProperty("value")) {
            this.textContent = data.value;
        }
        if (data.hasOwnProperty("className")) {
            this.dataset.className = data.className;
        }
        if (data.hasOwnProperty("intervalTime")) {
            this.dataset.intervalTime = data.intervalTime;
        }
        if (this._elementType.toLowerCase() === "button") {
            if (data.hasOwnProperty("link")) {
                this.dataset.link = data.link;
            }
        } else {
            if (data.hasOwnProperty("formId")) {
                this.dataset.formId = data.formId;
            }
        }
        this.renderCustom(data);
    }

    renderCustom(data) {
    }

    connectedCallback() {
        super.connectedCallback();
        let buttonElement = this;
        this.inputElement.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.dataset.intervalTime !== undefined && this.dataset.intervalTime !== null
                && this.dataset.intervalTime.isNum()) {
                if (buttonElement._timer === null) {
                    buttonElement.dataset.buttonText = this.inputElement.getAttribute("value");
                    this.inputElement.disable();
                    let countDown = buttonElement.dataset.intervalTime.parseInt();
                    buttonElement.dataset.countDown = countDown.toString();
                    this.inputElement.setAttribute("value", countDown.toString());
                    buttonElement._timer =
                        window.setInterval(function () {
                            buttonElement.disable();
                        }, 1000);
                }
            }
        });
        if (this._elementType === "submit" || this._elementType === "reset") {
            this.inputElement.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                let formElement = $(buttonElement.dataset.formId);
                if (formElement) {
                    switch (buttonElement._elementType) {
                        case "submit":
                            Cell.submitForm(formElement);
                            break;
                        case "reset":
                            formElement.reset();
                            break;
                    }
                }
            });
        }
    }

    disable() {
        let countDown;
        if (this.dataset.countDown === undefined || !this.dataset.countDown.isNum()) {
            countDown = this.dataset.intervalTime.parseInt();
        } else {
            countDown = this.dataset.countDown.parseInt();
        }
        countDown--;
        if (countDown <= 0) {
            this.enable();
        } else {
            this.inputElement.setAttribute("value", countDown.toString());
            this.dataset.countDown = countDown.toString();
        }
    }

    enable() {
        if (this._timer !== null) {
            window.clearInterval(this._timer);
            this._timer = null;
        }
        this.dataset.countDown = "";
        this.inputElement.setAttribute("value", this.dataset.buttonText);
        this.inputElement.enable();
    }
}

class LikeButton extends BaseButton {
    constructor() {
        super("button");
        super._addSlot("icon");
        this.iconElement = null;
    }

    static tagName() {
        return "like-button";
    }

    connectedCallback() {
        if (this.iconElement === null) {
            this.iconElement = document.createElement("i");
            this.iconElement.setAttribute("slot", "icon");
            this.appendChild(this.iconElement);
        }
        super.connectedCallback();
    }

    renderElement(data) {
        if (data.hasOwnProperty("checked")) {
            this.dataset.checked = Boolean(data.checked).toString();
        }
        super.renderElement(data);
    }
}

class FavoriteButton extends BaseButton {
    constructor() {
        super("button");
        super._addSlot("icon");
        this.iconElement = null;
    }

    static tagName() {
        return "favorite-button";
    }

    connectedCallback() {
        if (this.iconElement === null) {
            this.iconElement = document.createElement("i");
            this.iconElement.setAttribute("slot", "icon");
            this.appendChild(this.iconElement);
        }
        super.connectedCallback();
    }

    renderElement(data) {
        if (data.hasOwnProperty("checked")) {
            this.dataset.checked = Boolean(data.checked).toString();
        }
    }
}

class StandardButton extends BaseButton {
    constructor() {
        super("button");
    }

    static tagName() {
        return "standard-button";
    }
}

class SubmitButton extends BaseButton {
    constructor() {
        super("submit");
    }

    static tagName() {
        return "submit-button";
    }
}

class ResetButton extends BaseButton {
    constructor() {
        super("reset");
    }

    static tagName() {
        return "reset-button";
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
 * Email input
 *
 * Render element:
 * <input type="email" ... />
 */
class EmailInput extends AbstractInput {
    constructor() {
        super("email");
    }

    static tagName() {
        return "email-input";
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
        super._addSlot("itemName", "tips", "dragWindow", "reference");
        this.dragWindow = null;
        this.dragElement = null;
        this.previewElement = null;
        this.drawFiles = [];
        this.referenceElement = null;
    }

    static tagName() {
        return "drag-upload";
    }

    uploadFiles() {
        return this.drawFiles;
    }

    renderElement(data) {
        if (data !== undefined && data.hasOwnProperty("name")) {
            Object.keys(data).forEach(key => (this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key])));
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
                this.dragElement.show();
            }
        } else {
            this.drawFiles = [];
            this.dragElement.show();
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
                        let identifyCode = Cell.digestData("MD5", fileItem.name);
                        fileItem.identifyCode = identifyCode;
                        this.drawFiles.push(fileItem);
                        if (fileItem.type.indexOf("image") !== -1) {
                            let imgPreview = this._renderItem(identifyCode);
                            if (imgPreview) {
                                this.previewElement.append(imgPreview);
                                let reader = new FileReader();
                                reader.onload = function (event) {
                                    imgPreview.style.backgroundImage = "url('" + event.currentTarget.result + "')";
                                    imgPreview.show();
                                }
                                reader.readAsDataURL(fileItem);
                            }
                        } else if (fileItem.type.indexOf("video") !== -1) {
                            let imgPreview = this._renderItem(identifyCode);
                            if (imgPreview) {
                                this.previewElement.append(imgPreview);
                                imgPreview.show();
                                let videoElement = document.createElement("video");
                                videoElement.setAttribute("controls", "true");
                                videoElement.src = URL.createObjectURL(fileItem);
                                videoElement.load();
                                imgPreview.appendChild(videoElement);
                            }
                        }
                        this.dragElement.hide();
                    });
            } else {
                if (event.dataTransfer.files.length > 0) {
                    let fileItem = event.dataTransfer.files[0];
                    if (this._checkType(fileItem)) {
                        this.drawFiles = [];
                        this.drawFiles.push(fileItem);
                        let imgPreview = this.previewElement.querySelector("span");
                        if (imgPreview === null) {
                            imgPreview = this._renderItem();
                            if (imgPreview) {
                                this.previewElement.append(imgPreview);
                            }
                        }
                        if (fileItem.type.indexOf("image") !== -1) {
                            imgPreview.clearChildNodes();
                            let reader = new FileReader();
                            reader.onload = function (event) {
                                imgPreview.style.backgroundImage = ("url('" + event.currentTarget.result + "')");
                                imgPreview.show();
                            }
                            reader.readAsDataURL(fileItem);
                        } else if (fileItem.type.indexOf("video") !== -1) {
                            imgPreview.style.backgroundImage = "";
                            let videoElement = document.createElement("video");
                            videoElement.setAttribute("controls", "true");
                            videoElement.src = URL.createObjectURL(fileItem);
                            videoElement.load();
                        }
                        this.dragElement.hide();
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

    _renderReference() {
        if (this.referenceElement === null && this.dataset.multilingual === "true"
            && this.dataset.reference !== undefined && this.dataset.reference.isJSON()) {
            this.referenceElement = document.createElement("div");
            this.referenceElement.setAttribute("slot", "reference");
            this.appendChild(this.referenceElement);

            Array.from(this.dataset.reference.parseJSON())
                .forEach(refData => {
                    let refItem = new ResourceDetails();
                    this.referenceElement.appendChild(refItem);
                    refItem.data = JSON.stringify(refData);
                });
        }
    }

    _render() {
        super._renderLabel();
        this._renderReference();
        if (this.dragWindow === null) {
            this.dragWindow = document.createElement("div");
            this.dragWindow.setAttribute("slot", "dragWindow");
            this.appendChild(this.dragWindow);
        }
        if (this.previewElement === null) {
            this.previewElement = document.createElement("div");
            this.previewElement.setAttribute("id", "preview");
            this.dragWindow.appendChild(this.previewElement);
        }
        if (this.dragElement === null) {
            this.dragElement = document.createElement("div");
            this.dragElement.setAttribute("id", "dragElement");
            this.dragWindow.appendChild(this.dragElement);
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

    connectedCallback() {
        super._removeProgress();
        this._render();
    }

    _render() {
        let currentValue = this.dataset.value;
        super._addSlot("element");
        let selectElement = this.querySelector("select");
        if (selectElement === null) {
            selectElement = this._createElement("select");
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
                        optionItem.value === currentValue));
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
class TextAreaInput extends AbstractInput {
    constructor() {
        super("textarea");
    }

    static tagName() {
        return "textarea-input";
    }

    connectedCallback() {
        super._removeProgress();
        super.connectedCallback();
        this._render();
    }

    _render() {
        if (this.dataset.name === undefined) {
            return;
        }
        if (this.dataset.id !== undefined) {
            this.inputElement.setAttribute("id", this.dataset.id);
        }
        this.inputElement.setAttribute("name", this.dataset.name);
        if (this.dataset.placeholder !== undefined) {
            this.inputElement.setAttribute("placeholder", this.dataset.placeholder);
        }
        let height = 200;
        let attributeValue = this.getAttribute("height");
        if (attributeValue !== null && attributeValue.isNum()) {
            height = attributeValue.parseInt();
        }
        this.inputElement.style.minHeight = height + "px";
        if (this.dataset.value !== undefined) {
            this.inputElement.innerHTML = this.dataset.value.decodeByRegExp();
        }
        if (this.dataset.multilingual === "true" && this.dataset.reference !== undefined) {
            this.referenceElement.innerText = this.dataset.reference;
            this.appendClass("multilingual");
        } else {
            this.removeClass("multilingual");
        }
    }
}

export {
    InputElement,
    BaseInput,
    AbstractInput,
    StandardButton,
    SubmitButton,
    ResetButton,
    LikeButton,
    FavoriteButton,
    PasswordInput,
    HiddenInput,
    TextInput,
    EmailInput,
    SearchInput,
    NumberInput,
    DateInput,
    TimeInput,
    DateTimeInput,
    SelectInput,
    TextAreaInput,
    DragUpload,
    NumberIntervalInput,
    DateIntervalInput,
    TimeIntervalInput,
    DateTimeIntervalInput
};