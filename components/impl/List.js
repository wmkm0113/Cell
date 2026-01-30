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

import {Comment} from "../../commons/Commons.js";
import {EnhancedElement, TagRender} from "../Components.js";
import {DetailsRender} from "./Details.js";
import {FormInfoElement} from "./Form.js";
import {MockButtonRender, PagerRender} from "./Mock.js";
import {PropertyRender} from "./Enhance.js";

/**
 * Property information define
 *
 * @param paramName parameter name (used when sort parameter is true)
 * @param multiKey  property name multilingual message key
 * @param content   property name content
 * @param width     column width
 * @param category  property data type (timestamp/price)
 * @param sort      property is a sort parameter (true/false)
 *
 * 属性信息定义
 *
 * @param paramName 参数名（在sort参数为true时使用）
 * @param multiKey  属性名多语言键值
 * @param content   属性名
 * @param width     数据列宽度
 * @param category  数据类型 (timestamp/price)
 * @param sort      属性是一个可排序的参数 (true/false)
 * @type {{paramName: string, multiKey: string, content: string, width: string, category: string, sort: boolean}}
 */
const Property = {
    paramName: "",
    multiKey: "",
    content: "",
    width: "",
    category: "",
    sort: false
};
Object.freeze(Property);

const sortClick = async function (event, filter = null) {
    event.preventDefault();
    event.stopPropagation();
    const item = event.target;
    if (!item.dataset.hasOwnProperty("sort") || item.dataset.sort !== "true") {
        return;
    }
    if (filter !== null && filter.dataset.hasOwnProperty("sortName") && filter.dataset.hasOwnProperty("sortType")) {
        const parameters = [];
        parameters[filter.dataset.sortName] = item.dataset.paramName;
        if (!item.dataset.hasOwnProperty("sortType") || item.dataset.sortType.toLowerCase() === "asc") {
            item.dataset.sortType = "desc";
            parameters[filter.dataset.sortType] = "asc";
        } else {
            item.dataset.sortType = "asc";
            parameters[filter.dataset.sortType] = "desc";
        }
        await Cell.submitForm(filter, parameters);
    }
}

/**
 * Statistic information render
 *
 * 分析信息渲染器
 */
class StatisticsRender extends TagRender {

    static newInstance() {
        const statistics = document.createElement("a");
        statistics.dataset.type = "statistics";
        return statistics;
    }

    static selectors() {
        return ['a[data-type="statistics"]'];
    }

    async _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        Object.keys(data).forEach((key) => {
            switch (key.toLowerCase()) {
                case "class":
                    element.setClass(data[key]);
                    break;
                case "id":
                    element.id = data[key];
                    break;
                case "link":
                    element.href = data[key];
                    break;
                case "index":
                    element.dataset.sortCode = data[key];
                    break;
                case "title":
                    const title = data.title;
                    if (title.hasOwnProperty("multiKey")) {
                        element.dataset.title = Cell.multiMsg(title.multiKey);
                    } else if (title.hasOwnProperty("content")) {
                        element.dataset.title = title.content;
                    }
                    break;
                default:
                    element.dataset[key] = data[key];
                    break;
            }
        });
        if (Object.keys(data).filter(key => key.toLowerCase() === "class").length === 0) {
            element.setClass("");
            if (data.hasOwnProperty("bgColor")) {
                element.style.backgroundColor = data.bgColor;
            }
            if (data.hasOwnProperty("color")) {
                element.style.color = data.color;
            }
        } else {
            delete element.style.backgroundColor;
            delete element.style.color;
        }
        if (Object.keys(data).filter(key => key.toLowerCase() === "link").length === 0) {
            element.href = "#";
        }
        if (element.dataset.hasOwnProperty("content")) {
            element.setAttribute("title", element.dataset.content);
        }
        const parentElement = element.parentElement;
        StatisticsRender.selectors().forEach(selector =>
            parentElement.sortChildrenBy(selector, "data-sort-code", true));
    }
}

/**
 * Grid list information render
 *
 * 信息列表渲染器
 */
class GridListRender extends TagRender {

    static newInstance() {
        const grid = document.createElement("div");
        grid.dataset.type = "grid";
        return grid;
    }

    static selectors() {
        return ['div[data-type="grid"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }
        //  Clear all child nodes
        element.clearChildNodes();

        const filter = FormInfoElement.newInstance();
        filter.dataset.sortCode = "0";
        element._appendChild(filter);

        //  Create statistics area
        const statistics = document.createElement("span");
        statistics.dataset.type = "statistics";
        statistics.dataset.sortCode = "1";
        element.appendChild(statistics);

        const grid = document.createElement("span");
        grid.dataset.type = "data-grid";
        grid.dataset.sortCode = "2";
        element.appendChild(grid);

        const title = document.createElement("span");
        title.dataset.type = "title";
        title.dataset.sortCode = "0";
        grid.appendChild(title);

        const switchBtn = document.createElement("span");
        switchBtn.dataset.type = "switch-btn-group";
        switchBtn.dataset.sortCode = "1";
        grid.appendChild(switchBtn);

        const addBtn = document.createElement("i");
        addBtn.innerText = String.fromCodePoint(Comment.Icons.Button.Plus);
        addBtn.dataset.type = "add-btn";
        addBtn.dataset.sortCode = "2";
        grid.appendChild(addBtn);
        addBtn.addEventListener("click", (event) => Cell.eventRequest(event));

        const header = document.createElement("span");
        header.dataset.type = "grid-header";
        header.dataset.sortCode = "3";
        grid.appendChild(header);

        //  Prepare grid header
        const mainTitle = document.createElement("span");
        mainTitle.dataset.type = "main-title";
        mainTitle.dataset.sortCode = "0";
        header.appendChild(mainTitle);

        const properties = document.createElement("span");
        properties.dataset.type = "properties";
        properties.dataset.sortCode = "1";
        header.appendChild(properties);

        const operators = document.createElement("span");
        operators.dataset.type = "operators";
        operators.dataset.sortCode = "2";
        header.appendChild(operators);

        const list = document.createElement("span");
        list.dataset.type = "grid-list";
        list.dataset.sortCode = "4";
        grid.appendChild(list);

        const batchBtn = document.createElement("span");
        batchBtn.dataset.type = "batch-btn-group";
        batchBtn.dataset.sortCode = "5";
        grid.appendChild(batchBtn);

        const selectAllBtn = document.createElement("i");
        selectAllBtn.dataset.type = "select-all";
        selectAllBtn.innerText = String.fromCodePoint(Comment.Icons.Select.Yes);
        batchBtn.appendChild(selectAllBtn);
        selectAllBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            const target = event.target;
            const selectName = target.parentElement.dataset.selectName || "identifyCode";
            const selector = `input[type="checkbox"][name="${selectName}"]`;
            const selectArray = Array.from(document.querySelectorAll(selector));
            const checkedCount = selectArray.filter(item => item.checked).length;
            if (checkedCount === selectArray.length) {
                selectArray.forEach(item => item.checked = false);
                target.innerText = String.fromCodePoint(Comment.Icons.Select.Yes);
            } else {
                selectArray.forEach(item => item.checked = true);
                target.innerText = String.fromCodePoint(Comment.Icons.Select.No);
            }
        })

        const pager = PagerRender.newInstance();
        pager.dataset.sortCode = "6";
        grid._appendChild(pager);

        //  Prepare switch style buttons
        const current = grid.className || "view-list";
        ["text-list", "view-list", "image-list"].forEach(listType => {
            let styleBtn = document.createElement("i");
            styleBtn.dataset.listType = listType;
            switch (listType) {
                case "text-list":
                    styleBtn.innerText = String.fromCodePoint(Comment.Icons.List.Text);
                    break;
                case "view-list":
                    styleBtn.innerText = String.fromCodePoint(Comment.Icons.List.View);
                    break;
                case "image-list":
                    styleBtn.innerText = String.fromCodePoint(Comment.Icons.List.Image);
                    break;
            }
            if (current === listType) {
                styleBtn.appendClass("current");
            }
            switchBtn.appendChild(styleBtn);
            styleBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                const btnGroup = event.target.parentElement, gridElement = btnGroup.parentElement;
                gridElement.className = listType;
                btnGroup.querySelectorAll(":scope > i")
                    .forEach(itemBtn => {
                        if (itemBtn.dataset.listType === listType) {
                            itemBtn.appendClass("current");
                        } else {
                            itemBtn.removeClass("current");
                        }
                    });
            });
        });

        header.sortChildrenBy(":scope > span", "data-sort-code");
        grid.sortChildrenBy(":scope > *", "data-sort-code");
        element.sortChildrenBy(":scope > span", "data-sort-code");
    }

    async _prepare(element = null, data = {}) {
        if (element === null) {
            return;
        }
        const grid = data.grid || {};
        const elements = this._elements(element);
        if (data.hasOwnProperty("class")) {
            const className = data.class;
            elements.grid.setClass(className);
            elements.switchBtn.querySelectorAll(":scope > i")
                .forEach(itemBtn => {
                    if (itemBtn.dataset.listType === className) {
                        itemBtn.appendClass("current");
                    } else {
                        itemBtn.removeClass("current");
                    }
                });
        }
        if (data.hasOwnProperty("addLink")) {
            elements.addBtn.dataset.link = data.addLink;
            elements.addBtn.show();
        } else {
            elements.addBtn.hide();
        }
        if (data.hasOwnProperty("switch")) {
            if (Boolean(data.switch)) {
                elements.switchBtn.show();
            } else {
                elements.switchBtn.hide();
            }
        }
        elements.list.dataset.selectName = grid.selectName || "";
        elements.batchBtn.dataset.selectName = grid.selectName || "";
        const statistics = data.statistics || [];
        const statisticsArray = elements.statistics.querySelectorAll(':scope > a[data-type="statistics"]');
        statistics.forEach((statistic, index) => {
            const item = (index < statisticsArray.length) ? statisticsArray[index] : StatisticsRender.newInstance();
            if (statisticsArray.length <= index) {
                elements.statistics._appendChild(item);
            }
            item.data = statistic;
        });
        for (let i = statistics.length; i < statisticsArray.length; i++) {
            elements.statistics.removeChild(statisticsArray[i]);
        }
        if (statistics.length === 0) {
            elements.statistics.style.display = "none";
        } else {
            elements.statistics.style.display = "grid";
        }
        const title = data.title || {};
        if (title.hasOwnProperty("multiKey")) {
            elements.title.dataset.multiKey = title.multiKey;
            elements.title.innerText = Cell.multiMsg(title.multiKey);
        } else if (title.hasOwnProperty("content")) {
            elements.title.innerText = title.content;
        }
        const header = grid.header || {};
        const mainTitle = header.main || {};
        if (mainTitle.hasOwnProperty("multiKey")) {
            elements.header.mainTitle.dataset.multiKey = mainTitle.multiKey;
        } else if (mainTitle.hasOwnProperty("content")) {
            elements.header.mainTitle.innerText = mainTitle.content;
        } else {
            elements.header.mainTitle.innerText = "";
        }
        const operatorTitle = header.operator || {};
        if (operatorTitle.hasOwnProperty("multiKey")) {
            elements.header.operators.dataset.multiKey = operatorTitle.multiKey;
        } else if (operatorTitle.hasOwnProperty("content")) {
            elements.header.operators.innerText = operatorTitle.content;
        } else {
            elements.header.operators.innerText = "";
        }
        if (header.hasOwnProperty("items") && (header.items instanceof Array)) {
            const properties = [];
            header.items.forEach((item, index) => {
                const property = JSON.stringify(Property).parseJSON();
                const propertyTitle = item.title || {};
                if (propertyTitle.hasOwnProperty("multiKey")) {
                    property.multiKey = propertyTitle.multiKey;
                }
                property.content = propertyTitle.hasOwnProperty("content") ? propertyTitle.content : "";
                if (item.hasOwnProperty("width")) {
                    property.width = item.width;
                }
                property.sort = item.hasOwnProperty("sort") ? item.sort : false;
                if (property.sort && item.hasOwnProperty("paramName")) {
                    property.paramName = item.paramName;
                }
                if (item.hasOwnProperty("category")) {
                    property.category = item.category;
                }
                if (property.hasOwnProperty("category") && property.category !== null && property.category.toLowerCase() === "timestamp") {
                    property.pattern = item.hasOwnProperty("pattern") ? item.pattern : Comment.DateTime.ISO8601DATETIMEPattern;
                }
                properties[index] = property;
            });
            let existProperties = elements.header.properties.querySelectorAll(":scope > span");
            const count = properties.length;
            properties.forEach((property, index) => {
                let item = (index < existProperties.length) ? existProperties[index] : document.createElement("span");
                if (existProperties.length <= index) {
                    elements.header.properties.appendChild(item);
                    item.addEventListener("click", async (event) => await sortClick(event, elements.filter));
                }
                item.setStyle("--width:" + property.width);
                if (property.sort) {
                    item.dataset.sortType = "";
                }
                item.dataset.sortCode = (count - index).toString();
                item.dataset.sort = property.sort.toString();
                if (property.hasOwnProperty("multiKey") && property.multiKey.length > 0) {
                    item.dataset.multiKey = property.multiKey;
                } else {
                    delete item.dataset.multiKey;
                    item.innerText = property.content;
                    item.setAttribute("title", property.content);
                }
                if (property.sort) {
                    item.dataset.paramName = property.paramName;
                    item.style.cursor = "pointer";
                } else {
                    delete item.dataset.paramName;
                    item.style.cursor = "auto";
                }
            });
            for (let i = properties.length; i < existProperties.length; i++) {
                elements.header.properties.removeChild(existProperties[i]);
            }
            elements.header.properties.sortChildrenBy(":scope > span", "data-sort-code", true);
            elements.list.dataset.properties = JSON.stringify(properties);
            const operators = grid.operators || [];
            const operatorArray = elements.batchBtn.querySelectorAll(':scope > i');
            operators.forEach((operator, index) => {
                const i = index + 1;
                const item = (i + 1) < operatorArray.length ? operatorArray[i] : document.createElement("i");
                if (operatorArray.length <= i) {
                    item.addEventListener("click", (event) => {
                        if (!Comment.Browser.IE || Comment.Browser.IE11) {
                            event.preventDefault();
                        }
                        event.stopPropagation();
                        const target = event.target;
                        const elementName = target.parent.dataset.selectName || "identifyCode";
                        let parameters = null;
                        if (elementName.length > 0) {
                            parameters = new FormData();
                            document.getElementsByName(elementName)
                                .forEach((item) => {
                                    if (item.tagName.toLowerCase() === "input" && item.type.toLowerCase() === "checkbox" && item.checked) {
                                        parameters.append(elementName, item.value);
                                    }
                                });
                            Cell.eventRequest(event, {}, parameters);
                        }
                    });
                    elements.batchBtn.appendChild(item);
                }
                if (operator.hasOwnProperty("icon")) {
                    item.innerText = String.fromCodePoint(Number.parseInt(operator.icon, 16))
                }
                if (operator.hasOwnProperty("link")) {
                    item.dataset.link = operator.link;
                }
                item.setAttribute("title", operator.title || "");
            });
            for (let index = operators.length + 1; index < operatorArray.length; index++) {
                elements.batchBtn.removeChild(operatorArray[index]);
            }
            if (elements.list.dataset.selectName.length === 0) {
                operatorArray[0].hide();
            } else {
                operatorArray[0].show();
            }
        }
    }

    async _setData(element = null, data = {}) {
        const filter = this._filter(element);
        if (data.hasOwnProperty("filter")) {
            filter.data = data.filter;
            if (data.filter.hasOwnProperty("formId")) {
                filter.id = data.filter.formId;
            }
            filter.dataset.sortName = data.filter.hasOwnProperty("sortName") ? data.filter.sortName : "";
            if (filter.dataset.sortName.length === 0) {
                filter.dataset.sortName = "sortBy";
            }
            filter.dataset.sortType = data.filter.hasOwnProperty("sortType") ? data.filter.sortType : "sortType";
            if (filter.dataset.sortType.length === 0) {
                filter.dataset.sortType = "sortType";
            }
        }
        const childNodes = filter.querySelector(':scope > span[data-type="items"]').childList();
        const ignoreCount = Array.from(childNodes).filter(item => item.styles().display === "none").length;
        if ((childNodes.length - ignoreCount) === 0) {
            filter.hide();
        } else {
            filter.show();
        }
        if (element.id.length === 0) {
            element.generateId();
        }
        filter.dataset.targetId = element.id;

        const gridData = data.grid || {};
        const list = this._list(element);
        if (list) {
            const itemData = gridData.hasOwnProperty("itemData") ? gridData.itemData : [];
            const itemArray = list.querySelectorAll(':scope > span[data-type="list-record"]');
            itemData.forEach((item, index) => {
                const itemElement = (index < itemArray.length) ? itemArray[index] : ListRecordRender.newInstance();
                if (itemArray.length <= index) {
                    list._appendChild(itemElement);
                }
                itemElement.data = item;
            });
            for (let i = itemData.length; i < itemArray.length; i++) {
                list.removeChild(itemArray[i]);
            }
        }
        const pagerData = gridData.hasOwnProperty("pager") ? gridData.pager : {};
        const pager = this._pager(element);
        if (pager !== null && pagerData.hasOwnProperty("totalPage") && pagerData.hasOwnProperty("currentPage")
            && pagerData.hasOwnProperty("pagerParam")) {
            pager.data = pagerData;
        } else {
            pager.hide();
        }
        await Cell.multilingual(element);
    }

    _elements(element = null) {
        const grid = element.querySelector(':scope > span[data-type="data-grid"]');
        const header = grid.querySelector(':scope > span[data-type="grid-header"]');
        return {
            filter: element.querySelector(':scope > form[data-type="form"]'),
            statistics: element.querySelector(':scope > span[data-type="statistics"]'),
            grid: grid,
            title: grid.querySelector(':scope > span[data-type="title"]'),
            addBtn: grid.querySelector(':scope > i[data-type="add-btn"]'),
            switchBtn: grid.querySelector(':scope > span[data-type="switch-btn-group"]'),
            header: {
                mainTitle: header.querySelector(':scope > span[data-type="main-title"]'),
                properties: header.querySelector(':scope > span[data-type="properties"]'),
                operators: header.querySelector(':scope > span[data-type="operators"]')
            },
            list: grid.querySelector(':scope > span[data-type="grid-list"]'),
            batchBtn: grid.querySelector(':scope > span[data-type="batch-btn-group"]')
        };
    }

    _filter(element = null) {
        if (element === null) {
            return null;
        }
        return element.querySelector(':scope > form-info > form[data-type="form"]');
    }

    _pager(element = null) {
        if (element === null) {
            return null;
        }
        return element.querySelector(':scope > span[data-type="data-grid"]')
            .querySelector(':scope > span[data-type="pager"]');
    }

    _list(element = null) {
        if (element === null) {
            return null;
        }
        return element.querySelector(':scope > span[data-type="data-grid"]')
            .querySelector(':scope > span[data-type="grid-list"]');
    }
}

/**
 * List record information render
 *
 * 列表记录信息渲染器
 */
class ListRecordRender extends TagRender {

    static newInstance() {
        const record = document.createElement("span");
        record.dataset.type = "list-record";
        record.addEventListener("mouseover", (event) => {
            event.stopPropagation()
            const preview = record.querySelector('span[data-type="lazy"][data-catagory="preview"]');
            if (preview) {
                preview.playVideo();
            }
        });
        record.addEventListener("mouseout", (event) => {
            event.stopPropagation()
            const preview = record.querySelector('span[data-type="lazy"][data-catagory="preview"]');
            if (preview) {
                preview.pauseVideo();
            }
        });
        return record;
    }

    static selectors() {
        return ['span[data-type="list-record"]'];
    }

    async _enhance(element = null) {
        if (element) {
            const checkBox = document.createElement("input");
            checkBox.setAttribute("type", "checkbox");
            checkBox.dataset.category = "select-all";
            checkBox.dataset.type = "checkbox";
            element._appendChild(checkBox);
            checkBox.addEventListener("change", (event) => {
                event.stopPropagation();
                const current = event.target;
                const selector = `input[type="checkbox"][name="${current.name}"]`;
                const totalCount = document.querySelectorAll(selector).length;
                const checkedCount = document.querySelectorAll(selector + ":checked").length;
                const selectAllBtn = document.querySelector('span[data-type="batch-btn-group"] > i[data-type="select-all"]');
                if (checkedCount === totalCount) {
                    selectAllBtn.innerText = String.fromCodePoint(Comment.Icons.Select.No);
                } else {
                    selectAllBtn.innerText = String.fromCodePoint(Comment.Icons.Select.Yes);
                }
            })

            const avatar = document.createElement("span");
            avatar.dataset.category = "preview";
            avatar.dataset.type = "lazy";
            element._appendChild(avatar);
            avatar.addEventListener("click", Cell.eventRequest);

            const title = document.createElement("a");
            title.dataset.category = "main-title";
            element.appendChild(title);
            title.addEventListener("click", Cell.eventRequest);

            const score = document.createElement("p");
            score.dataset.category = "score";
            score.dataset.type = "score";
            element._appendChild(score);

            const label = document.createElement("p");
            label.dataset.type = "label";
            element._appendChild(label);

            const properties = document.createElement("span");
            properties.dataset.category = "properties";
            element.appendChild(properties);

            const summary = document.createElement("span");
            summary.dataset.category = "summary";
            element.appendChild(summary);

            const operators = document.createElement("span");
            operators.dataset.category = "operators";
            element.appendChild(operators);

            const extraOperators = document.createElement("span");
            extraOperators.dataset.category = "extra";
            operators.appendChild(extraOperators);
        }
    }

    async _setData(element = null, data = {}) {
        if (element === null || Object.keys(data).length === 0) {
            return;
        }

        const elements = this._elements(element);
        const linkAddress = data.link || "#";
        if (data.hasOwnProperty("avatar")) {
            elements.avatar.data = data.avatar;
            elements.avatar.dataset.link = linkAddress;
        }
        if (data.hasOwnProperty("openWindow")) {
            elements.avatar.dataset.openWindow = data.openWindow;
            elements.title.dataset.openWindow = data.openWindow;
        } else {
            delete elements.avatar.dataset.openWindow;
            delete elements.title.dataset.openWindow;
        }
        elements.title.innerText = data.title;
        elements.title.setAttribute("title", data.title);
        elements.title.setAttribute("href", linkAddress);
        const parent = element.parentElement;
        let selectName = parent.dataset.selectName;
        if (selectName && selectName.length > 0 && data.hasOwnProperty("identifyCode")) {
            const identifier = data.identifyCode;
            elements.checkBox.data = {
                name: selectName,
                id: selectName + identifier,
                value: identifier,
                hidden: "false"
            };
        } else {
            elements.checkBox.data = {
                hidden: "true"
            };
        }
        elements.summary.innerHTML = data.hasOwnProperty("summary") ? data.summary : "";
        if (data.hasOwnProperty("properties")) {
            const properties = data.properties,
                propArray = elements.properties.querySelectorAll('span[data-type="property"]'),
                defines = parent.dataset.properties.parseJSON(),
                defineCount = defines.length;
            if (properties.length === defineCount) {
                defines.forEach((define, index) => {
                    const property = (index < propArray.length) ? propArray[index] : PropertyRender.newInstance();
                    if (propArray.length <= index) {
                        elements.properties._appendChild(property);
                    }
                    property.data = {
                        sortCode: (defineCount - index).toString(),
                        title: {
                            multiKey: define.multiKey,
                            content: define.content
                        },
                        category: define.category,
                        pattern: define.pattern,
                        value: (index < properties.length) ? properties[index] : null
                    }
                    property.setStyle("--width:" + define.width);
                });
                for (let index = propArray.length; index < propArray.length; index++) {
                    elements.properties.removeChild(propArray[index]);
                }
            } else {
                elements.properties.clearChildNodes();
            }
        }
        elements.properties.sortChildrenBy('span[data-type="property"]', "data-sort-code", true);
        if (data.hasOwnProperty("score")) {
            elements.score.data = data.score;
            delete elements.score.show();
        } else {
            elements.score.data = 0.0;
            elements.score.hide();
        }
        if (data.hasOwnProperty("operators") && (data.operators instanceof Array)) {
            let operatorList = elements.operators.querySelectorAll('a[data-mock="button"]'),
                extraOperatorList = elements.extraOperators.querySelectorAll('a[data-mock="button"]'),
                operatorCount = operatorList.length, extraCount = extraOperatorList.length,
                operatorIndex = 0, extraIndex = 0;
            data.operators.forEach(itemData => {
                const extraOperator = (itemData.hasOwnProperty("extra") && Boolean(itemData.extra)),
                    newOperator = extraOperator ? (extraCount <= extraIndex) : (operatorCount <= operatorIndex),
                    operator = newOperator ? document.createElement("a") : (extraOperator ? extraOperatorList[extraIndex] : operatorList[operatorIndex]);
                if (newOperator) {
                    operator.dataset.mock = "button";
                    operator.addEventListener("click", Cell.eventRequest);
                    if (extraOperator) {
                        elements.extraOperators.appendChild(operator);
                    } else {
                        elements.operators.insertBefore(operator, elements.extraOperators);
                    }
                }
                if (itemData.hasOwnProperty("link")) {
                    operator.setAttribute("href", itemData.link);
                }
                if (itemData.hasOwnProperty("icon")) {
                    operator.dataset.icon = String.fromCodePoint(Number.parseInt(itemData.icon, 16));
                } else {
                    delete operator.dataset.icon;
                }
                if (itemData.hasOwnProperty("text")) {
                    const contentData = itemData.text;
                    let content = "";
                    if (contentData.hasOwnProperty("multiKey")) {
                        content = Cell.multiMsg(contentData.multiKey);
                        operator.dataset.multiKey = contentData.multiKey;
                    } else if (contentData.hasOwnProperty("content")) {
                        content = contentData.content;
                        delete operator.dataset.multiKey;
                    }
                    operator.innerText = content;
                    operator.setAttribute("title", content);
                }
                if (itemData.hasOwnProperty("openWindow")) {
                    operator.dataset.openWindow = itemData.openWindow;
                } else {
                    delete operator.dataset.openWindow;
                }
                if (itemData.hasOwnProperty("targetId")) {
                    operator.dataset.targetId = itemData.targetId;
                } else {
                    delete operator.dataset.targetId;
                }
                extraOperator ? extraIndex++ : operatorIndex++;
            });
            while (operatorIndex < operatorCount) {
                elements.operators.removeChild(operatorList[operatorIndex]);
                operatorIndex++;
            }
            while (extraIndex < extraCount) {
                elements.extraOperators.removeChild(extraOperatorList[extraIndex]);
                extraIndex++;
            }
            if (elements.extraOperators.querySelectorAll('a[data-mock="button"]').length === 0) {
                elements.extraOperators.hide();
            } else {
                elements.extraOperators.show();
            }
        } else {
            elements.extraOperators.hide();
        }

        element.removeClass("error");
        element.removeClass("warning");

        if (data.hasOwnProperty("className")) {
            element.appendClass(data.className);
        }
    }

    _elements(element = null) {
        const elements = {
            checkBox: null,
            avatar: null,
            title: null,
            summary: null,
            score: null,
            properties: [],
            operators: []
        };
        if (element) {
            elements.checkBox = element.querySelector(':scope > input[type="checkbox"][data-category="select-all"]');
            elements.avatar = element.querySelector(':scope > span[data-type="lazy"][data-category="preview"]');
            elements.title = element.querySelector(':scope > a[data-category="main-title"]');
            elements.summary = element.querySelector(':scope > span[data-category="summary"]');
            elements.score = element.querySelector(':scope > p[data-type="score"][data-category="score"]');
            elements.properties = element.querySelector(':scope > span[data-category="properties"]');
            elements.operators = element.querySelector(':scope > span[data-category="operators"]');
            elements.extraOperators = elements.operators.querySelector(':scope > span[data-category="extra"]');
        }
        return elements;
    }
}

class MessageListElement extends EnhancedElement {
    static tagName() {
        return "message-list";
    }

    constructor() {
        super(GridListRender);
    }
}

class CommentRecordRender extends TagRender {

    static newInstance() {
        const comment = document.createElement("span");
        comment.dataset.type = "comment-record";
        return comment;
    }

    static selectors() {
        return ['span[data-type="comment-record"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const user = DetailsRender.newInstance("user");
        user.dataset.sortCode = "0";
        element._appendChild(user);

        const title = document.createElement("span");
        title.dataset.category = "title";
        title.dataset.sortCode = "1";
        element.appendChild(title);

        const content = document.createElement("span");
        content.dataset.category = "content";
        content.dataset.sortCode = "2";
        element.appendChild(content);

        const operators = document.createElement("span");
        operators.dataset.category = "operators";
        operators.dataset.sortCode = "3";
        element.appendChild(operators);
    }

    async _setData(element = null, data = {}) {
        if (data.hasOwnProperty("title") && data.hasOwnProperty("content")) {
            const elements = this._elements(element);
            if (elements === null) {
                return;
            }

            if (data.hasOwnProperty("user")) {
                elements.user.data = data.user;
            }
            elements.title.innerText = data.title;
            elements.content.innerText = data.content;
            elements.operators.clearChildNodes();
            if (data.hasOwnProperty("operators")) {
                data.operators
                    .filter(itemData => itemData.hasOwnProperty("type"))
                    .forEach((itemData) => {
                        const operator = MockButtonRender.newInstance(itemData.type);
                        elements.operators._appendChild(operator);
                        operator.data = itemData;
                    })
            }
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            user: element.querySelector(':scope > span[data-type="details"][data-category="user"]'),
            title: element.querySelector(':scope > span[data-category="title"]'),
            content: element.querySelector(':scope > span[data-category="content"]'),
            operators: element.querySelector(':scope > span[data-category="operators"]')
        };
    }
}

class CommentListRender extends TagRender {

    static newInstance() {
        const comment = document.createElement("span");
        comment.dataset.type = "comment-list";
        return comment;
    }

    static selectors() {
        return ['span[data-type="comment-list"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }
        //  Clear all child nodes
        element.clearChildNodes();

        const title = document.createElement("span");
        title.dataset.type = "title";
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const pager = PagerRender.newInstance();
        if (element.id.length === 0) {
            element.id = Math.trunc(Math.random() * 1000000).toString(16);
        }
        pager.dataset.targetId = element.id;
        pager.dataset.sortCode = "2";
        element._appendChild(pager);

        const grid = document.createElement("span");
        grid.dataset.type = "data-list";
        grid.dataset.sortCode = "1";
        element.appendChild(grid);

        element.sortChildrenBy(":scope > span", "data-sort-code");
    }

    async _setData(element = null, data = {}) {
        const elements = this._elements(element);
        if (data.hasOwnProperty("multiKey")) {
            elements.title.innerText = Cell.multiMsg(data.multiKey);
            elements.title.show();
        } else if (data.hasOwnProperty("title")) {
            elements.title.innerText = data.title;
            elements.title.show();
        } else {
            elements.title.hide();
        }
        const itemData = data.items || [];
        const itemArray = elements.list.querySelectorAll(':scope > span[data-type="comment-record"]');
        itemData.forEach((item, index) => {
            const itemElement = (index < itemArray.length) ? itemArray[index] : CommentRecordRender.newInstance();
            if (itemArray.length <= index) {
                elements.list._appendChild(itemElement);
            }
            itemElement.data = item;
        });
        const pagerData = data.hasOwnProperty("pager") ? data.pager : {};
        if (pagerData.hasOwnProperty("totalPage") && pagerData.hasOwnProperty("currentPage")) {
            elements.pager.data = pagerData;
        } else {
            elements.pager.hide();
        }
    }

    _elements(element = null) {
        return {
            title: element.querySelector(':scope > span[data-type="title"]'),
            list: element.querySelector(':scope > span[data-type="data-list"]'),
            pager: element.querySelector(':scope > span[data-type="pager"]')
        };
    }
}

class CommentListElement extends EnhancedElement {
    static tagName() {
        return "comment-list";
    }

    constructor() {
        super(CommentListRender);
    }
}

export {MessageListElement, CommentListElement}

(function () {
    Cell.registerRenders(GridListRender, ListRecordRender, CommentRecordRender, CommentListRender, StatisticsRender);
    Cell.registerComponents(MessageListElement, CommentListElement);
})();