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

import {EnhancedElement, TagRender} from "../Components.js";
import MapRender from "./Maps.js";
import {BannerRender, GalleryRender, ResourcesRender, PropertyRender} from "./Enhance.js";
import {CommentListElement} from "./List.js";
import {ScoreRender} from "./Mock.js";

class AddressRender extends TagRender {

    static newInstance() {
        const section = document.createElement("section");
        section.dataset.type = "address";
        return section;
    }

    static selectors() {
        return ['section[data-type="address"]'];
    }

    async _enhance(element = null) {
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

    async _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }
        if (data.hasOwnProperty("sortCode")) {
            element.dataset.sortCode = data.sortCode;
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

class AccessoriesRender extends TagRender {

    static newInstance() {
        const accessories = document.createElement("span");
        accessories.dataset.type = "accessories";
        return accessories;
    }

    static selectors() {
        return ['span[data-type="accessories"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const title = document.createElement("h4");
        title.dataset.type = "title";
        title.dataset.sortCode = "0";
        element._appendChild(title);

        const container = document.createElement("span");
        container.dataset.type = "container";
        container.dataset.sortCode = "1";
        element._appendChild(container);
    }

    async _setData(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }

        const title = data.title || {};
        if (title.hasOwnProperty("multiKey")) {
            elements.title.innerText = Cell.multiMsg(title.multiKey);
            elements.title.show();
        } else if (title.hasOwnProperty("content")) {
            elements.title.innerText = title.content;
            elements.title.show();
        } else {
            elements.title.hide();
        }

        const items = data.hasOwnProperty("items") ? data.items : [];
        const itemArray = elements.container.querySelectorAll(':scope > a[data-type="banner"]');
        items.forEach((itemData, index) => {
            const model = (index < itemArray.length) ? itemArray[index] : BannerRender.newInstance();
            if (itemArray.length <= index) {
                elements.container._appendChild(model);
            }
            model.dataset.sortCode = index.toString();
            model.data = itemData;
        });
        for (let index = itemArray.length; index < itemArray.length; index++) {
            elements.container.removeChild(itemArray[index]);
        }

        if (elements.container.querySelectorAll(':scope > a[data-type="banner"]').length === 0) {
            elements.container.hide();
        } else {
            elements.container.show();
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            title: element.querySelector(':scope > h4[data-type="title"]'),
            container: element.querySelector(':scope > span[data-type="container"]')
        }
    }
}

class AttachesRender extends TagRender {

    static newInstance() {
        const attaches = document.createElement("span");
        attaches.dataset.type = "attaches";
        return attaches;
    }

    static selectors() {
        return ['span[data-type="attaches"]'];
    }

    async _enhance(element = null) {
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

    async _setData(element = null, data) {
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

class ChapterRender extends TagRender {

    static newInstance() {
        const chapter = document.createElement("section");
        chapter.dataset.type = "chapter";
        return chapter;
    }

    static selectors() {
        return ['section[data-type="chapter"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const title = document.createElement("span");
        title.dataset.type = "title";
        title.dataset.sortCode = "0";
        element.appendChild(title);

        const content = document.createElement("span");
        content.dataset.type = "content";
        content.dataset.sortCode = "1";
        element.appendChild(content);
    }

    async _setData(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (data.hasOwnProperty("title") && data.hasOwnProperty("content")) {
            elements.title.innerText = data.title;
            elements.content.innerText = data.content;
            element.show();
        } else {
            elements.title.innerText = "";
            elements.content.innerText = "";
            element.hide();
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            title: element.querySelector(':scope > span[data-type="title"]'),
            content: element.querySelector(':scope > span[data-type="content"]')
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

    static selectors() {
        return ['span[data-type="details"][data-category]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const content = document.createElement("span");
        content.dataset.type = "content";
        content.dataset.sortCode = "4";
        element.appendChild(content);

        const resources = GalleryRender.newInstance();
        resources.dataset.sortCode = "5";
        element._appendChild(resources);

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

            const accessories = document.createElement("span");
            accessories.dataset.type = "accessoriesContainer";
            accessories.dataset.sortCode = "9";
            element._appendChild(accessories);

            const commentList = CommentListElement.newInstance();
            commentList.dataset.sortCode = "10";
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

    async _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (data.hasOwnProperty("content")) {
            if (data.content instanceof Array) {
                elements.content.innerText = "";
                const selector = data.hasOwnProperty("selector") ? data.selector : "";
                const chapterArray = elements.content.querySelectorAll(':scope > section[data-type="chapter"]');
                const contentsArray = [];
                data.content.forEach((chapterData, index) => {
                    const chapter = (index < chapterArray.length) ? chapterArray[index] : ChapterRender.newInstance();
                    if (chapterArray.length <= index) {
                        elements.content._appendChild(chapter);
                        Cell.observeContent(chapter);
                    }
                    chapter.data = chapterData;
                    chapter.dataset.sortCode = index.toString();
                    if (selector.length > 0 && chapterData.hasOwnProperty("title")) {
                        chapter.generateId();
                        chapter.dataset.selector = selector;
                        contentsArray[index] = {
                            id: chapter.id,
                            title: chapterData.title
                        };
                    }
                });
                for (let index = data.content.length; index < chapterArray.length; index++) {
                    chapterArray[index].remove();
                }
                elements.content.sortChildrenBy('section[data-type="chapter"]', "data-sort-code");
                if (selector.length > 0) {
                    const contents = document.querySelector(selector);
                    if (!!contents) {
                        const itemArray = contents.querySelectorAll(':scope > span[data-id]');
                        contentsArray.forEach((contentData, index) => {
                            const item = (index < itemArray.length) ? itemArray[index] : document.createElement("span");
                            item.dataset.sortCode = index.toString();
                            item.dataset.id = contentData.id;
                            item.innerText = contentData.title;
                            if (itemArray.length <= index) {
                                contents.appendChild(item);
                            }
                            if (index === 0) {
                                item.appendClass("current");
                            }
                        })
                        for (let index = contentsArray.length; index < itemArray.length; index++) {
                            itemArray[index].remove();
                        }
                        contents.sortChildrenBy(':scope > span[data-id]', "data-sort-code")
                    }
                }
            } else {
                elements.content.innerText = data.content;
            }
            elements.content.show();
        } else {
            elements.content.hide();
        }

        elements.resources.data = data.hasOwnProperty("resources") ? data.resources : {};

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
            elements.addresses.sortChildrenBy(':scope > section[data-type="address"]', "data-sort-code");
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
                        title: prop.title,
                        value: prop.content,
                        link: prop.hasOwnProperty("link") ? prop.link : ""
                    }
                    property.innerText = ":";
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
                const itemData = (data.accessories instanceof Array) ? data.accessories : Array.of(data.accessories);
                const itemArray = elements.accessories.querySelectorAll('span[data-type="accessories"]');
                itemData.forEach((item, index) => {
                    const accessories = (index < itemArray.length) ? itemArray[index] : AccessoriesRender.newInstance();
                    if (itemArray.length <= index) {
                        elements.accessories._appendChild(accessories);
                    }
                    accessories.data = item;
                    accessories.dataset.sortCode = index.toString();
                });
                for (let index = itemData.length; index < itemArray.length; index++) {
                    elements.accessories.removeChild(itemArray[index]);
                }

                if (elements.accessories.querySelectorAll(':scope > span[data-type="accessories"]').length === 0) {
                    elements.accessories.hide();
                } else {
                    elements.accessories.show();
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
        if (element === null || !element.dataset.hasOwnProperty("category")) {
            return null;
        }
        switch (element.dataset.category.toLowerCase()) {
            case "corporate":
                return {
                    content: element.querySelector(':scope > span[data-type="content"]'),
                    resources: element.querySelector(':scope > section[data-type="gallery"]'),
                    addresses: element.querySelector(':scope > span[data-type="addresses"]')
                }
            case "message":
                return {
                    title: element.querySelector(':scope > h2'),
                    properties: element.querySelector(':scope > span[data-type="properties"]'),
                    avatar: element.querySelector(':scope > span[data-type="lazy"]'),
                    summary: element.querySelector(':scope > span[data-type="summary"]'),
                    content: element.querySelector(':scope > span[data-type="content"]'),
                    resources: element.querySelector(':scope > section[data-type="gallery"]'),
                    attaches: element.querySelector(':scope > span[data-type="attaches"]'),
                    models: {
                        title: element.querySelector(':scope > h4[data-type="modelTitle"]'),
                        container: element.querySelector(':scope > span[data-type="models"]')
                    },
                    accessories: element.querySelector(':scope > span[data-type="accessoriesContainer"]'),
                    comment: element.querySelector(':scope > comment-list > span[data-type="comment-list"]')
                }
            case "user":
                return {
                    avatar: element.querySelector(':scope > span[data-type="lazy"]'),
                    content: element.querySelector(':scope > span[data-type="content"]'),
                    resources: element.querySelector(':scope > section[data-type="gallery"]'),
                    score: element.querySelector(':scope > p[data-type="score"]')
                }
        }
        return null;
    }
}

class DetailsInfoElement extends EnhancedElement {
    _type;

    constructor(type = "") {
        super(DetailsRender);
        this._type = type;
    }

    _newElement() {
        return this._render.newInstance(this._type);
    }
}

class MessageDetailsElement extends DetailsInfoElement {
    static tagName() {
        return "message-details";
    }

    constructor() {
        super("message");
    }
}

class CorporateDetailsElement extends DetailsInfoElement {
    static tagName() {
        return "corporate-details";
    }

    constructor() {
        super("corporate");
    }
}

export {AddressRender, MessageDetailsElement, CorporateDetailsElement, DetailsRender}

(function () {
    Cell.registerRenders(AddressRender, AccessoriesRender, AttachesRender, ChapterRender, DetailsRender);
    Cell.registerComponents(MessageDetailsElement, CorporateDetailsElement);
})();