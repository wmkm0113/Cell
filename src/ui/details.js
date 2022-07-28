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

import {BaseElement} from "./element.js";
import {MessageList} from "./list.js";

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
    }
}

class MessageDetails extends BaseElement {
    constructor() {
        super();
        super._addSlot("msgTitle", "msgAvatar", "msgAbstract", "msgContent", "resourceList", "attachFiles", "commentList");
        this.titleElement = null;
        this.avatarElement = null;
        this.abstractElement = null;
        this.contentElement = null;
        this.resourceElement = null;
        this.attachElement = null;
        this.commentList = null;
    }

    static tagName() {
        return "message-details";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.titleElement === null) {
            this.titleElement = document.createElement("h1");
            this.titleElement.setAttribute("slot", "msgTitle");
            this.appendChild(this.titleElement);
        }
        if (this.avatarElement === null) {
            this.avatarElement = document.createElement("span");
            this.avatarElement.setAttribute("slot", "msgAvatar");
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
        if (this.commentList === null) {
            this.commentList = new MessageList();
            this.commentList.setAttribute("slot", "commentList");
            this.appendChild(this.commentList);
            this.commentList.hide();
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this._renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("messageTitle")) {
            this.titleElement.innerHTML = data.messageTitle;
        }
        if (data.hasOwnProperty("avatarPath")) {
            this.avatarElement.style.backgroundImage = ("url('" + Cell.contextPath() + data.avatarPath + "')");
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
            data.resourceList.forEach(resourcePath => {
                let resourceItem = document.createElement("span");
                resourceItem.style.backgroundImage = "url('" + Cell.contextPath() + resourcePath + "')";
                this.resourceElement.appendChild(resourceItem);
            });
        }
        if (data.hasOwnProperty("attachList")) {
            this.attachElement.show();
            this.attachElement.data = JSON.stringify(data.attachList);
        }
        if (data.hasOwnProperty("commentEnabled") && data.commentEnabled === true) {
            this.commentList.show();
            if (data.hasOwnProperty("commentList")) {
                this.commentList.data = JSON.stringify(data.commentList);
            }
        } else {
            this.commentList.hide();
        }
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
                    if (itemInfo.hasOwnProperty("identifyCode") && itemInfo.hasOwnProperty("itemName") && itemInfo.hasOwnProperty("itemContent")) {
                        let itemElement = document.createElement("div");
                        itemElement.setAttribute("id", itemInfo.identifyCode);
                        let itemName = document.createElement("h4");
                        itemName.innerText = itemInfo.itemName;
                        itemElement.appendChild(itemName);
                        let itemContent = document.createElement("span");
                        itemContent.innerHTML = itemInfo.itemContent;
                        itemElement.appendChild(itemContent);
                        this.itemsElement.appendChild(itemElement);
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

class CategoryAccessories extends BaseElement {
    constructor() {
        super();
        super._addSlot("accessoriesTitle", "itemList");
        this.titleElement = null;
        this.itemsElement = null;
    }

    static tagName() {
        return "category-accessories";
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
        if (data.hasOwnProperty("categoryName")) {
            this.titleElement.innerText = data.categoryName;
        }
        if (data.hasOwnProperty("items")) {
            this.itemsElement.clearChildNodes();
            if (data.items.length > 0) {
                data.items.forEach(itemInfo => {
                    if (itemInfo.hasOwnProperty("linkAddress") && itemInfo.hasOwnProperty("avatarPath")
                        && itemInfo.hasOwnProperty("itemName")) {
                        let accessoriesItem = document.createElement("a");
                        accessoriesItem.setAttribute("href", itemInfo.linkAddress);
                        accessoriesItem.setAttribute("title", itemInfo.itemName);
                        let avatarElement = document.createElement("span");
                        avatarElement.setClass("avatar");
                        avatarElement.style.backgroundImage = "url('" + Cell.contextPath() + itemInfo.avatarPath + "')";
                        accessoriesItem.appendChild(avatarElement);
                        let titleElement = document.createElement("span");
                        titleElement.setClass("itemTitle");
                        titleElement.innerText = itemInfo.itemName;
                        accessoriesItem.appendChild(titleElement);
                        this.itemsElement.appendChild(accessoriesItem);
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
            let itemList = this.accessoriesItems.querySelectorAll("category-accessories"),
                existsCount = itemList.length, i = 0;
            data.forEach(itemData => {
                let itemElement;
                if (i < itemList.length) {
                    itemElement = itemList[i];
                } else {
                    itemElement = new CategoryAccessories();
                    this.accessoriesItems.appendChild(itemElement);
                }
                itemElement.data = JSON.stringify(itemData);
                i++;
            });
            while (i < existsCount) {
                this.accessoriesItems.removeChild(itemList[i]);
                i++;
            }
        }
    }
}

class CorporateAddress extends BaseElement {
    constructor() {
        super();
        super._addSlot("addressTitle", "addressContent");
        this.titleElement = null;
        this.contentElement = null;
    }

    static tagName() {
        return "corporate-address";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.titleElement === null) {
            this.titleElement = document.createElement("span");
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
    }
}

class CorporateResource extends BaseElement {
    constructor() {
        super();
        super._addSlot("resourcePreview", "resourceName");
        this.previewElement = null;
        this.contentElement = null;
    }

    static tagName() {
        return "corporate-resource";
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.previewElement === null) {
            this.previewElement = document.createElement("span");
            this.previewElement.setAttribute("slot", "resourcePreview");
            this.appendChild(this.previewElement);
        }
        if (this.contentElement === null) {
            this.contentElement = document.createElement("span");
            this.contentElement.setAttribute("slot", "resourceName");
            this.appendChild(this.contentElement);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("identifyCode")) {
            this.setAttribute("id", data.identifyCode);
        }
        if (data.hasOwnProperty("resourcePath") && data.hasOwnProperty("resourceName")) {
            this.previewElement.style.backgroundImage = ("url('" + Cell.contextPath() + data.resourcePath + "')");
            this.contentElement.innerText = data.resourceName;
        }
    }
}

class CorporateDetails extends BaseElement {
    constructor() {
        super();
        super._addSlot("contentInfo", "resourceList", "addressList");
        this.contentElement = null;
        this.resourceElement = null;
        this.resourceTitle = null;
        this.resourceList = null;
        this.addressElement = null;
        this.addressTitle = null;
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
            if (this.resourceTitle === null) {
                this.resourceTitle = document.createElement("h2");
            }
            this.resourceElement.appendChild(this.resourceTitle);
            this.resourceList = document.createElement("div");
            this.resourceElement.appendChild(this.resourceList);
            this.appendChild(this.resourceElement);
        }
        if (this.addressElement === null) {
            this.addressElement = document.createElement("article");
            this.addressElement.setAttribute("slot", "addressList");
            if (this.addressTitle === null) {
                this.addressTitle = document.createElement("h2");
            }
            this.addressElement.appendChild(this.addressTitle);
            this.addressList = document.createElement("div");
            this.addressElement.appendChild(this.addressList);
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
            let resourceData = data.resourceList;
            if (resourceData.hasOwnProperty("title")) {
                this.resourceTitle.innerText = resourceData.title;
            }
            let itemCount = resourceData.hasOwnProperty("items") ? resourceData.items.length : 0;
            if (itemCount === 0) {
                this.resourceElement.hide();
            } else {
                let itemList = this.resourceList.querySelectorAll("corporate-resource"),
                    existsCount = itemList.length, i = 0;
                resourceData.items.forEach(itemData => {
                    let itemElement;
                    if (i < itemList.length) {
                        itemElement = itemList[i];
                    } else {
                        itemElement = new CorporateResource();
                        this.resourceList.appendChild(itemElement);
                    }
                    itemElement.data = JSON.stringify(itemData);
                    i++;
                });
                while (i < existsCount) {
                    this.resourceList.removeChild(itemList[i]);
                    i++;
                }
                this.resourceElement.show();
            }
        }
        if (data.hasOwnProperty("addressList")) {
            let addressData = data.addressList;
            if (addressData.hasOwnProperty("title")) {
                this.addressTitle.innerText = addressData.title;
            }
            let itemCount = addressData.hasOwnProperty("items") ? addressData.items.length : 0;
            if (itemCount === 0) {
                this.addressElement.hide();
            } else {
                let itemList = this.addressList.querySelectorAll("corporate-address"),
                    existsCount = itemList.length, i = 0;
                addressData.items.forEach(itemData => {
                    let itemElement;
                    if (i < itemList.length) {
                        itemElement = itemList[i];
                    } else {
                        itemElement = new CorporateAddress();
                        this.addressList.appendChild(itemElement);
                    }
                    itemElement.data = JSON.stringify(itemData);
                    i++;
                });
                while (i < existsCount) {
                    this.addressList.removeChild(itemList[i]);
                    i++;
                }
                this.addressElement.show();
            }
        }
    }
}

class CorporateAbstract extends BaseElement {
    constructor() {
        super();
        super._addSlot("content", "image", "video");
        this.contentElement = null;
        this.imgElement = null;
        this.videoElement = null;
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
        if (this.imgElement === null) {
            this.imgElement = document.createElement("span");
            this.imgElement.setAttribute("slot", "image");
            this.appendChild(this.imgElement);
        }
        if (this.videoElement === null) {
            this.videoElement = document.createElement("video");
            this.videoElement.setAttribute("slot", "video");
            this.appendChild(this.videoElement);
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
    }
}

class WidgetButton extends BaseElement {
    constructor() {
        super();
        super._addSlot("widget");
        this.linkElement = null;
        this.imgElement = null;
        this.videoElement = null;
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
        if (this.imgElement === null) {
            this.imgElement = document.createElement("span");
            this.linkElement.appendChild(this.imgElement);
        }
        if (this.videoElement === null) {
            this.videoElement = document.createElement("video");
            this.videoElement.setAttribute("slot", "video");
            this.linkElement.appendChild(this.videoElement);
        }
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON())
            this.renderElement(this.getAttribute("data").parseJSON());
    }

    renderElement(data) {
        if (data === null) {
            return;
        }
        this.linkElement.setAttribute("href",
            data.hasOwnProperty("linkAddress") ? data.linkAddress : "#");
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
    }
}

class ContentBanner extends BaseElement {
    constructor() {
        super();
        super._addSlot("title");
        this.titleElement = null;
    }

    static tagName() {
        return "content-banner";
    }

    connectedCallback() {
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
            this.style.backgroundImage = "url('" + Cell.contextPath() + data.resourcePath + "')";
        }
        if (data.hasOwnProperty("bannerTitle")) {
            this.titleElement.innerText = data.bannerTitle;
        }
    }
}

export {AttachFiles, MessageDetails, ModelList, CategoryAccessories, AccessoriesList,
    CorporateAddress, CorporateResource, CorporateDetails, CorporateAbstract, WidgetButton, ContentBanner};