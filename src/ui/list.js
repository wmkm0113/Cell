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
import {StandardButton} from "./button.js";
import {HiddenInput} from "./input.js";

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
        if (this.dataset.items === undefined || !this.dataset.items.isJSON()) {
            this.hide();
            return;
        }
        this.show();
        this.filterForm.clearChildNodes();
        if (this.dataset.sortBy !== undefined && this.dataset.sortBy.length > 0) {
            if (this.sortByElement === null) {
                this.sortByElement = new HiddenInput();
                this.filterForm.appendChild(this.sortByElement);
            }
            this.sortByElement.setAttribute("name", this.dataset.sortBy);
        }
        if (this.dataset.sortType !== undefined && this.dataset.sortType.length > 0) {
            if (this.sortTypeElement === null) {
                this.sortTypeElement = new HiddenInput();
                this.filterForm.appendChild(this.sortTypeElement);
            }
            this.sortTypeElement.setAttribute("name", this.dataset.sortType);
        }
        if (this.dataset.pageNo !== undefined && this.dataset.pageNo.length > 0) {
            if (this.pageNoElement === null) {
                this.pageNoElement = new HiddenInput();
                this.filterForm.appendChild(this.pageNoElement);
            }
            this.pageNoElement.setAttribute("name", this.dataset.pageNo);
        }
        if (this.dataset.pageLimit !== undefined && this.dataset.pageLimit.length > 0) {
            if (this.pageLimitElement === null) {
                this.pageLimitElement = new HiddenInput();
                this.filterForm.appendChild(this.pageLimitElement);
            }
            this.pageLimitElement.setAttribute("name", this.dataset.pageLimit);
        }
        if (this.dataset.className !== undefined && this.dataset.className.length > 0) {
            this.filterForm.setClass(this.dataset.className);
        }
        let jsonData = this.dataset.items.parseJSON();
        Array.from(jsonData)
            .filter(itemData => itemData.hasOwnProperty("tag"))
            .forEach(itemData => {
                let filterItem = document.createElement(itemData.tag);
                this.filterForm.appendChild(filterItem);
                filterItem.data = JSON.stringify(itemData);
            });
        let searchBtn = this.querySelector("standard-button[slot='searchBtn']");
        if (searchBtn === null) {
            searchBtn = new StandardButton();
            searchBtn.setAttribute("slot", "searchBtn");
            searchBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this._submitForm();
            });
            searchBtn.setAttribute("value", "Search");
            this.appendChild(searchBtn);
        }
        if (this.dataset.searchText !== undefined && this.dataset.searchText.length > 0) {
            searchBtn.textContent = this.dataset.searchText;
        }
    }

    refresh() {
        this._submitForm();
    }

    sortQuery(sortBy = "", asc = false) {
        if (this.sortByElement !== null) {
            this.sortByElement.setAttribute("value", sortBy);
        }
        if (this.sortTypeElement !== null) {
            this.sortTypeElement.setAttribute("value", asc ? "ASC" : "DESC");
        }
        this._submitForm();
    }

    pageQuery(pageNo = 1, pageLimit = 20) {
        if (this.pageNoElement !== null) {
            this.pageNoElement.setAttribute("value", pageNo);
        }
        if (this.pageLimitElement !== null) {
            this.pageLimitElement.setAttribute("value", pageLimit);
        }
        this._submitForm();
    }

    _submitForm() {
        if (this.dataset.elementId !== undefined && this.dataset.elementId !== null) {
            this.filterForm.dataset.elementId = this.dataset.elementId;
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
            let idList = [], updateList = [];
            data.forEach(statisticsItem => idList.push(statisticsItem.id));
            this.statisticsElement.querySelectorAll("div")
                .forEach(existsItem => {
                    let index = idList.indexOf(existsItem.getAttribute("id"));
                    if (index === -1) {
                        this.statisticsElement.removeChild(existsItem);
                    } else {
                        let statisticsItem = data[index];
                        if (statisticsItem.hasOwnProperty("title")) {
                            let titleElement = existsItem.querySelector("span[id='title']");
                            if (titleElement !== null) {
                                titleElement.innerText = statisticsItem.title;
                            }
                        }
                        if (statisticsItem.hasOwnProperty("data")) {
                            let dataElement = existsItem.querySelector("span[id='data']");
                            if (dataElement !== null) {
                                dataElement.innerText = statisticsItem.data;
                            }
                        }
                        existsItem.dataset.index = index.toString();
                        updateList.push(idList[index]);
                    }
                });
            for (let i = 0 ; i < data.length ; i++) {
                let dataItem = data[i];
                if (dataItem.hasOwnProperty("id") && (updateList.indexOf(dataItem.id) === -1)
                    && dataItem.hasOwnProperty("title") && dataItem.hasOwnProperty("data")) {
                    let statisticsItem = document.createElement("div");
                    statisticsItem.setAttribute("id", dataItem.id);
                    this.statisticsElement.appendChild(statisticsItem);
                    let titleElement = document.createElement("span");
                    titleElement.setAttribute("id", "title");
                    titleElement.innerText = dataItem.title;
                    statisticsItem.appendChild(titleElement);
                    let dataElement = document.createElement("span");
                    dataElement.setAttribute("id", "data");
                    dataElement.innerText = dataItem.data;
                    statisticsItem.appendChild(dataElement);
                    if (dataItem.hasOwnProperty("index")) {
                        statisticsItem.dataset.index = dataItem.index.toString();
                    }
                    statisticsItem.removeClass("error");
                    statisticsItem.removeClass("warning");
                    if (dataItem.hasOwnProperty("className")) {
                        statisticsItem.appendClass(dataItem.className);
                    }
                }
            }
            this.statisticsElement.sortChildrenBy("div", "data-index", true);
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
        this.importBtn = null;
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
            this.btnGroup.hide();
            this.appendChild(this.btnGroup);

            this.importBtn = document.createElement("a");
            this.importBtn.setClass("icon icon-upload");
            this.btnGroup.appendChild(this.importBtn);
            this.importBtn.addEventListener("click", (event) => Cell.sendRequest(event));
            this.importBtn.hide();

            ["text-list", "view-list", "image-list"].forEach(listType => {
                let styleBtn = document.createElement("i");
                styleBtn.dataset.listType = listType;
                switch (listType) {
                    case "text-list":
                        styleBtn.setClass("icon-reorder");
                        break;
                    case "view-list":
                        styleBtn.setClass("icon-list");
                        break;
                    case "image-list":
                        styleBtn.setClass("icon-reorder_square");
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
        if (data.hasOwnProperty("importUrl")) {
            this.importBtn.setAttribute("href", data.importUrl);
            this.importBtn.show();
        }
        if (data.hasOwnProperty("disableSwitch") && data.disableSwitch) {
            this.btnGroup.hide();
        } else {
            this.btnGroup.show();
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
        if (data.hasOwnProperty("sort")) {
            if (this.sort !== Boolean(data.sort)) {
                this.sort = Boolean(data.sort);
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
                    return a.index - b.index;
                });
        }
        this._render();
    }

    connectedCallback() {
        super._removeProgress();
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
        if (this.dataset.operatorTitle !== undefined) {
            this.operatorElement.innerText = this.dataset.operatorTitle;
        }
        if (this.itemDefines.length > 0) {
            let itemList = this.itemElement.querySelectorAll("span");
            let itemCount = this.itemDefines.length;
            if (itemCount < itemList.length) {
                for (let i = itemCount ; i < itemList.length ; i++) {
                    this.removeChild(itemList[i]);
                }
            }
            for (let i = 0 ; i < itemCount ; i++) {
                let itemData = this.itemDefines[i];
                let itemElement;
                if (i < itemList.length) {
                    itemElement = itemList[i];
                } else {
                    itemElement = document.createElement("span");
                    this.itemElement.appendChild(itemElement);
                }
                itemElement.style = ("--width:" + itemData.width);
                if (itemData.sort) {
                    itemElement.dataset.sortType = "";
                }
                itemElement.innerText = itemData.title;
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
        }
    }

    _index(mapKey = "") {
        let index = -1;
        if (this.itemDefines !== null) {
            this.itemDefines.forEach(item => {
                if (item.mapKey === mapKey) {
                    index = this.items.indexOf(item);
                }
            });
        }
        return index;
    }
}

class RecordOperator extends BaseElement {
    static get observedAttributes() {
        return ['elementId'];
    }

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

    get elementId() {
        return this.linkElement.dataset.elementId;
    }

    set elementId(elementId) {
        this.linkElement.dataset.elementId = elementId;
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
        if (data.hasOwnProperty("iconClass")) {
            this.iconElement.setClass(data.iconClass);
        }
        if (data.hasOwnProperty("textContent")) {
            this.textElement.innerHTML = data.textContent;
        }
    }
}

class ListRecord extends BaseElement {
    propertyDefines = [];
    selectElement = null;
    previewImg = null;
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
        this.dataset.recordData = JSON.stringify(data);
        this._render();
    }

    connectedCallback() {
        super._removeProgress();
        this._render();
    }

    set selectAll(selectAll) {
        if (selectAll !== null && selectAll.length > 0 && this.selectElement !== null
            && this.dataset.recordData !== undefined && this.dataset.recordData.isJSON()) {
            let jsonData = this.dataset.recordData.parseJSON();
            let data = {
                "name": selectAll,
                "value": jsonData.hasOwnProperty(selectAll) ? jsonData[selectAll] : ""
            };
            this.selectElement.data = JSON.stringify(data);
        }
    }

    set enableSelectAll(enabled) {
        this.selectElement.disabled = !enabled;
        if (this.selectElement.disabled) {
            this.selectElement.hide();
        } else {
            this.selectElement.show();
        }
    }

    selected() {
        return this.selectElement.checked;
    }

    _render() {
        if (this.dataset.recordData !== undefined && this.dataset.recordData.isJSON()) {
            let jsonData = this.dataset.recordData.parseJSON();
            if (jsonData.hasOwnProperty("link") && jsonData.hasOwnProperty("title")) {
                if (this.selectElement === null) {
                    this.selectElement = new MockCheckBox();
                    this.selectElement.setAttribute("slot", "selectAll");
                    this.appendChild(this.selectElement);
                    this.selectElement.addEventListener("click", (event) => {
                        event.stopPropagation();
                        this.selectElement.checked = !this.selectElement.checked;
                        this.parentElement.parentElement.parentElement.checkSelectAll();
                    })
                }
                if (this.previewImg === null) {
                    this.previewImg = document.createElement("span");
                    this.previewImg.setAttribute("slot", "preview");
                    this.appendChild(this.previewImg);
                    this.previewImg.addEventListener("click", (event) => Cell.sendRequest(event));
                }
                this.previewImg.dataset.link = jsonData.link;
                this.previewImg.dataset.elementId = jsonData.hasOwnProperty("elementId") ? jsonData.elementId : "";
                if (jsonData.hasOwnProperty("imgPath")) {
                    this.previewImg.style.backgroundImage = "url('" + jsonData.imgPath + "')";
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
                }
                let elementId = jsonData.hasOwnProperty("elementId") ? jsonData.elementId : "";
                linkElement.innerText = jsonData.title;
                linkElement.setAttribute("title", jsonData.title);
                linkElement.setAttribute("href", jsonData.link);
                linkElement.dataset.elementId = elementId;

                this.abstractElement.innerHTML = jsonData.hasOwnProperty("abstract") ? jsonData.abstract : "";

                if (this.itemsElement === null) {
                    this.itemsElement = document.createElement("div");
                    this.itemsElement.setAttribute("slot", "items");
                    this.appendChild(this.itemsElement);
                }
                let propertyList = this.itemsElement.querySelectorAll("property-item[slot='items']");
                let propertyCount = this.propertyDefines.length, existsCount = propertyList.length;
                if (propertyCount < existsCount) {
                    for (let i = propertyCount ; i < existsCount ; i++) {
                        this.itemsElement.removeChild(propertyList[i]);
                    }
                }
                for (let i = 0 ; i < propertyCount ; i++) {
                    let propertyDefine = this.propertyDefines[i], propertyItem;
                    if (i < existsCount) {
                        propertyItem = propertyList[i];
                    } else {
                        propertyItem = new PropertyItem();
                        this.itemsElement.appendChild(propertyItem);
                    }
                    propertyItem.itemName(propertyDefine.title);
                    if (jsonData.hasOwnProperty(propertyDefine.mapKey)) {
                        propertyItem.itemValue(jsonData[propertyDefine.mapKey]);
                        propertyItem.show();
                    } else {
                        propertyItem.itemValue("");
                        propertyItem.hide();
                    }
                    propertyItem.style = ("--width:" + propertyDefine.width);
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
                            recordOperator.elementId = elementId;
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
    }
}

class ListData extends BaseElement {
    constructor() {
        super();
        super._addSlot("dataInfo", "batchOperators", "listPager");
        this.pageLimit = 20;
        this.selectAll = false;
        this.selectName = "";
        this.listElement = null;
        this.headerElement = null;
        this.contentElement = null;
        this.selectAllBtn = null;
        this.batchElement = null;
        this.pagerElement = null;
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
        if (this.pagerElement === null) {
            this.pagerElement = document.createElement("div");
            this.pagerElement.setAttribute("id", "pager");
            this.pagerElement.setAttribute("slot", "listPager");
            this.appendChild(this.pagerElement);
        }
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
            this.contentElement.querySelectorAll("property-item")
                .forEach(propertyItem => propertyItem.updateDefines(this.headerElement.items));
        }
        if (data.hasOwnProperty("batchOperators") && (data.batchOperators instanceof Array)) {
            this.batchElement.dataset.batchOperators = JSON.stringify(data.batchOperators);
            this._renderBatchOperators();
        }
        if (data.hasOwnProperty("itemData")) {
            this.contentElement.dataset.itemData = JSON.stringify(data.itemData);
            this._renderData();
        }
        if (data.hasOwnProperty("pager")) {
            this.pagerElement.dataset.itemData = JSON.stringify(data.pager);
            this._renderPager();
        }
        if (data.hasOwnProperty("pageLimit") && ((typeof data.pageLimit) === "number")) {
            this.pageLimit = data.pageLimit;
        } else {
            this.pageLimit = 20;
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

    checkSelectAll() {
        if (this.contentElement !== null) {
            let recordList = this.contentElement.querySelectorAll("list-record"),
                recordCount = recordList.length;
            let checkedCount = 0;
            for (let i = 0 ; i < recordCount ; i++) {
                if (recordList[i].selected()) {
                    checkedCount++;
                }
            }
            this.headerElement.checked = (checkedCount === recordCount);
        }
    }

    sortQuery(sortBy = "", asc = false) {
        this.parentElement.sortQuery(sortBy, asc);
    }

    _renderBatchOperators() {
        if (this.batchElement.dataset.batchOperators === undefined
            || !this.batchElement.dataset.batchOperators.isJSON()) {
            return;
        }
        if (this.selectAllBtn === null) {
            this.selectAllBtn = document.createElement("i");
            this.selectAllBtn.setClass("icon-check");
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
        let existsOperators = this.batchElement.querySelectorAll("a"),
            existsCount = existsOperators.length, operatorCount = jsonData.length, i;
        for (i = 0 ; i < operatorCount ; i++) {
            let operatorData = jsonData[i];
            if (operatorData.hasOwnProperty("link") && operatorData.hasOwnProperty("title")) {
                let operator;
                if (i < existsCount) {
                    operator = existsOperators[i];
                } else {
                    operator = document.createElement("a");
                    this.batchElement.appendChild(operator);
                    operator.addEventListener("click", (event) => Cell.sendRequest(event));
                }
                operator.setAttribute("href", operatorData.link);
                operator.setAttribute("title",
                    operatorData.hasOwnProperty("title") ? operatorData.title : operatorData.textContent);
                if (operatorData.hasOwnProperty("icon")) {
                    operator.setClass("icon " + operatorData.icon);
                }
                if (operatorData.hasOwnProperty("elementId")) {
                    operator.dataset.elementId = operatorData.elementId;
                }
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
                    if (rowData.hasOwnProperty(this.selectName)) {
                        rowElement.dataset[this.selectName] = rowData[this.selectName];
                    }
                    rowElement.data = JSON.stringify(rowData);
                    rowElement.selectAll = this.selectName;
                    rowElement.enableSelectAll = this.selectAll;
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
                        rowElement.updateDefines(this.headerElement.itemDefines);
                    }
                    if (rowData.hasOwnProperty(this.selectName)) {
                        rowElement.dataset[this.selectName] = rowData[this.selectName];
                    }
                    rowElement.data = JSON.stringify(rowData);
                    rowElement.selectAll = this.selectName;
                    rowElement.enableSelectAll = this.selectAll;
                    i++;
                });
                while (i < existsCount) {
                    this.contentElement.removeChild(rowList[i]);
                    i++;
                }
            }
        }
    }

    _renderPager() {
        if (this.pagerElement.dataset.itemData === undefined || !this.pagerElement.dataset.itemData.isJSON()) {
            return;
        }
        let jsonData = this.pagerElement.dataset.itemData.parseJSON();
        let totalPage = 0, currentPage = 1;
        if (jsonData.hasOwnProperty("totalPage") && ((typeof jsonData.totalPage) === "number")) {
            totalPage = jsonData.totalPage;
        }
        if (totalPage <= 0) {
            return;
        }
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
            firstPageBtn.setClass("icon-step_backward");
            firstPageBtn.dataset.currentPage = "1";
            this.pagerElement.appendChild(firstPageBtn);
            firstPageBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this.parentElement.pageQuery(firstPageBtn.dataset.currentPage.parseInt(), this.pageLimit);
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
            previousPageBtn.setClass("icon-chevron_left");
            this.pagerElement.appendChild(previousPageBtn);
            previousPageBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this.parentElement.pageQuery(previousPageBtn.dataset.currentPage.parseInt(), this.pageLimit);
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
            for (let i = pageBtnList.length ; i < totalPage ; i++) {
                pageGroup.removeChild(pageBtnList[i]);
            }
        } else if (pageBtnList.length < totalPage) {
            for (let i = pageBtnList.length ; i < totalPage ; i++) {
                let pageBtn = document.createElement("i");
                pageBtn.dataset.currentPage = (i + 1).toString();
                pageBtn.innerText = (i + 1).toString();
                pageGroup.appendChild(pageBtn);
                pageBtn.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.parentElement.pageQuery(pageBtn.dataset.currentPage.parseInt(), this.pageLimit);
                });
            }
        }

        let beginPage = Math.max(1, currentPage - 2), endPage = Math.min(totalPage, currentPage + 2);
        pageGroup.querySelectorAll("i").forEach(pageBtn => {
            let pageNo = pageBtn.dataset.currentPage.parseInt();
            if (pageNo === currentPage) {
                pageBtn.appendClass("current");
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
            nextPageBtn.setClass("icon-chevron_right");
            this.pagerElement.appendChild(nextPageBtn);
            nextPageBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this.parentElement.pageQuery(nextPageBtn.dataset.currentPage.parseInt(), this.pageLimit);
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
            lastPageBtn.setClass("icon-step_forward");
            lastPageBtn.dataset.currentPage = totalPage.toString();
            this.pagerElement.appendChild(lastPageBtn);
            lastPageBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                this.parentElement.pageQuery(lastPageBtn.dataset.currentPage.parseInt(), this.pageLimit);
            });
        }
        if (currentPage === totalPage) {
            lastPageBtn.hide();
        } else {
            lastPageBtn.show();
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
        if (this.filterElement === null) {
            this.filterElement = new ListFilter()
            this.filterElement.setAttribute("slot", "filter");
            this.appendChild(this.filterElement);
            this.filterElement.hide();
        }
        if (this.statisticsElement === null) {
            this.statisticsElement = new ListStatistics()
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

        let initData = this.getAttribute("data");
        if (initData !== undefined && initData !== null && initData.isJSON()) {
            this.renderElement(initData.parseJSON());
        }
    }

    renderElement(data) {
        if (data === null) {
            return;
        }
        if (data.hasOwnProperty("id")) {
            this.setAttribute("id", data.id);
            this.filterElement.dataset.elementId = data.id;
        }
        if (data.hasOwnProperty("filter")) {
            this.filterElement.data = JSON.stringify(data.filter);
            this.filterElement.show();
        }
        if (data.hasOwnProperty("statistics")) {
            this.statisticsElement.data = JSON.stringify(data.statistics);
            this.statisticsElement.show();
        }
        if (data.hasOwnProperty("title")) {
            this.titleEleemnt.data = JSON.stringify(data.title);
            this.titleEleemnt.show();
        }
        if (data.hasOwnProperty("grid")) {
            this.gridElement.data = JSON.stringify(data.grid);
            this.gridElement.show();
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

    pageQuery(pageNo = 1, pageLimit = 15) {
        if (this.filterElement !== null) {
            this.filterElement.pageQuery(pageNo, pageLimit);
        }
    }
}

export {ListFilter, ListData, ListStatistics, ListTitle, ListRecord,
    RecordOperator, ListHeader, MessageList, PropertyItem, PropertyDefine};