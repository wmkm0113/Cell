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

import {BaseElement, CustomElement, ScrollBar} from "./element.js";
import {BaseInput} from "./input.js";

/**
 * Abstract mock element
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": "value",
 *      "linkButton": "buttonId",
 *      "checked": true,
 *      "textContent": "Element label text",
 *      "textButton": "Label text after the mock button",
 *      "tips": {"content": "Tips message"}
 * }
 *
 * Automatic enable/disable button if configured linkButton
 *
 * Attention: "id" and "name" is required
 *
 */
class MockElement extends BaseInput {
    constructor(elementType = "", className = "") {
        super(elementType);
        super._addSlot("element");
        this._className = className;
        this._divElement = null;
        this._inputElement = null;
        this._spanElement = null;
    }

    renderElement(data) {
        if (data.hasOwnProperty("name")) {
            Object.keys(data).forEach(key =>
                this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key]));
            this.connectedCallback();
        }
    }

    _render() {
        if (this.dataset.name !== undefined && this.dataset.name.length > 0) {
            this._divElement.setClass(this._className);
            this._inputElement.setAttribute("type", this._elementType);
            this._inputElement.setAttribute("name", this.dataset.name);
            if (this.dataset.id !== undefined) {
                this._inputElement.setAttribute("id", this.dataset.id);
            }
            if (this.dataset.value !== undefined) {
                this._inputElement.setAttribute("value", this.dataset.value);
            }
            if (["checkbox", "radio"].indexOf(this._elementType) !== -1 && this.dataset.checked === "true") {
                this._inputElement.setAttribute("checked", this.dataset.checked);
            }
            this.attrNames().forEach(attributeName => {
                if (attributeName.startsWith("on")) {
                    this._inputElement.setAttribute(attributeName, this.getAttribute(attributeName));
                    this.removeAttribute(attributeName);
                }
            });
            if (this.dataset.buttonId !== undefined) {
                this._inputElement.addEventListener("change", (event) => {
                    event.stopPropagation();
                    if (this.checked) {
                        $(this.dataset.buttonId).enable();
                    } else {
                        $(this.dataset.buttonId).disable();
                    }
                });
            }

            this._spanElement.innerText = this.dataset.textButton === undefined ? "" : this.dataset.textButton;
        }
    }

    connectedCallback() {
        super._removeProgress();
        let tipsButton = this.querySelector("tips-button[slot='tips']");
        if (tipsButton) {
            this.removeChild(tipsButton);
        }
        if (this._divElement === null) {
            this._divElement = document.createElement("div");
            this._divElement.setAttribute("slot", "element");
            this.appendChild(this._divElement);
            this.addEventListener("click", (event) => {
                event.stopPropagation();
                if (this._elementType === "checkbox") {
                    if (this.checked) {
                        this._removeAttribute("checked");
                    } else {
                        this._updateAttribute("checked", "");
                    }
                }
            });
        }
        if (this._inputElement === null) {
            this._inputElement = document.createElement("input");
            this._divElement.appendChild(this._inputElement);
        }
        if (this._spanElement === null) {
            let labelElement = document.createElement("label");
            if (this.dataset.id !== undefined) {
                labelElement.setAttribute("for", this.dataset.id);
            }
            labelElement.appendChild(document.createElement("i"));
            this._divElement.appendChild(labelElement);
            this._spanElement = document.createElement("span");
            labelElement.appendChild(this._spanElement);
        }
        this._render();
    }
}

/**
 * Flat style button
 */
class MockSwitch extends MockElement {
    constructor() {
        super("checkbox", "mock-switch");
    }

    static tagName() {
        return "mock-switch";
    }
}

/**
 * Mock checkbox
 */
class MockCheckBox extends MockElement {
    constructor() {
        super("checkbox");
    }

    static tagName() {
        return "mock-checkbox";
    }
}

/**
 * Mock radio button
 */
class MockRadio extends MockElement {
    constructor() {
        super("radio", "mockElement mockRadio");
    }

    static tagName() {
        return "mock-radio";
    }
}

/**
 * Mock dialog for float notification and notify center
 */
class MockDialog extends CustomElement {
    constructor() {
        super();
    }

    static tagName() {
        return "mock-dialog";
    }

    showMessage(message = "", type = "alert", callFunc = null) {
        document.body.style.overflow = "hidden";
        let dialogElement = document.createElement("div");
        dialogElement.setAttribute("slot", "dialog");
        dialogElement.setClass(type);
        this.appendChild(dialogElement);

        let messageElement = document.createElement("span");
        messageElement.innerHTML = message;
        dialogElement.appendChild(messageElement);

        let confirmBtn = document.createElement("button");
        confirmBtn.setAttribute("id", "confirm-btn");
        dialogElement.appendChild(confirmBtn);
        confirmBtn.innerText = "OK";

        if (type === "confirm") {
            let cancelBtn = document.createElement("button");
            cancelBtn.setAttribute("id", "cancel-btn");
            dialogElement.appendChild(cancelBtn);
            cancelBtn.innerText = "Cancel";
            cancelBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this._remove(dialogElement);
            });
            confirmBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                if (callFunc !== null) {
                    callFunc.apply(dialogElement);
                }
                this._remove(dialogElement);
            });
        } else {
            confirmBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this._remove(dialogElement);
            });
        }
    }

    _remove(dialogElement) {
        if (dialogElement.parentElement !== null) {
            this.removeChild(dialogElement);
            if (this.querySelectorAll("div[slot='dialog']").length === 0) {
                document.body.style.overflow = "auto";
                document.body.removeChild(this);
            }
        }
    }

    connectedCallback() {
        let slotElement = document.createElement("slot");
        slotElement.setAttribute("name", "dialog");
        this._shadowRoot.appendChild(slotElement);
    }
}

class NotifyArea extends CustomElement {
    constructor() {
        super();
        super._addSlot("floatNotify", "notification", "button");
        this._floatButton = null;
        this._floatNotify = null;
        this._notification = null;
    }

    static tagName() {
        return "notify-area";
    }

    connectedCallback() {
        if (this._floatNotify === null) {
            this._floatNotify = document.createElement("div");
            this._floatNotify.setAttribute("slot", "floatNotify");
            this.appendChild(this._floatNotify);
        }
        if (this._notification === null) {
            this._notification = document.createElement("div");
            this._notification.setAttribute("slot", "notification");
            this.appendChild(this._notification);
        }

        if (this._floatButton === null) {
            this._floatButton = document.createElement("i");
            this._floatButton.setAttribute("slot", "button");
            this._floatButton.setClass("icon-bell-ring")
            this.appendChild(this._floatButton);
            this._floatButton.addEventListener("click", (event) => {
                event.stopPropagation();
                if (this._notification !== null) {
                    if (this.hasClass("notify")) {
                        document.body.style.overflow = "auto";
                        this.removeClass("notify");
                    } else {
                        document.body.style.overflow = "hidden";
                        this.appendClass("notify");
                    }
                }
            });
        }
        this.hide();
    }

    notify(data = "") {
        if (data.isJSON()) {
            let jsonData = data.parseJSON();
            if (jsonData.hasOwnProperty("textContent")) {
                let notifyItem = document.createElement("div");
                let linkElement = document.createElement("a");
                linkElement.href = jsonData.hasOwnProperty("link") ? jsonData.link : "#";
                if (jsonData.hasOwnProperty("imgPath")) {
                    let picItem = document.createElement("img");
                    picItem.setAttribute("src", jsonData.imgPath);
                    linkElement.appendChild(picItem);
                }
                let spanElement = document.createElement("span");
                spanElement.innerHTML = jsonData.textContent;
                linkElement.appendChild(spanElement);
                notifyItem.appendChild(linkElement);
                let floatItem = notifyItem.cloneNode(true);
                let clearButton = document.createElement("i");
                clearButton.setClass("icon-close");
                notifyItem.appendChild(clearButton);
                this._notification.appendChild(notifyItem);
                clearButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this._notification.removeChild(notifyItem);
                    this.checkNotify();
                });
                let clearFloat = document.createElement("i");
                clearFloat.setClass("icon-close");
                floatItem.appendChild(clearFloat);
                let notify = this;
                clearFloat.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (floatItem.parentElement !== null) {
                        floatItem.parentElement.removeChild(floatItem);
                    }
                    notify.checkFloat.apply(notify);
                });
                this._floatNotify.style.opacity = "1";
                this._floatNotify.appendChild(floatItem);
                window.setTimeout(() => {
                    if (floatItem.parentElement !== null) {
                        floatItem.parentElement.removeChild(floatItem);
                    }
                    notify.checkFloat.apply(notify);
                }, this.dataset.floatTimeout === undefined ? 5000 : this.dataset.floatTimeout);
            }
            this.checkNotify();
        }
    }

    checkNotify() {
        if (this._notification.querySelectorAll("div").length === 0) {
            this._floatButton.setClass("icon-bell");
            this.hide();
            this._floatButton.click();
            document.body.style.overflow = "auto";
        } else {
            this._floatButton.setClass("icon-bell-ring");
            this.show();
        }
    }

    checkFloat() {
        if (this._floatNotify.childList().length === 0) {
            this._floatNotify.style.opacity = "0";
        }
    }
}

/**
 * Float window element
 */
class FloatWindow extends BaseElement {
    constructor() {
        super();
        super._addSlot("floatWindow");
        let floatWindow = this;
        this.listenerFunc = (event) => {
            event.stopPropagation();
            floatWindow.resize();
        };
        window.addEventListener("resize", this.listenerFunc);
    }

    static tagName() {
        return "float-window";
    }

    close() {
        document.body.style.overflowY = "scroll";
        this.parentElement.removeChild(this);
    }

    renderElement(data) {
        let pageElement = this.querySelector("float-page");
        if (pageElement !== null) {
            pageElement.data = JSON.stringify(data);
        }
    }

    connectedCallback() {
        let pageElement = this.querySelector("float-page");
        if (pageElement === null) {
            pageElement = new FloatPage();
            pageElement.setAttribute("slot", "floatWindow");
            this.appendChild(pageElement);
        }
        this.resize();
    }

    disconnectedCallback() {
        window.removeEventListener("resize", this.listenerFunc);
    }

    resize() {
        this.style.width = "100%";
        this.style.height = document.body.scrollHeight + "px";
        let pageElement = this.querySelector("float-page");
        if (pageElement !== null) {
            pageElement.resize();
        }
    }
}

/**
 * Float page element
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "tagName": "Tag name",          //  Element tag name
 *      "title": "Current title",       //  Set for title in html head element
 *      "keywords": "Key words",        //  Set for keywords in html head element
 *      "description": "true",          //  Set for description in html head element
 *      "data": {
 *          //  Element data
 *      }
 * }
 *
 * Attention: "tagName" and "data" was required
 *
 */
class FloatPage extends BaseElement {
    constructor() {
        super();
        super._addSlot("closeBtn", "floatPage", "scroll");
        this._divElement = null;
        this._childElement = null;
        this._scrollBar = null;
        this._beginPosition = 0;
        this._beginPoint = -1;
        this._itemHeight = -1;
        this._pageHeight = -1;
        this._windowHeight = -1;
    }

    static tagName() {
        return "float-page";
    }

    close() {
        this.parentElement.close();
    }

    renderElement(data) {
        this.dataset.data = JSON.stringify(data);
        this.render();
    }

    _mouseDown(event, scrollBar) {
        event.stopPropagation();
        scrollBar._beginPoint = event.clientY;
        scrollBar._beginPosition = scrollBar._divElement.scrollTop;
    }

    _mouseMove(event, scrollBar) {
        event.stopPropagation();
        if (scrollBar._beginPoint !== -1) {
            let movePosition = event.clientY - scrollBar._beginPoint;
            if (movePosition !== 0) {
                let movePoint = Math.floor(scrollBar._pageHeight * movePosition / scrollBar._windowHeight);
                scrollBar._divElement.scroll(0, scrollBar._beginPosition + movePoint);
            }
        }
    }

    _mouseUp(event, scrollBar) {
        event.stopPropagation();
        if ((event.clientY - scrollBar._beginPoint) === 0) {
            let movePosition = 0;
            let scrollTop = scrollBar._scrollBar.scrollTop();
            if (event.clientY < scrollTop) {
                movePosition = scrollBar._windowHeight * -1;
            } else if (event.clientY > (scrollTop + scrollBar._itemHeight)) {
                movePosition = scrollBar._windowHeight;
            }

            let targetPosition = scrollTop + movePosition;
            if (targetPosition < 0) {
                scrollBar._divElement.scroll(0, 0);
            } else if (targetPosition > scrollBar._differentHeight) {
                scrollBar._divElement.scroll(0, scrollBar._beginPosition + scrollBar._differentHeight);
            } else {
                scrollBar._divElement.scroll(0, targetPosition);
            }
            scrollBar._beginPosition = scrollBar._divElement.scrollTop;
        }
        scrollBar._beginPoint = -1;
    }

    _scroll(event) {
        event.stopPropagation();
        event.target.parentElement.scroll();
    }

    resize() {
        let scrollTop = window.scrollY;
        let height = Math.floor(window.innerHeight * 0.8);
        this.style.height = height + "px";
        let top = Math.floor((window.innerHeight - height) / 2);
        this.style.top = (scrollTop + top - 20) + "px";
        if (this._childElement !== null) {
            this._pageHeight = window.getComputedStyle(this._childElement).height.parseInt();
            this._windowHeight = window.getComputedStyle(this._divElement).height.parseInt();
            if (this._windowHeight < this._pageHeight) {
                this._scrollBar.enable();
                this._itemHeight = Math.floor(this._windowHeight * this._windowHeight / this._pageHeight);
                this._scrollBar.initHeight(this._itemHeight);
                this._differentHeight = this._pageHeight - this._windowHeight;
                this._divElement.addEventListener("scroll", this._scroll);
                let scrollBar = this;
                this._scrollBar.addEventListener("mousedown", (event) => this._mouseDown(event, scrollBar));
                document.addEventListener("mousemove", (event) => this._mouseMove(event, scrollBar));
                document.addEventListener("mouseup", (event) => this._mouseUp(event, scrollBar));
            } else {
                this._scrollBar.disable();
                this._divElement.removeEventListener("scroll", this._scroll);
                let scrollBar = this;
                this._scrollBar.removeEventListener("mousedown", (event) => this._mouseDown(event, scrollBar));
                document.removeEventListener("mousemove", (event) => this._mouseMove(event, scrollBar));
                document.removeEventListener("mouseup", (event) => this._mouseUp(event, scrollBar));
                this._beginPoint = -1;
            }
        }
    }

    scroll() {
        let pageStyle = window.getComputedStyle(this._childElement);
        let windowStyle = window.getComputedStyle(this._divElement);
        let pageHeight = pageStyle.height.parseInt();
        let windowHeight = windowStyle.height.parseInt();
        let itemHeight = Math.floor(windowHeight * windowHeight / pageHeight);
        let scrollTop = this._divElement.scrollTop;
        let different = pageHeight - windowHeight;
        this._scrollBar.scroll(Math.floor((windowHeight - itemHeight) * scrollTop / different));
    }

    connectedCallback() {
        super._removeProgress();
        if (this._divElement === null) {
            this._divElement = document.createElement("div");
            this._divElement.setAttribute("slot", "floatPage");
            this.appendChild(this._divElement);
        }
        if (this.querySelector("button[slot='closeBtn']") === null) {
            let closeBtn = document.createElement("button");
            closeBtn.setAttribute("slot", "closeBtn");
            closeBtn.setClass("icon icon-close");
            let floatPage = this;
            closeBtn.addEventListener("click", function (event) {
                event.stopPropagation();
                document.body.style.overflowY = "scroll";
                floatPage.close();
            });
            this.appendChild(closeBtn);
        }
        if (this._scrollBar === null) {
            this._scrollBar = new ScrollBar();
            this._scrollBar.setAttribute("slot", "scroll");
            this.appendChild(this._scrollBar);
        }
        if (this.dataset.data === undefined) {
            this._divElement.appendClass("waitingData");
        } else {
            this.render();
        }
        this.resize();
    }

    render() {
        this._divElement.removeClass("waitingData");
        document.body.style.overflowY = "hidden";
        if (this.dataset.data !== undefined && this.dataset.data.isJSON()) {
            let jsonData = this.dataset.data.parseJSON();
            if (jsonData.hasOwnProperty("tagName") && jsonData.hasOwnProperty("data")) {
                if (this._childElement === null
                    || this._childElement.tagName.toLowerCase() !== jsonData.tagName.toLowerCase()) {
                    //  Remove exists elements
                    if (this._childElement !== null) {
                        this._divElement.removeChild(this._childElement);
                        this._childElement = null;
                    }
                    this._childElement = document.createElement(jsonData.tagName);
                    this._divElement.appendChild(this._childElement);
                }
                this._childElement.data = JSON.stringify(jsonData.data);
            }
        }
        this.resize();
    }
}

export {MockSwitch, MockCheckBox, MockRadio, MockDialog, NotifyArea, FloatWindow, FloatPage};