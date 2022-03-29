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

import {AbstractInput} from "./input.js"

class BaseButton extends AbstractInput {
    constructor(elementType = "button") {
        if (!["button", "submit", "reset"].includes(elementType.toLowerCase())) {
            throw new Error("Invalid element type");
        }
        super(elementType);
        this._timer = null;
        Object.defineProperty(this, "textContent", {
            set(data) {
                let inputElement = this._inputElement();
                if (inputElement !== null) {
                    inputElement.setAttribute("value", data);
                }
            }
        });
    }

    set id(id) {
        super.setAttribute("id", id);
    }

    renderElement(data) {
        if (data.hasOwnProperty("value")) {
            this.setAttribute("value", data.value);
        }
        if (data.hasOwnProperty("className")) {
            this.dataset.className = data.className;
        }
        if (data.hasOwnProperty("intervalTime")) {
            this.dataset.intervalTime = data.intervalTime;
        }
        if (data.hasOwnProperty("formId")) {
            this.dataset.formId = data.formId;
        }
        this._render();
    }

    connectedCallback() {
        super._removeProgress();
        super._addSlot("element", "icon");
        this._render();
    }

    _render() {
        let inputElement = super._inputElement();
        this.getAttributeNames()
            .filter(attributeName => attributeName.toLowerCase() !== "slot")
            .forEach(attributeName =>
                inputElement.setAttribute(attributeName, this.getAttribute(attributeName)));
        let buttonElement = this;
        if (this.dataset.intervalTime !== undefined && this.dataset.intervalTime.isNum()) {
            inputElement.addEventListener("click", () => {
                if (buttonElement._timer === null) {
                    buttonElement.dataset.buttonText = inputElement.getAttribute("value");
                    inputElement.disabled = true;
                    let countDown = buttonElement.dataset.intervalTime.parseInt();
                    buttonElement.dataset.countDown = countDown.toString();
                    inputElement.setAttribute("value", countDown.toString());
                    buttonElement._timer =
                        window.setInterval(function () {
                            buttonElement.disable.apply(buttonElement);
                        }, 1000);
                }
            });
        }
        if (this._elementType === "submit" || this._elementType === "reset") {
            inputElement.addEventListener("click", function () {
                let formElement = $(buttonElement.dataset.formId);
                if (formElement) {
                    switch (buttonElement._elementType) {
                        case "submit":
                            formElement.submit();
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
        let inputElement = super._inputElement();
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
            inputElement.setAttribute("value", countDown.toString());
            this.dataset.countDown = countDown.toString();
        }
    }

    enable() {
        if (this._timer !== null) {
            window.clearInterval(this._timer);
            this._timer = null;
        }
        this.dataset.countDown = "";
        let inputElement = super._inputElement();
        inputElement.setAttribute("value", this.dataset.buttonText);
        inputElement.disabled = false;
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

    set formId(formId) {
        this.dataset.formId = formId;
    }

    connectedCallback() {
        if (this.dataset.formId !== undefined) {
            super.connectedCallback();
        }
    }
}

class ResetButton extends BaseButton {
    constructor() {
        super("reset");
    }

    static tagName() {
        return "reset-button";
    }

    set formId(formId) {
        this.dataset.formId = formId;
    }

    connectedCallback() {
        if (this.dataset.formId !== undefined) {
            super.connectedCallback();
        }
    }
}

export {StandardButton, SubmitButton, ResetButton};