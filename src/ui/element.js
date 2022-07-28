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

import {MockCheckBox, MockRadio, MockSwitch} from "./mock.js";

class CustomElement extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode : "closed" });
    }

    static tagName() {
        return null;
    }

    _addSlot(...names) {
        if (names !== null) {
            names.filter(name => this._checkExists(name))
                .forEach(name => {
                    let slotElement = document.createElement("slot");
                    slotElement.setAttribute("name", name);
                    this._shadowRoot.appendChild(slotElement);
                });
        }
    }

    _checkExists(name = "") {
        return (name != null) && (name.length > 0)
            && (this._shadowRoot.querySelector("slot[name='" + name + "']") === null);
    }
}

class BaseElement extends CustomElement {
    constructor() {
        super();
        Object.defineProperty(this, "data", {
            set(data) {
                if (this.renderElement !== undefined && data !== null && data.isJSON()) {
                    this._removeProgress();
                    let jsonData = data.parseJSON();
                    if (jsonData.hasOwnProperty("elementId")) {
                        this.setAttribute("id", jsonData.elementId);
                    }
                    this.renderElement(jsonData);
                }
            }
        });
        this._appendProgress();
    }

    remove() {
        if (this.parentElement !== null) {
            this.parentElement.removeChild(this);
        }
    }

    _appendProgress() {
        if (this._shadowRoot.querySelector("div[id='waiting']") === null) {
            let progressElement = document.createElement("div");
            progressElement.setAttribute("id", "waiting");
            progressElement.style.width = "100%";
            progressElement.style.minHeight = "20px";
            progressElement.setClass("waitingData");
            this._shadowRoot.appendChild(progressElement);
        }
    }

    _removeProgress() {
        let progressElement = this._shadowRoot.querySelector("div[id='waiting']");
        if (progressElement !== null) {
            this._shadowRoot.removeChild(progressElement);
        }
    }
}

class AbstractElement extends BaseElement {
    constructor() {
        super();
    }

    _renderLabel() {
        let labelElement = this.querySelector("label[slot='itemName']");
        let textContent = (this.dataset.textContent === undefined) ? "" : this.dataset.textContent;
        if (textContent.length === 0) {
            if (labelElement !== null) {
                labelElement.parentElement.removeChild(labelElement);
            }
        } else {
            if (labelElement === null) {
                labelElement = document.createElement("label");
                labelElement.setAttribute("slot", "itemName");
                if (this.dataset.id !== undefined) {
                    labelElement.setAttribute("for", this.dataset.id);
                }
                labelElement.appendChild(document.createElement("i"));
                this.appendChild(labelElement);
            }
            let spanElement = this.querySelector("label > span");
            if (spanElement === null) {
                spanElement = document.createElement("span");
                labelElement.appendChild(spanElement);
            }
            spanElement.innerText = textContent;
        }

        super._addSlot("itemName", "tips");
        let tipsButton = this.querySelector("tips-button[slot='tips']");
        if (tipsButton === null) {
            tipsButton = document.createElement("tips-button");
            tipsButton.setAttribute("slot", "tips");
            this.appendChild(tipsButton);
        }
        if (this.dataset.tips !== undefined && this.dataset.tips.isJSON()) {
            tipsButton.data = this.dataset.tips;
        }
    }
}

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
                        this.dataset.tips = JSON.stringify(data[key]);
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
                        this._shadowRoot.querySelectorAll("radio-button")
                            .forEach(radioButton => {
                                radioButton.checked = (radioButton.getAttribute("value") === itemElement.value);
                            });
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
 * Progress bar element
 *
 * Value of attribute named "data" is json string like:
 * {
 *      "percent": "32",                //  Progress percent
 *      "processed": "166",             //  Processed count
 *      "total": "227"                  //  Total count
 * }
 *
 * Attention: "percent" is required
 *
 */
class ProgressBar extends CustomElement {
    constructor() {
        super();
        super._addSlot("progressInfo", "progressText");
        this._progressInfo = null;
        this._progressText = null;
        Object.defineProperty(this, "data", {
            set(data) {
                if (this._progressInfo !== null && data && data.isJSON()) {
                    let jsonData = data.parseJSON();
                    let percent = 0;
                    if (jsonData.hasOwnProperty("percent")) {
                        percent = jsonData.percent.parseInt();
                    } else if (jsonData.hasOwnProperty("processed") && jsonData.hasOwnProperty("total")) {
                        percent = Math.floor(jsonData.processed.parseInt() * 100 / jsonData.total.parseInt());
                    }
                    if (percent < 0) {
                        percent = 0;
                    } else if (percent > 100) {
                        percent = 100;
                    }
                    percent = Math.floor(percent);
                    this._progressInfo.style.width = percent + "%";
                    if (this._progressText !== null) {
                        let textContent;
                        if (jsonData.hasOwnProperty("processed") && jsonData.hasOwnProperty("total")) {
                            textContent = jsonData.processed + " / " + jsonData.total;
                        } else {
                            textContent = (percent + "%");
                        }
                        this._progressText.innerText = textContent;
                        if (percent > 50) {
                            this._progressText.style.color = "#FFFFFF";
                        }
                    }
                }
            }
        });
    }

    static tagName() {
        return "progress-bar";
    }

    connectedCallback() {
        if (this.querySelector("span[slot='progressInfo']") === null) {
            this._progressInfo = document.createElement("span");
            this._progressInfo.setAttribute("slot", "progressInfo");
            this.appendChild(this._progressInfo);
        }
        if (this.querySelector("span[slot='progressText']") === null) {
            this._progressText = document.createElement("span");
            this._progressText.setAttribute("slot", "progressText");
            this.appendChild(this._progressText);
        }
    }
}

/**
 * Mock scroll bar
 */
class ScrollBar extends CustomElement {
    constructor() {
        super();
        super._addSlot("scrollItem");
        this._scrollItem = null;
    }

    connectedCallback() {
        if (this._scrollItem === null) {
            this._scrollItem = document.createElement("div");
            this._scrollItem.setAttribute("slot", "scrollItem");
            this.appendChild(this._scrollItem);
        }
    }

    static tagName() {
        return "scroll-bar";
    }

    disable() {
        this.style.display = "none";
    }

    enable() {
        this.style.display = "block";
    }

    initHeight(itemHeight = 0) {
        if (this._scrollItem !== null && itemHeight > 0) {
            this._scrollItem.style.height = itemHeight + "px";
            this._scrollItem.style.top = "0";
        }
    }

    scroll(top = 0) {
        if (this._scrollItem !== null) {
            this._scrollItem.style.top = (top > 0 ? top : 0) + "px";
        }
    }

    scrollTop() {
        return this._scrollItem !== null ? this._scrollItem.style.top.parseInt() : 0;
    }
}

/**
 * Mock five-star rating
 * setting name attribute for form item name
 */
class StarRating extends CustomElement {
    constructor() {
        super();
        super._addSlot("starRating");
    }

    static tagName() {
        return "star-rating";
    }

    connectedCallback() {
        if (this.hasAttribute("name")) {
            this.render(this.getAttribute("name"));
        }
    }

    set name(name) {
        this.render(name);
    }

    render(name = "") {
        if (name.length > 0 && this.querySelector("div[slot='starRating']") === null) {
            let divElement = document.createElement("div");
            divElement.setAttribute("slot", "starRating");
            this.appendChild(divElement);
            for (let i = 5 ; i > 0 ; i--) {
                let id = "star" + i;
                let inputElement = document.createElement("input");
                inputElement.setAttribute("type", "radio");
                inputElement.setAttribute("id", id);
                inputElement.setAttribute("name", name);
                inputElement.setAttribute("value", i.toString());
                divElement.appendChild(inputElement);
                let labelElement = document.createElement("label");
                labelElement.setAttribute("for", id);
                divElement.appendChild(labelElement);
            }
        }
    }
}

/**
 * Five star score display element
 * set score for display, for example: 3.0 is 3 fill stars, 4.2 is 4 fill stars and 1 half star
 */
class StarScore extends CustomElement {

    constructor() {
        super();
        super._addSlot("starScore");
    }

    static tagName() {
        return "star-score";
    }

    connectedCallback() {
        if (this.querySelector("div[slot='starScore']") === null) {
            let divElement = document.createElement("div");
            divElement.setAttribute("slot", "starScore");
            this.appendChild(divElement);
            for (let i = 0 ; i < 5 ; i++) {
                let spanElement = document.createElement("i");
                spanElement.setClass("star");
                divElement.appendChild(spanElement);
            }
        }
    }

    set score(score) {
        if ((typeof score) === "number") {
            let starList = this.querySelectorAll("div[slot='starScore'] > i");
            if (score <= 0) {
                starList.forEach(starItem => starItem.setClass("icon-star-outline"));
            } else if (score >= 5) {
                starList.forEach(starItem => starItem.setClass("icon-star-half"));
            } else {
                let fillCount = score | 0;
                for (let i = 1 ; i <= 5 ; i++) {
                    if (i <= fillCount) {
                        starList[i - 1].setClass("icon-star");
                    } else {
                        if ((i - score) < 1) {
                            starList[i - 1].setClass("icon-star-half");
                        } else {
                            starList[i - 1].setClass("icon-star-outline");
                        }
                    }
                }
            }
        }
    }
}

export {CustomElement, BaseElement, AbstractElement, GroupElement, ProgressBar, ScrollBar, StarRating, StarScore};