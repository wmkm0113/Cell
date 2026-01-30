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
import CalendarElement from "./Calendar.js";
import {ResourcesRender, PropertyRender} from "./Enhance.js";
import {TipsRender} from "./Mock.js";
import {SquarePaymentRender} from "./Payments.js";
import {Comment, DragUpload} from "../../commons/Commons.js";

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

class PasswordRender extends TagRender {

    static newInstance() {
        const input = document.createElement("input");
        input.dataset.type = "password";
        input.type = "password";
        return input;
    }

    static selectors() {
        return ['input[type="password"]'];
    }

    async _enhance(element = null) {
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

    async _setData(element = null, data = "") {
        if (element === null || data.length === 0) {
            return;
        }
        const label = element.parentElement.querySelector(':scope > label');
        if (label) {
            label.setAttribute("for", data);
        }
    }

    async _process(element = null) {
        if (element === null) {
            return;
        }
        await Cell.digest(element.value)
            .then(encResult => {
                element.value = encResult
                element.dataset.encResult = encResult;
            });
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

    static selectors() {
        return ['span[data-category="group"]'];
    }

    async _setData(element = null, data = {}) {
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

    static selectors() {
        return ['span[data-category="interval"]'];
    }

    async _enhance(element = null) {
        element.clearChildNodes();
        element._appendChild(this._newInput("begin", "0"));
        const connector = document.createElement("span");
        connector.innerText = Comment.Icons.Connector;
        connector.dataset.sortCode = "1";
        element._appendChild(connector);
        element._appendChild(this._newInput("end", "2"));
    }

    async _setData(element = null, data = {}) {
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

    static selectors() {
        return ['input[type="file"][data-type="drag"]'];
    }

    async _enhance(element = null) {
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

    async _setData(element = null, data = {}) {
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

    static selectors() {
        return ['span[data-type="group-item"]'];
    }

    async _enhance(element = null) {
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

    async _setData(element = null, data = {}) {
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

    static selectors() {
        return ['span[data-type="tabs-item"]'];
    }

    async _enhance(element = null) {
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

    async _setData(element = null, data = {}) {
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

    static selectors() {
        return ['span[data-type="array-item"]'];
    }

    async _enhance(element = null) {
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

    async _setData(element = null, data = {}) {
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

    static selectors() {
        return ['span[data-type="form-item"]'];
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

    async _setData(element = null, data = {}) {
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
                case "timestamp":
                case "price":
                    component.data = {
                        category: data.category || "",
                        value: data.value || ""
                    }
                    break;
                default:
                    component.data = data.value || {};
                    break;
            }
        } else {
            if (data.type.toLowerCase() === "square-payment") {
                component.data = {
                    id: data.hasOwnProperty("id") ? data.id : "",
                    name: data.hasOwnProperty("name") ? data.name : "",
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
                        const value = data.value || "";
                        component.innerHTML = value.decodeByRegExp();
                        break;
                    case "property":
                        component.data = {
                            title: {
                                multiKey: data.multiKey || ""
                            },
                            category: data.category || "",
                            pattern: data.pattern || "",
                            value: data.value || ""
                        }
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
        await Cell.multilingual(element);
    }

    _component(category = "", type = "", exist = null) {
        if (category.length > 0) {
            let selector;
            switch (category) {
                case "drag":
                    selector = 'input[data-category="drag"][type="file"]';
                    break;
                case "custom":
                    selector = `span[data-type="${type}"]`;
                    break;
                case "interval":
                    selector = `span[data-category="interval"]`;
                    break;
                default:
                    selector = `span[data-category="${category}"][data-type="${type}"]`;
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
                    case "square-payment":
                        return SquarePaymentRender.newInstance();
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
                                return CalendarElement.newInstance();
                            case "tabs-item":
                                return TabsItemElement.newInstance();
                            case "group-item":
                                return GroupItemElement.newInstance();
                        }
                        break;
                    case "timestamp":
                    case "price":
                        return PropertyRender.newInstance();
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
            case "square-payment":
                component = SquarePaymentRender.newInstance();
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

    static selectors() {
        return ['form[data-type="form"]'];
    }

    async _enhance(element = null) {
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
        submitBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.target.dataset.hasOwnProperty("intervalTime")) {
                event.target.countDown();
            }
            await Cell.submitForm(element);
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
        await Cell.multilingual(element);
    }

    async _setData(element = null, data = {}) {
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
        await Cell.multilingual(element);
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

class FormInfoElement extends EnhancedElement {
    static tagName() {
        return "form-info";
    }

    constructor() {
        super(FormInfoRender);
    }
}

class GroupItemElement extends EnhancedElement {
    static tagName() {
        return "group-item";
    }

    constructor() {
        super(GroupItemRender);
    }
}

class TabsItemElement extends EnhancedElement {
    static tagName() {
        return "tabs-item";
    }

    constructor() {
        super(TabsItemRender);
    }
}

export {FormInfoElement, FormItemRender, GroupItemElement, TabsItemElement};

(function () {
    Cell.registerRenders(PasswordRender, InputGroupRender, IntervalRender, DragUploadRender, GroupItemRender, TabsItemRender, ArrayItemRender, FormItemRender, FormInfoRender);
    Cell.registerComponents(FormInfoElement, GroupItemElement, TabsItemElement);
})();