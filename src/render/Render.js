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
/*
 *
 * 1.0.0
 * [New] UI Render Processor
 *
 */
'use strict';

import {FloatWindow, FloatPage, NotifyArea, MockSwitch, MockDialog, MockCheckBox, MockRadio} from "../ui/mock.js";
import {StandardButton, SubmitButton, ResetButton} from "../ui/button.js";
import {ProgressBar, ScrollBar, StarRating, StarScore} from "../ui/element.js";
import {FormItem, FormInfo} from "../ui/form.js";
import {ButtonGroup, CheckBoxGroup, RadioGroup} from "../ui/group.js";
import * as Input from "../ui/input.js";
import * as List from "../ui/list.js";
import SlideShow from "../ui/slide.js";
import SocialGroup from "../ui/social.js";
import TipsElement from "../ui/tips.js";
import {MenuElement, MenuItem} from "../ui/menu.js";

export default class UIRender {
    constructor(elements = []) {
        UIRender.init([
            FloatWindow, FloatPage, NotifyArea, MockSwitch, MockDialog, MockCheckBox, MockRadio, StandardButton,
            SubmitButton, ResetButton, ProgressBar, ScrollBar, StarRating, StarScore, FormItem, FormInfo,
            ButtonGroup, CheckBoxGroup, RadioGroup, Input.InputElement, Input.BaseInput, Input.AbstractInput,
            Input.PasswordInput, Input.HiddenInput, Input.TextInput, Input.SearchInput, Input.NumberInput,
            Input.DateInput, Input.TimeInput, Input.DateTimeInput, Input.SelectInput, Input.TextAreaInput,
            Input.NumberIntervalInput, Input.DateIntervalInput, Input.TimeIntervalInput, Input.DateTimeIntervalInput,
            Input.DragUpload, List.ListFilter, List.ListData, List.ListStatistics, List.ListTitle, List.ListRecord,
            List.RecordOperator, List.ListHeader, List.MessageList, List.PropertyItem, List.PropertyDefine,
            SlideShow, SocialGroup, TipsElement, MenuElement, MenuItem
        ]);
        UIRender.init(elements);
    }

    static init(elements = []) {
        elements.filter(element => element.tagName !== undefined && (typeof element.tagName) === "function")
            .forEach(element => {
                let tagName = element.tagName();
                if (tagName !== null) {
                    if (customElements.get(tagName) === undefined) {
                        if (Cell.developmentMode()) {
                            console.log("Register custom tag: " + tagName);
                        }
                        customElements.define(tagName, element);
                    }
                }
            });
    }

    message(type = "", message = null, confirmFunc = null) {
        if (message === null || message.length === 0) {
            return;
        }

        switch (type.toLowerCase()) {
            case "alert":
                UIRender._retrieve("mock-dialog").showMessage(type, message);
                break;
            case "confirm":
                UIRender._retrieve("mock-dialog").showMessage(type, message, confirmFunc);
                break;
            case "notify":
                UIRender._retrieve("notify-area").notify(message);
                break;
        }
    }

    static _retrieve(tagName = "") {
        if (tagName.length === 0) {
            throw Error("Unknown tag name");
        }
        let target = document.body.querySelector(tagName);
        if (target === null) {
            switch (tagName.toLowerCase()) {
                case "mock-dialog":
                    target = new MockDialog();
                    break;
                case "notify":
                    target = new NotifyArea();
                    break;
                default:
                    return null;
            }
            document.body.appendChild(target);
        }
        return target;
    }
}