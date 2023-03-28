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

import {BaseElement, StarScore} from "./element.js";
import {MockCheckBox} from "./mock.js";
import {StandardButton, HiddenInput} from "./input.js";
import {ResourceDetails, UserDetails} from "./details.js";
import {FormInfo} from "./form.js";

/**
 * Message List Filter Form
 *
 * Value of attribute named "data" is json string like:
 * {
 *      "id": "elementId",
 *      "method": "post",
 *      "action": "url",
 *      "sortBy": "sortByElementName",
 *      "sortType": "sortTypeElementName",
 *      "pageNo": "pageNoElementName",
 *      "pageLimit": "pageLimitElementName",
 *      "items": [
 *          {
 *              "id": "elementId",
 *              "name": "elementName",
 *              "tag": "search-input",
 *              "value": "",
 *              "placeholder": "Place holder text",
 *              "textContent": "Element label text",
 *              "tips": {"content": "Tips message"}
 *          },
 *          {
 *              "id": "elementId",
 *              "beginName": "beginElement",
 *              "endName": "endElement",
 *              "tag": "number-interval-input",
 *              "beginValue": "1",
 *              "endValue": "3",
 *              "textContent": "Element label text",
 *              "tips": {"content": "Tips message"}
 *          },
 *          {
 *              "id": "elementId",
 *              "name": "elementName",
 *              "tag": "checkbox-group",
 *              "value": ["value2", "value4"],
 *              "textContent": "Element label text",
 *              "tips": {"content": "Tips message"},
 *              "items": [
 *                  {'id' : 'radioButtonId', 'value' : 'radioValue1', 'textButton' : 'Radio Content'},
 *                  {'id' : 'radioButtonId', 'value' : 'radioValue2', 'textButton' : 'Radio Content'},
 *                  {'id' : 'radioButtonId', 'value' : 'radioValue3', 'textButton' : 'Radio Content'}
 *              ]
 *          },
 *          {
 *              "id": "elementId",
 *              "name": "elementName",
 *              "tag": "radio-group",
 *              "value": "Initialize value",
 *              "textContent": "Element label text",
 *              "tips": {"content": "Tips message"},
 *              "items": [
 *                  {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'},
 *                  {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'},
 *                  {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'}
 *              ]
 *          },
 *          {
 *              "id": "elementId",
 *              "name": "elementName",
 *              "itemType": "search-input",
 *              "value": "Initialize value",
 *              "textContent": "Element label text",
 *              "tips": {"content": "Tips message"}
 *          }
 *      ]
 * }
 */
class ListFilter extends BaseElement {

    constructor() {
        super();
        super._addSlot("filterForm", "searchBtn");
        this.filterForm = null;
        this.sortByElement = null;
        this.sortTypeElement = null;
        this.pageNoElement = null;
        this.pageLimitElement = null;
    }

    static tagName() {
        return "list-filter";
    }

    renderElement(data) {
        Object.keys(data).forEach(key => {
            switch (key.toLowerCase()) {
                case "action":
                case "method":
                    this.filterForm.setAttribute(key, data[key]);
                    break;
                default:
                    this.dataset[key] = ((typeof data[key]) === "string") ? data[key] : JSON.stringify(data[key]);
                    break;
            }
        })
        this._render();
    }

    connectedCallback() {
        super._removeProgress();
        this.filterForm = document.createElement("form");
        this.filterForm.setAttribute("slot", "filterForm");
        this.appendChild(this.filterForm);
        this._render();
    }

    _render() {
        if (this.dataset.targetId !== null && this.dataset.targetId !== undefined) {
            this.filterForm.dataset.targetId = this.dataset.targetId;
        }
        this.filterForm.clearChildNodes();
        if (this.dataset.sortBy !== undefined && this.dataset.sortBy.length > 0) {
            if (this.sortByElement === null) {
                this.sortByElement = new HiddenInput();
                this.sortByElement.dataset.name = this.dataset.sortBy;
            }
            this.filterForm.appendChild(this.sortByElement);
        }
        if (this.dataset.sortType !== undefined && this.dataset.sortType.length > 0) {
            if (this.sortTypeElement === null) {
                this.sortTypeElement = new HiddenInput();
                this.sortTypeElement.dataset.name = this.dataset.sortType;
            }
            this.filterForm.appendChild(this.sortTypeElement);
        }
        if (this.dataset.pageNo !== undefined && this.dataset.pageNo.length > 0) {
            if (this.pageNoElement === null) {
                this.pageNoElement = new HiddenInput();
                this.pageNoElement.dataset.id = this.dataset.pageNo;
                this.pageNoElement.dataset.name = this.dataset.pageNo;
            }
            this.filterForm.appendChild(this.pageNoElement);
        }
        if (this.dataset.pageLimit !== undefined && this.dataset.pageLimit.length > 0) {
            if (this.pageLimitElement === null) {
                this.pageLimitElement = new HiddenInput();
                this.pageLimitElement.dataset.id = this.dataset.pageLimit;
                this.pageLimitElement.dataset.name = this.dataset.pageLimit;
            }
            this.filterForm.appendChild(this.pageLimitElement);
        }
        if (this.dataset.className !== undefined && this.dataset.className.length > 0) {
            this.filterForm.setClass(this.dataset.className);
        }
        let searchBtn = this.querySelector("standard-button[slot='searchBtn']");
        if (searchBtn === null) {
            searchBtn = new StandardButton();
            searchBtn.setAttribute("slot", "searchBtn");
            searchBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this._submitForm();
            });
            searchBtn.value = "Search";
            this.appendChild(searchBtn);
        }
        if (this.dataset.searchText !== undefined && this.dataset.searchText.length > 0) {
            searchBtn.textContent = this.dataset.searchText;
        }
        if (this.dataset.items === undefined || !this.dataset.items.isJSON()) {
            this.hide();
            return;
        }
        let jsonData = this.dataset.items.parseJSON();
        if (Array.from(jsonData).length === 0) {
            this.hide();
        } else {
            Array.from(jsonData)
                .filter(itemData => itemData.hasOwnProperty("tag"))
                .forEach(itemData => {
                    let filterItem = document.createElement(itemData.tag);
                    this.filterForm.appendChild(filterItem);
                    filterItem.data = JSON.stringify(itemData);
                });
            this.show();
        }
    }

    refresh() {
        this._submitForm();
    }

    sortQuery(sortBy = "", asc = false) {
        if (this.sortByElement !== null) {
            this.sortByElement.value = sortBy;
        }
        if (this.sortTypeElement !== null) {
            this.sortTypeElement.value = asc ? "ASC" : "DESC";
        }
        this._submitForm();
    }

    pageQuery(pageNo = 1) {
        if (this.pageNoElement !== null) {
            this.pageNoElement.value = pageNo;
        }
        this._submitForm();
    }

    _submitForm() {
        if (this.dataset.targetId !== undefined && this.dataset.targetId !== null) {
            this.filterForm.dataset.targetId = this.dataset.targetId;
        }
        Cell.submitForm(this.filterForm);
    }
}

/**
 * Message List Statistics
 *
 * Value of attribute named "data" is json string like:
 *  [
 *      {
 *          "index": 1,
 *          "id": "index1",
 *          "title": "Title 1",
 *          "data": "Data 1"
 *      },
 *      {
 *          "index": 2,
 *          "id": "index2",
 *          "title": "Title 2",
 *          "data": "Data 2"
 *      },
 *      {
 *          "index": 3,
 *          "id": "index3",
 *          "title": "Title 3",
 *          "data": "Data 3"
 *      },
 *      {
 *          "index": 4,
 *          "id": "index4",
 *          "title": "Title 4",
 *          "data": "Data 4"
 *      }
 *  ]
 *
 *  Item sort by index desc
 *
 */
class ListStatistics extends BaseElement {
    constructor() {
        super();
        super._addSlot("statistics");
        this.statisticsElement = null;
    }

    static tagName() {
        return "list-statistics";
    }

    connectedCallback() {
        this._removeProgress();
        if (this.statisticsElement === null) {
            this.statisticsElement = document.createElement("div");
            this.statisticsElement.setAttribute("slot", "statistics");
            this.appendChild(this.statisticsElement);
        }
    }

    renderElement(data) {
        if (data === null) {
            return;
        }

        if (data instanceof Array) {
            this.statisticsElement.clearChildNodes();
            data.forEach(dataItem => {
                if (dataItem.hasOwnProperty("id") && dataItem.hasOwnProperty("title")
                    && dataItem.hasOwnProperty("data")) {
                    let itemElement = document.createElement("div");
                    itemElement.setAttribute("id", dataItem.id);
                    itemElement.dataset.sortCode =
                        dataItem.hasOwnProperty("sortCode") ? dataItem.sortCode.toString() : "0";
                    this.statisticsElement.appendChild(itemElement);
                    let titleElement = document.createElement("span");
                    titleElement.setAttribute("id", "title");
                    titleElement.innerText = dataItem.title;
                    itemElement.appendChild(titleElement);
                    let dataElement = document.createElement("span");
                    dataElement.setAttribute("id", "data");
                    dataElement.innerText = dataItem.data;
                    itemElement.appendChild(dataElement);
                    if (dataItem.hasOwnProperty("className")) {
                        itemElement.appendClass(dataItem.className);
                    }
                    if (dataItem.hasOwnProperty("link")) {
                        itemElement.dataset.link = dataItem.link;
                        itemElement.addEventListener("click", (event) => Cell.sendRequest(event));
                    }
                }
            });
            this.statisticsElement.sortChildrenBy("div", "data-sort-code", true);
            if (data.length > 0) {
                this.show();
            } else {
                this.hide();
            }
        }
    }
}

/**
 * Message List Title
 *
 * setting for title, import url, export url and display switch button(text-list, view-list, image-list)
 * setting for default styleClass(text-list, view-list, image-list)
 *
 * Value of attribute named "data" is json string like:
 * {
 *      "title": "Message List Title",
 *      "importUrl": "Import data url",
 *      "disableSwitch": true/false,
 *      "styleClass": "view-list"
 * }
 *
 */
class ListTitle extends BaseElement {
    constructor() {
        super();
        super._addSlot("title", "btnGroup");
        this.titleElement = null;
        this.btnGroup = null;
    }

    static tagName() {
        return "list-title";
    }

    connectedCallback() {
        this._removeProgress();
        if (this.titleElement === null) {
            this.titleElement = document.createElement("span");
            this.titleElement.setAttribute("slot", "title");
            this.appendChild(this.titleElement);
        }
        if (this.btnGroup === null) {
            this.btnGroup = document.createElement("div");
            this.btnGroup.setAttribute("slot", "btnGroup");
            this.appendChild(this.btnGroup);

            ["text-list", "view-list", "image-list"].forEach(listType => {
                let styleBtn = document.createElement("i");
                styleBtn.dataset.listType = listType;
                switch (listType) {
                    case "text-list":
                        styleBtn.setClass("icon-view-headline");
                        break;
                    case "view-list":
                        styleBtn.setClass("icon-view-list");
                        break;
                    case "image-list":
                        styleBtn.setClass("icon-view-grid");
                        break;
                }
                if ("view-list" === listType) {
                    styleBtn.appendClass("current");
                }
                this.btnGroup.appendChild(styleBtn);
                styleBtn.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.parentElement.switchStyle(listType);
                    this.btnGroup.querySelectorAll(":scope > i").forEach(itemBtn => {
                        if (itemBtn.dataset.listType === listType) {
                            itemBtn.appendClass("current");
                        } else {
                            itemBtn.removeClass("current");
                        }
                    });
                });
            });
        }
    }

    renderElement(data) {
        if (data.hasOwnProperty("textContent")) {
            this.titleElement.innerText = data.textContent;
            this.titleElement.show();
        } else {
            this.titleElement.hide();
        }
        if (data.hasOwnProperty("disableSwitch") && data.disableSwitch) {
            this.btnGroup.querySelectorAll(":scope > i")
                .forEach(itemBtn => itemBtn.hide());
        } else {
            this.btnGroup.querySelectorAll(":scope > i")
                .forEach(itemBtn => itemBtn.show());
        }
        if (data.hasOwnProperty("styleClass")) {
            this.btnGroup.querySelectorAll(":scope > i")
                .forEach(buttonElement => {
                    if (buttonElement.dataset.listType === data.styleClass) {
                        buttonElement.click();
                    }
                });
        }
    }
}

class PropertyItem extends BaseElement {
    constructor() {
        super();
        super._addSlot("name", "value");
        this.nameElement = null;
        this.valueElement = null;
    }

    static tagName() {
        return "property-item";
    }

    itemName(name = "") {
        if (name == null || name.length === 0) {
            return;
        }
        if (this.nameElement === null) {
            this.nameElement = document.createElement("span");
            this.nameElement.setAttribute("slot", "name");
            this.appendChild(this.nameElement);
        }
        this.nameElement.innerText = name;
    }

    itemValue(value = "") {
        if (value == null || value.length === 0) {
            return;
        }
        if (this.valueElement === null) {
            this.valueElement = document.createElement("span");
            this.valueElement.setAttribute("slot", "value");
            this.appendChild(this.valueElement);
        }
        this.valueElement.innerText = value;
        this.valueElement.setAttribute("title", value);
    }

    connectedCallback() {
        super._removeProgress();
        this.addEventListener("click", (event) => Cell.sendRequest(event));
    }
}

class PropertyDefine {
    index = 0;
    mapKey = "";
    title = "";
    width = "";
    pattern = "";
    utc = false;
    sort = false;
    modified = false;

    constructor() {
    }

    update(data) {
        let updateCount = 0;
        if (data.hasOwnProperty("index")) {
            if (this.index !== data.index) {
                this.index = data.index;
                updateCount++;
            }
        }
        if (data.hasOwnProperty("mapKey")) {
            if (this.mapKey !== data.mapKey) {
                this.mapKey = data.mapKey;
                updateCount++;
            }
        }
        if (data.hasOwnProperty("title")) {
            if (this.title !== data.title) {
                this.title = data.title;
                updateCount++;
            }
        }
        if (data.hasOwnProperty("width")) {
            if (this.width !== data.width) {
                this.width = data.width;
                updateCount++;
            }
        }
        if (data.hasOwnProperty("pattern")) {
            if (this.pattern !== data.pattern) {
                this.pattern = data.pattern;
                updateCount++;
            }
        }
        if (data.hasOwnProperty("utc")) {
            if (this.utc !== data.utc) {
                this.utc = data.utc;
                updateCount++;
            }
        }
        if (data.hasOwnProperty("sort")) {
            if (this.sort !== data.sort) {
                this.sort = data.sort;
                updateCount++;
            }
        }
        this.modified = (updateCount > 0);
    }
}

class ListHeader extends BaseElement {
    itemDefines = [];
    mainElement = null;
    itemElement = null;
    operatorElement = null;

    constructor() {
        super();
        super._addSlot("selectAll", "mainTitle", "items", "operators");
    }

    static tagName() {
        return "list-header";
    }

    renderElement(data) {
        if (data === null || !data.hasOwnProperty("mainTitle")) {
            return;
        }

        this.dataset.mainTitle = data.mainTitle;
        if (data.hasOwnProperty("operatorTitle")) {
            this.dataset.operatorTitle = data.operatorTitle;
        }

        if (data.hasOwnProperty("items") && (data.items instanceof Array)) {
            let newKeys = [];
            data.items.filter(data => (data.hasOwnProperty("mapKey") && data.mapKey.length > 0))
                .forEach(data => {
                    let index = this._index(data.mapKey);
                    let propertyDefine = (index === -1) ? new PropertyDefine() : this.itemDefines[index];
                    propertyDefine.update(data);
                    if (index === -1) {
                        this.itemDefines.push(propertyDefine);
                    } else {
                        this.itemDefines.splice(index, 1, propertyDefine);
                    }
                    newKeys.push(data.mapKey);
                });
            this.itemDefines = Array.from(this.itemDefines.filter(item => newKeys.includes(item.mapKey)))
                .sort((a, b) => {
                    if (a.index === b.index) {
                        return a.mapKey.localeCompare(b.mapKey);
                    }
                    return b.index - a.index;
                });
        }
        this._render();
    }

    connectedCallback() {
        this._render();
    }

    _render() {
        if (this.mainElement === null) {
            this.mainElement = document.createElement("span");
            this.mainElement.setAttribute("slot", "mainTitle");
            this.appendChild(this.mainElement);
        }
        if (this.itemElement === null) {
            this.itemElement = document.createElement("div");
            this.itemElement.setAttribute("slot", "items");
            this.appendChild(this.itemElement);
        }
        if (this.operatorElement === null) {
            this.operatorElement = document.createElement("span");
            this.operatorElement.setAttribute("slot", "operators");
            this.appendChild(this.operatorElement);
        }
        this.mainElement.innerText = this.dataset.mainTitle;
        this.mainElement.setAttribute("title", this.dataset.mainTitle);
        if (this.dataset.operatorTitle !== undefined) {
            this.operatorElement.innerText = this.dataset.operatorTitle;
        }
        if (this.itemDefines.length > 0) {
            let itemList = this.itemElement.querySelectorAll("span");
            let itemCount = this.itemDefines.length;
            if (itemCount < itemList.length) {
                for (let i = itemCount; i < itemList.length; i++) {
                    this.removeChild(itemList[i]);
                }
            }
            for (let i = 0; i < itemCount; i++) {
                let itemData = this.itemDefines[i];
                let itemElement;
                if (i < itemList.length) {
                    itemElement = itemList[i];
                } else {
                    itemElement = document.createElement("span");
                    this.itemElement.appendChild(itemElement);
                }
                itemElement.setStyle("--width:" + itemData.width);
                if (itemData.sort) {
                    itemElement.dataset.sortType = "";
                }
                itemElement.dataset.sortCode = itemData.index;
                itemElement.innerText = itemData.title;
                itemElement.setAttribute("title", itemData.title);
                if (itemData.sort) {
                    itemElement.style.cursor = "pointer";
                    itemElement.addEventListener("click", (event) => {
                        event.stopPropagation();
                        let asc;
                        if (itemElement.dataset.sortType === "" || itemElement.dataset.sortType === "asc") {
                            asc = false;
                            itemElement.dataset.sortType = "desc";
                        } else {
                            asc = true;
                            itemElement.dataset.sortType = "asc";
                        }
                        this.parentElement.parentElement.sortQuery(itemData.mapKey, asc);
                    });
                } else {
                    itemElement.style.cursor = "auto";
                }
            }
            this.itemElement.sortChildrenBy("span", "data-sort-code", true);
        }
    }

    _index(mapKey = "") {
        let index = -1;
        if (this.itemDefines !== null) {
            this.itemDefines.forEach(item => {
                if (item.mapKey === mapKey) {
                    index = this.itemDefines.indexOf(item);
                }
            });
        }
        return index;
    }
}

class RecordOperator extends BaseElement {

    constructor() {
        super();
        super._addSlot("link");
        this.linkElement = null;
        this.iconElement = null;
        this.textElement = null;
    }

    static tagName() {
        return "record-operator";
    }

    connectedCallback() {
        this.linkElement = document.createElement("a");
        this.linkElement.setAttribute("slot", "link");
        this.appendChild(this.linkElement);
        this.linkElement.addEventListener("click", (event) => Cell.sendRequest(event));
        this.iconElement = document.createElement("i");
        this.iconElement.setAttribute("id", "icon");
        this.linkElement.appendChild(this.iconElement);
        this.textElement = document.createElement("span");
        this.textElement.setAttribute("id", "text");
        this.linkElement.appendChild(this.textElement);
    }

    renderElement(data) {
        if (data.hasOwnProperty("link")) {
            this.linkElement.setAttribute("href", data.link);
        }
        if (data.hasOwnProperty("title")) {
            this.linkElement.setAttribute("title", data.title);
        }
        if (data.hasOwnProperty("icon")) {
            this.iconElement.setClass(data.icon);
        }
        if (data.hasOwnProperty("textContent")) {
            this.textElement.innerHTML = data.textContent;
        }
        if (data.hasOwnProperty("openWindow")) {
            this.linkElement.dataset.openWindow = data.openWindow;
        }
        if (data.hasOwnProperty("targetId")) {
            this.linkElement.dataset.targetId = data.targetId;
        }
    }
}

class ListRecord extends BaseElement {
    propertyDefines = [];
    selectElement = null;
    avatarElement = null;
    mainTitle = null;
    abstractElement = null;
    itemsElement = null;
    scoreElement = null;
    operatorsElement = null;

    constructor() {
        super();
        super._addSlot("selectAll", "preview", "mainTitle", "score", "items", "abstract", "operators");
    }

    static tagName() {
        return "list-record";
    }

    updateDefines(propertyDefines = []) {
        this.propertyDefines = propertyDefines;
        this._render();
    }

    renderElement(data) {
        this._renderData(data);
    }

    connectedCallback() {
        super._removeProgress();
        this._render();
        let listRecord = this;
        this.addEventListener("mouseover", () => {
            listRecord.avatarPlay();
        });
        this.addEventListener("mouseout", () => {
            listRecord.avatarPause();
        });
    }

    avatarPlay() {
        if (this.avatarElement !== null) {
            this.avatarElement.playVideo();
        }
    }

    avatarPause() {
        if (this.avatarElement !== null) {
            this.avatarElement.pauseVideo();
        }
    }

    set selectAll(selectAll) {
        if (selectAll !== null && selectAll.length > 0 && this.selectElement !== null
            && this.dataset.recordData !== undefined && this.dataset.recordData.isJSON()) {
            let jsonData = this.dataset.recordData.parseJSON();
            let data = {
                "id": jsonData.hasOwnProperty(selectAll) ? jsonData[selectAll] : "",
                "name": selectAll,
                "value": jsonData.hasOwnProperty(selectAll) ? jsonData[selectAll] : ""
            };
            this.selectElement.data = JSON.stringify(data);
        }
    }

    _renderData(jsonData = {}) {
        if (jsonData.hasOwnProperty("title")) {
            this.dataset.link = jsonData.hasOwnProperty("link") ? jsonData.link : "#";
            if (this.selectElement === null) {
                this.selectElement = new MockCheckBox();
                this.selectElement.setAttribute("slot", "selectAll");
                this.selectElement.addEventListener("click", (event) => {
                    event.stopPropagation();
                    let currentCheckbox = event.target.parentElement.parentElement.parentElement;
                    let listData = this.parentElement.parentElement.parentElement;
                    let count = Array.from(listData.querySelectorAll("mock-checkbox[slot='selectAll']"))
                        .filter(mockCheckbox =>
                            (mockCheckbox.dataset.value !== currentCheckbox.dataset.value) && !mockCheckbox.checked)
                        .length;
                    if (currentCheckbox.checked) {
                        count++;
                    }
                    listData.switchSelectAll(count);
                });
                this.appendChild(this.selectElement);
            }
            if (this.avatarElement === null) {
                this.avatarElement = new ResourceDetails();
                this.avatarElement.setAttribute("slot", "preview");
                this.appendChild(this.avatarElement);
                this.avatarElement.dataset.link = jsonData.link;
                if (jsonData.hasOwnProperty("openWindow")) {
                    this.avatarElement.dataset.openWindow = jsonData.openWindow;
                }
                if (this.dataset.targetId !== null && this.dataset.targetId !== undefined) {
                    this.avatarElement.dataset.targetId = this.dataset.targetId;
                }
                this.avatarElement.addEventListener("click", (event) => Cell.sendRequest(event));
            }
            if (jsonData.hasOwnProperty("avatar")) {
                this.avatarElement.data = JSON.stringify(jsonData.avatar);
                this.avatarElement.dataset.link = this.dataset.link;
            }
            if (this.mainTitle === null) {
                this.mainTitle = document.createElement("span");
                this.mainTitle.setAttribute("slot", "mainTitle");
                this.appendChild(this.mainTitle);
            }
            if (this.abstractElement === null) {
                this.abstractElement = document.createElement("span");
                this.abstractElement.setAttribute("slot", "abstract");
                this.appendChild(this.abstractElement);
            }
            if (this.scoreElement === null) {
                this.scoreElement = new StarScore();
                this.scoreElement.setAttribute("slot", "score");
                this.appendChild(this.scoreElement);
            }
            let linkElement = this.mainTitle.querySelector("a");
            if (linkElement === null) {
                linkElement = document.createElement("a");
                this.mainTitle.appendChild(linkElement);
                linkElement.addEventListener("click", (event) => Cell.sendRequest(event));
                if (jsonData.hasOwnProperty("openWindow")) {
                    linkElement.dataset.openWindow = jsonData.openWindow;
                }
            }
            linkElement.innerText = jsonData.title;
            linkElement.setAttribute("title", jsonData.title);
            linkElement.setAttribute("href", this.dataset.link);
            if (this.dataset.targetId !== null && this.dataset.targetId !== undefined) {
                linkElement.dataset.targetId = this.dataset.targetId;
            }

            this.abstractElement.innerHTML = jsonData.hasOwnProperty("abstract") ? jsonData.abstract : "";

            if (this.itemsElement === null) {
                this.itemsElement = document.createElement("div");
                this.itemsElement.setAttribute("slot", "items");
                this.appendChild(this.itemsElement);
            }
            let propertyList = this.itemsElement.querySelectorAll("property-item");
            let propertyCount = this.propertyDefines.length, existsCount = propertyList.length;
            if (propertyCount < existsCount) {
                for (let i = propertyCount; i < existsCount; i++) {
                    this.itemsElement.removeChild(propertyList[i]);
                }
            }
            if (jsonData.hasOwnProperty("properties")) {
                let properties = jsonData.properties;
                for (let i = 0; i < propertyCount; i++) {
                    let propertyDefine = this.propertyDefines[i], propertyItem;
                    if (i < existsCount) {
                        propertyItem = propertyList[i];
                    } else {
                        propertyItem = new PropertyItem();
                        this.itemsElement.appendChild(propertyItem);
                    }
                    propertyItem.itemName(propertyDefine.title);
                    if (properties.hasOwnProperty(propertyDefine.mapKey)) {
                        let dataValue = properties[propertyDefine.mapKey];
                        propertyItem.dataset.data = dataValue;
                        if (propertyDefine.pattern.length > 0) {
                            propertyItem.itemValue(
                                Cell.millisecondsToDate(dataValue, propertyDefine.pattern, propertyDefine.utc));
                        } else {
                            propertyItem.itemValue(dataValue);
                        }
                    }
                    propertyItem.setStyle("--width:" + propertyDefine.width);
                }
            }
            if (jsonData.hasOwnProperty("score")) {
                this.scoreElement.score = jsonData.score;
            }
            if (this.operatorsElement === null) {
                this.operatorsElement = document.createElement("div");
                this.operatorsElement.setAttribute("slot", "operators");
                this.appendChild(this.operatorsElement);
            }
            if (jsonData.hasOwnProperty("operators") && (jsonData.operators instanceof Array)) {
                let operatorList = this.operatorsElement.querySelectorAll("record-operator"),
                    existsCount = operatorList.length;
                let i = 0;
                jsonData.operators
                    .filter(operatorItem => operatorItem.hasOwnProperty("link"))
                    .forEach(operatorItem => {
                        let recordOperator;
                        if (i < existsCount) {
                            recordOperator = operatorList[i];
                        } else {
                            recordOperator = new RecordOperator();
                            this.operatorsElement.appendChild(recordOperator);
                        }
                        recordOperator.data = JSON.stringify(operatorItem);
                    });
                while (i < existsCount) {
                    this.operatorsElement.removeChild(operatorList[i]);
                    i++;
                }
            }

            this.removeClass("error");
            this.removeClass("warning");

            if (jsonData.hasOwnProperty("className")) {
                this.appendClass(jsonData.className);
            }
        }
    }

    _render() {
        if (this.dataset.recordData !== undefined && this.dataset.recordData.isJSON()) {
            this._renderData(this.dataset.recordData.parseJSON());
        }
    }

    enableAll() {
        if (this.selectElement !== null) {
            this.selectElement.show();
        }
    }

    disableAll() {
        if (this.selectElement !== null) {
            this.selectElement.hide();
        }
    }
}

class PagerList extends BaseElement {
    constructor() {
        super();
        this.pagerElement = null;
    }

    connectedCallback() {
        if (this.pagerElement === null) {
            this.pagerElement = document.createElement("div");
            this.pagerElement.setAttribute("id", "pager");
            this.pagerElement.setAttribute("slot", "listPager");
            this.appendChild(this.pagerElement);
        }
    }

    _renderPager(jsonData = {}) {
        let totalPage = 0, currentPage = 1;
        if (jsonData.hasOwnProperty("totalPage") && ((typeof jsonData.totalPage) === "number")) {
            totalPage = jsonData.totalPage;
        }
        if (totalPage <= 0) {
            this.pagerElement.hide();
            return;
        }
        this.pagerElement.show();
        if (jsonData.hasOwnProperty("currentPage") && ((typeof jsonData.currentPage) === "number")) {
            currentPage = jsonData.currentPage;
            if (currentPage < 1) {
                currentPage = 1;
            }
        }

        let firstPageBtn = this.pagerElement.querySelector("i[id='firstPage']");
        if (firstPageBtn === null) {
            firstPageBtn = document.createElement("i");
            firstPageBtn.setAttribute("id", "firstPage");
            firstPageBtn.setClass("icon-chevron-double-left");
            firstPageBtn.dataset.currentPage = "1";
            this.pagerElement.appendChild(firstPageBtn);
            firstPageBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this.pageQuery(firstPageBtn.dataset.currentPage.parseInt());
            });
        }
        if (currentPage === 1) {
            firstPageBtn.hide();
        } else {
            firstPageBtn.show();
        }

        let previousPage = currentPage - 1;
        if (previousPage < 1) {
            previousPage = 1;
        }

        let previousPageBtn = this.pagerElement.querySelector("i[id='previousPage']");
        if (previousPageBtn === null) {
            previousPageBtn = document.createElement("i");
            previousPageBtn.setAttribute("id", "previousPage");
            previousPageBtn.setClass("icon-chevron-left");
            this.pagerElement.appendChild(previousPageBtn);
            previousPageBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this.pageQuery(previousPageBtn.dataset.currentPage.parseInt());
            });
        }
        if (previousPage === 1) {
            previousPageBtn.hide();
        } else {
            previousPageBtn.dataset.currentPage = previousPage.toString();
            previousPageBtn.show();
        }

        let pageGroup = this.pagerElement.querySelector("div[id='pageGroup']");
        if (pageGroup === null) {
            pageGroup = document.createElement("div");
            pageGroup.setAttribute("id", "pageGroup");
            this.pagerElement.appendChild(pageGroup);
        }
        let pageBtnList = pageGroup.querySelectorAll("i");
        if (totalPage < pageBtnList.length) {
            for (let i = pageBtnList.length; i < totalPage; i++) {
                pageGroup.removeChild(pageBtnList[i]);
            }
        } else if (pageBtnList.length < totalPage) {
            for (let i = pageBtnList.length; i < totalPage; i++) {
                let pageBtn = document.createElement("i");
                pageBtn.dataset.currentPage = (i + 1).toString();
                pageBtn.innerText = (i + 1).toString();
                pageGroup.appendChild(pageBtn);
                pageBtn.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.pageQuery(pageBtn.dataset.currentPage.parseInt());
                });
            }
        }

        let beginPage = Math.max(1, currentPage - 2), endPage = Math.min(totalPage, currentPage + 2);
        pageGroup.querySelectorAll("i").forEach(pageBtn => {
            let pageNo = pageBtn.dataset.currentPage.parseInt();
            if (pageNo === currentPage) {
                pageBtn.appendClass("current");
            } else {
                pageBtn.removeClass("current");
            }
            if (pageNo < beginPage || pageNo > endPage) {
                pageBtn.hide();
            } else {
                pageBtn.show();
            }
        })
        let nextPage = currentPage + 1;
        if (totalPage < nextPage) {
            nextPage = totalPage;
        }
        let nextPageBtn = this.pagerElement.querySelector("i[id='nextPage']");
        if (nextPageBtn === null) {
            nextPageBtn = document.createElement("i");
            nextPageBtn.setAttribute("id", "nextPage");
            nextPageBtn.setClass("icon-chevron-right");
            this.pagerElement.appendChild(nextPageBtn);
            nextPageBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this.pageQuery(nextPageBtn.dataset.currentPage.parseInt());
            });
        }
        if (nextPage === totalPage) {
            nextPageBtn.hide();
        } else {
            nextPageBtn.dataset.currentPage = nextPage.toString();
            nextPageBtn.show();
        }
        let lastPageBtn = this.pagerElement.querySelector("i[id='lastPage']");
        if (lastPageBtn === null) {
            lastPageBtn = document.createElement("i");
            lastPageBtn.setAttribute("id", "lastPage");
            lastPageBtn.setClass("icon-chevron-double-right");
            lastPageBtn.dataset.currentPage = totalPage.toString();
            this.pagerElement.appendChild(lastPageBtn);
            lastPageBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this.pageQuery(lastPageBtn.dataset.currentPage.parseInt());
            });
        }
        if (currentPage === totalPage) {
            lastPageBtn.hide();
        } else {
            lastPageBtn.show();
        }
    }
}

class ListData extends PagerList {
    constructor() {
        super();
        super._addSlot("dataInfo", "batchOperators", "listPager");
        this.selectAll = false;
        this.selectName = "";
        this.listElement = null;
        this.headerElement = null;
        this.contentElement = null;
        this.selectAllBtn = null;
        this.batchElement = null;
    }

    static tagName() {
        return "list-data";
    }

    connectedCallback() {
        super._removeProgress();
        if (this.listElement === null) {
            this.listElement = document.createElement("div");
            this.listElement.setAttribute("slot", "dataInfo");
            this.listElement.setClass("view-list");
            this.appendChild(this.listElement);
        }
        if (this.headerElement === null) {
            this.headerElement = new ListHeader();
            this.listElement.appendChild(this.headerElement);
        }
        if (this.contentElement === null) {
            this.contentElement = document.createElement("div");
            this.contentElement.setAttribute("id", "content");
            this.listElement.appendChild(this.contentElement);
        }
        if (this.batchElement === null) {
            this.batchElement = document.createElement("div");
            this.batchElement.setAttribute("slot", "batchOperators");
            this.appendChild(this.batchElement);
        }
        super.connectedCallback();
    }

    renderElement(data) {
        if (data === null) {
            return;
        }
        if (data.hasOwnProperty("type")) {
            this.dataset.type = data.type;
        }
        this.selectName = data.hasOwnProperty("selectName") ? data.selectName : "";
        if (data.hasOwnProperty("header")) {
            this.headerElement.data = JSON.stringify(data.header);
        }
        if (data.hasOwnProperty("batchOperators") && (data.batchOperators instanceof Array)) {
            this.batchElement.dataset.batchOperators = JSON.stringify(data.batchOperators);
            this._renderBatchOperators();
        }
        if (data.hasOwnProperty("itemData")) {
            this.contentElement.dataset.itemData = JSON.stringify(data.itemData);
        } else {
            this.contentElement.dataset.itemData = JSON.stringify([]);
        }
        this._renderData();
        if (data.hasOwnProperty("pager")) {
            super._renderPager(data.pager);
        } else {
            super._renderPager({});
        }
        if (this.selectAllBtn !== null) {
            if (this.selectName === "") {
                this.selectAllBtn.hide();
            } else {
                this.selectAllBtn.show();
            }
        }
    }

    switchStyle(styleClass = "") {
        if (styleClass === null) {
            styleClass = "";
        }

        if (!["text-list", "view-list", "image-list"].includes(styleClass)) {
            styleClass = "view-list";
        }

        if (this.listElement.getClass().toLowerCase() !== styleClass.toLowerCase()) {
            this.listElement.setClass(styleClass);
        }
    }

    sortQuery(sortBy = "", asc = false) {
        this.parentElement.sortQuery(sortBy, asc);
    }

    pageQuery(pageNo = 1) {
        if (this.parentElement !== null) {
            this.parentElement.pageQuery(pageNo);
        }
    }

    switchSelectAll(count) {
        this.selectAllBtn.dataset.selectAll = "" + (count === 0);
    }

    _renderBatchOperators() {
        if (this.batchElement.dataset.batchOperators === undefined
            || !this.batchElement.dataset.batchOperators.isJSON()) {
            return;
        }
        if (this.selectAllBtn === null) {
            this.selectAllBtn = document.createElement("i");
            this.selectAllBtn.setClass("icon");
            this.batchElement.appendChild(this.selectAllBtn);
            this.selectAllBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                let checked;
                if (this.selectAllBtn.dataset.hasOwnProperty("selectAll")) {
                    checked = (this.selectAllBtn.dataset.selectAll !== "true");
                } else {
                    checked = true;
                }
                this.selectAllBtn.dataset.selectAll = checked.toString();
                this.contentElement
                    .querySelectorAll("mock-checkbox")
                    .forEach(selectBox => {
                        selectBox.checked = checked;
                    });
            });
        }
        let jsonData = this.batchElement.dataset.batchOperators.parseJSON();
        let existsOperators = this.batchElement.querySelectorAll("record-operator"),
            existsCount = existsOperators.length, operatorCount = jsonData.length, i;
        for (i = 0; i < operatorCount; i++) {
            let operatorData = jsonData[i];
            if (operatorData.hasOwnProperty("link") && operatorData.hasOwnProperty("title")) {
                let operator;
                if (i < existsCount) {
                    operator = existsOperators[i];
                } else {
                    operator = new RecordOperator();
                    this.batchElement.appendChild(operator);
                    operator.addEventListener("click", (event) => Cell.sendRequest(event));
                }
                operator.data = JSON.stringify(operatorData);
            }
        }

        while (i < existsCount) {
            this.batchElement.removeChild(existsOperators[i]);
            i++;
        }

        this.selectAll = (operatorCount > 0);
        if (this.selectAll) {
            this.selectAllBtn.show();
        } else {
            this.selectAllBtn.hide();
        }
    }

    _renderData() {
        if (this.contentElement.dataset.itemData === undefined || this.contentElement.dataset.itemData == null
            || !this.contentElement.dataset.itemData.isJSON()) {
            return;
        }

        let jsonData = this.contentElement.dataset.itemData.parseJSON();
        if (jsonData instanceof Array) {
            if (this.dataset.type === "append") {
                jsonData.forEach(rowData => {
                    let rowElement = new ListRecord();
                    this.contentElement.appendChild(rowElement);
                    rowElement.updateDefines(this.headerElement.itemDefines);
                    this._renderRow(rowElement, rowData);
                });
            } else {
                let rowList = this.contentElement.querySelectorAll("list-record"),
                    existsCount = rowList.length, i = 0;
                jsonData.forEach(rowData => {
                    let rowElement;
                    if (i < rowList.length) {
                        rowElement = rowList[i];
                    } else {
                        rowElement = new ListRecord();
                        this.contentElement.appendChild(rowElement);
                    }
                    rowElement.updateDefines(this.headerElement.itemDefines);
                    this._renderRow(rowElement, rowData);
                    i++;
                });
                while (i < existsCount) {
                    this.contentElement.removeChild(rowList[i]);
                    i++;
                }
            }
        }
    }

    _renderRow(rowElement = null, rowData = []) {
        if (rowElement == null || rowData.length === 0) {
            return;
        }
        if (this.dataset.targetId !== null && this.dataset.targetId !== undefined) {
            rowElement.dataset.targetId = this.dataset.targetId;
        }
        if (rowData.hasOwnProperty(this.selectName)) {
            rowElement.dataset[this.selectName] = rowData[this.selectName];
        }
        rowElement.data = JSON.stringify(rowData);
        if (this.selectAll) {
            rowElement.selectAll = this.selectName;
            rowElement.enableAll();
        } else {
            rowElement.disableAll();
        }
    }
}

class MessageList extends BaseElement {
    constructor() {
        super();
        super._addSlot("filter", "statistics", "title", "info");
        this.filterElement = null;
        this.statisticsElement = null;
        this.titleEleemnt = null;
        this.gridElement = null;
        this.interval = 0;
    }

    static tagName() {
        return "message-list";
    }

    connectedCallback() {
        this._appendProgress();
        let initData = this.getAttribute("data");
        if (initData !== undefined && initData !== null && initData.isJSON()) {
            this.renderElement(initData.parseJSON());
        }
    }

    renderElement(data) {
        if (data === null) {
            return;
        }
        super._removeProgress();
        if (this.filterElement === null) {
            this.filterElement = new ListFilter();
            this.filterElement.setAttribute("slot", "filter");
            this.appendChild(this.filterElement);
            this.filterElement.hide();
        }
        if (this.statisticsElement === null) {
            this.statisticsElement = new ListStatistics();
            this.statisticsElement.setAttribute("slot", "statistics");
            this.appendChild(this.statisticsElement);
            this.statisticsElement.hide();
        }
        if (this.titleEleemnt === null) {
            this.titleEleemnt = new ListTitle();
            this.titleEleemnt.setAttribute("slot", "title");
            this.appendChild(this.titleEleemnt);
        }
        if (this.gridElement === null) {
            this.gridElement = new ListData();
            this.gridElement.setAttribute("slot", "info");
            this.appendChild(this.gridElement);
        }

        if (data.hasOwnProperty("className")) {
            this.setClass(data.className);
        }
        if (data.hasOwnProperty("id")) {
            this.setAttribute("id", data.id);
            this.filterElement.dataset.targetId = data.id;
        }
        if (data.hasOwnProperty("filter")) {
            this.filterElement.data = JSON.stringify(data.filter);
        }
        if (data.hasOwnProperty("statistics")) {
            this.statisticsElement.data = JSON.stringify(data.statistics);
        }
        if (data.hasOwnProperty("title")) {
            this.titleEleemnt.data = JSON.stringify(data.title);
        }
        if (data.hasOwnProperty("grid")) {
            this.gridElement.data = JSON.stringify(data.grid);
        }

        if (this.interval !== 0) {
            window.clearInterval(this.interval);
        }
        if (data.hasOwnProperty("refresh")) {
            let refreshElement = this.filterElement;
            this.interval = window.setInterval(function () {
                refreshElement.refresh();
            }, data.refresh);
        }

        if (data.hasOwnProperty("className")) {
            this.setClass(data.className);
        }
    }

    switchStyle(styleClass = "") {
        if (this.gridElement !== null) {
            this.gridElement.switchStyle(styleClass);
        }
    }

    sortQuery(sortBy = "", asc = false) {
        if (this.filterElement !== null) {
            this.filterElement.sortQuery(sortBy, asc);
        }
    }

    pageQuery(pageNo = 1) {
        if (this.filterElement !== null) {
            this.filterElement.pageQuery(pageNo);
        }
    }
}

class CommentList extends PagerList {
    constructor() {
        super();
        super._addSlot("listTitle", "filter", "commentList", "listPager", "commentForm");
        this.titleElement = null;
        this.filterElement = null;
        this.listElement = null;
        this.formElement = null;
        this.pageNoElement = null;
        this.pageLimitElement = null;
    }

    static tagName() {
        return "comment-list";
    }

    connectedCallback() {
        if (this.titleElement === null) {
            this.titleElement = document.createElement("h3");
            this.titleElement.setAttribute("slot", "listTitle");
            this.appendChild(this.titleElement);
            this.titleElement.hide();
        }
        if (this.filterElement === null) {
            this.filterElement = document.createElement("form");
            this.filterElement.setAttribute("slot", "filter");
            this.appendChild(this.filterElement);
            this.filterElement.hide();
            if (this.pageNoElement === null) {
                this.pageNoElement = document.createElement("input");
                this.pageNoElement.setAttribute("id", "pageNo");
                this.pageNoElement.setAttribute("name", "page");
                this.pageNoElement.setAttribute("type", "number");
                this.filterElement.appendChild(this.pageNoElement);
            }
            if (this.pageLimitElement === null) {
                this.pageLimitElement = document.createElement("input");
                this.pageLimitElement.setAttribute("id", "pageLimit");
                this.pageLimitElement.setAttribute("name", "limit");
                this.pageLimitElement.setAttribute("type", "number");
                this.filterElement.appendChild(this.pageLimitElement);
            }
        }
        if (this.listElement === null) {
            this.listElement = document.createElement("div");
            this.listElement.setAttribute("slot", "commentList");
            this.appendChild(this.listElement);
        }
        super.connectedCallback();
        if (this.formElement === null) {
            this.formElement = new FormInfo();
            this.formElement.setAttribute("slot", "commentForm");
            this.appendChild(this.formElement);
            this.formElement.hide();
        }
        if (this.dataset.hasOwnProperty("data")) {
            this.renderElement(this.dataset.data.parseJSON());
        }
    }

    renderElement(data) {
        if (data.hasOwnProperty("title")) {
            this.titleElement.innerHTML = data.title;
            this.titleElement.show();
        } else {
            this.titleElement.hide();
        }
        if (data.hasOwnProperty("items") && (data.items instanceof Array)) {
            this.listElement.clearChildNodes();
            data.items.forEach(dataItem => {
                let commentData = new CommentData();
                this.listElement.appendChild(commentData);
                commentData.data = JSON.stringify(dataItem);
            });
        }
        if (data.hasOwnProperty("pager") && data.hasOwnProperty("url")) {
            this.filterElement.setAttribute("action", data.url);
            super._renderPager(data.pager);
        }
        if (data.hasOwnProperty("formData")) {
            this.formElement.data = JSON.stringify(data.formData);
            this.formElement.show();
        } else {
            this.formElement.hide();
        }
    }

    pageQuery(pageNo = 1) {
        if (this.filterElement !== null) {
            this.pageNoElement.value = pageNo;
            Cell.submitForm(this.filterElement);
        }
    }
}

class CommentData extends BaseElement {
    constructor() {
        super();
        super._addSlot("userInfo", "title", "content", "operators");
        this.userInfo = null;
        this.titleElement = null;
        this.contentElement = null;
        this.operators = null;
    }

    static tagName() {
        return "comment-data";
    }

    connectedCallback() {
        if (this.userInfo === null) {
            this.userInfo = new UserDetails();
            this.userInfo.setAttribute("slot", "userInfo");
            this.appendChild(this.userInfo);
        }
        if (this.titleElement === null) {
            this.titleElement = document.createElement("span");
            this.titleElement.setAttribute("slot", "title");
            this.appendChild(this.titleElement);
        }
        if (this.contentElement === null) {
            this.contentElement = document.createElement("span");
            this.contentElement.setAttribute("slot", "content");
            this.appendChild(this.contentElement);
        }
        if (this.operators === null) {
            this.operators = document.createElement("span");
            this.operators.setAttribute("slot", "operators");
            this.appendChild(this.operators);
        }
    }

    renderElement(data) {
        if (data.hasOwnProperty("userDetails") && data.hasOwnProperty("title") && data.hasOwnProperty("content")) {
            this.userInfo.data = JSON.stringify(data.userDetails);
            this.titleElement.innerHTML = data.title;
            this.contentElement.innerHTML = data.content;
            if (data.hasOwnProperty("operators")) {
                this.operators.clearChildNodes();
                Array.from(data.operators)
                    .filter(operator => operator.hasOwnProperty("tagName"))
                    .forEach(operator => {
                        let operatorBtn = document.createElement(operator.tagName);
                        this.operators.appendChild(operatorBtn);
                        operatorBtn.addEventListener("click", (event) => Cell.sendRequest(event));
                        if (operator.hasOwnProperty("link")) {
                            operatorBtn.dataset.link = operator.link;
                        }
                        if (operator.hasOwnProperty("value")) {
                            operatorBtn.value = operator.value;
                        } else {
                            operatorBtn.value = "0";
                        }
                        operatorBtn.dataset.checked = Boolean(operator.checked).toString();
                    });
            }
        }
    }
}

export {
    ListFilter, ListData, ListStatistics, ListTitle, ListRecord, RecordOperator, ListHeader, MessageList, PropertyItem,
    PropertyDefine, CommentList, CommentData
};