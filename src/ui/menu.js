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
import {RecordOperator} from "./list.js";

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
        this._appendProgress();
        this.menuList = document.createElement("div");
        this.menuList.setAttribute("slot", "menuList");
        this.appendChild(this.menuList);
        let initData = this.getAttribute("data");
        if (initData !== undefined && initData !== null && initData.isJSON()) {
            this.renderElement(initData.parseJSON());
        }
    }

    renderElement(data) {
        if (data.hasOwnProperty("className")) {
            this.setClass(data.className);
        }
        if (data.hasOwnProperty("targetId")) {
            this.dataset.targetId = data.targetId;
        }
        if (data.hasOwnProperty("languageCode")) {
            this.dataset.languageCode = data.languageCode;
        }
        if (data.hasOwnProperty("data")) {
            this.dataset.menuData = JSON.stringify(data.data);
        }
        this._render();
    }

    _render() {
        if (this.dataset.menuData !== undefined && this.dataset.menuData.isJSON()) {
            super._removeProgress();
            let itemList = this.menuList.querySelectorAll(":scope > menu-item"),
                existsCount = itemList.length, i = 0;
            let jsonData = this.dataset.menuData.parseJSON();
            jsonData.filter(itemData => itemData.hasOwnProperty("title"))
                .forEach(itemData => {
                    let menuItem;
                    if (i < existsCount) {
                        menuItem = itemList[i];
                    } else {
                        menuItem = new MenuItem();
                        this.menuList.appendChild(menuItem);
                    }
                    if (this.dataset.targetId !== undefined) {
                        menuItem.dataset.targetId = this.dataset.targetId;
                    }
                    if (this.dataset.languageCode !== undefined) {
                        menuItem.dataset.languageCode = this.dataset.languageCode;
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
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }

    renderElement(data) {
        if (data.hasOwnProperty("title")) {
            if (data.hasOwnProperty("sortCode") && data.sortCode.isNum()) {
                this.dataset.sortCode = data.sortCode;
            } else {
                this.dataset.sortCode = "0";
            }
            let languageCode;
            if (this.dataset.languageCode !== undefined) {
                languageCode = this.dataset.languageCode;
            } else {
                languageCode = "";
            }
            if (this.dataset.targetId !== undefined) {
                this._menuTitle.dataset.targetId = this.dataset.targetId;
            }
            MenuItem._renderContent(this._menuTitle, languageCode, data);
            if (data.hasOwnProperty("items")) {
                let itemList = this._menuList.querySelectorAll("menu-item"),
                    existsCount = itemList.length, i = 0;
                Array.from(data.items)
                    .filter(itemData => itemData.hasOwnProperty("title"))
                    .forEach(itemData => {
                        let menuItem;
                        if (i < existsCount) {
                            menuItem = itemList[i];
                        } else {
                            menuItem = new MenuItem();
                            this._menuList.appendChild(menuItem);
                        }
                        if (this.dataset.targetId !== undefined) {
                            menuItem.dataset.targetId = this.dataset.targetId;
                        }
                        menuItem.dataset.languageCode = languageCode;
                        menuItem.data = JSON.stringify(itemData);
                        i++;
                    });
                while (i < existsCount) {
                    this._menuList.removeChild(itemList[i]);
                    i++;
                }
                this._menuList.sortChildrenBy(":scope > menu-item", "data-sort-code", true);
            }
        }
    }

    static _renderContent(element, languageCode, itemData) {
        if (itemData.hasOwnProperty("link")) {
            let linkAddress = Cell.contextPath();
            if (languageCode.length > 0) {
                linkAddress += ("/" + languageCode);
            }
            linkAddress += itemData.link;
            element.setAttribute("href", linkAddress);
            if (element.dataset.targetId !== undefined) {
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
        spanElement.innerText = itemData.title;
        let iconElement = element.querySelector("i");
        if (iconElement === null) {
            iconElement = document.createElement("i");
            element.insertBefore(iconElement, spanElement);
        }
        if (itemData.hasOwnProperty("icon")) {
            iconElement.appendClass(itemData.icon);
            iconElement.show();
        } else {
            iconElement.setClass("");
            iconElement.hide();
        }
    }
}

class MultilingualMenu extends BaseElement {
    constructor() {
        super();
        super._addSlot("icon", "currentItem", "multiItems");
        this.currentItem = null;
        this.menuItems = null;
    }

    static tagName() {
        return "multi-menu";
    }

    renderElement(data) {
        if (data.hasOwnProperty("url") && data.url.length > 0) {
            this.menuItems.clearChildNodes();
            let urlTemplate = Cell.contextPath() + data.url;
            if (data.hasOwnProperty("items") && data.items instanceof Array) {
                data.items.forEach(itemData => {
                    if (itemData.hasOwnProperty("languageCode") && itemData.hasOwnProperty("languageName")) {
                        let itemButton = document.createElement("a");
                        this.menuItems.appendChild(itemButton);
                        itemButton.dataset.languageCode = itemData.languageCode;
                        itemButton.setAttribute("title", itemData.languageName);
                        itemButton.setAttribute("href",
                            urlTemplate.replace("{languageCode}", itemData.languageCode));
                        itemButton.innerText = itemData.languageName;
                    }
                });
            } else {
                this.menuItems.querySelectorAll("a")
                    .forEach(itemButton => {
                        itemButton.setAttribute("href",
                            urlTemplate.replace("{languageCode}", itemButton.dataset.languageCode));
                    });
            }
            if (this.menuItems.querySelectorAll("a").length > 0) {
                let currentLanguage = data.hasOwnProperty("current") ? data.current : Cell.language;
                this.menuItems.querySelectorAll("a")
                    .forEach(itemButton => {
                        if (itemButton.dataset.languageCode === currentLanguage) {
                            itemButton.setClass("current");
                            this.currentItem.innerText = itemButton.innerText;
                        } else {
                            itemButton.removeClass("current");
                        }
                    });
                this.show();
            } else {
                this.hide();
            }
        }
    }

    connectedCallback() {
        if (this.querySelector("i[slot='icon']") === null) {
            let iconElement = document.createElement("i");
            iconElement.setAttribute("slot", "icon");
            iconElement.setClass("icon-earth");
            this.appendChild(iconElement);
        }
        if (this.menuItems === null) {
            this.menuItems = document.createElement("div");
            this.menuItems.setAttribute("slot", "multiItems");
            this.appendChild(this.menuItems);
        }
        if (this.currentItem === null) {
            this.currentItem = document.createElement("span");
            this.currentItem.setAttribute("slot", "currentItem");
            this.appendChild(this.currentItem);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }
}

class CategoryMenu extends BaseElement {
    constructor() {
        super();
        super._addSlot("menuTitle", "menuList");
        this._menuTitle = null;
        this._menuList = null;
    }

    static tagName() {
        return "category-menu";
    }

    connectedCallback() {
        if (this._menuTitle === null) {
            this._menuTitle = document.createElement("h4");
            this._menuTitle.setAttribute("slot", "menuTitle");
            this.appendChild(this._menuTitle);
        }
        if (this._menuList === null) {
            this._menuList = document.createElement("div");
            this._menuList.setAttribute("slot", "menuList");
            this.appendChild(this._menuList);
        }
    }

    renderElement(data) {
        if (data.hasOwnProperty("className")) {
            this.setClass(data.className);
        }
        if (data.hasOwnProperty("title")) {
            this._menuTitle.innerHTML = data.title;
        }
        if (data.hasOwnProperty("items")) {
            this._menuList.clearChildNodes();
            data.items
                .filter(itemData => itemData.hasOwnProperty("link") && itemData.hasOwnProperty("textContent"))
                .forEach(itemData => {
                    let menuItem = new RecordOperator();
                    this._menuList.appendChild(menuItem);
                    menuItem.data = JSON.stringify(itemData);
                })
        }
    }
}

export {MenuElement, MenuItem, MultilingualMenu, CategoryMenu};