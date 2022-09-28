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

import {BaseElement, TipsElement} from "./element.js";
import {MessageList} from "./list.js";
import {StandardButton} from "./input.js";
import {MultilingualMenu} from "./menu.js";

class AttachFiles extends BaseElement {
    constructor() {
        super();
        super._addSlot("attachTitle", "attachList");
        this.attachTitle = null;
        this.attachList = null;
    }

    static tagName() {
        return "attach-list";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.attachTitle === null) {
            this.attachTitle = document.createElement("h3");
            this.attachTitle.setAttribute("slot", "attachTitle");
            this.appendChild(this.attachTitle);
        }
        if (this.attachList === null) {
            this.attachList = document.createElement("div");
            this.attachList.setAttribute("slot", "attachList");
            this.appendChild(this.attachList);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this._renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("title")) {
            this.attachTitle.innerHTML = data.title;
        }
        if (data.hasOwnProperty("attachList")) {
            this.attachList.clearChildNodes();
            data.attachList
                .forEach(attachInfo => {
                    if (attachInfo.hasOwnProperty("resourcePath") && attachInfo.hasOwnProperty("resourceName")) {
                        let attachElement = document.createElement("a");
                        attachElement.setAttribute("href", Cell.contextPath() + attachInfo.resourcePath);
                        attachElement.setAttribute("target", "_blank");
                        attachElement.innerText = attachInfo.resourceName;
                        this.attachList.appendChild(attachElement);
                    }
                });
        }
        if (this.attachList.querySelectorAll("a").length === 0) {
            this.hide();
        } else {
            this.show();
        }
    }
}

class MessageDetails extends BaseElement {
    constructor() {
        super();
        super._addSlot("multiMenu", "msgTitle", "properties", "avatar", "msgAbstract", "msgContent",
            "resourceList", "attachFiles", "modelList", "accessoriesList", "commentList", "tags", "operators");
        this.multiMenu = null;
        this.titleElement = null;
        this.propertyItems = null;
        this.avatarElement = null;
        this.abstractElement = null;
        this.contentElement = null;
        this.resourceElement = null;
        this.attachElement = null;
        this.modelsElement = null;
        this.accessoriesElement = null;
        this.commentList = null;
        this.tags = null;
        this.operators = null;
    }

    static tagName() {
        return "message-details";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.multiMenu === null) {
            this.multiMenu = new MultilingualMenu();
            this.multiMenu.setAttribute("slot", "multiMenu");
            this.appendChild(this.multiMenu);
        }
        if (this.titleElement === null) {
            this.titleElement = document.createElement("h1");
            this.titleElement.setAttribute("slot", "msgTitle");
            this.appendChild(this.titleElement);
        }
        if (this.propertyItems === null) {
            this.propertyItems = document.createElement("div");
            this.propertyItems.setAttribute("slot", "properties");
            this.appendChild(this.propertyItems);
        }
        if (this.avatarElement === null) {
            this.avatarElement = new ResourceDetails();
            this.avatarElement.setAttribute("slot", "avatar");
            this.appendChild(this.avatarElement);
        }
        if (this.abstractElement === null) {
            this.abstractElement = document.createElement("div");
            this.abstractElement.setClass("abstractMessage");
            this.abstractElement.setAttribute("slot", "msgAbstract");
            this.appendChild(this.abstractElement);
        }
        if (this.contentElement === null) {
            this.contentElement = document.createElement("div");
            this.contentElement.setClass("contentMessage");
            this.contentElement.setAttribute("slot", "msgContent");
            this.appendChild(this.contentElement);
        }
        if (this.resourceElement === null) {
            this.resourceElement = document.createElement("div");
            this.resourceElement.setClass("resourceList");
            this.resourceElement.setAttribute("slot", "resourceList");
            this.appendChild(this.resourceElement);
            this.resourceElement.hide();
        }
        if (this.attachElement === null) {
            this.attachElement = new AttachFiles();
            this.attachElement.setAttribute("slot", "attachFiles");
            this.appendChild(this.attachElement);
            this.attachElement.hide();
        }
        if (this.modelsElement === null) {
            this.modelsElement = new ModelList();
            this.modelsElement.setAttribute("slot", "modelList");
            this.appendChild(this.modelsElement);
            this.modelsElement.hide();
        }
        if (this.accessoriesElement === null) {
            this.accessoriesElement = new AccessoriesList();
            this.accessoriesElement.setAttribute("slot", "accessoriesList");
            this.appendChild(this.accessoriesElement);
            this.accessoriesElement.hide();
        }
        if (this.commentList === null) {
            this.commentList = new MessageList();
            this.commentList.setAttribute("slot", "commentList");
            this.appendChild(this.commentList);
            this.commentList.hide();
        }
        if (this.tags === null) {
            this.tags = document.createElement("div");
            this.tags.setAttribute("slot", "tags");
            this.appendChild(this.tags);
        }
        if (this.operators === null) {
            this.operators = document.createElement("div");
            this.operators.setAttribute("slot", "operators");
            this.appendChild(this.operators);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this._renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("multiMenu") && data.multiMenu.hasOwnProperty("url")) {
            this.multiMenu.show();
            this.multiMenu.data = JSON.stringify(data.multiMenu);
        } else {
            this.multiMenu.hide();
        }
        if (data.hasOwnProperty("messageTitle")) {
            this.titleElement.innerHTML = data.messageTitle;
        }
        if (data.hasOwnProperty("properties") && (data.properties instanceof Array)) {
            this.propertyItems.clearChildNodes();
            data.properties.forEach(propertyItem => {
                let propertyDetails = new PropertyDetails();
                this.propertyItems.appendChild(propertyDetails);
                propertyDetails.data = JSON.stringify(propertyItem);
            });
        }
        if (data.hasOwnProperty("resourcePath") && data.hasOwnProperty("mimeType")) {
            this.avatarElement.data = JSON.stringify(data);
        }
        if (data.hasOwnProperty("abstractMessage")) {
            this.abstractElement.innerHTML = data.abstractMessage;
        }
        if (data.hasOwnProperty("contentMessage")) {
            this.contentElement.innerHTML = data.contentMessage;
        }
        if (data.hasOwnProperty("resourceList")) {
            this.resourceElement.show();
            this.resourceElement.clearChildNodes();
            data.resourceList
                .filter(resourceItem => resourceItem.hasOwnProperty("resourcePath") && resourceItem.hasOwnProperty("mimeType"))
                .forEach(resourceItem => {
                    let resourceDetails = new ResourceDetails();
                    this.resourceElement.appendChild(resourceDetails);
                    resourceDetails.data = JSON.stringify(resourceItem);
            });
        }
        if (data.hasOwnProperty("attachList")) {
            this.attachElement.show();
            this.attachElement.data = JSON.stringify(data.attachList);
        }
        if (data.hasOwnProperty("modelList")) {
            this.modelsElement.show();
            this.modelsElement.data = JSON.stringify(data.modelList);
        } else {
            this.modelsElement.hide();
        }
        if (data.hasOwnProperty("accessoriesList")) {
            this.accessoriesElement.show();
            this.accessoriesElement.data = JSON.stringify(data.accessoriesList);
        } else {
            this.accessoriesElement.hide();
        }
        this.tags.clearChildNodes();
        if (data.hasOwnProperty("tagList")) {
            data.tagList.forEach(propertyItem => {
                let propertyDetails = new PropertyDetails();
                this.tags.appendChild(propertyDetails);
                propertyDetails.data = JSON.stringify(propertyItem);
            });
        }
        if (data.hasOwnProperty("commentList")) {
            this.commentList.show();
            this.commentList.data = JSON.stringify(data.commentList);
        } else {
            this.commentList.hide();
        }
        this.operators.clearChildNodes();
        if (data.hasOwnProperty("operatorList") && (data.operatorList instanceof Array)) {
            data.operatorList
                .filter(action => action.hasOwnProperty("value") && action.hasOwnProperty("link"))
                .forEach(action => {
                    let actionButton = new StandardButton();
                    this.operators.appendChild(actionButton);
                    actionButton.textContent = action.value;
                    actionButton.dataset.link = action.link;
                    if (action.hasOwnProperty("className")) {
                        actionButton.dataset.className = action.className;
                    }
                });
        }
        if (this.operators.querySelectorAll("standard-button").length === 0) {
            this.operators.hide();
        } else {
            this.operators.show();
        }
    }
}

class PropertyDetails extends BaseElement {
    constructor() {
        super();
        super._addSlot("title", "tips", "content");
        this.titleElement = null;
        this.tipsButton = null;
        this.contentElement = null;
    }

    static tagName() {
        return "property-details";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this._renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        if (this.titleElement === null) {
            this.titleElement = document.createElement("span");
            this.titleElement.setAttribute("slot", "title");
            this.appendChild(this.titleElement);
        }
        if (this.contentElement === null) {
            this.contentElement = document.createElement("span");
            this.contentElement.setAttribute("slot", "content");
            this.appendChild(this.contentElement);
            this.contentElement.addEventListener("click", (event) => Cell.sendRequest(event));
        }
        if (this.tipsButton === null) {
            this.tipsButton = new TipsElement();
            this.tipsButton.setAttribute("slot", "tips");
            this.appendChild(this.tipsButton);
        }
        if (data.hasOwnProperty("title")) {
            this.titleElement.innerText = data.title;
        }
        if (data.hasOwnProperty("content")) {
            let textContent;
            if (data.hasOwnProperty("pattern")) {
                textContent = data.hasOwnProperty("utc")
                    ? Cell.millisecondsToDate(data.content, data.pattern, data.utc)
                    : Cell.millisecondsToDate(data.content, data.pattern);
            } else {
                textContent = data.content;
            }
            this.contentElement.innerText = textContent;
        }
        if (data.hasOwnProperty("link")) {
            this.contentElement.dataset.link = data.link;
        }
        if (data.hasOwnProperty("tips")) {
            this.tipsButton.show();
            this.tipsButton.data = JSON.stringify(data.tips);
        } else {
            this.tipsButton.hide();
        }
    }
}

class ModelDetails extends BaseElement {
    constructor() {
        super();
        super._addSlot("modelPreview", "modelTitle", "modelAbstract");
        this.previewElement = null;
        this.titleElement = null;
        this.abstractElement = null;
    }

    static tagName() {
        return "model-details";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.previewElement === null) {
            this.previewElement = new ResourceDetails();
            this.previewElement.setAttribute("slot", "modelPreview");
            this.appendChild(this.previewElement);
        }
        if (this.titleElement === null) {
            this.titleElement = document.createElement("h4");
            this.titleElement.setAttribute("slot", "modelTitle");
            this.appendChild(this.titleElement);
        }
        if (this.abstractElement === null) {
            this.abstractElement = document.createElement("span");
            this.abstractElement.setAttribute("slot", "modelAbstract");
            this.appendChild(this.abstractElement);
        }
        this.dataset.link = "#";
        this.addEventListener("click", (event) => Cell.sendRequest(event));
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this._renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("identifyCode")) {
            this.setAttribute("id", data.identifyCode);
        }
        if (data.hasOwnProperty("title")) {
            this.titleElement.innerText = data.title;
        }
        if (data.hasOwnProperty("abstract")) {
            this.abstractElement.innerText = data.abstract;
        }
        if (data.hasOwnProperty("preview")) {
            this.previewElement.data = JSON.stringify(data.preview);
        }
        this.dataset.link = data.hasOwnProperty("linkAddress") ? data.linkAddress : "#";
    }
}

class ModelList extends BaseElement {
    constructor() {
        super();
        super._addSlot("listTitle", "listItems");
        this.titleElement = null;
        this.itemsElement = null;
    }

    static tagName() {
        return "model-list";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.titleElement === null) {
            this.titleElement = document.createElement("h3");
            this.titleElement.setAttribute("slot", "listTitle");
            this.appendChild(this.titleElement);
        }
        if (this.itemsElement === null) {
            this.itemsElement = document.createElement("div");
            this.itemsElement.setAttribute("slot", "listItems");
            this.appendChild(this.itemsElement);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this._renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("title")) {
            this.titleElement.innerHTML = data.title;
        }
        if (data.hasOwnProperty("items")) {
            this.itemsElement.clearChildNodes();
            if (data.items.length > 0) {
                data.items.forEach(itemInfo => {
                    if (itemInfo.hasOwnProperty("identifyCode") && itemInfo.hasOwnProperty("title")
                        && itemInfo.hasOwnProperty("abstract")) {
                        let itemElement = new ModelDetails();
                        this.itemsElement.appendChild(itemElement);
                        itemElement.data = JSON.stringify(itemInfo);
                    }
                });
            }
        }
        let itemCount = this.itemsElement.querySelectorAll("model-details").length;
        if (itemCount > 0) {
            this.show();
        } else {
            this.hide();
        }
    }
}

class AccessoriesDetails extends BaseElement {
    constructor() {
        super();
        super._addSlot("accessoriesTitle", "itemList");
        this.titleElement = null;
        this.itemsElement = null;
    }

    static tagName() {
        return "accessories-details";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.titleElement === null) {
            this.titleElement = document.createElement("h3");
            this.titleElement.setAttribute("slot", "accessoriesTitle");
            this.appendChild(this.titleElement);
        }
        if (this.itemsElement === null) {
            this.itemsElement = document.createElement("div");
            this.itemsElement.setAttribute("slot", "itemList");
            this.appendChild(this.itemsElement);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this._renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("accessoriesName")) {
            this.titleElement.innerText = data.accessoriesName;
        }
        if (data.hasOwnProperty("items")) {
            this.itemsElement.clearChildNodes();
            if (data.items.length > 0) {
                data.items.forEach(itemInfo => {
                    if (itemInfo.hasOwnProperty("resourcePath") && itemInfo.hasOwnProperty("mimeType")) {
                        let accessoriesItem = new ResourceDetails();
                        this.itemsElement.appendChild(accessoriesItem);
                        accessoriesItem.data = JSON.stringify(itemInfo);
                    }
                });
            } else {
                this.hide();
            }
        } else {
            this.hide();
        }
    }
}

class AccessoriesList extends BaseElement {
    constructor() {
        super();
        super._addSlot("accessoriesItems");
        this.accessoriesItems = null;
    }

    static tagName() {
        return "accessories-list";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.accessoriesItems === null) {
            this.accessoriesItems = document.createElement("div");
            this.accessoriesItems.setAttribute("slot", "accessoriesItems");
            this.appendChild(this.accessoriesItems);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this._renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data instanceof Array) {
            this.accessoriesItems.clearChildNodes();
            data.forEach(itemData => {
                let itemElement = new AccessoriesDetails();
                this.accessoriesItems.appendChild(itemElement);
                itemElement.data = JSON.stringify(itemData);
            });
        }
    }
}

class CorporateAddress extends BaseElement {
    constructor() {
        super();
        super._addSlot("addressTitle", "addressContent", "addressMap");
        this.titleElement = null;
        this.contentElement = null;
        this.mapElement = null;
    }

    static tagName() {
        return "corporate-address";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.titleElement === null) {
            this.titleElement = document.createElement("h4");
            this.titleElement.setAttribute("slot", "addressTitle");
            this.appendChild(this.titleElement);
        }
        if (this.contentElement === null) {
            this.contentElement = document.createElement("span");
            this.contentElement.setAttribute("slot", "addressContent");
            this.appendChild(this.contentElement);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("addressTitle") && data.hasOwnProperty("addressContent")) {
            this.titleElement.innerText = data.addressTitle;
            this.contentElement.innerText = data.addressContent;
        }
        if (data.hasOwnProperty("location") && data.location.hasOwnProperty("provider")) {
            if (this.mapElement === null) {
                this._newMap(data.location.provider);
            } else if (data.location.provider !== this.mapElement.tagName()) {
                this.removeChild(this.mapElement);
                this._newMap(data.location.provider);
            }
            this.mapElement.data = JSON.stringify(data.location);
        }
    }

    _newMap(tagName = "") {
        if (tagName.length > 0) {
            this.mapElement = document.createElement(tagName);
            this.mapElement.setAttribute("slot", "addressMap");
            this.appendChild(this.mapElement);
        }
    }
}

class CorporateDetails extends BaseElement {
    constructor() {
        super();
        super._addSlot("contentInfo", "resourceList", "addressList");
        this.contentElement = null;
        this.resourceElement = null;
        this.resourceList = null;
        this.addressElement = null;
        this.addressList = null;
    }

    static tagName() {
        return "corporate-details";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.contentElement === null) {
            this.contentElement = document.createElement("article");
            this.contentElement.setAttribute("slot", "contentInfo");
            this.appendChild(this.contentElement);
        }
        if (this.resourceElement === null) {
            this.resourceElement = document.createElement("article");
            this.resourceElement.setAttribute("slot", "resourceList");
            this.resourceList = document.createElement("div");
            this.resourceElement.appendChild(this.resourceList);
            this.appendChild(this.resourceElement);
        }
        if (this.addressElement === null) {
            this.addressElement = document.createElement("article");
            this.addressElement.setAttribute("slot", "addressList");
            this.appendChild(this.addressElement);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("contentInfo")) {
            this.contentElement.innerHTML = data.contentInfo;
        }

        if (data.hasOwnProperty("resourceList")) {
            this.resourceList.clearChildNodes();
            data.resourceList.forEach(itemData => {
                let itemElement = new ResourceDetails();
                this.resourceList.appendChild(itemElement);
                itemElement.data = JSON.stringify(itemData);
            });
            this.resourceElement.show();
        } else {
            this.resourceElement.hide();
        }
        if (data.hasOwnProperty("addressList")) {
            this.addressElement.clearChildNodes();
            data.addressList.forEach(itemData => {
                let itemElement = new CorporateAddress();
                this.addressElement.appendChild(itemElement);
                itemElement.data = JSON.stringify(itemData);
            });
            this.addressElement.show();
        } else {
            this.addressElement.hide();
        }
    }
}

class ResourceDetails extends BaseElement {
    constructor() {
        super();
        super._addSlot("image", "video", "title");
        this.imgElement = null;
        this.videoElement = null;
        this.titleElement = null;
    }

    static tagName() {
        return "resource-details";
    }

    connectedCallback() {
        if (this.imgElement === null) {
            this.imgElement = document.createElement("span");
            this.imgElement.setAttribute("slot", "image");
            this.appendChild(this.imgElement);
            this.imgElement.hide();
        }
        if (this.videoElement === null) {
            this.videoElement = document.createElement("video");
            this.videoElement.setAttribute("slot", "video");
            this.videoElement.setAttribute("controls", "");
            this.appendChild(this.videoElement);
            this.videoElement.hide();
        }
        if (this.titleElement === null) {
            this.titleElement = document.createElement("span");
            this.titleElement.setAttribute("slot", "title");
            this.appendChild(this.titleElement);
            this.titleElement.hide();
        }
        this.dataset.link = "#";
        this.addEventListener("click", (event) => Cell.sendRequest(event));
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }

    renderElement(data) {
        if (data.hasOwnProperty("resourcePath") && data.hasOwnProperty("mimeType")) {
            if (data.mimeType.startsWith("image")) {
                this.imgElement.show();
                this.imgElement.style.backgroundImage = "url('" + Cell.contextPath() + data.resourcePath + "')";
                this.videoElement.hide();
            } else {
                this.videoElement.clearChildNodes();
                let sourceElement = document.createElement("source");
                sourceElement.setAttribute("src", Cell.contextPath() + data.resourcePath);
                sourceElement.setAttribute("type", data.mimeType);
                this.videoElement.appendChild(sourceElement);
                this.videoElement.show();
                this.imgElement.hide();
            }
        }
        if (data.hasOwnProperty("title")) {
            this.titleElement.innerText = data.title;
            this.titleElement.show();
        } else {
            this.titleElement.hide();
        }
        this.dataset.link = data.hasOwnProperty("link") ? data.link : "#";
    }
}

class CorporateAbstract extends BaseElement {
    constructor() {
        super();
        super._addSlot("content", "resource");
        this.contentElement = null;
        this.resourceDetails = null;
    }

    static tagName() {
        return "corporate-abstract";
    }

    connectedCallback() {
        if (this.contentElement === null) {
            this.contentElement = document.createElement("div");
            this.contentElement.setAttribute("slot", "content");
            this.appendChild(this.contentElement);
        }
        if (this.resourceDetails === null) {
            this.resourceDetails = new ResourceDetails();
            this.resourceDetails.setAttribute("slot", "resource");
            this.appendChild(this.resourceDetails);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON())
            this.renderElement(this.getAttribute("data").parseJSON());
    }

    renderElement(data) {
        if (data === null) {
            return;
        }
        if (data.hasOwnProperty("className")) {
            this.setClass(data.className);
        }
        if (data.hasOwnProperty("id")) {
            this.setAttribute("id", data.id);
        }
        if (data.hasOwnProperty("profileAbstract")) {
            this.contentElement.innerHTML = data.profileAbstract;
        }
        if (data.hasOwnProperty("resourcePath") && data.hasOwnProperty("mimeType")) {
            this.resourceDetails.data = JSON.stringify(data);
        }
    }
}

class WidgetButton extends BaseElement {
    constructor() {
        super();
        super._addSlot("widget");
        this.linkElement = null;
        this.resourceDetails = null;
    }

    static tagName() {
        return "widget-button";
    }

    connectedCallback() {
        if (this.linkElement === null) {
            this.linkElement = document.createElement("a");
            this.linkElement.setAttribute("slot", "widget");
            this.appendChild(this.linkElement);
        }
        if (this.resourceDetails === null) {
            this.resourceDetails = new ResourceDetails();
            this.linkElement.appendChild(this.resourceDetails);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }

    renderElement(data) {
        if (data === null) {
            return;
        }
        this.linkElement.setAttribute("href", data.hasOwnProperty("linkAddress") ? data.linkAddress : "#");
        if (data.hasOwnProperty("resource")) {
            this.resourceDetails.data = JSON.stringify(data.resource);
        }
    }
}

class ContentBanner extends BaseElement {
    constructor() {
        super();
        super._addSlot("background", "title");
        this.backgroundElement = null;
        this.titleElement = null;
    }

    static tagName() {
        return "content-banner";
    }

    connectedCallback() {
        if (this.backgroundElement === null) {
            this.backgroundElement = document.createElement("span");
            this.backgroundElement.setAttribute("slot", "background");
            this.appendChild(this.backgroundElement);
        }
        if (this.titleElement === null) {
            this.titleElement = document.createElement("span");
            this.titleElement.setAttribute("slot", "title");
            this.appendChild(this.titleElement);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }

    renderElement(data) {
        if (data === null) {
            return;
        }
        if (data.hasOwnProperty("resourcePath")) {
            this.backgroundElement.style.backgroundImage = "url('" + Cell.contextPath() + data.resourcePath + "')";
        }
        if (data.hasOwnProperty("bannerTitle")) {
            this.titleElement.innerText = data.bannerTitle;
        }
    }
}

export {AttachFiles, ResourceDetails, ModelDetails, ModelList, AccessoriesDetails, AccessoriesList, MessageDetails,
    PropertyDetails, CorporateAddress, CorporateDetails, CorporateAbstract, WidgetButton, ContentBanner};