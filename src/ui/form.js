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

import {BaseElement} from "./element.js";

/**
 * Form item element
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "tag": "item element tag name",
 *      "class": "item style class",
 *      "data": {
 *          item element init data...
 *      }
 * }
 *
 * Attention: "tag" is required
 *
 */
class FormItem extends BaseElement {
    constructor() {
        super();
        this.inputElement = null;
    }

    static tagName() {
        return "form-item";
    }

    renderElement(data) {
        if (data.hasOwnProperty("tag")) {
            let tagName = data.tag;
            if (this.dataset.tagName !== undefined) {
                let existsTag = this.dataset.tagName;
                if (existsTag.toLowerCase() !== tagName.toLowerCase()) {
                    if (tagName.toLowerCase() === "hidden-input") {
                        this.removeChild(this.inputElement);
                    } else {
                        this.removeChild(this.querySelector("div[slot='element']"));
                    }
                    this.inputElement = null;
                }
            }
            this.dataset.tagName = tagName;
            if (data.hasOwnProperty("class")) {
                this.setAttribute("class", data.class);
            }
            this.dataset.itemData = JSON.stringify(data.data);
            this._render();
        }
    }

    connectedCallback() {
        super._addSlot("element");
        this._render();
    }

    matchElement(elementName = "") {
        if (elementName == null || elementName.length === 0 || this.inputElement === null) {
            return false;
        }
        return this.inputElement.hasAttribute("name")
            && this.inputElement.getAttribute("name").toLowerCase() === elementName.toLowerCase();
    }

    updateValue(value = "") {
        if (value != null && value.length > 0 && this.inputElement !== null) {
            this.inputElement.setAttribute("value", value);
        }
    }

    _render() {
        if (this.dataset.tagName !== undefined
            && this.dataset.itemData !== undefined && this.dataset.itemData.isJSON()) {
            let itemData = this.dataset.itemData.parseJSON();
            let tagName = this.dataset.tagName;
            if (this.inputElement === null) {
                this.inputElement = document.createElement(tagName);
                if (tagName.toLowerCase() === "hidden-input") {
                    this.hide();
                    this.appendChild(this.inputElement);
                } else {
                    let divElement = this.querySelector("div[slot='element']");
                    if (divElement === null) {
                        divElement = document.createElement("div");
                        divElement.setAttribute("slot", "element");
                        this.appendChild(divElement);
                    }
                    if (this.hasAttribute("class")) {
                        divElement.setClass(this.getAttribute("class"));
                    }
                    divElement.appendChild(this.inputElement);
                }
            }

            this.inputElement.data = JSON.stringify(itemData);
        }
    }
}

/**
 * Form info element
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "method": "post",
 *      "action": "form submit path",
 *      "title": "Form title",
 *      "items": [
 *          {
 *              "tag": "item element tag name",
 *              "class": "item style class",
 *              "data": {
 *                  item element init data...
 *              }
 *          },
 *          ....
 *      ]
 * }
 *
 * Attention: "action" is required
 *
 */
class FormInfo extends BaseElement {
    constructor() {
        super();
        super._addSlot("formTitle", "formInfo");
        this.formElement = null;
    }

    static tagName() {
        return "form-info";
    }

    updateValue(elementName = "", elementValue = "") {
        if (elementName != null && elementName.length > 0
            && elementValue != null && elementValue.length > 0
            && this.formElement !== null) {
            this.formElement.querySelectorAll("form-item")
                .forEach(formItem => {
                    if (formItem.matchElement(elementName)) {
                        formItem.updateValue(elementValue);
                    }
                });
        }
    }

    renderElement(data) {
        if (data.hasOwnProperty("action")) {
            Object.keys(data).forEach(key => {
                switch (key.toLowerCase()) {
                    case "title":
                        let titleElement = this.querySelector("h2[slot='formTitle']");
                        if (titleElement === null) {
                            titleElement = document.createElement("h2");
                            titleElement.setAttribute("slot", "formTitle");
                            this.appendChild(titleElement);
                        }
                        titleElement.innerHTML = data[key];
                        break;
                    case "items":
                        this.dataset.items = JSON.stringify(data[key]);
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
        if (this.formElement === null) {
            this.formElement = document.createElement("form");
            this.formElement.setAttribute("slot", "formInfo");
            this.appendChild(this.formElement);
        }
        this._render();
    }

    _render() {
        if (this.dataset.items !== undefined && this.dataset.items.isJSON()) {
            this.formElement.setAttribute("action", this.getAttribute("action"));
            if (this.hasAttribute("method")) {
                this.formElement.setAttribute("method", this.getAttribute("method"));
            }
            let existsItems = this.formElement.querySelectorAll("form-item");
            let jsonItem = this.dataset.items.parseJSON();
            jsonItem.forEach((itemInfo, index) => {
                if (existsItems.length > index) {
                    existsItems[index].data = JSON.stringify(itemInfo);
                } else {
                    let formItem = new FormItem();
                    formItem.data = JSON.stringify(itemInfo);
                    this.formElement.appendChild(formItem);
                }
            });
            if (jsonItem.length < existsItems.length) {
                for (let i = jsonItem.length ; i < existsItems.length ; i++) {
                    this.formElement.removeChild(existsItems[i]);
                }
            }
            this.getAttributeNames().forEach(attributeName => {
                if (!attributeName.startsWith("data-") && attributeName.toLowerCase() !== "slot") {
                    this.formElement.setAttribute(attributeName, this.getAttribute(attributeName));
                }
            });
        }
    }

    submit() {
        Cell.submitForm(this.formElement);
    }

    reset() {
        if (this.formElement != null) {
            this.formElement.reset();
        }
    }
}

export {FormInfo, FormItem};
