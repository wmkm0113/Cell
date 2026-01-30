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
import {Comment} from "../../commons/Commons.js";

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

    static selectors() {
        return ['progress', 'span[data-type="progress"]'];
    }

    async _setData(element = null, data = {}) {
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
            ring(element, 0, circle,
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

    static selectors() {
        return ['span[data-type="lazy"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.addEventListener("click", (event) => Cell.eventRequest(event));
        element.addEventListener("mouseover", () => element.playVideo());
        element.addEventListener("mouseout", () => element.pauseVideo());
        if (element.dataset.initData && element.dataset.initData.isJSON()) {
            await this._setData(element, element.dataset.initData.parseJSON());
        }
    }

    async _setData(element = null, data = {}) {
        if (element === null || data === null || Object.keys(data).length === 0) {
            return;
        }

        if (data.hasOwnProperty("mimeType") && data.hasOwnProperty("resourcePath")) {
            if (element.dataset.mimeType !== data["mimeType"] || element.dataset.resourcePath !== data["resourcePath"]) {
                delete element.dataset.loaded;
            }
            Object.keys(data).forEach((key) => element.dataset[key] = data[key]);
        }
    }
}

class BannerRender extends TagRender {
    static newInstance() {
        const banner = document.createElement("a");
        banner.dataset.type = "banner";
        banner.addEventListener("click", async (event) => await Cell.eventRequest(event));
        return banner;
    }

    static selectors() {
        return ['a[data-type="banner"]'];
    }

    async _enhance(element = null) {
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

    async _setData(element = null, data = {}) {
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

        const title = data.title || {};
        let textContent = "";
        if (title.hasOwnProperty("multiKey")) {
            textContent = Cell.multiMsg(title.multiKey);
        } else if (title.hasOwnProperty("content")) {
            textContent = title.content;
        }

        if (textContent.length > 0) {
            element.dataset.content = textContent;
        } else {
            delete element.dataset.content;
        }
        element.title = textContent;
    }
}

class MenuRender extends TagRender {

    static newInstance(_type = "menu") {
        //  Default using nav tag
        const menu = document.createElement("nav");
        menu.dataset.type = _type;
        return menu;
    }

    static selectors() {
        return ['nav[data-type]', 'menu[data-type]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const link = document.createElement("a");
        link.dataset.type = "main";
        link.dataset.sortCode = "0";
        element.appendChild(link);
        link.addEventListener("click", async (event) => {
            const target = event.target;
            if (target.dataset.hasOwnProperty("langCode") && target.parentElement.dataset.type === "multi") {
                const langCode = target.dataset.langCode;
                if (langCode.length > 0) {
                    await Cell.languageCode(langCode);
                    if (document.body.dataset.hasOwnProperty("multiTemplate")) {
                        const link = document.body.dataset.multiTemplate.replaceAll("{languageCode}", langCode);
                        if (link.length > 0) {
                            target.href = link;
                        }
                    }
                }
            }
            await Cell.eventRequest(event);
        });
        if (element.dataset.type.toLowerCase() === "multi" && !element.dataset.hasOwnProperty("category")) {
            link.dataset.icon = String.fromCodePoint(Comment.Icons.Multilingual);
        }

        const items = document.createElement("span");
        items.dataset.type = "items";
        items.dataset.sortCode = "1";
        element.appendChild(items);
    }

    async _setData(element = null, data = {}) {
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

        const title = data.title || {};

        let textContent = "";
        if (title.hasOwnProperty("multiKey")) {
            elements.main.dataset.multiKey = title.multiKey;
            textContent = Cell.multiMsg(title.multiKey);
        } else if (title.hasOwnProperty("content")) {
            textContent = title.content;
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
            if (!element.dataset.hasOwnProperty("category") || (element.dataset.type.toLowerCase() === "menu")) {
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

class GalleryRender extends TagRender {

    static newInstance() {
        const gallery = document.createElement("section");
        gallery.dataset.type = "gallery";
        return gallery;
    }

    static selectors() {
        return ['span[data-type="gallery"]', 'div[data-type="gallery"]', 'section[data-type="gallery"]'];
    }

    async _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        element.style.display = "grid";
        if (data.hasOwnProperty("gridColumn")) {
            element.style.gridTemplateColumns = `repeat(${data.gridColumn}, 1fr)`;
        }
        if (data.hasOwnProperty("gridGap")) {
            element.style.gap = data.gridGap;
        }
        const existResources = element.querySelectorAll('span[data-type="lazy"]');
        const items = data.items || [];
        items.filter(item => item.hasOwnProperty("data"))
            .forEach((item, index) => {
                const resource = (index < existResources.length) ? existResources[index] : ResourcesRender.newInstance();
                if (existResources.length <= index) {
                    element._appendChild(resource);
                }
                resource.data = item.data;
                if (item.hasOwnProperty("column")) {
                    resource.style.gridColumn = `span ${item.column}`;
                } else {
                    delete resource.style.gridColumn;
                }
                if (item.hasOwnProperty("row")) {
                    resource.style.gridRow = `span ${item.row}`;
                } else {
                    delete resource.style.gridRow;
                }
            });
        for (let i = items.length; i < existResources.length; i++) {
            element.removeChild(existResources[i]);
        }
    }
}

class ProgressElement extends EnhancedElement {
    _ring;
    constructor(ring = false) {
        super(ProgressRender);
        this._ring = ring;
    }

    _newElement() {
        return ProgressRender.newInstance(this._ring);
    }
}

class ProgressRingElement extends ProgressElement {
    constructor() {
        super(true);
    }

    static tagName() {
        return "progress-ring";
    }
}

class ProgressBarElement extends ProgressElement {
    constructor() {
        super(false);
    }

    static tagName() {
        return "progress-bar";
    }
}

class MenuElement extends EnhancedElement {
    _multiMenu;
    constructor(multiMenu = false) {
        super(MenuRender);
        this._multiMenu = multiMenu;
    }

    _newElement() {
        return MenuRender.newInstance(this._multiMenu ? "multi" : "menu");
    }
}

class MultiMenuElement extends MenuElement {
    static tagName() {
        return "menu-multi";
    }
    constructor() {
        super(true);
    }
}

class MenuInfoElement extends MenuElement {
    static tagName() {
        return "menu-info";
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

    static selectors() {
        return ['span[data-type="property"]'];
    }

    async _enhance(element = null) {
        element.addEventListener("click", (event) => Cell.eventRequest(event));
    }

    async _setData(element = null, data = {}) {
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

        if (data.hasOwnProperty("category") && data.category !== null) {
            switch (data.category.toLowerCase()) {
                case "timestamp":
                    content = content.formatDate(data.pattern);
                    break;
                case "price":
                    content = content.parseInt().toPrice();
                    break;
            }
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

export {ProgressRingElement, ProgressBarElement, BannerRender, MultiMenuElement, MenuInfoElement, GalleryRender, PropertyRender, ResourcesRender};

(function () {
    Cell.registerRenders(ProgressRender, ResourcesRender, BannerRender, MenuRender, GalleryRender, PropertyRender);
    Cell.registerComponents(ProgressRingElement, ProgressBarElement, MultiMenuElement, MenuInfoElement);
})();