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

import {GroupElement} from "./element.js";

/**
 * Mock button group
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": ["radioValue1", "radioValue2"],
 *      "textContent": "Element label text",
 *      "tips": {"content": "Tips message"},
 *      "items": [
 *          {'id' : 'radioButtonId', 'value' : 'radioValue1', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue2', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue3', 'textButton' : 'Radio Content'}
 *      ]
 * }
 *
 * Attention: "name" is required
 *
 */
class ButtonGroup extends GroupElement {
    constructor() {
        super();
    }

    static tagName() {
        return "group-button";
    }

    connectedCallback() {
        super._renderItem("mock-switch");
    }
}

/**
 * Mock checkbox group
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": ["radioValue1", "radioValue2"],
 *      "textContent": "Element label text",
 *      "tips": {"content": "Tips message"},
 *      "items": [
 *          {'id' : 'radioButtonId', 'value' : 'radioValue1', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue2', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue3', 'textButton' : 'Radio Content'}
 *      ]
 * }
 *
 * Attention: "name" is required
 *
 */
class CheckBoxGroup extends GroupElement {
    constructor() {
        super();
    }

    static tagName() {
        return "checkbox-group";
    }

    connectedCallback() {
        super._renderItem("mock-checkbox");
    }
}

/**
 * Mock radio group
 *
 * Value of attribute named "initData" is json string like:
 * {
 *      "id": "elementId",
 *      "name": "elementName",
 *      "value": "Initialize value",
 *      "textContent": "Element label text",
 *      "tips": {"content": "Tips message"},
 *      "items": [
 *          {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'},
 *          {'id' : 'radioButtonId', 'value' : 'radioValue', 'textButton' : 'Radio Content'}
 *      ]
 * }
 *
 * Attention: "name" is required
 *
 */
class RadioGroup extends GroupElement {
    constructor() {
        super();
    }

    static tagName() {
        return "radio-group";
    }

    connectedCallback() {
        super._removeProgress();
        super._renderItem("mock-radio");
    }
}

export {ButtonGroup, RadioGroup, CheckBoxGroup};