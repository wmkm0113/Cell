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

export default class SocialGroup extends BaseElement {
    constructor() {
        super();
        this._addSlot("title", "items");
        this.titleElement = null;
    }

    static tagName() {
        return "social-group";
    }

    connectedCallback() {
        this._render();
    }

    renderElement(data) {
        this.dataset.itemData = JSON.stringify(data);
        this._render();
    }

    _render() {
        if (this.dataset.itemData === undefined || this.dataset.itemData.length === 0
            || !this.dataset.itemData.isJSON()) {
            return;
        }

        if (this.titleElement === null) {
            this.titleElement = document.createElement("span");
            this.titleElement.setAttribute("slot", "title");
            this.appendChild(this.titleElement);
        }

        let jsonData = this.dataset.itemData.parseJSON(), existsItems = this.querySelectorAll("a"),
            existsCount = existsItems.length, i = 0;
        if (jsonData.hasOwnProperty("textContent")) {
            this.titleElement.innerHTML = jsonData.textContent;
        }
        if (jsonData.hasOwnProperty("items")) {
            Array.from(jsonData.items)
                .filter(jsonItem => jsonItem.hasOwnProperty("className"))
                .forEach(jsonItem => {
                    let linkElement;
                    if (i < existsCount) {
                        linkElement = existsItems[i];
                    } else {
                        linkElement = document.createElement("a");
                        linkElement.setAttribute("slot", "items");
                        linkElement.setAttribute("target", "_blank");
                        this.appendChild(linkElement);
                    }
                    linkElement.setClass(jsonItem.className);
                    linkElement.setAttribute("title", jsonItem.hasOwnProperty("title") ? jsonItem.title : "");
                    linkElement.setAttribute("href", jsonItem.hasOwnProperty("link") ? jsonItem.link : "#");
                    if (jsonItem.hasOwnProperty("sortIndex")) {
                        linkElement.dataset.sortIndex = jsonItem.sortIndex;
                    } else {
                        linkElement.dataset.sortIndex = "0";
                    }
                });
            this.sortChildrenBy("a", "data-sort-index", true);
        }
    }
}