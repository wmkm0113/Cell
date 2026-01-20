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

import {Comment, DragUpload, SlideType} from "../commons/Commons.js";

/**
 * Generate random color code (format: #FFFFFF)
 *
 * @returns {string} Generated random color code
 *
 * 生成随机颜色代码（格式：#FFFFFF）
 *
 * @returns {string} 生成的颜色代码
 */
const randomColor = function () {
    let randColor = "";
    while (true) {
        let color = Math.floor(Math.random() * 255).toString(16);
        if (color.length === 1) {
            randColor += "0";
        }
        randColor += color;
        if (randColor.length >= 6) {
            break;
        }
    }
    return "#" + randColor;
}

/**
 * Calculate pie chart clip path array
 *
 * @param data  Clip data information array
 * @param width Pie width value
 * @returns {*[]} Clip path array
 *
 * 计算饼图的路径信息数组
 *
 * @param data  饼图信息数组
 * @param width 饼图宽度值
 * @returns {*[]} 路径信息数组
 */
const _clipPath = function (data = [], width = 0) {
    let offset = 0;
    const circleX = width / 2;
    const circleY = width / 2;
    const radius = width / 2;
    const dataList = [];
    data.forEach((item) => {
        if (item.hasOwnProperty("value")) {
            let ratio = item.value.parseFloat();
            const sectorData = {
                "path": _path(circleX, circleY, radius, offset, ratio),
                color: randomColor(),
                content: "",
                scale: 1.0
            };
            if (item.hasOwnProperty("color")) {
                sectorData.color = item.color;
            }
            if (item.hasOwnProperty("content")) {
                sectorData.content = item.content;
            }
            if (item.hasOwnProperty("scale")) {
                sectorData.scale = item.scale.parseFloat();
            }
            dataList.push(sectorData);
            offset += ratio;
        }
    });
    return dataList;
}

/**
 * Calculate ring chart clip path array
 *
 * @param data  Clip data information array
 * @returns {*[]} Clip path array
 *
 * 计算环形图的路径信息数组
 *
 * @param data  饼图信息数组
 * @returns {*[]} 路径信息数组
 */
const _ringPath = function (data = []) {
    const dataList = [];
    data.forEach((item) => {
        if (item.hasOwnProperty("value")) {
            const sectorData = {
                value: item.value.parseFloat(),
                color: randomColor(),
                content: ""
            };
            if (item.hasOwnProperty("color")) {
                sectorData.color = item.color;
            }
            if (item.hasOwnProperty("content")) {
                sectorData.content = item.content;
            }
            dataList.push(sectorData);
        }
    });
    return dataList;
}

/**
 * Calculate clip path data string
 *
 * @param circleX Circle X point
 * @param circleY Circle Y point
 * @param radius  Circle radius value
 * @param offset  Ratio offset value
 * @param ratio   Current ratio value
 * @returns ${String} Clip path string
 *
 * 计算扇形路径字符串
 *
 * @param circleX 圆心X坐标
 * @param circleY 圆心Y坐标
 * @param radius  半径值
 * @param offset  扇形起始值
 * @param ratio   扇形角度值
 * @returns ${String} 扇形路径字符串
 */
const _path = function (circleX, circleY, radius, offset, ratio) {
    if (circleX <= 0 || circleY <= 0 || radius <= 0 || offset < 0 || offset > 1 || ratio < 0 || ratio > 1) {
        return {startX: 0, startY: 0, endX: 0, endY: 0};
    }
    const begin = offset * 2 * Math.PI;
    const end = (offset + ratio) * 2 * Math.PI;
    const angle = (ratio * 2 > 1) ? 1 : 0;
    return `M ${circleX}, ${circleY} L ${circleX + Math.sin(begin) * radius}, ${circleY - Math.cos(begin) * radius} A ${radius}, ${radius}, 0, ${angle}, 1 ${circleX + Math.sin(end) * radius}, ${circleY - Math.cos(end) * radius} Z`;
}

/**
 * Render ring by given data
 *
 * @param element       Container element
 * @param index         Ring index number
 * @param _stepWidth    Value of ring width + gap width
 * @param fillColor     Custom ring fill color
 * @param sectorData    Ring data
 *
 * 使用给定的数据生成圆环
 *
 * @param element       环形图容器
 * @param index         数据环索引值
 * @param _stepWidth    环宽度+间隔宽度值
 * @param fillColor     自定义未完成的颜色
 * @param sectorData    数据环信息
 */
const _ring = function (element, index, _stepWidth = 0, fillColor = "", sectorData = {}) {
    const _progress = Math.floor(sectorData.value * 100),
        _last = 100 - _progress,
        _position = Math.floor((index * _stepWidth) / 2),
        sectionArray = element.getElementsByTagName("section");
    const section = (index < sectionArray.length) ? sectionArray[index] : document.createElement("section");
    if (sectionArray.length <= index) {
        element.appendChild(section);
    }
    let styles = `--position: ${_position}px; --ring-width: ${element.dataset.ringWidth}; --ring-color: ${sectorData.color}; --progress: ${_progress}%; --last: ${_last}%;`;
    if (fillColor.length > 0) {
        styles += ` --fill-color: ${fillColor};`;
    }
    section.setAttribute("style", styles);
}

/**
 * Property information define
 *
 * @param paramName parameter name (used when sort parameter is true)
 * @param multiKey  property name multilingual message key
 * @param content   property name content
 * @param width     column width
 * @param timestamp property value is timestamp (true/false)
 * @param sort      property is a sort parameter (true/false)
 *
 * 属性信息定义
 *
 * @param paramName 参数名（在sort参数为true时使用）
 * @param multiKey  属性名多语言键值
 * @param content   属性名
 * @param width     数据列宽度
 * @param timestamp 时间戳数据 (true/false)
 * @param sort      属性是一个可排序的参数 (true/false)
 * @type {{paramName: string, multiKey: string, content: string, width: string, timestamp: boolean, sort: boolean}}
 */
const Property = {
    paramName: "",
    multiKey: "",
    content: "",
    width: "",
    timestamp: false,
    sort: false
}

const showPicker = function (event) {
    if ((event.target.tagName.toLowerCase() === "input")
        && (["date", "time", "datetime-local"].indexOf(event.target.type) !== -1)) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length === 0) {
            event.target.currentDateTime();
        }
        event.target.showPicker();
    }
}

const confirmDialog = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target, element = target.parentElement;
    if (target.dataset.type === "confirm" && element.confirm) {
        element.confirm(event);
    }
    closeDialog(event);
}

const closeDialog = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target.parentElement;
    element.hide();
    delete element.dataset.category;
    delete element.confirm;
    document.body.removeClass("freeze");
}

const sortClick = function (event, filter = null) {
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
        Cell.submitForm(filter, parameters);
    }
}

const pagerClick = function (event) {
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
                    item.addEventListener("click", (event) => pagerClick(event));
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
        switchPage(element);
    }
}

const changeLimit = function (event) {
    event.preventDefault();
    event.stopPropagation();
    let element = event.target.parentElement;
    while (true) {
        if (element === null || element.matches('span[data-type="pager"]')) {
            break;
        }
        element = element.parentElement;
    }
    switchPage(element);
}

const switchPage = function (pagerElement = null) {
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
                parameters[pagerElement.dataset.pager] = pageNo;
                if (paramName.length > 0) {
                    parameters[paramName] = pageLimit !== null ? pageLimit.value : -1;
                }
                Cell.submitForm(form, parameters);
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

const switchCalendar = function (event, calendar = null, current = null) {
    if (calendar !== null && calendar.dataset.switch === "true") {
        const btn = event.target;
        if (current === null || current.childList().length === 0) {
            event.preventDefault();
            event.stopPropagation();
            let dataCategory = "";
            switch (calendar.dataset.category.toLowerCase()) {
                case "year":
                    dataCategory = btn.dataset.hasOwnProperty("month") ? "month" : "year";
                    if (dataCategory === "year" && btn.matches('span[data-type="title"]')) {
                        return;
                    }
                    break;
                case "month":
                    dataCategory = btn.dataset.hasOwnProperty("category") ? btn.dataset.category : "week";
                    break;
                case "week":
                    dataCategory = btn.dataset.hasOwnProperty("category") ? btn.dataset.category : "month";
                    break;
            }
            calendar.data = {
                category: dataCategory,
                year: btn.dataset.year,
                month: btn.dataset.hasOwnProperty("month") ? btn.dataset.month : "",
                week: btn.dataset.hasOwnProperty("week") ? btn.dataset.week : "",
                weekend: calendar.dataset.hasOwnProperty("weekend") ? calendar.dataset.weekend : "true",
                beginIndex: calendar.dataset.hasOwnProperty("beginIndex") ? calendar.dataset.beginIndex : "0",
                loadLink: calendar.dataset.hasOwnProperty("loadLink") ? calendar.dataset.loadLink : ""
            }
        }
    }
}

class TagRender {

    selectors() {
        return [];
    }

    colorMode(element = null, darkMode = false) {
    }

    _enhance(element = null) {
    }

    _prepare(element = null, data) {
    }

    _setData(element = null, data) {
    }

    _multilingual(element = null) {
    }
}

class TipsRender extends TagRender {

    static newInstance() {
        const tips = document.createElement("i");
        tips.dataset.type = "tips";
        return tips;
    }

    selectors() {
        return ['i[data-type="tips"]'];
    }

    _setData(element = null, data = "") {
        if (element === null) {
            return;
        }
        element.dataset.content = data;
    }
}

/**
 * Progress bar render
 *
 * 进度条渲染器
 */
class ProgressRender extends TagRender {

    static newInstance(ring = false) {
        const progressBar = document.createElement("span");
        progressBar.dataset.type = "progress";
        if (ring) {
            progressBar.dataset.category = "ring";
        }
        return progressBar;
    }

    selectors() {
        return ['progress', 'span[data-type="progress"]'];
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }
        let percent = 0;
        if (data.hasOwnProperty("percent")) {
            percent = data.percent.toString().parseInt();
        } else if (data.hasOwnProperty("processed") && data.hasOwnProperty("total")) {
            percent = Math.floor(data.processed.toString().parseInt() * 100 / data.total.toString().parseInt());
        }
        if (percent < 0) {
            percent = 0;
        } else if (percent > 100) {
            percent = 100;
        }
        percent = Math.floor(percent);
        if (element.tagName.toLowerCase() === "progress") {
            element.value = percent;
            element.max = "100";
        } else {
            element.dataset.percent = percent + "%";
            element.setAttribute("style", "--width: " + (percent + "%"));
        }
        let textContent;
        if (data.hasOwnProperty("processed") && data.hasOwnProperty("total")) {
            textContent = data.processed + " / " + data.total;
        } else {
            textContent = (percent + "%");
        }
        element.dataset.info = textContent;
        if (element.dataset.hasOwnProperty("category") && element.dataset.category.toLowerCase() === "ring") {
            this._config(element, data.hasOwnProperty("styles") ? data.styles : {});

            const styles = element.styles();
            const circle = Math.min(styles.width.parseInt(), styles.height.parseInt());
            _ring(element, 0, circle,
                element.dataset.hasOwnProperty("fillColor") ? element.dataset.fillColor : "",
                {
                    value: (percent / 100),
                    color: element.dataset.color
                });
        }
    }

    _config(element = null, styles = {}) {
        if (element === null) {
            return;
        }
        if (styles.hasOwnProperty("color")) {
            element.dataset.color = styles.color;
        } else if (!element.dataset.hasOwnProperty("color")) {
            element.dataset.color = randomColor();
        }
        if (styles.hasOwnProperty("fillColor")) {
            element.dataset.fillColor = styles.fillColor;
        }
        if (styles.hasOwnProperty("width")) {
            element.dataset.ringWidth = styles.width;
        } else if (!element.dataset.hasOwnProperty("ringWidth")) {
            element.dataset.ringWidth = document.remWidth() + "px";
        }
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

    selectors() {
        return ['p[data-type="score"]', 'span[data-type="score"]'];
    }

    _enhance(element = null) {
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

    _setData(element = null, data = 0.0) {
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
 * Resource information render
 *
 * 多媒体信息渲染器
 */
class ResourcesRender extends TagRender {

    static newInstance() {
        const element = document.createElement("span");
        element.dataset.type = "lazy";
        return element;
    }

    selectors() {
        return ['span[data-type="lazy"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.addEventListener("click", (event) => Cell.eventRequest(event));
        element.addEventListener("mouseover", () => element.playVideo());
        element.addEventListener("mouseout", () => element.pauseVideo());
        if (element.dataset.initData && element.dataset.initData.isJSON()) {
            this._setData(element, element.dataset.initData.parseJSON());
        }
    }

    _setData(element = null, data = {}) {
        if (element === null || data === null || Object.keys(data).length === 0) {
            return;
        }

        if (data.hasOwnProperty("mimeType") && data.hasOwnProperty("resourcePath")) {
            if (element.dataset.mimeType !== data["mimeType"] || element.dataset.resourcePath !== data["resourcePath"]) {
                delete element.dataset.loaded;
            }
            Object.keys(data).forEach((key) => element.dataset[key] = data[key]);
            element.loadResource();
        }
    }
}

class BannerRender extends TagRender {
    static newInstance() {
        const banner = document.createElement("a");
        banner.dataset.type = "banner";
        banner.addEventListener("click", (event) => Cell.eventRequest(event));
        return banner;
    }

    selectors() {
        return ['a[data-type="banner"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            Cell.eventRequest(event);
        });
        const avatar = ResourcesRender.newInstance();
        if (avatar) {
            element.clearChildNodes();
            element._appendChild(avatar);
        }
        element.hide();
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }
        if (data.hasOwnProperty("avatar")) {
            const avatar = element.querySelector(':scope > span[data-type="lazy"]');
            if (avatar) {
                avatar.data = data.avatar;
            }
            element.show();
        } else {
            element.hide();
        }
        if (data.hasOwnProperty("link")) {
            element.href = data.link;
        } else {
            element.href = "#";
        }

        if (data.hasOwnProperty("title")) {
            element.title = data.title;
        }

        if (data.hasOwnProperty("multiKey")) {
            element.dataset.content = Cell.multiMsg(data.multiKey);
        } else if (data.hasOwnProperty("content")) {
            element.dataset.content = data.content;
        } else {
            delete element.dataset.content;
        }
    }
}

class PasswordRender extends TagRender {

    static newInstance() {
        const input = document.createElement("input");
        input.dataset.type = "password";
        input.type = "password";
        return input;
    }

    selectors() {
        return ['input[type="password"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        const label = document.createElement("label");
        if (element.id.length > 0) {
            label.setAttribute("for", element.id);
        }
        element.after(label);
        label.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const input = event.target.parentElement.querySelector(':scope > input[data-type="password"]');
            if (input) {
                if (input.type.toLowerCase() === "password") {
                    input.type = "text";
                } else {
                    input.type = "password";
                }
            }
        });
    }

    _setData(element = null, data = "") {
        if (element === null || data.length === 0) {
            return;
        }
        const label = element.parentElement.querySelector(':scope > label');
        if (label) {
            label.setAttribute("for", data);
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

    selectors() {
        return ['a[data-mock="button"]', 'input[type="checkbox"]', 'input[type="radio"]', 'input[type="button"]', 'input[type="submit"]', 'input[type="reset"]'];
    }

    _enhance(element = null) {
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

    _setData(element = null, data = {}) {
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

/**
 * Chart component render
 *
 * 日历组件渲染器
 */
class CalendarRender extends TagRender {

    static newInstance() {
        const calendar = document.createElement("span");
        calendar.dataset.type = "calendar";
        return calendar;
    }

    selectors() {
        return ['span[data-type="calendar"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.dataset.multi = "true";
        element.clearChildNodes();

        const prevBtn = document.createElement("a");
        prevBtn.href = "#";
        prevBtn.dataset.sortCode = "0";
        prevBtn.dataset.type = "previous";
        prevBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Previous);
        element.appendChild(prevBtn);
        prevBtn.addEventListener("click", (event) => switchCalendar(event, element));

        const title = document.createElement("span");
        title.dataset.type = "title";
        title.dataset.sortCode = "1";
        element.appendChild(title);
        let parent = element.parentElement;
        if (parent && parent.matches('span[data-type="content"]')) {
            title.addEventListener("click", (event) => switchCalendar(event, parent.parentElement));
        } else {
            title.addEventListener("click", (event) => switchCalendar(event, element));
        }

        const nextBtn = document.createElement("a");
        nextBtn.href = "#";
        nextBtn.dataset.sortCode = "2";
        nextBtn.dataset.type = "next";
        nextBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Next);
        element.appendChild(nextBtn);
        nextBtn.addEventListener("click", (event) => switchCalendar(event, element));

        const header = document.createElement("span");
        header.dataset.type = "header";
        header.dataset.sortCode = "3";
        element.appendChild(header);

        for (let index = 0; index < 7; index++) {
            const item = document.createElement("p");
            //  Compatible JS day of week value
            item.dataset.dayOfWeek = index === 6 ? "0" : (index + 1).toString();
            item.dataset.index = index.toString();
            item.dataset.sortCode = index.toString();
            switch (item.dataset.dayOfWeek.parseInt()) {
                case 0:
                    item.dataset.fullMultiKey = "Calendar.Sunday";
                    item.dataset.shortMultiKey = "Calendar.Sunday.Short";
                    break;
                case 1:
                    item.dataset.fullMultiKey = "Calendar.Monday";
                    item.dataset.shortMultiKey = "Calendar.Monday.Short";
                    break;
                case 2:
                    item.dataset.fullMultiKey = "Calendar.Tuesday";
                    item.dataset.shortMultiKey = "Calendar.Tuesday.Short";
                    break;
                case 3:
                    item.dataset.fullMultiKey = "Calendar.Wednesday";
                    item.dataset.shortMultiKey = "Calendar.Wednesday.Short";
                    break;
                case 4:
                    item.dataset.fullMultiKey = "Calendar.Thursday";
                    item.dataset.shortMultiKey = "Calendar.Thursday.Short";
                    break;
                case 5:
                    item.dataset.fullMultiKey = "Calendar.Friday";
                    item.dataset.shortMultiKey = "Calendar.Friday.Short";
                    break;
                case 6:
                    item.dataset.fullMultiKey = "Calendar.Saturday";
                    item.dataset.shortMultiKey = "Calendar.Saturday.Short";
                    break;
            }
            header.appendChild(item);
        }

        const content = document.createElement("span");
        content.dataset.type = "content";
        content.dataset.sortCode = "4";
        element.appendChild(content);

        this._multilingual(element);
    }

    _multilingual(element = null) {
        const elements = this._elements(element);
        elements.header.querySelectorAll(':scope > p')
            .forEach(header => {
                if (header.dataset.hasOwnProperty("fullMultiKey")) {
                    header.dataset.fullName = Cell.multiMsg(header.dataset.fullMultiKey);
                }
                if (header.dataset.hasOwnProperty("shortMultiKey")) {
                    header.dataset.shortName = Cell.multiMsg(header.dataset.shortMultiKey);
                }
            });

        if (element.dataset.category === "month" || element.dataset.category === "week") {
            switch (elements.title.dataset.month.parseInt()) {
                case 1:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.January");
                    break;
                case 2:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.February");
                    break;
                case 3:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.March");
                    break;
                case 4:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.April");
                    break;
                case 5:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.May");
                    break;
                case 6:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.June");
                    break;
                case 7:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.July");
                    break;
                case 8:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.August");
                    break;
                case 9:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.September");
                    break;
                case 10:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.October");
                    break;
                case 11:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.November");
                    break;
                case 12:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.December");
                    break;
            }
        }

        if (element.dataset.category === "week") {
            elements.title.innerText = Cell.multiMsg("Calendar.Week", elements.title.dataset.week);
            elements.content.querySelectorAll(':scope > span')
                .forEach(day => {
                    switch (day.dataset.dayOfWeek.parseInt()) {
                        case 0:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Monday");
                            break;
                        case 1:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Tuesday");
                            break;
                        case 2:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Wednesday");
                            break;
                        case 3:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Thursday");
                            break;
                        case 4:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Friday");
                            break;
                        case 5:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Saturday");
                            break;
                        case 6:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Sunday");
                            break;
                    }
                });
        }
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }
        const category = data.hasOwnProperty("category") ? data.category.toLowerCase() : "month";
        element.dataset.weekend = data.hasOwnProperty("weekend") ? data.weekend.toString() : "true";
        element.dataset.beginIndex = data.hasOwnProperty("beginIndex") ? data.beginIndex.toString() : "0";
        element.dataset.switch = data.hasOwnProperty("switch") ? (data.switch.toString() === "true") : "true";

        if (data.hasOwnProperty("dataLink")) {
            element.dataset.dataLink = data.dataLink;
        }
        switch (category) {
            case "week":
                this._weekCalendar(element, data);
                break;
            case "month":
                this._monthCalendar(element, data);
                break;
            case "year":
                this._yearCalendar(element, data);
                break;
        }
        this._multilingual(element);
        if (category !== "year") {
            this._loadData(element);
        }
    }

    _loadData(element = null) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (element.dataset.hasOwnProperty("dataLink") && element.dataset.dataLink.length > 0) {
            const urlAddress =
                element.dataset.dataLink.replace("{year}", elements.title.dataset.year)
                    .replace("{month}", elements.title.dataset.month)
                    .replace("{week}", elements.title.dataset.hasOwnProperty("week") ? elements.title.dataset.week : "-1");
            Cell.sendRequest(urlAddress).then(data => {
                if (data.isJSON()) {
                    const items = data.parseJSON();
                    Object.entries(items).forEach(([key, value]) => {
                        const dateArray = key.split("-");
                        if (dateArray.length === 3) {
                            const day = elements.content.querySelector(`:scope > span[data-year="${dateArray[0]}"][data-month="${dateArray[1].parseInt()}"][data-current="${dateArray[2].parseInt()}"]`)
                            if (day) {
                                this._schedule(day, value);
                            }
                        }
                    });
                }
            });
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        const elements = {
            prevBtn: element.querySelector(':scope > a[data-type="previous"]'),
            title: element.querySelector(':scope > span[data-type="title"]'),
            nextBtn: element.querySelector(':scope > a[data-type="next"]'),
            header: element.querySelector(':scope > span[data-type="header"]'),
            content: element.querySelector(':scope > span[data-type="content"]')
        }
        const switchCalendar = element.dataset.switch === "true";
        if (switchCalendar) {
            elements.prevBtn.style.visibility = "visible";
            elements.nextBtn.style.visibility = "visible";
        } else {
            elements.prevBtn.style.visibility = "hidden";
            elements.nextBtn.style.visibility = "hidden";
        }

        return elements;
    }

    _yearCalendar(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        const year = data.hasOwnProperty("year") ? data.year.parseInt() : new Date().getFullYear();
        elements.prevBtn.dataset.year = (year - 1).toString();
        elements.prevBtn.dataset.category = "year";
        delete elements.prevBtn.dataset.month;
        delete elements.prevBtn.dataset.day;
        elements.nextBtn.dataset.year = (year + 1).toString();
        elements.nextBtn.dataset.category = "year";
        delete elements.nextBtn.dataset.month;
        delete elements.nextBtn.dataset.day;
        elements.title.dataset.year = year.toString();
        delete elements.title.dataset.month;
        delete elements.title.dataset.monthName;
        elements.title.innerText = year.toString();
        elements.header.hide();

        if (element.dataset.hasOwnProperty("category") && element.dataset.category.toLowerCase() !== "year") {
            elements.content.clearChildNodes();
        }
        element.dataset.category = "year";
        const monthArray = elements.content.querySelectorAll(':scope > span');
        for (let month = 0; month < 12; month++) {
            const monthCalendar = month < monthArray.length ? monthArray[month] : CalendarRender.newInstance();
            if (monthArray.length <= month) {
                elements.content._appendChild(monthCalendar);
            }
            monthCalendar.data = {
                beginIndex: data.hasOwnProperty("beginIndex") ? data.beginIndex.toString() : "0",
                category: "month",
                year: year.toString(),
                month: (month + 1).toString()
            };
        }
    }

    _monthCalendar(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        const currentDate = new Date(),
            selectedDate = (data.hasOwnProperty("selected") && data.selected.length > 0)
                ? Date.parse(data.current).parseTime(data.hasOwnProperty("utc") ? Boolean(data.utc) : false)
                : currentDate;
        let year = currentDate.getFullYear(), month = currentDate.getMonth();
        if (data.hasOwnProperty("year") && data.hasOwnProperty("month")) {
            year = data.year.parseInt();
            month = data.month.parseInt() - 1;
        }

        elements.prevBtn.dataset.category = "month";
        if (month === 0) {
            elements.prevBtn.dataset.year = (year - 1).toString();
            elements.prevBtn.dataset.month = "12";
        } else {
            elements.prevBtn.dataset.year = year.toString();
            elements.prevBtn.dataset.month = month.toString();
        }
        delete elements.prevBtn.dataset.day;

        elements.nextBtn.dataset.category = "month";
        if (month === 11) {
            elements.nextBtn.dataset.year = (year + 1).toString();
            elements.nextBtn.dataset.month = "1";
        } else {
            elements.nextBtn.dataset.year = year.toString();
            elements.nextBtn.dataset.month = (month + 2).toString();
        }
        delete elements.nextBtn.dataset.day;

        elements.title.dataset.year = year.toString();
        elements.title.dataset.month = (month + 1).toString();
        elements.title.dataset.category = "year";
        elements.title.innerText = "";

        const dayOfWeekArray = [];
        const beginIndex = data.hasOwnProperty("beginIndex") ? data.beginIndex.parseInt() : 0;
        const headerArray = elements.header.querySelectorAll(':scope > p');
        headerArray.forEach(item => {
            const index = item.dataset.index.parseInt();
            let sortCode = index - beginIndex;
            if (sortCode < 0) {
                sortCode += 7;
            }
            item.dataset.sortCode = sortCode.toString();
            dayOfWeekArray[sortCode] = item.dataset.dayOfWeek;
        });
        elements.header.sortChildrenBy(':scope > p', "data-sort-code");
        elements.header.show();

        const firstDay = new Date(year, month, 1),
            weekOfFirstDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1,
            lastDayOfPreviousMonth = firstDay.lastDayOfPreviousMonth(),
            lastDayOfCurrentMonth = firstDay.lastDayOfCurrentMonth();
        let current, appendCount = (beginIndex === weekOfFirstDay) ? 0 : 7 - beginIndex + weekOfFirstDay;
        if (appendCount > 7) {
            appendCount -= 7;
        }
        if (appendCount === 0) {
            current = 0;
        } else {
            current = lastDayOfPreviousMonth - appendCount;
        }
        let appendLimit = lastDayOfCurrentMonth + appendCount;
        while (appendLimit % 7 !== 0) {
            appendLimit++;
        }

        if (element.dataset.hasOwnProperty("category") && element.dataset.category.toLowerCase() !== "month") {
            elements.content.clearChildNodes();
        }
        element.dataset.category = "month";
        const dayArray = elements.content.querySelectorAll(':scope > span');
        let currentMonth = month;
        if (current !== 0) {
            currentMonth--;
        }
        let parent = element.parentElement, calendar = element;
        while (parent != null) {
            if (parent.matches('span[data-type="calendar"]')) {
                calendar = parent;
            }
            parent = parent.parentElement;
        }
        for (let index = 0; index < appendLimit; index++) {
            current++;
            const day = (index < dayArray.length) ? dayArray[index] : document.createElement("span");
            if (dayArray.length <= index) {
                elements.content.appendChild(day);
                day.addEventListener("click", (event) => switchCalendar(event, calendar, day));
            }
            day.dataset.current = current.toString();
            day.dataset.dayOfWeek = dayOfWeekArray[index % 7];
            day.dataset.beginIndex = beginIndex.toString();
            day.clearChildNodes();
            if (currentMonth < 0) {
                day.dataset.year = (year - 1).toString();
                day.dataset.month = "12";
                day.dataset.week = new Date((year - 1), 11, current).weekOfYear(beginIndex).toString();
            } else if (currentMonth > 11) {
                day.dataset.year = (year + 1).toString();
                day.dataset.month = "1";
                day.dataset.week = new Date((year + 1), 0, current).weekOfYear(beginIndex).toString();
            } else {
                day.dataset.year = year.toString();
                day.dataset.month = (currentMonth + 1).toString();
                day.dataset.week = new Date(year, currentMonth, current).weekOfYear(beginIndex).toString();
            }
            if (currentMonth !== month) {
                day.removeClass("current");
                day.removeClass("selected");
                day.dataset.disabled = "true";
            } else {
                delete day.dataset.disabled;
                if (currentDate.matches(year, month, current)) {
                    day.appendClass("current");
                } else {
                    day.removeClass("current");
                }
                if (selectedDate.matches(year, month, current)) {
                    day.appendClass("selected");
                } else {
                    day.removeClass("selected");
                }
            }
            if ((currentMonth < month && current === lastDayOfPreviousMonth) || (currentMonth === month && current === lastDayOfCurrentMonth)) {
                currentMonth++;
                current = 0;
            }
            if (appendLimit < index + 7) {
                day.dataset.lastRow = "true";
            } else {
                delete day.dataset.lastRow;
            }
        }
        for (let index = appendLimit; index < dayArray.length; index++) {
            elements.content.removeChild(dayArray[index]);
        }

        //  Hidden last row if all display item is disabled
        if (data.hasOwnProperty("weekend") && data.weekend.toString().toLowerCase() === "false") {
            const checkArray = elements.content.querySelectorAll(':scope > span[data-last-row]');
            const count = Array.from(checkArray).filter(day => {
                if (day.dataset.hasOwnProperty("disabled")) {
                    return true;
                }
                const index = day.dataset.dayOfWeek.parseInt();
                return index === 0 || index === 6;
            }).length;
            if (count === checkArray.length) {
                checkArray.forEach(day => elements.content.removeChild(day));
            }
        }
    }

    _weekCalendar(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (element.dataset.hasOwnProperty("category") && element.dataset.category.toLowerCase() !== "week") {
            elements.content.clearChildNodes();
        }
        element.dataset.category = "week";
        const current = new Date(),
            year = data.hasOwnProperty("year") ? data.year.parseInt() : current.getFullYear(),
            beginIndex = data.hasOwnProperty("beginIndex") ? data.beginIndex.parseInt() : 0,
            week = data.hasOwnProperty("week") ? data.week.parseInt() : current.weekOfYear(beginIndex),
            firstDayOfYear = new Date(year, 0, 1);
        elements.prevBtn.dataset.category = "week";
        if (week === 1) {
            elements.prevBtn.dataset.year = (year - 1).toString();
            elements.prevBtn.dataset.week = new Date(year, 0, 0).weekOfYear(beginIndex).toString();
        } else {
            elements.prevBtn.dataset.year = year.toString();
            elements.prevBtn.dataset.week = (week - 1).toString();
        }

        elements.nextBtn.dataset.category = "week";
        const weekCountOfCurrentYear = new Date(year + 1, 0, 0).weekOfYear(beginIndex);
        if (week === weekCountOfCurrentYear) {
            elements.nextBtn.dataset.year = (year + 1).toString();
            elements.nextBtn.dataset.week = "1";
        } else {
            elements.nextBtn.dataset.year = year.toString();
            elements.nextBtn.dataset.week = (week + 1).toString();
        }

        const dayCount = (week - 1) * 7 - firstDayOfYear.getDay() - (7 - (beginIndex === 0 ? 7 : beginIndex)) + 1;
        let dateTimestamp = firstDayOfYear.valueOf() + dayCount * (24 * 60 * 60 * 1000);
        const month = dayCount < 0 ? firstDayOfYear.getMonth() : dateTimestamp.parseTime(false).getMonth();

        elements.title.dataset.year = year.toString();
        elements.title.dataset.month = (month + 1).toString();
        elements.title.dataset.week = week.toString();
        elements.title.dataset.category = "month";
        elements.title.innerText = Cell.multiMsg("Calendar.Week", week);

        const dayArray = elements.content.querySelectorAll(':scope > span');
        for (let index = 0; index < 7; index++) {
            const day = (index < dayArray.length) ? dayArray[index] : document.createElement("span");
            if (dayArray.length <= index) {
                elements.content.appendChild(day);
            }
            let weekOfIndex = beginIndex + index;
            if (weekOfIndex > 6) {
                weekOfIndex -= 7;
            }
            day.dataset.weekOfIndex = weekOfIndex.toString();
            switch (weekOfIndex) {
                case 0:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Monday");
                    break;
                case 1:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Tuesday");
                    break;
                case 2:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Wednesday");
                    break;
                case 3:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Thursday");
                    break;
                case 4:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Friday");
                    break;
                case 5:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Saturday");
                    break;
                case 6:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Sunday");
                    break;
            }
            let date = dateTimestamp.parseTime(false);
            day.dataset.year = date.getFullYear().toString();
            day.dataset.month = (date.getMonth() + 1).toString();
            day.dataset.current = date.getDate().toString();
            if (current.matches(date.getFullYear(), date.getMonth(), date.getDate())) {
                day.setClass("current");
            } else {
                day.removeClass("current");
            }
            day.clearChildNodes();
            dateTimestamp += (24 * 60 * 60 * 1000);
        }
        for (let index = 7; index < dayArray.length; index++) {
            elements.content.removeChild(dayArray[index]);
        }
    }

    _schedule(day = null, plans = {}) {
        if (day === null || plans.length === 0) {
            return;
        }
        day.clearChildNodes();

        plans.filter(plan => plan.hasOwnProperty("tagName") && plan.hasOwnProperty("data"))
            .forEach(plan => {
                switch (plan.tagName) {
                    case "form-item":
                        const formItem = FormItemRender.newInstance();
                        day._appendChild(formItem);
                        formItem.data = plan.data;
                        break;
                    case "schedule-item":
                        const scheduleItem = ScheduleItemRender.newInstance();
                        day._appendChild(scheduleItem);
                        scheduleItem.data = plan.data;
                        break;
                }
            });
    }
}

/**
 * Chart information render
 *
 * 报表信息渲染器
 */
class ChartRender extends TagRender {

    static newInstance(style = "") {
        const chart = document.createElement("section");
        chart.dataset.type = "chart";
        chart.dataset.style = style;
        return chart;
    }

    selectors() {
        return ['section[data-type="chart"]'];
    }

    _prepare(element = null, data = {}) {
        if (element === null) {
            return;
        }
        if (this.selectors().filter(selector => element.matches(selector)).length > 0
            && data.hasOwnProperty("items")) {
            const barChart = element.dataset.style.toLowerCase() === "bar"
                || element.dataset.style.toLowerCase() === "k-line"
                || element.dataset.style.toLowerCase() === "column"
                || element.dataset.style.toLowerCase() === "waterfall";
            let width = Math.min(element.clientWidth, element.clientHeight), halfWidth = width / 2;
            element.dataset.legendWidth = Math.floor(halfWidth) + "px";
            let sizeX = "0px", sizeY = "0px";
            if (barChart) {
                const remWidth = document.remWidth();
                sizeX = remWidth + "px";
                sizeY = (element.dataset.style.toLowerCase() === "bar") ? remWidth + "px" : (remWidth * 5) + "px";
            }
            if (data.hasOwnProperty("styles")) {
                const styles = data.styles || {};
                if (barChart) {
                    if (styles.hasOwnProperty("sizeX")) {
                        sizeX = styles.sizeX;
                    }
                    if (styles.hasOwnProperty("sizeY")) {
                        sizeY = styles.sizeY;
                    }
                }
            }
            if (element.dataset.style.toLowerCase() === "bar"
                || element.dataset.style.toLowerCase() === "k-line"
                || element.dataset.style.toLowerCase() === "column"
                || element.dataset.style.toLowerCase() === "waterfall") {
                element.style.marginLeft = "" + sizeY;
                element.style.marginBottom = "" + sizeX;
                element.dataset.sizeX = sizeX;
                element.dataset.sizeY = sizeY;
                if (element.dataset.style.toLowerCase() !== "k-line") {
                    let _groupCount = data.items.length;
                    if (element.dataset.style.toLowerCase() === "bar") {
                        element.style.gridTemplateRows = `repeat(${_groupCount}, 1fr)`;
                    } else {
                        element.style.gridTemplateColumns = `repeat(${_groupCount}, 1fr)`;
                    }
                }
            }
        }
    }

    _setData(element = null, data = {}) {
        if (element === null || element.dataset.type !== "chart" || !element.dataset.style) {
            return;
        }

        switch (element.dataset.style.toLowerCase()) {
            case "pie":
            case "rose":
                this._pieChart(element, data);
                break;
            case "ring":
                this._ringChart(element, data);
                break;
            case "bar":
            case "column":
            case "waterfall":
                this._barChart(element, data);
                break;
            case "k-line":
                this._kLineChart(element, data);
                break;
        }
    }

    _parameters(element, styles = {}) {
        const elementStyles = element.styles();
        const width = Math.min(elementStyles.width.parseInt(), elementStyles.height.parseInt());
        const circle = Math.floor(width * 0.75);
        // let width = Math.min(element.clientWidth, element.clientHeight);
        const remWidth = document.remWidth();
        const parameters = {
            remWidth: remWidth,
            width: circle,
            halfWidth: circle / 2,
            ringWidth: 0,
            gapWidth: 0,
            fillColor: "",
            titleSize: remWidth + "px",
            itemSize: "1fr",
            markingColor: randomColor(),
            colors: {
                positive: "green",
                negative: "red"
            }
        };
        if (element.dataset.style.toLowerCase() === "ring") {
            let ringWidth = parameters.remWidth * 2,
                gapWidth = ringWidth,
                fillColor = "";
            if (styles.hasOwnProperty("ringWidth")) {
                ringWidth = styles.ringWidth.parseInt();
            }
            if (styles.hasOwnProperty("gapWidth")) {
                gapWidth = styles.gapWidth.parseInt();
            }
            if (styles.hasOwnProperty("fillColor")) {
                fillColor = styles.fillColor;
            }
            parameters.ringWidth = ringWidth;
            parameters.gapWidth = gapWidth;
            parameters.fillColor = fillColor;
            element.dataset.ringWidth = ringWidth.toString() + "px";
        } else if (element.dataset.style.toLowerCase() === "bar"
            || element.dataset.style.toLowerCase() === "column"
            || element.dataset.style.toLowerCase() === "waterfall") {
            let _barChart = element.dataset.style.toLowerCase() === "bar";
            if (_barChart) {
                parameters.titleSize = (parameters.remWidth * 5) + "px";
            }
            if (styles.hasOwnProperty("itemSize")) {
                parameters.itemSize = styles.itemSize;
            }
            if (styles.hasOwnProperty("titleSize")) {
                parameters.titleSize = styles.titleSize;
            }
            if (styles.hasOwnProperty("markingColor")) {
                parameters.markingColor = styles.markingColor;
            }
        } else if (element.dataset.style.toLowerCase() === "k-line") {
            if (styles.hasOwnProperty("markingColor")) {
                parameters.markingColor = styles.markingColor;
            }
            if (styles.hasOwnProperty("positive")) {
                parameters.colors.positive = styles.positive;
            }
            if (styles.hasOwnProperty("negative")) {
                parameters.colors.negative = styles.negative;
            }
        }
        return parameters;
    }

    _sector(element, index, sectorData = {}) {
        let sectionArray = element.getElementsByTagName("section");
        let section;
        if (sectionArray.length <= index) {
            section = document.createElement("section");
            element.appendChild(section);
        }
        section.style.clipPath = "path('" + sectorData.path + "')";
        section.style.backgroundColor = ("" + sectorData.color);
        section.style.scale = "" + sectorData.scale;
    }

    _markings(element, parameters = {}, data = [], style = "") {
        let markings = element.querySelector('p[data-type="markings"]');
        if (!markings) {
            markings = document.createElement("p");
            markings.dataset.type = "markings";
            element.appendChild(markings);
        }
        markings.setAttribute("style", `--marking-color: ${parameters.markingColor};`);
        const markingArray = markings.querySelectorAll("i");
        let position = 0, step = 100 / (data.length - 1);
        data.forEach((content, index) => {
            const marking = index < markingArray.length ? markingArray[index] : document.createElement("i");
            if (markingArray.length <= index) {
                markings.appendChild(marking);
            }
            marking.dataset.content = content;
            let markingStyles = `--position: ${position}%;`;
            if (style === "bar") {
                markingStyles += `--moving: -${element.dataset.sizeX}; --size: calc(-5px + ${element.dataset.sizeX});`;
            } else {
                markingStyles += `--moving: -${element.dataset.sizeY}; --size: calc(-5px + ${element.dataset.sizeY});`;
            }
            marking.setAttribute("style", markingStyles);
            position += step;
        })
    }

    _bar(element, index = 0, parameters = {}, data = {}, legendData = [], style = "") {
        let containerArray = element.getElementsByTagName("span");
        let barContainer;
        if (index < containerArray.length) {
            barContainer = containerArray[index];
        } else {
            barContainer = document.createElement("span");
            element.appendChild(barContainer);
        }
        let styles = element.dataset.style.toLowerCase() === "bar" ? "grid-template-rows: " : "grid-template-columns: ";
        styles += `repeat(${legendData.length}, ${parameters.itemSize}); --title-size: ${parameters.titleSize}; --title-moving: -${parameters.titleSize};`;
        barContainer.setAttribute("style", styles);
        if (data.hasOwnProperty("title")) {
            barContainer.dataset.title = data.title;
        }
        data.values.forEach((itemData, _index) =>
            this._barSector(barContainer, _index, itemData, legendData[_index], style));
    }

    _kLine(sector = null, min = 0, height = 0, parameters = {}, data = {}) {
        if (sector !== null && min > 0 && height > 0
            && data.hasOwnProperty("open") && data.hasOwnProperty("close")
            && data.hasOwnProperty("low") && data.hasOwnProperty("high")) {
            const open = data.open.toString().parseFloat(),
                close = data.close.toString().parseFloat(),
                low = data.low.toString().parseFloat(),
                high = data.high.toString().parseFloat(),
                line = high - low,
                block = Math.max(open, close) - Math.min(open, close),
                blockPosition = (Math.floor((Math.min(open, close) - min) * 100 / height)),
                linePosition = (Math.floor((low - min) * 100 / height));
            sector.setAttribute("style",
                `--item-color: ${close < open ? parameters.colors.negative : parameters.colors.positive}; --block-height: ${Math.floor((block * 100) / height)}%; --block-position: ${blockPosition}%; --line-height: ${Math.floor((line * 100) / height)}%; --line-position: ${linePosition}%`);
            let title = sector.querySelector(':scope > p[data-type="title"]');
            if (title === null) {
                title = document.createElement("p");
                title.dataset.type = "title";
                sector.appendChild(title);
            }
            title.innerText = data.hasOwnProperty("title") ? data.title : "";

            let content = sector.querySelector(':scope > p[data-type="content"]');
            if (content === null) {
                content = document.createElement("p");
                content.dataset.type = "content";
                sector.appendChild(content);
            }
            content.dataset.open = open.toString();
            content.dataset.close = close.toString();
            content.dataset.low = low.toString();
            content.dataset.high = high.toString();
        }
    }

    _barSector(container, index = 0, data = 0.0, legend = {}, style = "") {
        const sectorArray = container.getElementsByTagName("p");
        let sector;
        if (index < sectorArray.length) {
            sector = sectorArray[index];
        } else {
            sector = document.createElement("p");
            container.appendChild(sector);
        }
        sector.setAttribute("style", `--item-color: ${legend.color}`);
        let _percent = Math.floor(data * 100);
        switch (style) {
            case "waterfall":
                if (_percent < 0) {
                    sector.style.gridRow = `100 / ${100 - _percent}`;
                    sector.style.alignItems = "flex-end";
                } else {
                    sector.style.gridRow = `${100 - _percent} / 101`;
                    sector.style.paddingTop = "1fr";
                }
                break;
            case "bar":
                sector.style.gridColumnEnd = "" + _percent;
                break;
            default:
                sector.style.gridRowStart = "" + (100 - _percent);
                break;
        }
        sector.dataset.content = "" + _percent;
    }

    _legend(container, index, parameters = {}, sectorData = {}) {
        let legendArray = container.getElementsByTagName("p");
        let legend;
        if (legendArray.length <= index) {
            legend = document.createElement("p");
            container.appendChild(legend);
        }
        const styles = Object.keys(parameters).length === 0
            ? `--item-color:${sectorData.color};`
            : `padding-left: ${parameters.halfWidth}px; --item-color:${sectorData.color};`
        legend.setAttribute("style", styles);
        legend.dataset.content = sectorData.content;
    }

    _remove(element, container, length = 0) {
        new Array(element.getElementsByTagName("section"))
            .filter((section, index) => length <= index)
            .forEach(section => element.removeChild(section));
        new Array(container.getElementsByTagName("p"))
            .filter((legend, index) => length <= index)
            .forEach(legend => element.removeChild(legend));
    }

    _pieChart(element, data = {}) {
        element.style.height = `${element.styles().width.parseInt()}px`;
        const parameters = this._parameters(element);
        element.style.height = `${parameters.width}px`;
        _clipPath(data.items, parameters.width).forEach((sectorData, index) => {
            this._sector(element, index, sectorData);
            this._legend(element, index, parameters, sectorData);
        });
        this._remove(element, element, data.items.length);
    }

    _ringChart(element, data = {}) {
        element.style.height = `${element.styles().width.parseInt()}px`;
        const parameters = this._parameters(element, data.hasOwnProperty("styles") ? data.styles : {});
        element.style.height = `${parameters.width}px`;
        const _stepWidth = parameters.ringWidth + parameters.gapWidth;
        _ringPath(data.items)
            .forEach((sectorData, index) => {
                _ring(element, index, _stepWidth, parameters.fillColor, sectorData);
                this._legend(element, index, parameters, sectorData);
            });
        this._remove(element, element, data.items.length);
    }

    _barChart(element, data = {}) {
        if (data.hasOwnProperty("legend")) {
            const parameters = this._parameters(element, data.hasOwnProperty("styles") ? data.styles : {});
            const chartStyle = element.dataset.style.toLowerCase();
            this._markings(element, parameters, data.hasOwnProperty("markings") ? data.markings : [], chartStyle);
            let containers = element.getElementsByTagName("aside");
            let container = containers.length > 0 ? containers[0] : document.createElement("aside");
            if (containers.length === 0) {
                element.appendChild(container);
            }
            let _legendData = data.legend;
            let _itemCount = _legendData.length;
            for (let _index = 0; _index < _itemCount; _index++) {
                if (!_legendData[_index].hasOwnProperty("color")) {
                    _legendData[_index].color = randomColor();
                }
                this._legend(container, _index, {}, _legendData[_index]);
            }
            data.items.forEach((groupData, index) =>
                this._bar(element, index, parameters, groupData, _legendData, chartStyle));
            this._remove(element, container, data.items.length);
        }
    }

    _kLineChart(element, data = {}) {
        if (data.hasOwnProperty("items")) {
            const parameters = this._parameters(element, data.hasOwnProperty("styles") ? data.styles : {}),
                items = data.items;
            let min = -1, max = -1;
            items.forEach((item) => {
                const low = item.hasOwnProperty("low") ? item.low.toString().parseFloat() : -1,
                    high = item.hasOwnProperty("high") ? item.high.toString().parseFloat() : -1;
                if (min === -1 || low < min) {
                    min = low;
                }
                if (max === -1 || max < high) {
                    max = high;
                }
            });
            if (min === -1 || max === -1) {
                return;
            }
            const height = max - min, step = height / 4, markings = [];
            for (let point = min; point <= max; point += step) {
                markings.push(point.toFixed(2));
            }
            const width = element.styles().width.parseInt(), itemWidth = document.remWidth() * 1.5,
                itemCount = Math.trunc(width / itemWidth);
            const beginIndex = itemCount < items.length ? items.length - itemCount : 0;
            this._markings(element, parameters, markings, element.dataset.style.toLowerCase());
            const sectorArray = element.querySelectorAll(':scope > span');
            let currentIndex = 0;
            items.filter(item => item.hasOwnProperty("open") && item.hasOwnProperty("close") && item.hasOwnProperty("low") && item.hasOwnProperty("high"))
                .forEach((item, index) => {
                    if (index < beginIndex) {
                        return;
                    }
                    const sector = (currentIndex < sectorArray.length) ? sectorArray[currentIndex] : document.createElement("span");
                    if (sectorArray.length <= currentIndex) {
                        element.appendChild(sector);
                    }
                    this._kLine(sector, min, height, parameters, item);
                    currentIndex++;
                });
            for (let index = items.length; index < sectorArray.length; index++) {
                element.removeChild(sectorArray[index]);
            }
        }
    }
}

/**
 * Input group information render
 *
 * 输入信息组渲染器
 */
class InputGroupRender extends TagRender {

    static newInstance() {
        const group = document.createElement("span");
        group.dataset.category = "group";
        return group;
    }

    selectors() {
        return ['span[data-category="group"]'];
    }

    _setData(element = null, data = {}) {
        if (element === null || !data.hasOwnProperty("name") || !element.dataset.hasOwnProperty("type")) {
            return;
        }
        const type = element.dataset.type.toLowerCase();
        const existArray = element.querySelectorAll(`:scope > input[type="${type}"]`);
        const values = (type === "radio") ? Array.of(data.value) : data.value;
        if (data.hasOwnProperty("id")) {
            element.id = data.id;
        }
        element.generateId();
        if (data.hasOwnProperty("items")) {
            const container = (type === "radio" && data.hasOwnProperty("container")) ? data.container : null;
            const selector = (type === "radio" && data.hasOwnProperty("selector")) ? data.selector : null;
            data.items.forEach((item, index) => {
                const input = (index < existArray.length) ? existArray[index] : document.createElement('input');
                if (existArray.length <= index) {
                    input.type = type;
                    input.dataset.category = "group";
                    element._appendChild(input);
                }
                input.data = {
                    name: data.name,
                    id: item.hasOwnProperty("id") ? item.id : (element.id + index),
                    value: item.value,
                    multiKey: item.hasOwnProperty("multiKey") ? item.multiKey : "",
                    content: item.hasOwnProperty("content") ? item.content : "",
                    tips: item.hasOwnProperty("tips") ? item.tips : "",
                    checked: values.indexOf(item.value) !== -1,
                    container: container,
                    selector: selector
                };
            })
            for (let index = data.items.length; index < existArray.length; index++) {
                element.removeChild(existArray[index]);
            }
        }
    }
}

/**
 * Interval input information render
 *
 * 区间输入信息渲染器
 */
class IntervalRender extends TagRender {

    static newInstance() {
        const interval = document.createElement("span");
        interval.dataset.category = "interval";
        return interval;
    }

    selectors() {
        return ['span[data-category="interval"]'];
    }

    _enhance(element = null) {
        element.clearChildNodes();
        element._appendChild(this._newInput("begin", "0"));
        const connector = document.createElement("span");
        connector.innerText = Comment.Icons.Connector;
        connector.dataset.sortCode = "1";
        element._appendChild(connector);
        element._appendChild(this._newInput("end", "2"));
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        const type = element.dataset.type.toLowerCase();
        const begin = element.querySelector(`:scope > input[data-category="begin"]`);
        if (begin) {
            begin.type = type;
            const beginData = data.hasOwnProperty("begin") ? data.begin : {};
            begin.name = beginData.hasOwnProperty("name") ? beginData.name : (element.id + "Begin");
            if (beginData.hasOwnProperty("value")) {
                switch (type) {
                    case "date":
                        begin.value = beginData.value.formatDate(Comment.DateTime.ISO8601DATEPattern);
                        begin.dataset.icon = String.fromCodePoint(Comment.Icons.Picker.Calendar);
                        break;
                    case "time":
                        begin.value = beginData.value.formatDate(Comment.DateTime.ISO8601TIMEPattern);
                        begin.dataset.icon = String.fromCodePoint(Comment.Icons.Picker.Timer);
                        break;
                    case "datetime-local":
                        begin.value = beginData.value.formatDate(Comment.DateTime.ISO8601DATETIMEPattern);
                        begin.dataset.icon = String.fromCodePoint(Comment.Icons.Picker.Calendar);
                        break;
                }
            }
        }

        const end = element.querySelector(`:scope > input[data-category="end"]`);
        if (end) {
            end.type = type;
            const endData = data.hasOwnProperty("end") ? data.end : {};
            end.name = endData.hasOwnProperty("name") ? endData.name : (element.id + "End");
            if (endData.hasOwnProperty("value")) {
                switch (type) {
                    case "date":
                        end.value = endData.value.formatDate(Comment.DateTime.ISO8601DATEPattern);
                        end.dataset.icon = String.fromCodePoint(Comment.Icons.Picker.Calendar);
                        break;
                    case "time":
                        end.value = endData.value.formatDate(Comment.DateTime.ISO8601TIMEPattern);
                        end.dataset.icon = String.fromCodePoint(Comment.Icons.Picker.Timer);
                        break;
                    case "datetime-local":
                        end.value = endData.value.formatDate(Comment.DateTime.ISO8601DATETIMEPattern);
                        end.dataset.icon = String.fromCodePoint(Comment.Icons.Picker.Calendar);
                        break;
                }
            }
        }
    }

    _newInput(category = "", sortCode = "0") {
        const input = document.createElement("input");
        input.dataset.category = category;
        input.dataset.sortCode = sortCode;
        input.addEventListener("click", showPicker)
        return input;
    }
}

class DragUploadRender extends TagRender {
    static newInstance() {
        const dragUpload = document.createElement("input");
        dragUpload.type = "file";
        dragUpload.dataset.type = "drag";
        return dragUpload;
    }

    selectors() {
        return ['input[type="file"][data-type="drag"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        const dragWindow = document.createElement("span");
        dragWindow.dataset.type = "drag";
        dragWindow.dataset.sortCode = "3";
        element.after(dragWindow);

        const previewWindow = document.createElement("span");
        previewWindow.dataset.type = "preview";
        previewWindow.dataset.sortCode = "4";
        element.after(previewWindow);

        dragWindow.bindEvent("dragenter", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });

        dragWindow.bindEvent("dragover", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });

        dragWindow.bindEvent("drop", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const input = event.target.parentElement.querySelector(':scope > input[type="file"]');
            if (input) {
                const dragFiles = input.dragFiles || [];
                const multipleFiles = Boolean(input.dataset.multipleFiles);
                if (dragFiles.length === 0 || multipleFiles) {
                    Array.from(event.dataTransfer.files)
                        .forEach((file, index) => {
                            if (index === 0 || multipleFiles) {
                                const identifyCode = Cell.digestData("MD5", file.name);
                                if (dragFiles.filter(item => item.identifyCode === identifyCode).length === 0) {
                                    const fileData = JSON.stringify(DragUpload).parseJSON();
                                    fileData.identifyCode = identifyCode;
                                    fileData.fileName = file.name;
                                    fileData.content = file;
                                    dragFiles.push(fileData);
                                    const preview = DragUploadRender.preview(file);
                                    if (preview) {
                                        previewWindow.appendChild(preview);
                                    }
                                }
                            }
                        });
                    input.dragFiles = dragFiles;
                    if (!multipleFiles) {
                        event.target.hide();
                    }
                }
            }
        });
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        if (data.hasOwnProperty("name")) {
            element.name = data.name;
        }
        if (data.hasOwnProperty("id")) {
            element.id = data.id;
        }
        if (data.hasOwnProperty("multipleFiles")) {
            element.dataset.multipleFiles = data.multipleFiles;
        }

        const dragWindow = element.parentElement.querySelector(':scope > span[data-type="drag"]');
        dragWindow.dataset.name = element.name;
    }

    static preview(file) {
        if (file === null || !(file instanceof File)) {
            return null;
        }
        const identifyCode = Cell.digestData("MD5", file.name);
        const preview = document.createElement("span");
        preview.hide();
        const closeBtn = document.createElement("i");
        closeBtn.setClass("icon-close");
        closeBtn.bindEvent("click", (event) => {
            event.stopPropagation();
            const preview = event.target.parentElement;
            const element = preview.parentElement.parentElement.querySelector(':scope > input[type="file"]');
            const dragFiles = element.dragFiles || [];
            element.dragFiles = dragFiles.filter(file => file.identifyCode !== identifyCode);
            if (element.dragFiles.length === 0 || Boolean(element.dataset.multipleFiles)) {
                const dragWindow = element.parentElement.querySelector(':scope > span[data-type="drag"]');
                if (dragWindow) {
                    dragWindow.show();
                }
            }
            preview.parentElement.removeChild(preview);
        });
        preview.appendChild(closeBtn);
        if (file.type.indexOf("image") !== -1) {
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
                preview.style.backgroundImage = `url("${event.target.result}")`;
                preview.show();
            });
            reader.readAsDataURL(file);
        } else if (file.type.indexOf("video") !== -1) {
            const video = document.createElement("video");
            preview.style.backgroundImage = "";
            preview.show();
            video.setAttribute("controls", "true");
            video.src = URL.createObjectURL(file);
            video.load();
        }
        return preview;
    }
}

class PropertyRender extends TagRender {

    static newInstance(info = false) {
        const element = document.createElement("span");
        element.dataset.type = "property";
        if (info) {
            element.dataset.category = "info";
        }
        return element;
    }

    selectors() {
        return ['span[data-type="property"]'];
    }

    _enhance(element = null) {
        element.addEventListener("click", (event) => Cell.eventRequest(event));
    }

    _setData(element = null, data = {}) {
        if (data.hasOwnProperty("sortCode")) {
            element.dataset.sortCode = data.sortCode.toString();
        }
        if (data.hasOwnProperty("title") && data.title !== null) {
            const title = data.title || {};
            if (title.hasOwnProperty("multiKey") && title.multiKey !== null && title.multiKey.length > 0) {
                element.dataset.title = Cell.multiMsg(title.multiKey);
            } else if (title.hasOwnProperty("content")) {
                element.dataset.title = title.content;
            } else {
                element.dataset.title = "";
            }
        }
        let content = data.hasOwnProperty("value") ? data.value : "";
        if (data.hasOwnProperty("timestamp") && !!data.timestamp) {
            content = content.formatDate(data.pattern);
        }
        element.dataset.content = content;
        element.setAttribute("title", content);
        if (data.hasOwnProperty("link") && data.link !== null && data.link !== undefined && data.link.length > 0) {
            element.dataset.link = data.link;
        } else {
            delete element.dataset.link;
        }
    }
}

class ScheduleItemRender extends TagRender {

    static newInstance() {
        const element = document.createElement("span");
        element.dataset.type = "schedule-item";
        return element;
    }

    selectors() {
        return ['span[data-type="schedule-item"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const container = document.createElement("span");
        container.dataset.type = "container";
        container.dataset.sortCode = "0";
        element.appendChild(container);

        const operators = document.createElement("span");
        operators.dataset.type = "operators";
        operators.dataset.sortCode = "2";
        element.appendChild(operators);
    }

    _setData(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (data.hasOwnProperty("items")) {
            const properties = elements.container.querySelectorAll(':scope > span[data-type="property"]');
            data.items.forEach((item, index) => {
                const property = (index < properties.length) ? properties[index] : PropertyRender.newInstance();
                if (properties.length <= index) {
                    elements.container._appendChild(property);
                }
                property.data = {
                    sortCode: index.toString(),
                    title: {
                        content: item.title
                    },
                    value: item.content
                }
            });
            for (let index = data.items.length; index < properties.length; index++) {
                elements.container.removeChild(properties[index]);
            }
            elements.container.sortChildrenBy(':scope > span[data-type="property"]', "data-sort-code");
        }
        if (data.hasOwnProperty("operators")) {
            const operatorArray = elements.operators.querySelectorAll("a");
            data.operators
                .filter(oper => oper.hasOwnProperty("title") && oper.hasOwnProperty("link"))
                .forEach((oper, index) => {
                    const operator = (index < operatorArray.length) ? operatorArray[index] : document.createElement("a");
                    if (operatorArray.length <= index) {
                        operator.dataset.mock = "button";
                        elements.operators.appendChild(operator);
                        operator.addEventListener("click", (event) => Cell.eventRequest(event));
                    }
                    operator.innerText = oper.title;
                    operator.setAttribute("title", oper.title);
                    operator.href = oper.link;
                })
        } else {
            elements.operators.clearChildNodes();
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            container: element.querySelector(':scope > span[data-type="container"]'),
            operators: element.querySelector(':scope > span[data-type="operators"]')
        }
    }
}

/**
 * Group form item information render
 *
 * 数据组表单项信息渲染器
 */
class GroupItemRender extends TagRender {

    static newInstance() {
        const element = document.createElement("span");
        element.dataset.type = "group-item";
        return element;
    }

    selectors() {
        return ['span[data-type="group-item"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.clearChildNodes();

        const addButton = document.createElement("a");
        addButton.dataset.mock = "button";
        addButton.dataset.sortCode = "0";
        addButton.value = addButton.title = String.fromCodePoint(Comment.Icons.Button.Plus);
        element._appendChild(addButton);
        addButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const button = event.target;
            const container = button.parentElement;
            if (container && button.dataset.hasOwnProperty("template")) {
                container.removeChild(button);
                const total = container.querySelectorAll('span[data-type="array-item"]').length;
                const item = ArrayItemRender.newInstance();
                item.generateId();
                container._appendChild(item);
                item.dataset.sortCode = total.toString();
                item.data = {
                    id: item.id,
                    items: button.dataset.template.parseJSON()
                };
                button.dataset.sortCode = (total + 1).toString();
                container.sortChildrenBy(':scope > span[data-type="array-item"]', "data-sort-code");
                container.appendChild(button);
            }
        });
    }

    _setData(element = null, data = {}) {
        if (element === null || !data.hasOwnProperty("template")) {
            return;
        }

        const addButton = element.querySelector(':scope > a[data-mock="button"]');
        if (addButton === null) {
            return;
        }

        addButton.dataset.template = JSON.stringify(data.template);

        element.removeChild(addButton);
        const dataArray = element.querySelectorAll(':scope > span[data-type="array-item"]');
        data.items.forEach(((itemData, index) => {
            const item = (index < dataArray.length) ? dataArray[index] : ArrayItemRender.newInstance();
            if (dataArray.length <= index) {
                element._appendChild(item);
            }
            item.dataset.sortCode = index.toString();
            item.data = itemData;
        }));
        for (let i = data.items.length; i < dataArray.length; i++) {
            element.removeChild(dataArray[i]);
        }
        addButton.dataset.sortCode = data.items.length.toString();
        element.sortChildrenBy(':scope > span[data-type="array-item"]', "data-sort-code");
        element.appendChild(addButton);
    }
}

/**
 * Tabs form item information render
 *
 * 标签页表单项信息渲染器
 */
class TabsItemRender extends TagRender {

    static newInstance() {
        const element = document.createElement("span");
        element.dataset.type = "tabs-item";
        return element;
    }

    selectors() {
        return ['span[data-type="tabs-item"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.clearChildNodes();

        const tabContainer = InputGroupRender.newInstance();
        tabContainer.dataset.sortCode = "0";
        tabContainer.dataset.type = "radio";
        element._appendChild(tabContainer);

        const dataContainer = document.createElement("span");
        dataContainer.generateId();
        dataContainer.dataset.type = "data-container";
        dataContainer.dataset.sortCode = "2";
        element.appendChild(dataContainer);
    }

    _setData(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null || !data.hasOwnProperty("name") || !data.hasOwnProperty("items")) {
            return;
        }

        const tabItems = [];
        let value = "";
        const dataArray = elements.data.querySelectorAll(':scope > span[data-type="array-item"]');
        data.items.forEach(((itemData, index) => {
            const item = (index < dataArray.length) ? dataArray[index] : ArrayItemRender.newInstance();
            if (dataArray.length <= index) {
                elements.data._appendChild(item);
            }
            item.dataset.sortCode = index.toString();
            item.data = itemData;
            tabItems[index] = {
                value: item.id,
                multiKey: itemData.multiKey,
                content: itemData.content
            }
            if ((itemData.hasOwnProperty("current") && itemData.current.toLowerCase() === "true") || index === 0) {
                value = item.id;
                item.show()
            } else {
                item.hide();
            }
        }));
        for (let i = data.items.length; i < dataArray.length; i++) {
            elements.data.removeChild(dataArray[i]);
        }
        elements.data.sortChildrenBy(':scope > span[data-type="form-item"]', "data-sort-code");
        elements.tab.data = {
            type: "radio",
            category: "group",
            name: data.name,
            container: elements.data.id,
            selector: ':scope > span[data-type="array-item"]',
            value: value,
            items: tabItems
        };
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            tab: element.querySelector(':scope > span[data-category="group"]'),
            data: element.querySelector(':scope > span[data-type="data-container"]')
        }
    }
}

/**
 * Array form item information render
 *
 * 数组表单项信息渲染器
 */
class ArrayItemRender extends TagRender {

    static newInstance() {
        const element = document.createElement("span");
        element.dataset.type = "array-item";
        return element;
    }

    selectors() {
        return ['span[data-type="array-item"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.clearChildNodes();
        element.generateId();

        const removeButton = document.createElement("i");
        removeButton.setClass("icon");
        removeButton.dataset.content = String.fromCodePoint(Comment.Icons.Button.Close);
        element._appendChild(removeButton);
        removeButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const button = event.target;
            if (button.parentElement) {
                button.parentElement.remove();
            }
        })
    }

    _setData(element = null, data = {}) {
        if (element === null || !data.hasOwnProperty("id") || !data.hasOwnProperty("items")) {
            return;
        }

        if (data.hasOwnProperty("id") && data.id.length > 0) {
            element.id = data.id;
        }

        const groupArray = element.parentElement.matches('span[data-type="group-item"]');
        const removeButton = element.querySelector(':scope > i');
        if (!!removeButton) {
            if (groupArray) {
                removeButton.show();
            } else {
                removeButton.hide();
            }
        }

        const itemArray = element.querySelectorAll(':scope > span[data-type="form-item"]');
        data.items.forEach(((itemData, index) => {
            const item = (index < itemArray.length) ? itemArray[index] : FormItemRender.newInstance();
            if (itemArray.length <= index) {
                element._appendChild(item);
            }
            item.dataset.sortCode = index.toString();
            item.data = itemData;
        }));
        for (let i = data.length; i < itemArray.length; i++) {
            element.removeChild(itemArray[i]);
        }
        element.sortChildrenBy(':scope > span[data-type="form-item"]', "data-sort-code");
    }
}

/**
 * Form item information render
 *
 * 表单项信息渲染器
 */
class FormItemRender extends TagRender {

    static newInstance() {
        const element = document.createElement("span");
        element.dataset.type = "form-item";
        return element;
    }

    selectors() {
        return ['span[data-type="form-item"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const title = document.createElement("span");
        title.dataset.type = "title";
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const tips = TipsRender.newInstance();
        tips.dataset.sortCode = "1";
        element._appendChild(tips);

        const error = document.createElement("span");
        error.dataset.type = "error";
        error.dataset.sortCode = "5";
        element.appendChild(error);

        const reference = document.createElement("span");
        reference.dataset.type = "reference";
        reference.dataset.sortCode = "6";
        element.appendChild(reference);
    }

    _setData(element = null, data = {}) {
        if (element === null || !data.hasOwnProperty("type")) {
            return;
        }

        if (data.hasOwnProperty("class")) {
            element.setClass(data.class);
        }

        const elements = this._elements(element);
        if (data.hasOwnProperty("title")) {
            const title = data.title;
            if (title.hasOwnProperty("multiKey")) {
                elements.title.dataset.multiKey = title.multiKey;
            } else if (title.hasOwnProperty("content")) {
                elements.title.innerText = title.content;
            }
        }

        if (data.hasOwnProperty("tips")) {
            const tips = data.tips;
            if (tips.hasOwnProperty("multiKey")) {
                elements.tips.dataset.multiKey = tips.multiKey;
            } else if (tips.hasOwnProperty("content")) {
                elements.tips.dataset.content = tips.content;
            }
            elements.tips.style.visibility = "visible";
        } else {
            elements.tips.style.visibility = "hidden";
        }

        let component = this._component(data.category, data.type, elements.component);
        if (component === null) {
            component = elements.component;
        } else {
            if (elements.component === null) {
                element._appendChild(component);
            } else {
                element.replaceChild(component, elements.component);
            }
        }
        if (component.dataset.type === "calendar"
            || component.dataset.type === "tabs-item") {
            elements.title.hide();
            elements.tips.hide();
            component.style.width = "100%";
        } else {
            elements.title.show();
            elements.tips.show();
            delete component.style.width;
        }
        component.dataset.sortCode = "2";
        if (data.hasOwnProperty("category") && data.category.length > 0) {
            switch (data.category) {
                case "group":
                    component.data = {
                        name: data.name,
                        id: data.hasOwnProperty("id") ? data.id : "",
                        value: data.value,
                        items: data.items
                    }
                    break;
                case "drag":
                    component.data = data;
                    break;
                default:
                    component.data = data.value || {};
                    break;
            }
        } else {
            if (data.hasOwnProperty("name")) {
                component.name = data.name;
            }
            if (data.hasOwnProperty("id")) {
                component.id = data.id;
            }
            if (data.hasOwnProperty("placeholder")) {
                component.placeholder = data.placeholder;
            }
            if (data.hasOwnProperty("multiKey")) {
                component.dataset.multiKey = data.multiKey;
            }
            if (data.hasOwnProperty("autocomplete")) {
                component.setAttribute("autocomplete", data.autocomplete);
            }
            if (data.hasOwnProperty("multilingual")) {
                component.dataset.multilingual = data.multilingual;
            }
            if (data.hasOwnProperty("verify")) {
                Object.keys(data.verify).forEach((key) => {
                    if (key.toLowerCase() === "type") {
                        component.dataset[data.verify.type] = "true";
                    } else {
                        component.dataset[key] = data.verify[key];
                    }
                })
            }
            if (data.hasOwnProperty("error")) {
                const error = data.error;
                if (error.hasOwnProperty("multiKey")) {
                    elements.error.dataset.multiKey = error.multiKey;
                }
                if (error.hasOwnProperty("content")) {
                    elements.error.innerText = error.content;
                }
            }
            switch (data.type) {
                case "textarea":
                case "property":
                    const value = data.value || "";
                    component.innerHTML = value.decodeByRegExp();
                    break;
                case "select":
                    component.dataset.value = data.value || "";
                    if (data.hasOwnProperty("items")) {
                        component.items(data.items);
                    }
                    break;
                case "date":
                    component.value = data.value.formatDate(Comment.DateTime.ISO8601DATEPattern);
                    break;
                case "time":
                    component.value = data.value.formatDate(Comment.DateTime.ISO8601TIMEPattern);
                    break;
                case "datetime-local":
                    component.value = data.value.formatDate(Comment.DateTime.ISO8601DATETIMEPattern);
                    break;
                case "password":
                    component.dataset.type = "password";
                    component.data = component.id;
                    break;
                case "array":
                    component.data = data.items;
                    break;
                default:
                    if (data.type !== "file" && data.type !== "password" && data.hasOwnProperty("value")) {
                        component.value = data.value;
                    }
                    break;
            }
        }

        if (data.hasOwnProperty("reference")) {
            if ((typeof data.reference) === "string") {
                elements.reference.innerText = data.reference;
            } else {
                elements.reference.clearChildNodes();
                data.reference.forEach(reference => {
                    const preview = ResourcesRender.newInstance();
                    elements.reference._appendChild(preview);
                    preview.data = reference;
                })
            }
        }

        if (data.type.toLowerCase() === "hidden") {
            element.hide();
        }

        element.sortChildrenBy(':scope > *', "data-sort-code");
        Cell.multilingual(element);
    }

    _component(category = "", type = "", exist = null) {
        if (category.length > 0) {
            let selector;
            switch (category) {
                case "drag":
                    selector = ':scope > input[data-category="drag"][type="file"]';
                    break;
                case "custom":
                    selector = `:scope > span[data-type="${type}"]`;
                    break;
                case "interval":
                    selector = `:scope > span[data-category="interval"]`;
                    break;
                default:
                    selector = `:scope > span[data-category="${category}"][data-type="${type}"]`;
                    break;
            }
            if (exist === null || !exist.matches(selector)) {
                switch (category) {
                    case "drag":
                        const dragUpload = DragUploadRender.newInstance();
                        dragUpload.addEventListener("blur", (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            event.target.validate();
                        });
                        return dragUpload;
                    case "group":
                        const group = InputGroupRender.newInstance();
                        group.dataset.type = type;
                        return group;
                    case "interval":
                        const interval = IntervalRender.newInstance();
                        interval.dataset.type = type;
                        return interval;
                    case "custom":
                        switch (type) {
                            case "calendar":
                                return CalendarRender.newInstance();
                            case "tabs-item":
                                return TabsItemRender.newInstance();
                            case "group-item":
                                return GroupItemRender.newInstance();
                        }
                        break;
                }
            }
            return null;
        }
        let component = null;
        switch (type) {
            case "textarea":
                if (exist === null || !exist.matches(":scope > textarea")) {
                    component = document.createElement("textarea");
                }
                break;
            case "select":
                if (exist === null || !exist.matches(":scope > select")) {
                    component = document.createElement("select");
                }
                break;
            case "property":
                if (exist === null || !exist.matches(':scope > span[data-type="property"]')) {
                    component = PropertyRender.newInstance();
                }
                break;
            case "password":
                component = PasswordRender.newInstance();
                break
            case "array":
                if (category === "tab") {
                    component = TabsItemRender.newInstance();
                } else {
                    component = GroupItemRender.newInstance();
                }
                break;
            default:
                if (exist === null || !exist.matches(`:scope > input[type="${type}"]`)) {
                    component = document.createElement("input");
                    component.type = type;
                    component.addEventListener("click", showPicker);
                    if (type === "time") {
                        component.dataset.icon = String.fromCodePoint(Comment.Icons.Picker.Timer);
                    }
                    if (type === "date" || type === "datetime-local") {
                        component.dataset.icon = String.fromCodePoint(Comment.Icons.Picker.Calendar);
                    }
                }
                break;
        }
        if (component) {
            component.addEventListener("blur", (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.target.validate();
            });
        }
        return component;
    }

    _elements(element = null) {
        const elements = {
            title: null,
            tips: null,
            component: null,
            error: null,
            reference: null
        }
        if (element !== null) {
            elements.title = element.querySelector(':scope > span[data-type="title"]');
            elements.tips = element.querySelector(':scope > i[data-type="tips"]');
            elements.component = element.querySelector(':scope > *[data-sort-code="2"]');
            elements.error = element.querySelector(':scope > span[data-type="error"]');
            elements.reference = element.querySelector(':scope > span[data-type="reference"]');
        }
        return elements;
    }
}

/**
 * Form information render
 *
 * 表单信息渲染器
 */
class FormInfoRender extends TagRender {

    static newInstance() {
        const form = document.createElement("form");
        form.dataset.type = "form";
        return form;
    }

    selectors() {
        return ['form[data-type="form"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const title = document.createElement("span");
        title.dataset.type = "title";
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const items = document.createElement("span");
        items.dataset.type = "items";
        items.dataset.sortCode = "1";
        element.appendChild(items);

        const buttons = document.createElement("span");
        buttons.dataset.type = "buttons";
        buttons.dataset.sortCode = "2";
        element.appendChild(buttons);

        const submitBtn = document.createElement("input");
        submitBtn.type = "submit";
        buttons._appendChild(submitBtn);
        submitBtn.dataset.multiKey = "Submit.Button";
        submitBtn.generateId();
        submitBtn.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.target.dataset.hasOwnProperty("intervalTime")) {
                event.target.countDown();
            }
            Cell.submitForm(element);
            return false;
        });

        const resetBtn = document.createElement("input");
        resetBtn.type = "reset";
        buttons._appendChild(resetBtn);
        resetBtn.dataset.multiKey = "Reset.Button";
        resetBtn.generateId();
        resetBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            element.reset();
        });

        element.sortChildrenBy(":scope > span", "data-sort-code");
        Cell.multilingual(element);
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }
        if (data.hasOwnProperty("id")) {
            element.id = data.id;
        }
        if (data.hasOwnProperty("action")) {
            element.action = data.action;
        }
        element.method = data.hasOwnProperty("method") ? data.method : "GET";
        const elements = this._elements(element);
        if (data.hasOwnProperty("title")) {
            const title = data.title;
            if (title.hasOwnProperty("multiKey")) {
                elements.title.dataset.multiKey = title.multiKey;
                elements.title.show();
            } else if (title.hasOwnProperty("content")) {
                elements.title.innerText = title.content;
                elements.title.show();
            } else {
                elements.title.innerText = "";
                elements.title.hide();
            }
        } else {
            elements.title.innerText = "";
            elements.title.hide();
        }
        const itemsData = data.items || [];
        const itemArray = elements.items.querySelectorAll(':scope > span[data-type="form-item"]');
        itemsData.forEach((itemData, index) => {
            const item = (index < itemArray.length) ? itemArray[index] : FormItemRender.newInstance();
            if (itemArray.length <= index) {
                elements.items._appendChild(item);
            }
            item.dataset.sortCode = index.toString();
            item.data = itemData;
            if (itemData.type === "drag" || itemData.type === "file") {
                element.setAttribute("enctype", "multipart/form-data");
            }
        });
        for (let i = itemsData.length; i < itemArray.length; i++) {
            elements.items.removeChild(itemArray[i]);
        }
        elements.items.sortChildrenBy(':scope > span[data-type="form-item"]', "data-sort-code");
        if (data.hasOwnProperty("buttons")) {
            const buttonData = data.buttons;
            if (buttonData.hasOwnProperty("Submit")) {
                elements.submitBtn.data = buttonData.Submit;
                elements.submitBtn.show();
                if (buttonData.hasOwnProperty("intervalTime")) {
                    elements.submitBtn.dataset.intervalTime = buttonData.intervalTime;
                } else {
                    delete elements.submitBtn.dataset.intervalTime;
                }
            } else {
                elements.submitBtn.hide();
            }
            if (buttonData.hasOwnProperty("Reset")) {
                elements.resetBtn.data = buttonData.Reset;
                elements.resetBtn.show();
            } else {
                elements.resetBtn.hide();
            }
        }
        Cell.multilingual(element);
    }

    _elements(element) {
        const elements = {
            title: null,
            items: null,
            submitBtn: null,
            resetBtn: null
        };
        if (element !== null && element.tagName.toLowerCase() === "form") {
            elements.title = element.querySelector(':scope > span[data-type="title"]');
            elements.items = element.querySelector(':scope > span[data-type="items"]');
            elements.submitBtn = element.querySelector(':scope > span[data-type="buttons"] > input[type="submit"]');
            elements.resetBtn = element.querySelector(':scope > span[data-type="buttons"] > input[type="reset"]');
        }
        return elements;
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

    selectors() {
        return ['a[data-type="statistics"]'];
    }

    _setData(element = null, data = {}) {
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
        this.selectors().forEach(selector =>
            parentElement.sortChildrenBy(selector, "data-sort-code", true));
    }
}

class PagerRender extends TagRender {

    static newInstance() {
        const pager = document.createElement("span");
        pager.dataset.type = "pager";
        return pager;
    }

    selectors() {
        return ['span[data-type="pager"]'];
    }

    _enhance(element = null) {
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
        firstBtn.addEventListener("click", (event) => pagerClick(event));

        const previousBtn = document.createElement("i");
        previousBtn.dataset.type = "previous-btn";
        previousBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Previous);
        element.appendChild(previousBtn);
        previousBtn.addEventListener("click", (event) => pagerClick(event));

        const pagerItems = document.createElement("span");
        pagerItems.dataset.type = "items";
        element.appendChild(pagerItems);

        const nextBtn = document.createElement("i");
        nextBtn.dataset.type = "next-btn";
        nextBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Next);
        element.appendChild(nextBtn);
        nextBtn.addEventListener("click", (event) => pagerClick(event));

        const lastBtn = document.createElement("i");
        lastBtn.dataset.type = "last-btn";
        lastBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Last);
        element.appendChild(lastBtn);
        lastBtn.addEventListener("click", (event) => pagerClick(event));
    }

    _setData(element = null, data) {
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
                    item.addEventListener("click", (event) => pagerClick(event));
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

class CommentRecordRender extends TagRender {

    static newInstance() {
        const comment = document.createElement("span");
        comment.dataset.type = "comment-record";
        return comment;
    }

    selectors() {
        return ['span[data-type="comment-record"]'];
    }

    _enhance(element = null) {
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

    _setData(element = null, data = {}) {
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

    selectors() {
        return ['span[data-type="comment-list"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        //  Clear all child nodes
        element.clearChildNodes();

        const title = document.createElement("span");
        title.dataset.type = "title";
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const grid = document.createElement("span");
        grid.dataset.type = "data-list";
        grid.dataset.sortCode = "1";
        element.appendChild(grid);

        const pager = PagerRender.newInstance();
        if (element.id.length === 0) {
            element.id = Math.trunc(Math.random() * 1000000).toString(16);
        }
        pager.dataset.targetId = element.id;
        element._appendChild(pager);
    }

    _setData(element = null, data = {}) {
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

    selectors() {
        return ['div[data-type="grid"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        //  Clear all child nodes
        element.clearChildNodes();

        const filter = FormInfoRender.newInstance();
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

    _prepare(element = null, data = {}) {
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
                if (item.hasOwnProperty("timestamp")) {
                    property.timestamp = (item.timestamp.toString() === "true");
                    if (property.timestamp) {
                        property.pattern = item.hasOwnProperty("pattern") ? item.pattern : Comment.DateTime.ISO8601DATETIMEPattern;
                    }
                }
                properties[index] = property;
            });
            let existProperties = elements.header.properties.querySelectorAll(":scope > span");
            const count = properties.length;
            properties.forEach((property, index) => {
                let item = (index < existProperties.length) ? existProperties[index] : document.createElement("span");
                if (existProperties.length <= index) {
                    elements.header.properties.appendChild(item);
                    item.addEventListener("click", (event) => sortClick(event, elements.filter));
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

    _setData(element = null, data = {}) {
        const filter = this._filter(element);
        if (data.hasOwnProperty("filter")) {
            filter.data = data.filter;
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
            for (let i = itemData.length ; i < itemArray.length ; i++) {
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
        Cell.multilingual(element);
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
        return element.querySelector(':scope > form[data-type="form"]');
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

    selectors() {
        return ['span[data-type="list-record"]'];
    }

    _enhance(element = null) {
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

            const properties = document.createElement("span");
            properties.dataset.category = "properties";
            element.appendChild(properties);

            const summary = document.createElement("span");
            summary.dataset.category = "summary";
            element.appendChild(summary);

            const operators = document.createElement("span");
            operators.dataset.category = "operators";
            element.appendChild(operators);
        }
    }

    _setData(element = null, data = {}) {
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
                value: identifier
            };
            elements.checkBox.show();
        } else {
            elements.checkBox.hide();
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
                        timestamp: define.timestamp,
                        pattern: define.timestamp ? define.pattern : null,
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
            delete elements.score.style.visibility;
        } else {
            elements.score.data = 0.0;
            elements.score.style.visibility = "hidden";
        }
        if (data.hasOwnProperty("operators") && (data.operators instanceof Array)) {
            let operatorList = elements.operators.querySelectorAll('a[data-mock="button"]'),
                existsCount = operatorList.length;
            let i = 0;
            data.operators.forEach(itemData => {
                let operator;
                if (i < existsCount) {
                    operator = operatorList[i];
                } else {
                    operator = document.createElement("a");
                    operator.dataset.mock = "button";
                    operator.addEventListener("click", Cell.eventRequest);
                    elements.operators.appendChild(operator);
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
            });
            while (i < existsCount) {
                elements.operators.removeChild(operatorList[i]);
                i++;
            }
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
        }
        return elements;
    }
}

class MenuRender extends TagRender {

    static newInstance(multi = false) {
        //  Default using nav tag
        const menu = document.createElement("nav");
        menu.dataset.type = multi ? "multi" : "menu";
        return menu;
    }

    selectors() {
        return ['nav[data-type]', 'menu[data-type]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const link = document.createElement("a");
        link.dataset.type = "main";
        link.dataset.sortCode = "0";
        element.appendChild(link);
        link.addEventListener("click", (event) => {
            const target = event.target;
            if (target.dataset.hasOwnProperty("langCode") && target.parentElement.dataset.type === "multi") {
                const langCode = target.dataset.langCode;
                if (langCode.length > 0) {
                    Cell.language = langCode;
                    if (document.body.dataset.hasOwnProperty("multiTemplate")) {
                        const link = document.body.dataset.multiTemplate.replaceAll("{languageCode}", langCode);
                        if (link.length > 0) {
                            target.href = link;
                        }
                    }
                }
            }
            Cell.eventRequest(event);
        });
        if (element.dataset.type.toLowerCase() === "multi" && !element.dataset.hasOwnProperty("category")) {
            link.dataset.icon = String.fromCodePoint(Comment.Icons.Multilingual);
        }

        const items = document.createElement("span");
        items.dataset.type = "items";
        items.dataset.sortCode = "1";
        element.appendChild(items);
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }
        if (data.hasOwnProperty("class")) {
            element.setClass(data.class);
        }
        this._renderMenu(element, data);
    }

    _renderMenu(element = null, data = {}) {
        if (element === null) {
            return;
        }

        const elements = this._elements(element);
        if (data.hasOwnProperty("link")) {
            elements.main.href = data.link;
        } else {
            elements.main.href = "#";
        }

        if (element.dataset.type.toLowerCase() === "menu" || element.dataset.hasOwnProperty("category")) {
            if (data.hasOwnProperty("icon") && data.icon !== null && data.icon.length > 0) {
                elements.main.dataset.icon = String.fromCodePoint(Number.parseInt(data.icon, 16));
            } else {
                delete elements.main.dataset.icon;
            }
        }

        if (element.dataset.type.toLowerCase() === "multi" && data.hasOwnProperty("code")) {
            elements.main.dataset.langCode = data.code;
        }

        let textContent = "";
        if (data.hasOwnProperty("multiKey")) {
            elements.main.dataset.multiKey = data.multiKey;
            textContent = Cell.multiMsg(data.multiKey);
        } else if (data.hasOwnProperty("title")) {
            textContent = data.title;
        }
        elements.main.setAttribute("title", textContent);
        elements.main.innerText = textContent;
        if (data.hasOwnProperty("targetId") && data.targetId.length > 0) {
            elements.main.dataset.targetId = data.targetId;
        } else {
            delete elements.main.dataset.targetId;
        }
        if (textContent.length === 0 && !elements.main.dataset.hasOwnProperty("icon")) {
            elements.main.hide();
        } else {
            elements.main.show();
        }
        if (data.hasOwnProperty("items")) {
            if ((element.dataset.type.toLowerCase() === "multi" && !element.dataset.hasOwnProperty("category"))
                || (element.dataset.type.toLowerCase() === "menu")) {
                const itemArray = elements.items.querySelectorAll(`:scope > ${element.tagName}[data-type="${element.dataset.type}"][data-category="item"]`);
                data.items.forEach((itemData, index) => {
                    const item = index < itemArray.length ? itemArray[index] : document.createElement(element.tagName);
                    if (itemArray.length <= index) {
                        item.dataset.type = element.dataset.type;
                        item.dataset.category = "item";
                        elements.items._appendChild(item);
                    }
                    item.dataset.sortCode = index.toString();
                    item.data = itemData;
                });
                for (let index = data.items.length; index < itemArray.length; index++) {
                    elements.items.removeChild(itemArray[index]);
                }
            }
        }
        if (elements.items.childList().length === 0) {
            elements.items.hide();
        } else {
            elements.items.show();
        }
    }

    _elements(element = null) {
        const elements = {
            main: null,
            items: null
        }
        if (element !== null) {
            elements.main = element.querySelector(':scope > a[data-type="main"]');
            elements.items = element.querySelector(':scope > span[data-type="items"]');
        }
        return elements;
    }
}

class SocialGroupRender extends TagRender {

    static newInstance() {
        const socialGroup = document.createElement("section");
        socialGroup.dataset.type = "social-group";
        return socialGroup;
    }

    selectors() {
        return ['section[data-type="social-group"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const title = document.createElement("h4");
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const items = document.createElement("span");
        items.dataset.type = "items";
        items.dataset.sortCode = "1";
        element.appendChild(items);
    }

    _setData(element = null, data) {
        if (element === null) {
            return;
        }

        const elements = this._elements(element);
        if (data.hasOwnProperty("multiKey")) {
            elements.title.innerText = Cell.multiMsg(data.multiKey);
        } else {
            elements.title.innerText = data.hasOwnProperty("title") ? data.title : "";
        }

        const items = data.hasOwnProperty("items") ? data.items : [];
        const linkArray = elements.items.querySelectorAll(':scope > a');
        items.forEach((item, index) => {
            const link = (index < linkArray.length) ? linkArray[index] : document.createElement("a");
            if (linkArray.length <= index) {
                elements.items.appendChild(link);
            }
            if (item.hasOwnProperty("icon")) {
                link.dataset.icon = String.fromCodePoint(Number.parseInt(item.icon, 16));
            }
            if (item.hasOwnProperty("title")) {
                link.title = item.title;
            }
            link.href = item.hasOwnProperty("link") ? item.link : "#";
        });
        for (let index = items.length; index < linkArray.length; index++) {
            elements.items.removeChild(items[index]);
        }
    }

    _elements(element = null) {
        const elements = {
            title: null,
            items: null
        }
        if (element) {
            elements.title = element.querySelector(':scope > h4[data-sort-code="0"]');
            elements.items = element.querySelector(':scope > span[data-type="items"]');
        }
        return elements;
    }
}

class MapRender extends TagRender {

    static newInstance() {
        const map = document.createElement("div");
        map.dataset.type = "map";
        return map;
    }

    selectors() {
        return ['div[data-type="map"]'];
    }

    async colorMode(element = null, darkMode = false) {
        if (element === null) {
            return false;
        }

        switch (element.dataset.provider) {
            case "baidu":
                if ((typeof baidu) !== "undefined") {
                    const {Map, NavigationControl, ScaleControl, Point} = await baidu.maps.importLibrary();
                    const mapInstance = new Map(element.id);
                    mapInstance.enableScrollWheelZoom(true);
                    mapInstance.addControl(new NavigationControl());
                    mapInstance.addControl(new ScaleControl());
                    element.map = mapInstance;
                    element.map.centerAndZoom(new Point(element.dataset.longitude.parseFloat(), element.dataset.latitude.parseFloat()), 15);
                    return true;
                }
                break;
            case "google":
                if ((typeof google) !== "undefined") {
                    const [{LatLng, ColorScheme}, {Map, MapTypeId}, {AdvancedMarkerElement}] =
                        await Promise.all([
                            google.maps.importLibrary("core"),
                            google.maps.importLibrary('maps'),
                            google.maps.importLibrary('marker')
                        ]);
                    const mapPoint = new LatLng(element.dataset.latitude.parseFloat(), element.dataset.longitude.parseFloat());
                    element.map = new Map(element, {
                        zoom: 16,
                        center: mapPoint,
                        initialized: true,
                        mapTypeId: MapTypeId.ROADMAP,
                        mapId: element.id,
                        colorScheme: darkMode ? ColorScheme.DARK : ColorScheme.LIGHT
                    });
                    element.marker = new AdvancedMarkerElement({
                        position: mapPoint,
                        map: element.map
                    });
                    return true;
                }
                break;
        }
        return false;
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.id = "container" + Math.floor(Math.random() * 100).toString();
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        if (data.hasOwnProperty("provider") && data.hasOwnProperty("location")) {
            element.dataset.latitude = data.location.latitude.toString();
            element.dataset.longitude = data.location.longitude.toString();
            element.dataset.provider = data.provider;
            this.colorMode(element, Cell.darkMode())
                .then(result => {
                    if (result) {
                        element.show();
                    } else {
                        element.hide();
                    }
                })
                .catch(() => element.hide());
        } else {
            element.hide();
        }
    }
}

class AddressRender extends TagRender {

    static newInstance() {
        const section = document.createElement("section");
        section.dataset.type = "address";
        return section;
    }

    selectors() {
        return ['section[data-type="address"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const title = document.createElement("h4");
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const content = document.createElement("span");
        content.dataset.type = "content";
        content.dataset.sortCode = "1";
        element.appendChild(content);

        const map = MapRender.newInstance();
        map.dataset.sortCode = "2";
        element._appendChild(map);

        element.sortChildrenBy(":scope > *", "data-sort-code");
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }
        const elements = this._elements(element);
        if (data.hasOwnProperty("multiKey")) {
            elements.title.innerText = Cell.multiMsg(data.multiKey);
        } else if (data.hasOwnProperty("title")) {
            elements.title.innerText = data.title;
        }

        if (data.hasOwnProperty("content")) {
            elements.content.innerText = data.content;
        }

        if (data.hasOwnProperty("map")) {
            elements.map.data = data.map;
        }
    }

    _elements(element = null) {
        const elements = {
            title: null,
            content: null,
            map: null
        }
        if (element) {
            elements.title = element.querySelector(':scope > h4[data-sort-code="0"]');
            elements.content = element.querySelector(':scope > span[data-type="content"]');
            elements.map = element.querySelector(':scope > div[data-type="map"]');
        }
        return elements;
    }
}

class AttachesRender extends TagRender {

    static newInstance() {
        const attaches = document.createElement("span");
        attaches.dataset.type = "attaches";
        return attaches;
    }

    selectors() {
        return ['span[data-type="attaches"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const title = document.createElement("h4");
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const items = document.createElement("span");
        items.dataset.type = "items";
        items.dataset.sortCode = "1";
        element.appendChild(items);

        element.sortChildrenBy(":scope > *", "data-sort-code");
    }

    _setData(element = null, data) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }

        if (data.hasOwnProperty("title")) {
            elements.title.innerText = data.title;
            elements.title.show();
        } else {
            elements.title.hide();
        }

        const attaches = data.hasOwnProperty("items") ? data.items : [];
        const attachArray = elements.items.querySelectorAll(':scope > a');
        attaches.filter(attachData => attachData.hasOwnProperty("title") && attachData.hasOwnProperty("link"))
            .forEach((attachData, index) => {
                const attach = (index < attachArray.length) ? attachArray[index] : document.createElement("a");
                if (attachArray.length <= index) {
                    attach.addEventListener("click", (event) => Cell.eventRequest(event));
                    elements.items.appendChild(attach);
                }
                attach.dataset.sortCode = index.toString();
                attach.innerText = attachData.title;
                attach.title = attachData.title;
                attach.href = attachData.link;
            });
        for (let index = attaches.length; index < attachArray.length; index++) {
            elements.items.removeChild(attachArray[index]);
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            title: element.querySelector(':scope > h4'),
            items: element.querySelector(':scope > span[data-type="items"]')
        }
    }
}

class DetailsRender extends TagRender {
    static newInstance(category = "") {
        const details = document.createElement("span");
        details.dataset.type = "details";
        if (category.length > 0) {
            details.dataset.category = category;
        }
        return details;
    }

    selectors() {
        return ['span[data-type="details"][data-category]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const content = document.createElement("span");
        content.dataset.type = "content";
        content.dataset.sortCode = "4";
        element.appendChild(content);

        const resources = document.createElement("span");
        resources.dataset.type = "resources";
        resources.dataset.sortCode = "5";
        element.appendChild(resources);

        if (element.dataset.category.toLowerCase() === "corporate") {
            const addresses = document.createElement("span");
            addresses.dataset.type = "addresses";
            addresses.dataset.sortCode = "6";
            element.appendChild(addresses);
        } else if (element.dataset.category.toLowerCase() === "message") {
            const title = document.createElement("h2");
            title.dataset.sortCode = "0";
            element.appendChild(title);

            const properties = document.createElement("span");
            properties.dataset.type = "properties";
            properties.dataset.sortCode = "1";
            element.appendChild(properties);

            const avatar = ResourcesRender.newInstance();
            avatar.dataset.sortCode = "2";
            element._appendChild(avatar);

            const summary = document.createElement("span");
            summary.dataset.type = "summary";
            summary.dataset.sortCode = "3";
            element._appendChild(summary);

            const attaches = AttachesRender.newInstance();
            attaches.dataset.sortCode = "6";
            element._appendChild(attaches);

            const modelTitle = document.createElement("h4");
            modelTitle.dataset.type = "modelTitle";
            modelTitle.dataset.sortCode = "7";
            element._appendChild(modelTitle);

            const models = document.createElement("span");
            models.dataset.type = "models";
            models.dataset.sortCode = "8";
            element._appendChild(models);

            const accessoriesTitle = document.createElement("h4");
            accessoriesTitle.dataset.type = "accessoriesTitle";
            accessoriesTitle.dataset.sortCode = "9";
            element._appendChild(accessoriesTitle);

            const accessories = document.createElement("span");
            accessories.dataset.type = "accessories";
            accessories.dataset.sortCode = "10";
            element._appendChild(accessories);

            const commentList = CommentListRender.newInstance();
            commentList.dataset.sortCode = "11";
            element._appendChild(commentList);
        } else if (element.dataset.category.toLowerCase() === "user") {
            const avatar = ResourcesRender.newInstance();
            avatar.dataset.sortCode = "2";
            element._appendChild(avatar);

            const score = ScoreRender.newInstance();
            score.dataset.sortCode = "6";
            element._appendChild(score);
        }

        element.sortChildrenBy(":scope > *", "data-sort-code");
    }

    _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (data.hasOwnProperty("content")) {
            elements.content.innerText = data.content;
            elements.content.show();
        } else {
            elements.content.hide();
        }

        const resources = data.hasOwnProperty("resources") ? data.resources : [];
        const resourceArray = elements.resources.querySelectorAll(':scope > span[data-type="lazy"]');
        resources.forEach((data, index) => {
            const resource = (index < resourceArray.length) ? resourceArray[index] : ResourcesRender.newInstance();
            if (resourceArray.length <= index) {
                elements.resources._appendChild(resource);
            }
            resource.dataset.sortCode = index.toString();
            resource.data = data;
        });
        for (let index = resources.length; index < resourceArray.length; index++) {
            elements.resources.removeChild(resourceArray[index]);
        }

        if (resources.length === 0) {
            elements.resources.hide();
        } else {
            elements.resources.show();
        }

        if (element.dataset.category.toLowerCase() === "corporate") {
            const addresses = data.hasOwnProperty("addresses") ? data.addresses : [];
            const addressArray = elements.addresses.querySelectorAll(':scope > section[data-type="address"]');
            addresses.forEach((data, index) => {
                const address = (index < addressArray.length) ? addressArray[index] : AddressRender.newInstance();
                if (addressArray.length <= index) {
                    elements.addresses._appendChild(address);
                }
                address.data = data;
            });
            for (let index = addresses.length; index < addressArray.length; index++) {
                elements.addresses.removeChild(addressArray[index]);
            }
        } else if (element.dataset.category.toLowerCase() === "message") {
            if (data.hasOwnProperty("title")) {
                elements.title.innerText = data.title;
            }

            if (data.hasOwnProperty("properties")) {
                const properties = data.properties;
                const propertyList = elements.properties.querySelectorAll(':scope > span[data-type="property"]');
                properties.forEach((prop, index) => {
                    const property = (index < propertyList.length) ? propertyList[index] : PropertyRender.newInstance();
                    if (propertyList.length <= index) {
                        elements.properties._appendChild(property);
                        property.addEventListener("click", (event) => Cell.eventRequest(event));
                    }
                    property.data = {
                        sortCode: index.toString(),
                        title: {
                            content: prop.title
                        },
                        value: prop.content,
                        link: prop.hasOwnProperty("link") ? prop.link : ""
                    }
                });
                for (let index = properties.length; index < propertyList.length; index++) {
                    elements.properties.removeChild(propertyList[index]);
                }
                elements.properties.show();
            } else {
                elements.properties.hide();
            }

            if (data.hasOwnProperty("avatar")) {
                elements.avatar.data = data.avatar;
                elements.avatar.show();
            } else {
                elements.avatar.hide();
            }

            if (data.hasOwnProperty("summary")) {
                elements.summary.innerText = data.summary;
                elements.summary.show();
            } else {
                elements.summary.hide();
            }

            if (data.hasOwnProperty("content")) {
                elements.content.innerHTML = data.content;
                elements.content.show();
            } else {
                elements.content.hide();
            }

            if (data.hasOwnProperty("attaches")) {
                elements.attaches.data = data.attaches;
                elements.attaches.show();
            } else {
                elements.attaches.hide();
            }

            if (data.hasOwnProperty("models")) {
                const modelsData = data.models;
                if (modelsData.hasOwnProperty("multiKey")) {
                    elements.models.title.innerText = Cell.multiMsg(modelsData.multiKey);
                    elements.models.title.show();
                } else if (modelsData.hasOwnProperty("title")) {
                    elements.models.title.innerText = modelsData.title;
                    elements.models.title.show();
                } else {
                    elements.models.title.hide();
                }

                const modelItems = modelsData.hasOwnProperty("items") ? modelsData.items : [];
                const modelArray = elements.models.container.querySelectorAll(':scope > a[data-type="banner"]');
                modelItems.forEach((itemData, index) => {
                    const model = (index < modelArray.length) ? modelArray[index] : BannerRender.newInstance();
                    if (modelArray.length <= index) {
                        elements.models.container._appendChild(model);
                    }
                    model.dataset.sortCode = index.toString();
                    model.data = itemData;
                });
                for (let index = modelItems.length; index < modelArray.length; index++) {
                    elements.models.container.removeChild(modelArray[index]);
                }

                if (elements.models.container.querySelectorAll(':scope > a[data-type="banner"]').length === 0) {
                    elements.models.container.hide();
                } else {
                    elements.models.container.show();
                }
            } else {
                elements.models.title.hide();
                elements.models.container.hide();
            }

            if (data.hasOwnProperty("accessories")) {
                const accessoriesData = data.accessories;
                if (accessoriesData.hasOwnProperty("multiKey")) {
                    elements.accessories.title.innerText = Cell.multiMsg(accessoriesData.multiKey);
                    elements.accessories.title.show();
                } else if (accessoriesData.hasOwnProperty("title")) {
                    elements.accessories.title.innerText = accessoriesData.title;
                    elements.accessories.title.show();
                } else {
                    elements.accessories.title.hide();
                }

                const accessoriesItems = accessoriesData.hasOwnProperty("items") ? accessoriesData.items : [];
                const accessoriesArray = elements.accessories.container.querySelectorAll(':scope > a[data-type="banner"]');
                accessoriesItems.forEach((itemData, index) => {
                    const model = (index < accessoriesArray.length) ? accessoriesArray[index] : BannerRender.newInstance();
                    if (accessoriesArray.length <= index) {
                        elements.accessories.container._appendChild(model);
                    }
                    model.dataset.sortCode = index.toString();
                    model.data = itemData;
                });
                for (let index = accessoriesItems.length; index < accessoriesArray.length; index++) {
                    elements.accessories.container.removeChild(accessoriesArray[index]);
                }

                if (elements.accessories.container.querySelectorAll(':scope > a[data-type="banner"]').length === 0) {
                    elements.accessories.container.hide();
                } else {
                    elements.accessories.container.show();
                }
            } else {
                elements.accessories.title.hide();
                elements.accessories.container.hide();
            }

            if (data.hasOwnProperty("comments")) {
                elements.comment.data = data.comments;
                elements.comment.show();
            } else {
                elements.comment.hide();
            }
        } else if (element.dataset.category.toLowerCase() === "user") {
            elements.resources.hide();
            if (data.hasOwnProperty("avatar")) {
                elements.avatar.data = data.avatar;
            }
            if (data.hasOwnProperty("score")) {
                elements.score.data = data.score;
            }
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        if (element.dataset.category.toLowerCase() === "corporate") {
            return {
                content: element.querySelector(':scope > span[data-type="content"]'),
                resources: element.querySelector(':scope > span[data-type="resources"]'),
                addresses: element.querySelector(':scope > span[data-type="addresses"]')
            }
        } else if (element.dataset.category.toLowerCase() === "message") {
            return {
                title: element.querySelector(':scope > h2'),
                properties: element.querySelector(':scope > span[data-type="properties"]'),
                avatar: element.querySelector(':scope > span[data-type="lazy"]'),
                summary: element.querySelector(':scope > span[data-type="summary"]'),
                content: element.querySelector(':scope > span[data-type="content"]'),
                resources: element.querySelector(':scope > span[data-type="resources"]'),
                attaches: element.querySelector(':scope > span[data-type="attaches"]'),
                models: {
                    title: element.querySelector(':scope > h4[data-type="modelTitle"]'),
                    container: element.querySelector(':scope > span[data-type="models"]')
                },
                accessories: {
                    title: element.querySelector(':scope > h4[data-type="accessoriesTitle"]'),
                    container: element.querySelector(':scope > span[data-type="accessories"]')
                },
                comment: element.querySelector(':scope > span[data-type="comment-list"]')
            }
        } else if (element.dataset.category.toLowerCase() === "user") {
            return {
                avatar: element.querySelector(':scope > span[data-type="lazy"]'),
                content: element.querySelector(':scope > span[data-type="content"]'),
                resources: element.querySelector(':scope > span[data-type="resources"]'),
                score: element.querySelector(':scope > p[data-type="score"]')
            }
        }
        return null;
    }
}

class SlideRender extends TagRender {

    static newInstance() {
        const slide = document.createElement("section");
        slide.dataset.type = "slide";
        return slide;
    }

    selectors() {
        return ['section[data-type="slide"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        element.addEventListener('mouseover', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (element.dataset.hasOwnProperty("timer")) {
                window.clearInterval(element.dataset.timer.parseInt());
                delete element.dataset.timer;
            }
        });
        element.addEventListener('mouseout', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!element.dataset.hasOwnProperty("timer")) {
                const timeout = element.dataset.hasOwnProperty("timeout") ? element.dataset.timeout.parseInt() : 5000;
                element.dataset.timer = window.setInterval(() => element.slide(), timeout).toString();
            }
        });

        const sortContainer = document.createElement("span");
        sortContainer.dataset.type = "sort-container";
        element.appendChild(sortContainer);

        const slideContainer = document.createElement("span");
        slideContainer.dataset.type = "slide-container";
        element.appendChild(slideContainer);
    }

    _setData(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }

        if (element.dataset.hasOwnProperty("timer")) {
            window.clearInterval(element.data.timer);
            delete element.dataset.timer;
        }

        if (data.hasOwnProperty("timeout")) {
            element.dataset.timeout = data.timeout.parseInt().toString();
        } else {
            element.dataset.timeout = "5000";
        }

        const openWindow = Boolean(data.openWindow);
        const transitionTime = data.hasOwnProperty("transitionTime") ? data.transitionTime.parseInt() : 0;
        const timeout = element.dataset.timeout.parseInt();
        const slideType = data.hasOwnProperty("slideType") ? data.slideType.parseInt() : SlideType.ScrollLeft;

        const items = data.hasOwnProperty("items") ? data.items.filter(item => item.hasOwnProperty("avatar")) : [];
        const sortArray = elements.sort.querySelectorAll(':scope > i');
        const slideArray = elements.slide.querySelectorAll(':scope > a[data-type="banner"]');
        if (items.length !== sortArray.length) {
            items.forEach((item, index) => {
                if (sortArray.length <= index) {
                    const sort = document.createElement("i");
                    sort.dataset.sortCode = index.toString();
                    elements.sort.appendChild(sort);
                    sort.addEventListener("click", (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        element.dataset.next = event.target.dataset.sortCode;
                        element.slide(true);
                    });
                    if (index === 0) {
                        sort.appendClass("current");
                    }
                } else {
                    if (index === 0) {
                        sortArray[index].appendClass("current");
                    }
                }
                const slide = (index < slideArray.length) ? slideArray[index] : BannerRender.newInstance();
                if (slideArray.length <= index) {
                    elements.slide._appendChild(slide);
                }
                slide.dataset.sortCode = index.toString();
                if (openWindow) {
                    slide.dataset.openWindow = "true";
                } else {
                    delete slide.dataset.openWindow;
                }
                slide.data = item;
                slide.style.transition = `all ${transitionTime}ms`;
                switch (slideType) {
                    case SlideType.ScrollLeft:
                    case SlideType.ScrollTop:
                    case SlideType.ScrollRight:
                    case SlideType.ScrollBottom:
                        slide.style.top = "0";
                        slide.style.left = "0";
                        break;
                    case SlideType.ZoomIn:
                        slide.style.scale = (index === 0) ? "1" : "0";
                        break;
                    case SlideType.ZoomOut:
                        slide.style.scale = "1";
                        break;
                    case SlideType.OpacityIn:
                        slide.style.opacity = (index === 0) ? "1" : "0";
                        break;
                    case SlideType.OpacityOut:
                        slide.style.opacity = "1";
                        break;
                }
                if (index === 0) {
                    slide.setClass("current");
                }
            });
            for (let index = items.length; index < Math.max(sortArray.length, slideArray.length); index++) {
                if (index < sortArray.length) {
                    elements.sort.removeChild(sortArray[index]);
                }
                if (index < slideArray.length) {
                    elements.slide.removeChild(slideArray[index]);
                }
            }

            element.dataset.slideType = slideType.toString();
            elements.sort.sortChildrenBy(':scope > i', "data-sort-code");
            elements.slide.sortChildrenBy(':scope > a[data-type="banner"]', "data-sort-code");
        }

        element.dataset.transitionTime = transitionTime.toString();
        element.dataset.timer = window.setInterval(() => element.slide(), timeout).toString();
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            sort: element.querySelector(':scope > span[data-type="sort-container"]'),
            slide: element.querySelector(':scope > span[data-type="slide-container"]')
        }
    }
}

class WindowRender extends TagRender {

    static newInstance(type = "") {
        if (type.length === 0) {
            return null;
        }
        const target = document.createElement("div");
        target.dataset.type = type;
        return target;
    }

    selectors() {
        return ['body > div[data-type="dialog"]', 'body > div[data-type="float"]', 'body > div[data-type="notify"]'];
    }

    _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.clearChildNodes();

        switch (element.dataset.type.toLowerCase()) {
            case "dialog":
                const message = document.createElement("span");
                message.dataset.type = "message";
                message.dataset.sortCode = "0";
                element.appendChild(message);

                const confirmBtn = document.createElement("button");
                confirmBtn.dataset.type = "confirm";
                confirmBtn.dataset.sortCode = "1";
                confirmBtn.dataset.multiKey = "OK.Button";
                element._appendChild(confirmBtn);
                confirmBtn.addEventListener("click", (event) => confirmDialog(event));

                const cancelBtn = document.createElement("button");
                cancelBtn.dataset.type = "cancel";
                cancelBtn.dataset.sortCode = "2";
                cancelBtn.dataset.multiKey = "Cancel.Button";
                element._appendChild(cancelBtn);
                cancelBtn.addEventListener("click", (event) => closeDialog(event));
                break;
            case "notify":
                const floatNotify = document.createElement("section");
                floatNotify.dataset.type = "float-notify";
                element.appendChild(floatNotify);
                floatNotify.hide();

                const notifyBtn = document.createElement("i");
                notifyBtn.setClass("icon-bell-ring");
                element.appendChild(notifyBtn);
                notifyBtn.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (element.hasClass("notify")) {
                        document.body.style.overflow = "auto";
                        element.removeClass("notify");
                    } else {
                        document.body.style.overflow = "hidden";
                        element.appendClass("notify");
                    }
                });

                const notification = document.createElement("section");
                notification.dataset.type = "notification";
                element.appendChild(notification);
                break;
            case "float":
                const closeBtn = document.createElement("i");
                closeBtn.setClass("icon-close");
                closeBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    document.body.removeClass("freeze");
                    element.hide();
                });
                element.appendChild(closeBtn);

                const details = document.createElement("div");
                details.dataset.type = "details";
                element.appendChild(details);

                const scrollBar = document.createElement("span");
                scrollBar.dataset.type = "scroll-bar";
                element._appendChild(scrollBar);
                break;
        }
        Cell.multilingual(element);
    }

    _setData(element = null, data) {
        if (element === null || data.length === 0) {
            return;
        }
        switch (element.dataset.type.toLowerCase()) {
            case "dialog":
                let textContent = "";
                if (data.hasOwnProperty("multiKey")) {
                    textContent = Cell.multiMsg(data.multiKey);
                } else if (data.hasOwnProperty("content")) {
                    textContent = data.content;
                }

                if (textContent.length === 0) {
                    return;
                }

                const message = element.querySelector('span[data-type="message"]');
                if (message) {
                    message.innerText = textContent;
                    element.dataset.category = data.hasOwnProperty("confirm") ? "confirm" : "alter";
                    if (data.hasOwnProperty("confirm")) {
                        element.confirm = data.confirm;
                    }
                    document.body.appendClass("freeze");
                    element.show();
                }
                break;
            case "notify":
                const elements = this._elements(element);
                if (elements) {
                    const dataArray = data instanceof Array ? data : [data];
                    dataArray.forEach((notifyData) => {
                        elements.float.appendChild(this._newNotify(notifyData));
                        elements.notification.appendChild(this._newNotify(notifyData));
                    });
                    if (elements.notification.querySelectorAll(":scope > a").length === 0) {
                        elements.button.setClass("icon-bell");
                        elements.notification.hide();
                        elements.float.hide();
                    } else {
                        elements.button.setClass("icon-bell-ring");
                        elements.float.show();
                        const timeout = element.dataset.hasOwnProperty("timeout") ? element.dataset.timeout.parseInt() : 5000;
                        window.setTimeout(() => elements.float.hide(), timeout);
                    }
                }
                break;
            case "float":
                this._details(element).then((details) => {
                    details.clearChildNodes();
                    const dataArray = data instanceof Array ? data : [data];
                    dataArray.filter(itemData => itemData.hasOwnProperty("tagName") && itemData.hasOwnProperty("data"))
                        .forEach(itemData => {
                            const tagElement = document.createElement(itemData.tagName);
                            if (itemData.hasOwnProperty("type")) {
                                tagElement.dataset.type = itemData.type;
                            }
                            details._appendChild(tagElement);
                            tagElement.data = itemData.data;
                        });
                    document.body.appendClass("freeze");
                    element.show();
                });
                break;
        }
    }

    _newNotify(data = {}) {
        if (data.hasOwnProperty("text") && data.hasOwnProperty("identify")) {
            const notify = document.createElement("a");
            notify.id = data.identify;
            notify.addEventListener("click", (event) => Cell.eventRequest(event));
            notify.title = data.text;
            notify.href = data.hasOwnProperty("link") ? data.link : "#";
            const closeBtn = document.createElement("i");
            closeBtn.dataset.type = "close-btn";
            closeBtn.dataset.sortCode = "0";
            closeBtn.setClass("icon-close");
            closeBtn.style.zIndex = "2";
            closeBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                const current = event.target.parentElement;
                const notify = current.parentElement.parentElement;
                const floatNotify = notify.querySelector(`:scope > section[data-type="float-notify"] > a[id="${current.id}"]`),
                    floatWindow = floatNotify == null ? null : floatNotify.parentElement;
                let emptyNotifications = false;
                if (floatNotify) {
                    floatWindow.removeChild(floatNotify);
                    if (floatWindow.childList().length === 0) {
                        emptyNotifications = true;
                    }
                }
                const notification = notify.querySelector(`:scope > section[data-type="notification"] > a[id="${current.id}"]`),
                    notifyWindow = notification === null ? null : notification.parentElement;
                if (notification) {
                    notifyWindow.removeChild(notification);
                    if (notifyWindow.childList().length === 0) {
                        emptyNotifications = true;
                    }
                }

                if (emptyNotifications) {
                    floatWindow.hide();
                    const notifyBtn = notify.querySelector(":scope > i");
                    if (notifyBtn) {
                        notifyBtn.setClass("icon-bell");
                        notifyBtn.hide();
                    }
                    notify.removeClass("notify");
                    document.body.style.overflow = "auto";
                }
            });
            notify.appendChild(closeBtn);
            if (data.hasOwnProperty("imgPath")) {
                notify.dataset.imgPath = data.imgPath;
                notify.setAttribute("style", `--icon: url('${data.imgPath}')`);
            } else if (data.hasOwnProperty("icon")) {
                notify.dataset.icon = data.icon;
            }
            return notify;
        }
        return null;
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            float: element.querySelector(':scope > section[data-type="float-notify"]'),
            button: element.querySelector(':scope > i'),
            notification: element.querySelector(':scope > section[data-type="notification"]')
        };
    }

    _details(element = null) {
        return new Promise((resolve, reject) => {
            const details = (element === null) ? null : element.querySelector('div[data-type="details"]');
            if (details) {
                resolve(details);
            } else {
                reject("Element not exists");
            }
        });
    }
}

export {
    TagRender,
    TipsRender,
    ProgressRender,
    ScoreRender,
    BannerRender,
    PasswordRender,
    MockButtonRender,
    CalendarRender,
    ChartRender,
    ResourcesRender,
    InputGroupRender,
    IntervalRender,
    DragUploadRender,
    PropertyRender,
    ScheduleItemRender,
    GroupItemRender,
    TabsItemRender,
    ArrayItemRender,
    FormItemRender,
    FormInfoRender,
    CommentRecordRender,
    CommentListRender,
    StatisticsRender,
    PagerRender,
    GridListRender,
    ListRecordRender,
    MenuRender,
    SocialGroupRender,
    MapRender,
    AddressRender,
    AttachesRender,
    DetailsRender,
    SlideRender,
    WindowRender
};