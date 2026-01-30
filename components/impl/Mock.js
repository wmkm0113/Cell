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

import {TagRender} from "../Components.js";
import {Comment} from "../../commons/Commons.js";

const pagerClick = async function (event) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target;
    if (target.dataset.hasOwnProperty("currentPage")) {
        const current = target.dataset.currentPage;
        let element = target.parentElement;
        while (true) {
            if (element === null || element.matches('span[data-type="pager"]')) {
                break;
            }
            element = element.parentElement;
        }
        if (element !== null) {
            const items = element.querySelector(':scope > span[data-type="items"]'),
                pageArray = items.querySelectorAll(':scope > i'),
                currentPage = current.parseInt(),
                pagerCount = element.dataset.hasOwnProperty("pagerCount") ? element.dataset.pagerCount.parseInt() : 5,
                totalPage = element.dataset.totalPage.parseInt(),
                firstBtn = element.querySelector(':scope > i[data-type="first-btn"]'),
                previousBtn = element.querySelector(':scope > i[data-type="previous-btn"]'),
                nextBtn = element.querySelector(':scope > i[data-type="next-btn"]'),
                lastBtn = element.querySelector(':scope > i[data-type="last-btn"]');

            const endPage = Math.min(totalPage, Math.max(currentPage + 2, pagerCount)),
                beginPage = Math.max(1, endPage - pagerCount + 1);
            let index = 0;
            for (let pageNo = beginPage; pageNo <= endPage; pageNo++) {
                let item = index < pageArray.length ? pageArray[index] : document.createElement("i");
                if (pageArray.length <= index) {
                    item.addEventListener("click", async (event) => await pagerClick(event));
                    items.appendChild(item);
                }
                item.dataset.currentPage = pageNo.toString();
                item.innerText = pageNo.toString();
                if (pageNo === currentPage) {
                    item.setClass("current");
                } else {
                    item.removeClass("current");
                }
                index++;
            }
            while (index < pageArray.length) {
                items.removeChild(pageArray[index]);
                index++;
            }
            previousBtn.dataset.currentPage = Math.max(1, currentPage - 1).toString();
            nextBtn.dataset.currentPage = Math.min(totalPage, currentPage + 1).toString();
            if (beginPage === 1) {
                firstBtn.hide();
            } else {
                firstBtn.show();
            }
            if (currentPage > 1) {
                previousBtn.show();
            } else {
                previousBtn.hide();
            }
            if (currentPage < totalPage) {
                nextBtn.show();
            } else {
                nextBtn.hide();
            }
            if (endPage < totalPage) {
                lastBtn.show();
            } else {
                lastBtn.hide();
            }
        }
        await switchPage(element);
    }
}

const changeLimit = async function (event) {
    event.preventDefault();
    event.stopPropagation();
    let element = event.target.parentElement;
    while (true) {
        if (element === null || element.matches('span[data-type="pager"]')) {
            break;
        }
        element = element.parentElement;
    }
    await switchPage(element);
}

const switchPage = async function (pagerElement = null) {
    if (pagerElement !== null && pagerElement.dataset.hasOwnProperty("pager")) {
        const current = pagerElement.querySelector(':scope > span[data-type="items"] > i[class="current"]');
        let pageNo = "1";
        if (current !== null && current.dataset.hasOwnProperty("currentPage")) {
            pageNo = current.dataset.currentPage;
        }
        const paramName = pagerElement.dataset.hasOwnProperty("limit") ? pagerElement.dataset.limit : "";
        const pageLimit = pagerElement.querySelector('select[data-type="page-limit"]');
        if (pagerElement.dataset.hasOwnProperty("formId")) {
            const form = $(pagerElement.dataset.formId);
            if (form) {
                const parameters = {};
                const pager = form.querySelector(`input[name="${pagerElement.dataset.pager}"]`);
                if (pager) {
                    pager.value = pageNo;
                } else {
                    parameters[pagerElement.dataset.pager] = pageNo;
                }
                if (paramName.length > 0) {
                    parameters[paramName] = pageLimit !== null ? pageLimit.value : -1;
                }
                await Cell.submitForm(form, parameters);
            }
        } else if (pagerElement.dataset.hasOwnProperty("link")) {
            const formData = new FormData();
            formData.append(pagerElement.dataset.pager, pageNo);
            if (paramName.length > 0) {
                formData.append(paramName, pageLimit !== null ? pageLimit.value : -1);
            }
            Cell.sendRequest(pagerElement.dataset.link, {}, formData)
                .then(responseText =>
                    Cell._response(responseText, false, pagerElement.dataset.link,
                        pagerElement.dataset.hasOwnProperty("targetId") ? pagerElement.dataset.targetId : ""))
                .catch((errorMsg) => Cell.error("Error.Message", errorMsg));
        }
    }
}

class TipsRender extends TagRender {

    static newInstance() {
        const tips = document.createElement("i");
        tips.dataset.type = "tips";
        return tips;
    }

    static selectors() {
        return ['i[data-type="tips"]'];
    }

    async _setData(element = null, data = "") {
        if (element === null) {
            return;
        }
        element.dataset.content = data;
    }
}

/**
 * Score information render
 *
 * 打分信息渲染器
 */
class ScoreRender extends TagRender {

    static newInstance(rate = false) {
        const score = document.createElement(rate ? "span" : "p");
        score.dataset.type = "score";
        return score;
    }

    static selectors() {
        return ['p[data-type="score"]', 'span[data-type="score"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }
        if (element.tagName.toLowerCase() === "p") {
            let index = 5, content = "";
            while (index > 0) {
                content += String.fromCodePoint(Comment.Icons.Score.Empty);
                index--;
            }
            element.setAttribute("title", "0");
            element.innerHTML = content;
        } else if (element.tagName.toLowerCase() === "span") {
            let itemName = element.dataset.name || element.name || element.id || "score";
            for (let i = 5; i > 0; i--) {
                let id = itemName + i;
                let inputElement = document.createElement("input");
                inputElement.setAttribute("type", "radio");
                inputElement.setAttribute("id", id);
                inputElement.setAttribute("name", itemName);
                inputElement.setAttribute("value", i.toString());
                inputElement.dataset.category = "score";
                element._appendChild(inputElement);
            }
        }
    }

    async _setData(element = null, data = 0.0) {
        if (element === null) {
            return;
        }
        if (element.tagName.toLowerCase() === "p") {
            let score = data.toString().parseFloat();
            let fillCount = 0, halfCount = false, emptyCount = 0;
            if (score <= 0) {
                emptyCount = 5;
            } else if (score >= 5) {
                fillCount = 5;
            } else {
                for (let i = 1; i <= 5; i++) {
                    if (i <= score) {
                        fillCount++;
                    } else {
                        if ((i - score) < 1) {
                            halfCount = true;
                        } else {
                            emptyCount++;
                        }
                    }
                }
            }
            let content = "";
            while (fillCount > 0) {
                content += String.fromCodePoint(Comment.Icons.Score.Fill);
                fillCount--;
            }
            if (halfCount) {
                content += String.fromCodePoint(Comment.Icons.Score.Half);
            }
            while (emptyCount > 0) {
                content += String.fromCodePoint(Comment.Icons.Score.Empty);
                emptyCount--;
            }
            element.setAttribute("title", score);
            element.innerHTML = content;
        }
    }
}

/**
 * Mock button render
 *
 * 模拟按钮渲染器
 */
class MockButtonRender extends TagRender {

    static newInstance(type = "") {
        switch (type) {
            case "link":
                const link = document.createElement("a");
                link.dataset.mock = "button";
                return link;
            case "checkbox":
            case "radio":
            case "submit":
            case "reset":
                const button = document.createElement("input");
                button.dataset.type = type;
                button.type = type;
                return button;
            default:
                const btn = document.createElement("input");
                btn.type = "button";
                return btn;
        }
    }

    static selectors() {
        return ['a[data-mock="button"]', 'input[type="checkbox"]', 'input[type="radio"]', 'input[type="button"]', 'input[type="submit"]', 'input[type="reset"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }
        if (element.tagName.toLowerCase() === "input") {
            if (["submit", "reset"].indexOf(element.type.toLowerCase()) === -1) {
                const label = element.nextElementSibling;
                if (label == null || label.tagName.toLowerCase() !== "label") {
                    const labelElement = document.createElement("label");
                    if (element.id.length > 0) {
                        labelElement.setAttribute("for", element.id);
                    }
                    element.after(labelElement);
                    if (element.type.toLowerCase() === "button") {
                        labelElement.addEventListener("click", (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            const element = event.target;
                            const input = element.previousElementSibling;
                            if (input && input.tagName.toLowerCase() === "input") {
                                input.countDown();
                            }
                        });
                    } else if (element.type.toLowerCase() === "radio") {
                        labelElement.addEventListener("click", (event) => {
                            const label = event.target, targetId = label.getAttribute("for");
                            if (((typeof targetId) === "string") && targetId.length > 0) {
                                const element = $(targetId);
                                if (element) {
                                    if (element.hasAttribute("checked")) {
                                        element.removeAttribute("checked");
                                    } else {
                                        element.setAttribute("checked", "checked");
                                    }
                                    if (element.dataset.hasOwnProperty("container")
                                        && element.dataset.hasOwnProperty("selector")) {
                                        const container = $(element.dataset.container);
                                        if (container) {
                                            container.querySelectorAll(element.dataset.selector)
                                                .forEach((item) => {
                                                    if (item.id === element.value) {
                                                        item.show();
                                                    } else {
                                                        item.hide();
                                                    }
                                                });
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        } else {
            element.addEventListener("click", (event) => Cell.eventRequest(event));
        }
        this._renderLabel(element);
    }

    _renderLabel(element = null) {
        if (element === null) {
            return;
        }
        const label = (element.tagName.toLowerCase() === "a" || ["submit", "reset"].indexOf(element.type.toLowerCase()) !== -1)
            ? element
            : element.nextElementSibling;
        if (label) {
            element.generateId();
            if (element.matches('input[type="checkbox"][data-type="switch"]') && element.dataset.hasOwnProperty("icons")) {
                try {
                    const icons = element.dataset.icons.parseJSON();
                    if (icons.hasOwnProperty("enable")) {
                        label.dataset.enableIcon = String.fromCodePoint(Number.parseInt(icons.enable, 16));
                    }
                    if (icons.hasOwnProperty("disable")) {
                        label.dataset.disableIcon = String.fromCodePoint(Number.parseInt(icons.disable, 16));
                    }
                } catch (e) {
                }
            }
            if (!element.dataset.hasOwnProperty("category")
                || ["score", "like", "favorite"].indexOf(element.dataset.category.toLowerCase()) === -1) {
                let labelText;
                if (element.dataset.hasOwnProperty("content")) {
                    labelText = element.dataset.content;
                    delete element.dataset.multiKey;
                } else if (element.dataset.hasOwnProperty("multiKey") && element.dataset.multiKey.length > 0) {
                    labelText = Cell.multiMsg(element.dataset.multiKey);
                } else {
                    labelText = element.value;
                }
                if (label.tagName.toLowerCase() === "label") {
                    label.setAttribute("for", element.id);
                    label.innerText = labelText;
                } else {
                    label.value = labelText;
                    label.dataset.value = labelText;
                }
                if (element.dataset.hasOwnProperty("tips") && element.dataset.tips.length > 0) {
                    label.title = element.dataset.tips;
                }
            }
            if (element.dataset.hasOwnProperty("category")) {
                label.dataset.value = element.value;
                switch (element.dataset.category.toLowerCase()) {
                    case "favorite":
                        label.dataset.yes = String.fromCodePoint(Comment.Icons.Favorite.Yes);
                        label.dataset.no = String.fromCodePoint(Comment.Icons.Favorite.No);
                        break;
                    case "like":
                        label.dataset.yes = String.fromCodePoint(Comment.Icons.Like.Yes);
                        label.dataset.no = String.fromCodePoint(Comment.Icons.Like.No);
                        break;
                    case "score":
                        label.dataset.fill = String.fromCodePoint(Comment.Icons.Score.Fill);
                        label.dataset.empty = String.fromCodePoint(Comment.Icons.Score.Empty);
                        break;
                }
            }
        }
    }

    async _setData(element = null, data = {}) {
        Object.entries(data).forEach(entry => {
            if (entry[1] === undefined || entry[1] === null) {
                return;
            }
            switch (entry[0].toLowerCase()) {
                case "name":
                    element.name = entry[1];
                    break;
                case "id":
                    element.id = entry[1];
                    break;
                case "value":
                    element.value = entry[1];
                    break;
                case "link":
                    if (element.tagName.toLowerCase() === "a") {
                        element.href = entry[1].toString();
                    } else {
                        element.dataset.link = entry[1].toString();
                    }
                    break;
                case "checked":
                    if (entry[1]) {
                        element.setAttribute("checked", "");
                        element.dataset.status = entry[1].toString();
                    } else {
                        element.removeAttribute("checked");
                        delete element.dataset.status;
                    }
                    break;
                case "icons":
                    if (element.matches('input[type="checkbox"][data-type="switch"]')) {
                        element.dataset.icons = JSON.stringify(entry[1]);
                    }
                    break;
                default:
                    const data = ((typeof entry[1]) === "string") ? entry[1] : JSON.stringify(entry[1]);
                    if (data.length > 0) {
                        element.dataset[entry[0]] = data;
                    }
                    break;
            }
        });
        if (element.tagName.toLowerCase() === "a") {
            if (element.dataset.type) {
                switch (element.dataset.type.toLowerCase()) {
                    case "favorite":
                        element.dataset.yes = String.fromCodePoint(Comment.Icons.Favorite.Yes);
                        element.dataset.no = String.fromCodePoint(Comment.Icons.Favorite.No);
                        break;
                    case "like":
                        element.dataset.yes = String.fromCodePoint(Comment.Icons.Like.Yes);
                        element.dataset.no = String.fromCodePoint(Comment.Icons.Like.No);
                        break;
                }
            }
        }
        this._renderLabel(element);
    }
}

class PagerRender extends TagRender {

    static newInstance() {
        const pager = document.createElement("span");
        pager.dataset.type = "pager";
        return pager;
    }

    static selectors() {
        return ['span[data-type="pager"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        const select = document.createElement("select");
        select.dataset.type = "page-limit";
        select.dataset.sortCode = "0";
        select.generateId();
        element.appendChild(select);
        select.addEventListener("change", (event) => changeLimit(event));

        const firstBtn = document.createElement("i");
        firstBtn.dataset.type = "first-btn";
        firstBtn.dataset.currentPage = "1";
        firstBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.First);
        element.appendChild(firstBtn);
        firstBtn.addEventListener("click", async (event) => await pagerClick(event));

        const previousBtn = document.createElement("i");
        previousBtn.dataset.type = "previous-btn";
        previousBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Previous);
        element.appendChild(previousBtn);
        previousBtn.addEventListener("click", async (event) => await pagerClick(event));

        const pagerItems = document.createElement("span");
        pagerItems.dataset.type = "items";
        element.appendChild(pagerItems);

        const nextBtn = document.createElement("i");
        nextBtn.dataset.type = "next-btn";
        nextBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Next);
        element.appendChild(nextBtn);
        nextBtn.addEventListener("click", async (event) => await pagerClick(event));

        const lastBtn = document.createElement("i");
        lastBtn.dataset.type = "last-btn";
        lastBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Last);
        element.appendChild(lastBtn);
        lastBtn.addEventListener("click", async (event) => await pagerClick(event));
    }

    async _setData(element = null, data) {
        if (element === null) {
            return;
        }
        const elements = this._elements(element);
        if (data.hasOwnProperty("totalPage") && data.hasOwnProperty("currentPage")) {
            const currentPage = data.currentPage.toString().parseInt(),
                totalPage = data.totalPage.toString().parseInt(),
                beginPage = Math.max(1, currentPage - 2),
                endPage = Math.min(totalPage, currentPage + 2),
                pageCount = endPage - beginPage + 1;
            if (currentPage < 1 || totalPage < currentPage) {
                return;
            }
            element.dataset.totalPage = totalPage.toString();
            element.show();
            if (data.hasOwnProperty("url")) {
                element.dataset.link = data.url;
            }
            if (data.hasOwnProperty("formId")) {
                element.dataset.formId = data.formId;
            }
            if (data.hasOwnProperty("pagerParam")) {
                element.dataset.pager = data.pagerParam;
            }

            if (data.hasOwnProperty("limitParam")
                && data.hasOwnProperty("currentLimit")
                && data.hasOwnProperty("items")) {
                element.dataset.limit = data.limitParam;
                elements.limit.name = data.limitParam;
                elements.limit.dataset.value = data.currentLimit;
                elements.limit.dataset.multiKey = data.hasOwnProperty("multiKey") ? data.multiKey : "";
                elements.limit.items(data.items);
                elements.limit.show();
            }

            if (data.hasOwnProperty("limit")) {
                const limitData = data.limit;
                if (limitData.hasOwnProperty("id")
                    && limitData.hasOwnProperty("current")
                    && limitData.hasOwnProperty("items")) {
                    element.dataset.limit = limitData.id;
                    elements.limit.name = limitData.id;
                    elements.limit.dataset.value = limitData.current;
                    elements.limit.dataset.multiKey = limitData.hasOwnProperty("multiKey") ? limitData.multiKey : "";
                    elements.limit.items(limitData.items);
                    elements.limit.show();
                }
            }
            if (elements.limit.childList().length === 0) {
                elements.limit.hide();
            }

            if (beginPage === 1) {
                elements.first.hide();
            } else {
                elements.first.show();
            }
            if (currentPage === 1) {
                elements.previous.hide();
            } else {
                elements.previous.show();
            }
            if (endPage === totalPage) {
                elements.last.hide();
            } else {
                elements.last.show();
            }
            if (currentPage === totalPage) {
                elements.next.hide();
            } else {
                elements.next.show();
            }
            elements.previous.dataset.currentPage = Math.max(1, currentPage - 1).toString();
            elements.next.dataset.currentPage = Math.min(totalPage, currentPage + 1).toString();
            elements.last.dataset.currentPage = totalPage.toString();

            const items = elements.items.querySelectorAll(":scope > i");
            for (let i = 0; i < pageCount; i++) {
                const item = (i < items.length) ? items[i] : document.createElement("i");
                if (items.length <= i) {
                    item.addEventListener("click", async (event) => await pagerClick(event));
                    elements.items.appendChild(item);
                }
                const pageNo = (beginPage + i);
                item.innerText = pageNo.toString();
                item.dataset.currentPage = pageNo.toString();
                if (pageNo === currentPage) {
                    item.setClass("current");
                } else {
                    item.removeClass("current");
                }
            }
            for (let i = pageCount; i < items.length; i++) {
                elements.items.removeChild(items[i]);
            }

            if ((totalPage - currentPage) < 3) {
                elements.next.hide();
                elements.last.hide();
            } else {
                elements.next.show();
                elements.last.show();
            }
        } else {
            element.hide();
        }
    }

    _elements(element = null) {
        const elements = {
            limit: null,
            first: null,
            previous: null,
            items: [],
            next: null,
            last: null
        };
        if (element) {
            elements.limit = element.querySelector(':scope > select[data-type="page-limit"]');
            elements.first = element.querySelector(':scope > i[data-type="first-btn"]');
            elements.previous = element.querySelector(':scope > i[data-type="previous-btn"]');
            elements.items = element.querySelector(':scope > span[data-type="items"]');
            elements.next = element.querySelector(':scope > i[data-type="next-btn"]');
            elements.last = element.querySelector(':scope > i[data-type="last-btn"]');
        }
        return elements;
    }
}

export {TipsRender, ScoreRender, MockButtonRender, PagerRender}

(function () {
    Cell.registerRenders(TipsRender, ScoreRender, MockButtonRender, PagerRender);
})();