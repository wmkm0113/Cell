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
const ring = function (element, index, _stepWidth = 0, fillColor = "", sectorData = {}) {
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

class CustomElement extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: "closed"});
        Object.defineProperty(this, "data", {
            set(data = null) {
                this._setData(data);
            }
        });
    }

    static tagName() {
        return "";
    }

    static newInstance() {
        return document.createElement(this.tagName());
    }

    connectedCallback() {}

    disconnectedCallback() {}

    _addSlot(...names) {
        if (names !== null) {
            names.filter(name => this._checkExists(name))
                .forEach(name => {
                    let slotElement = document.createElement("slot");
                    slotElement.setAttribute("name", name);
                    this._shadowRoot.appendChild(slotElement);
                });
        }
    }

    _checkExists(slot = "") {
        return (slot != null) && (slot.length > 0)
            && (this._shadowRoot.querySelector(`slot[name="${slot}"]`) === null);
    }

    _appendChild(element = null) {
        if (element === null) {
            return;
        }
        Cell._preRender(element);
        this.appendChild(element);
    }

    _setData(data = {}) {
    }
}

class TagRender {

    static newInstance() {
        return null;
    }

    static selectors() {
        return [];
    }

    async colorMode(element = null, darkMode = false) {
    }

    async resize(element = null) {
    }

    async _enhance(element = null) {
    }

    async _prepare(element = null, data) {
    }

    async _setData(element = null, data) {
    }

    _multilingual(element = null) {
    }

    async _process(element = null) {
    }
}

class EnhancedElement extends CustomElement {
    constructor(render = TagRender) {
        super();
        this._addSlot("element");
        this._element = null;
        this._render = render;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this._element === null) {
            this._element = this._newElement();
            if (!!this._element) {
                this._element.setAttribute("slot", "element");
                super._appendChild(this._element);
            }
        }
        if (this.dataset.hasOwnProperty("initData")) {
            const initData = this.dataset.initData;
            this._setData(initData.isJSON() ? initData.parseJSON() : initData);
        } else if (this.dataset.hasOwnProperty("code")) {
            Cell._initData(this);
        }
    }

    _setData(data) {
        if (data) {
            this._element.data = data;
        }
    }

    _newElement() {
        return this._render.newInstance();
    }
}

export {CustomElement, EnhancedElement, TagRender, ring, randomColor}