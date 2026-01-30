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

import {EnhancedElement, TagRender, ring, randomColor} from "../Components.js";

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

class KlineRender extends TagRender {

    static newInstance() {
        const chart = document.createElement("p");
        chart.dataset.type = "k-line";
        return chart;
    }

    static selectors() {
        return ['p[data-type="k-line"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.clearChildNodes();

        const title = document.createElement("p");
        title.dataset.type = "title";
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const open = document.createElement("p");
        open.dataset.type = "open";
        open.dataset.sortCode = "1";
        open.dataset.multiKey = "open.k.title";
        element.appendChild(open);

        const close = document.createElement("p");
        close.dataset.type = "close";
        close.dataset.sortCode = "2";
        close.dataset.multiKey = "close.k.title";
        element.appendChild(close);

        const high = document.createElement("p");
        high.dataset.type = "high";
        high.dataset.sortCode = "3";
        high.dataset.multiKey = "high.k.title";
        element.appendChild(high);

        const low = document.createElement("p");
        low.dataset.type = "low";
        low.dataset.sortCode = "4";
        low.dataset.multiKey = "low.k.title";
        element.appendChild(low);

        element.sortChildrenBy(':scope > p', "data-sort-code");
        await Cell.multilingual(element);
    }

    async _setData(element = null, data = {}) {
        const elements = this._elements(element);
        elements.title.innerText = data.hasOwnProperty("title") ? data.title : "";
        elements.open.dataset.value = data.hasOwnProperty("open") ? data.open : "";
        elements.close.dataset.value = data.hasOwnProperty("close") ? data.close : "";
        elements.high.dataset.value = data.hasOwnProperty("high") ? data.high : "";
        elements.low.dataset.value = data.hasOwnProperty("low") ? data.low : "";
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            title: element.querySelector(':scope > p[data-type="title"]'),
            open: element.querySelector(':scope > p[data-type="open"]'),
            close: element.querySelector(':scope > p[data-type="close"]'),
            high: element.querySelector(':scope > p[data-type="high"]'),
            low: element.querySelector(':scope > p[data-type="low"]')
        }
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

    static selectors() {
        return ['section[data-type="chart"]'];
    }

    async resize(element = null) {
        if (element !== null && element.dataset.hasOwnProperty("currentData")) {
            const data = element.dataset.currentData.parseJSON();
            await this._prepare(element, data);
            await this._setData(element, data);
        }
    }

    async _prepare(element = null, data = {}) {
        if (element === null) {
            return;
        }
        if (ChartRender.selectors().filter(selector => element.matches(selector)).length > 0
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
                element.style.width = `calc(-${sizeY} + 100%)`;
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

    async _setData(element = null, data = {}) {
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

        element.dataset.currentData = JSON.stringify(data);
    }

    _parameters(element, styles = {}) {
        if (["pie", "rose", "ring"].indexOf(element.dataset.style) >= 0) {
            element.style.height = `${element.styles().width.parseInt()}px`;
        }
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
        let section = (index < sectionArray.length) ? sectionArray[index] : document.createElement("section");
        if (sectionArray.length <= index) {
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
            if (index === data.length - 1) {
                markingStyles = `--position: calc(-1px + ${position}%);`;
            }
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

            let content = sector.querySelector(':scope > p[data-type="k-line"]');
            if (content === null) {
                content = KlineRender.newInstance();
                sector._appendChild(content);
            }
            content.data = {
                title: data.title || "",
                open: open.toString(),
                close: close.toString(),
                low: low.toString(),
                high: high.toString()
            };
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
                sector.dataset.negative = (_percent < 0).toString();
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
        const legendArray = container.getElementsByTagName("p");
        const legend = (index < legendArray.length) ? legendArray[index] : document.createElement("p");
        if (legendArray.length <= index) {
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
        const parameters = this._parameters(element);
        element.style.height = `${parameters.width}px`;
        _clipPath(data.items, parameters.width).forEach((sectorData, index) => {
            this._sector(element, index, sectorData);
            this._legend(element, index, parameters, sectorData);
        });
        this._remove(element, element, data.items.length);
    }

    _ringChart(element, data = {}) {
        const parameters = this._parameters(element, data.hasOwnProperty("styles") ? data.styles : {});
        element.style.height = `${parameters.width}px`;
        const _stepWidth = parameters.ringWidth + parameters.gapWidth;
        _ringPath(data.items)
            .forEach((sectorData, index) => {
                ring(element, index, _stepWidth, parameters.fillColor, sectorData);
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

class ChartElement extends EnhancedElement {
    constructor(style = "") {
        super(ChartRender);
        this._style = style;
    }

    _newElement() {
        return this._render.newInstance(this._style);
    }
}

class PieChartElement extends ChartElement {
    constructor() {
        super("pie");
    }

    static tagName() {
        return "chart-pie";
    }
}

class RoseChartElement extends ChartElement {
    constructor() {
        super("rose");
    }

    static tagName() {
        return "chart-rose";
    }
}

class CircleChartElement extends ChartElement {
    constructor() {
        super("circle");
    }

    static tagName() {
        return "chart-circle";
    }
}

class ColumnChartElement extends ChartElement {
    constructor() {
        super("column");
    }

    static tagName() {
        return "chart-column";
    }
}

class WaterfallChartElement extends ChartElement {
    constructor() {
        super("waterfall");
    }

    static tagName() {
        return "chart-waterfall";
    }
}

class BarChartElement extends ChartElement {
    constructor() {
        super("bar");
    }

    static tagName() {
        return "chart-bar";
    }
}

class KlineChartElement extends ChartElement {
    constructor() {
        super("k-line");
    }

    static tagName() {
        return "chart-k-line";
    }
}

export {PieChartElement, RoseChartElement, CircleChartElement, ColumnChartElement, WaterfallChartElement, BarChartElement, KlineChartElement}

(function () {
    Cell.registerRenders(KlineRender, ChartRender);
    Cell.registerComponents(PieChartElement, RoseChartElement, CircleChartElement, ColumnChartElement, WaterfallChartElement, BarChartElement, KlineChartElement);
})();