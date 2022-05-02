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
 *
 * Render a tips button, when mouse hover the button, show the tips message
 *
 * Value of attribute named "initData" is a json string like:
 * {
 *     "content": "Tips message"
 * }
 */
export default class TipsElement extends BaseElement {
    constructor() {
        super();
        if (this._shadowRoot.querySelector("slot[name='tipsButton']") === null) {
            let slotElement = document.createElement("slot");
            slotElement.setAttribute("name", "tipsButton");
            this._shadowRoot.appendChild(slotElement);
        }
    }

    static tagName() {
        return "tips-button";
    }

    renderElement(data) {
        if (data.hasOwnProperty("content")) {
            this.dataset.content = data.content;
            this.connectedCallback();
        }
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
                tipsIcon.setClass("icon-helpcircle");
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
