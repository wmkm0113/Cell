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

class CustomElement extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: "closed"});
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
                this._removeProgress();
                if (this.renderElement !== undefined && data !== null) {
                    if (data.isJSON()) {
                        let jsonData = data.parseJSON();
                        if (jsonData.hasOwnProperty("elementId")) {
                            this.setAttribute("id", jsonData.elementId);
                        }
                        this.renderElement(jsonData);
                    } else {
                        this.renderElement(data);
                    }
                }
            }
        });
        this._addSlot("loading");
        this.loadingElement = null;
    }

    loadData() {
        if (this.dataset.hasOwnProperty("code")) {
            window.setTimeout(() => Cell.initData(this.dataset.code, this), 100);
        }
    }

    remove() {
        if (this.parentElement !== null) {
            this.parentElement.removeChild(this);
        }
    }

    _appendProgress() {
        if (this.loadingElement === null) {
            this.loadingElement = document.createElement("div");
            this.loadingElement.setAttribute("slot", "loading");
            this.loadingElement.setClass("loading");
            this.appendChild(this.loadingElement);
        }
    }

    _removeProgress() {
        if (this.loadingElement !== null) {
            this.removeChild(this.loadingElement);
            this.loadingElement = null;
        }
    }
}

class TipsElement extends BaseElement {
    constructor() {
        super();
        super._addSlot("tipsButton");
    }

    static tagName() {
        return "tips-button";
    }

    renderElement(data) {
        this.dataset.content = data;
        this.connectedCallback();
    }

    connectedCallback() {
        super._removeProgress();
        let tipsElement = this.querySelector("span[slot='tipsButton']");
        if (this.dataset.content === undefined || this.dataset.content.length === 0) {
            if (tipsElement !== null) {
                this.removeChild(tipsElement);
            }
        } else {
            if (tipsElement === null) {
                tipsElement = document.createElement("span");
                tipsElement.setAttribute("slot", "tipsButton");
                this.appendChild(tipsElement);
                let tipsIcon = document.createElement("i");
                tipsIcon.setClass("icon-help-circle");
                tipsElement.appendChild(tipsIcon);
            }
            let tipsContent = this.querySelector("span > span");
            if (tipsContent === null) {
                tipsContent = document.createElement("span");
                tipsElement.appendChild(tipsContent);
            }
            tipsContent.innerText = this.dataset.content;
        }
    }
}

class AbstractElement extends BaseElement {
    constructor() {
        super();
        super._addSlot("itemName", "tips");
        this.labelElement = null;
        this.tipsElement = null;
    }

    _renderLabel() {
        if (this.labelElement === null) {
            this.labelElement = document.createElement("label");
            this.labelElement.setAttribute("slot", "itemName");
            this.appendChild(this.labelElement);
        }
        let textContent = (this.dataset.textContent === undefined) ? "" : this.dataset.textContent;
        if (textContent.length === 0) {
            this.labelElement.hide();
        } else {
            this.labelElement.show();
            if (this.dataset.id !== undefined) {
                this.labelElement.setAttribute("for", this.dataset.id);
            }
            this.labelElement.innerText = textContent;
        }

        if (this.dataset.tips !== undefined && this.dataset.tips.length > 0) {
            if (this.tipsElement === null) {
                this.tipsElement = new TipsElement();
                this.tipsElement.setAttribute("slot", "tips");
                this.appendChild(this.tipsElement);
            }
            this.tipsElement.data = this.dataset.tips;
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
        if (this._progressInfo === null) {
            this._progressInfo = document.createElement("span");
            this._progressInfo.setAttribute("slot", "progressInfo");
            this.appendChild(this._progressInfo);
        }
        if (this._progressText === null) {
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
            let limitTop = this.offsetHeight - this._scrollItem.offsetHeight;
            if (limitTop < top) {
                top = limitTop;
            }
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
            for (let i = 5; i > 0; i--) {
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
        this.scoreElement = null;
    }

    static tagName() {
        return "star-score";
    }

    connectedCallback() {
        if (this.scoreElement === null) {
            this.scoreElement = document.createElement("p");
            this.scoreElement.setAttribute("slot", "starScore");
            this.scoreElement.setAttribute("href", "#");
            this.appendChild(this.scoreElement);
            for (let i = 0; i < 5; i++) {
                let spanElement = document.createElement("i");
                spanElement.setClass("star");
                this.scoreElement.appendChild(spanElement);
            }
        }
    }

    set score(score) {
        if ((typeof score) === "number") {
            let starList = this.scoreElement.querySelectorAll("i");
            if (score <= 0) {
                starList.forEach(starItem => starItem.setClass("icon-star-outline"));
            } else if (score >= 5) {
                starList.forEach(starItem => starItem.setClass("icon-star-half"));
            } else {
                let fillCount = score | 0;
                for (let i = 1; i <= 5; i++) {
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
            this.scoreElement.setAttribute("title", score);
        }
    }
}

export {TipsElement, CustomElement, BaseElement, AbstractElement, ProgressBar, ScrollBar, StarRating, StarScore};