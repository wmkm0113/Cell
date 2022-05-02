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

class MenuElement extends BaseElement {
    constructor() {
        super();
        super._addSlot("menuList");
        this.menuList = null;
    }

    static tagName() {
        return "menu-element";
    }

    connectedCallback() {
        this._removeProgress();
        this.menuList = document.createElement("div");
        this.menuList.setAttribute("slot", "menuList");
        this.appendChild(this.menuList);
        let initData = this.getAttribute("data");
        if (initData !== undefined && initData !== null && initData.isJSON()) {
            this.dataset.menuData = initData;
        }
        this._render();
    }

    renderElement(data) {
        if (data.hasOwnProperty("className")) {
            this.setClass(data.className);
        }
        if (data.hasOwnProperty("elementId")) {
            this.dataset.elementId = data.elementId;
        }
        if (data.hasOwnProperty("data")) {
            this.dataset.menuData = JSON.stringify(data.data);
        }
        this._render();
    }

    _render() {
        if (this.dataset.menuData !== undefined && this.dataset.menuData.isJSON()) {
            let itemList = this.menuList.querySelectorAll(":scope > menu-item"),
                existsCount = itemList.length, i = 0;
            let jsonData = this.dataset.menuData.parseJSON();
            jsonData
                .filter(itemData => itemData.hasOwnProperty("title"))
                .forEach(itemData => {
                    let menuItem;
                    if (i < existsCount) {
                        menuItem = itemList[i];
                    } else {
                        menuItem = new MenuItem();
                        this.menuList.appendChild(menuItem);
                    }
                    if (this.dataset.elementId !== undefined) {
                        menuItem.dataset.elementId = this.dataset.elementId;
                    }
                    menuItem.data = JSON.stringify(itemData);
                    i++;
                });

            while (i < existsCount) {
                this.menuList.removeChild(itemList[i]);
                i++;
            }
            this.menuList.sortChildrenBy(":scope > menu-item", "data-sort-index", true);
        }
    }
}

class MenuItem extends BaseElement {
    constructor() {
        super();
        super._addSlot("menuTitle", "menuList");
        this._menuTitle = null;
        this._menuList = null;
    }

    static tagName() {
        return "menu-item";
    }

    connectedCallback() {
        this._menuTitle = this.querySelector("a[slot='menuTitle']");
        if (this._menuTitle === null) {
            this._menuTitle = document.createElement("a");
            this._menuTitle.setAttribute("slot", "menuTitle");
            this.appendChild(this._menuTitle);
        }
        this._menuList = this.querySelector("div[slot='menuList']");
        if (this._menuList === null) {
            this._menuList = document.createElement("div");
            this._menuList.setAttribute("slot", "menuList");
            this.appendChild(this._menuList);
        }
        this._render();
    }

    renderElement(data) {
        this.dataset.menuData = JSON.stringify(data);
        this._render();
    }

    static _renderContent(element, languageCode, itemData) {
        if (itemData.hasOwnProperty("link")) {
            let linkAddress = Cell.contextPath();
            if (languageCode.length > 0) {
                linkAddress += ("/" + languageCode);
            }
            linkAddress += itemData.link;
            element.setAttribute("href", linkAddress);
            if (element.dataset.elementId !== undefined) {
                element.bindEvent("click", Cell.sendRequest);
            }
        } else {
            element.setAttribute("href", "#");
        }
        let spanElement = element.querySelector("span[name='textContent']");
        if (spanElement === null) {
            spanElement = document.createElement("span");
            spanElement.setAttribute("name", "textContent");
            element.appendChild(spanElement);
        }
        spanElement.innerHTML = itemData.title;
        let iconElement = element.querySelector("i[name='icon']");
        if (iconElement === null) {
            iconElement = document.createElement("i");
            iconElement.setAttribute("name", "icon");
            element.insertBefore(iconElement, spanElement);
        }
        if (itemData.hasOwnProperty("icon")) {
            iconElement.setClass(itemData.icon);
            iconElement.show();
        } else {
            iconElement.setClass("");
            iconElement.hide();
        }
    }

    _render() {
        if (this.dataset.menuData !== undefined && this.dataset.menuData.isJSON()) {
            let jsonData = this.dataset.menuData.parseJSON();
            if (jsonData.hasOwnProperty("title")) {
                if (jsonData.hasOwnProperty("sortIndex") && jsonData.sortIndex.isNum()) {
                    this.dataset.sortIndex = jsonData.sortIndex;
                } else {
                    this.dataset.sortIndex = "0";
                }
                let languageCode;
                if (this.dataset.languageCode !== undefined) {
                    languageCode = this.dataset.languageCode;
                } else {
                    languageCode = "";
                }
                if (this.dataset.elementId !== undefined) {
                    this._menuTitle.dataset.elementId = this.dataset.elementId;
                }
                MenuItem._renderContent(this._menuTitle, languageCode, jsonData);
                if (jsonData.hasOwnProperty("items")) {
                    let itemList = this._menuList.querySelectorAll("menu-item"),
                        existsCount = itemList.length, i = 0;
                    Array.from(jsonData.items)
                        .filter(itemData => itemData.hasOwnProperty("title"))
                        .forEach(itemData => {
                            let menuItem;
                            if (i < existsCount) {
                                menuItem = itemList[i];
                            } else {
                                menuItem = new MenuItem();
                                this._menuList.appendChild(menuItem);
                            }
                            if (this.dataset.elementId !== undefined) {
                                menuItem.dataset.elementId = this.dataset.elementId;
                            }
                            menuItem.dataset.languageCode = languageCode;
                            menuItem.data = JSON.stringify(itemData);
                            i++;
                        });
                    while (i < existsCount) {
                        this._menuList.removeChild(itemList[i]);
                        i++;
                    }
                    this._menuList.sortChildrenBy(":scope > menu-item", "data-sort-index", true);
                }
            }
        }
    }
}

export {MenuElement, MenuItem};