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
import {MockCheckBox, MockRadio, MockSwitch} from "./mock.js";

class GroupElement extends AbstractElement {
    constructor() {
        super();
    }

    renderElement(data) {
        if (data.hasOwnProperty("name")) {
            Object.keys(data).forEach(key => {
                switch (key.toLowerCase()) {
                    case "textcontent":
                        this.dataset.textContent = data[key];
                        break;
                    case "tips":
                        this.dataset.tips = data[key];
                        break;
                    case "value":
                        if (data[key] instanceof Array) {
                            this.dataset.value = JSON.stringify(data[key]);
                        } else {
                            this.dataset.value = data[key];
                        }
                        break;
                    case "items":
                        this.dataset.items = JSON.stringify(data[key]);
                        break;
                    default:
                        this.setAttribute(key, data[key]);
                        break;
                }
            });
            this.connectedCallback();
        }
    }

    _renderItem(tagName = "") {
        let itemName = this.getAttribute("name");
        let itemList = this.dataset.items;
        if (itemName && itemList && itemList.isJSON()) {
            super._renderLabel();
            super._addSlot("item");
            let checkValue = [];
            if (this.dataset.value !== undefined && this.dataset.value.length > 0) {
                if (this.dataset.value.isJSON()) {
                    checkValue = this.dataset.value.parseJSON();
                } else {
                    checkValue[0] = this.dataset.value;
                }
            }
            let eventMap = [];
            this.attrNames().forEach(attributeName => {
                if (attributeName.startsWith("on")) {
                    eventMap.push([attributeName, this.getAttribute(attributeName)]);
                    this.removeAttribute(attributeName);
                }
            });
            let divElement = this.querySelector("div[slot='item']");
            if (divElement === null) {
                divElement = document.createElement("div");
                divElement.setAttribute("slot", "item");
                this.appendChild(divElement);
            }
            let existsItems = this.querySelectorAll("div > " + tagName);
            let jsonItems = itemList.parseJSON();
            jsonItems.forEach((itemInfo, index) => {
                let itemElement;
                if (index < existsItems.length) {
                    itemElement = existsItems[index];
                } else {
                    switch (tagName) {
                        case "mock-switch":
                            itemElement = new MockSwitch();
                            break;
                        case "mock-radio":
                            itemElement = new MockRadio();
                            break;
                        case "mock-checkbox":
                            itemElement = new MockCheckBox();
                            break;
                        default:
                            return;
                    }
                    divElement.appendChild(itemElement);
                }
                itemElement.attrNames().forEach(attributeName => {
                    if (attributeName.startsWith("on")) {
                        itemElement.removeAttribute(attributeName);
                    }
                });
                eventMap.forEach(eventInfo => itemElement.setAttribute(eventInfo[0], eventInfo[1]));
                if (tagName === "mock-radio") {
                    itemElement.addEventListener("click", (event) => {
                        event.stopPropagation();
                        let currentValue = "";
                        Array.from(this.querySelectorAll("div[slot='item'] > mock-radio"))
                            .filter(radioButton => radioButton.checked)
                            .forEach(radioButton => {
                                currentValue = radioButton.value();
                                radioButton.checked = false;
                            });
                        if (itemElement.value() !== currentValue) {
                            Array.from(this.querySelectorAll("div[slot='item'] > mock-radio"))
                                .filter(radioButton => radioButton.value() === itemElement.value())
                                .forEach(radioButton => {
                                    radioButton.checked = true;
                                });
                        }
                    });
                }
                itemInfo.name = itemName;
                itemInfo.checked = (checkValue.indexOf(itemInfo.value) !== -1);
                itemElement.data = JSON.stringify(itemInfo);
            });

            if (jsonItems.length < existsItems.length) {
                for (let i = jsonItems.length ; i < existsItems.length ; i++) {
                    divElement.removeChild(existsItems[i]);
                }
            }
        }
    }
}

/**
 * Mock button group
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": ["radioValue1", "radioValue2"],
 *      "textContent": "Element label text",
 *      "tips": {"content": "Tips message"},
 *      "items": [
 *          {'id' : 'radioButtonId', 'value' : 'radioValue1', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue2', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue3', 'textButton' : 'Radio Content'}
 *      ]
 * }
 *
 * Attention: "name" is required
 *
 */
class ButtonGroup extends GroupElement {
    constructor() {
        super();
    }

    static tagName() {
        return "group-button";
    }

    connectedCallback() {
        super._renderItem("mock-switch");
    }
}

/**
 * Mock checkbox group
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": ["radioValue1", "radioValue2"],
 *      "textContent": "Element label text",
 *      "tips": {"content": "Tips message"},
 *      "items": [
 *          {'id' : 'radioButtonId', 'value' : 'radioValue1', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue2', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue3', 'textButton' : 'Radio Content'}
 *      ]
 * }
 *
 * Attention: "name" is required
 *
 */
class CheckBoxGroup extends GroupElement {
    constructor() {
        super();
    }

    static tagName() {
        return "checkbox-group";
    }

    connectedCallback() {
        super._renderItem("mock-checkbox");
    }
}

/**
 * Mock radio group
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": "Initialize value",
 *      "textContent": "Element label text",
 *      "tips": {"content": "Tips message"},
 *      "items": [
 *          {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'}
 *      ]
 * }
 *
 * Attention: "name" is required
 *
 */
class RadioGroup extends GroupElement {
    constructor() {
        super();
    }

    static tagName() {
        return "radio-group";
    }

    connectedCallback() {
        super._removeProgress();
        super._renderItem("mock-radio");
    }
}

export {ButtonGroup, RadioGroup, CheckBoxGroup};