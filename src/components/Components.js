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

import * as Renders from "../render/Renders.js";

class CustomElement extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: "closed"});
        Object.defineProperty(this, "data", {
            set(data = null) {
                this._render(data);
            }
        });
    }

    static tagName() {
        return "";
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

    _render(data = {}) {
    }
}

class EnhancedElement extends CustomElement {
    constructor() {
        super();
        this._addSlot("element");
        this._element = null;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this._element === null) {
            this._element = this.newElement();
            if (this._element) {
                this._element.setAttribute("slot", "element");
                super._appendChild(this._element);
            }
        }
        if (this.dataset.hasOwnProperty("initData")) {
            const initData = this.dataset.initData;
            this._render(initData.isJSON() ? initData.parseJSON() : initData);
        } else if (this.dataset.hasOwnProperty("code")) {
            Cell._initData(this);
        }
    }

    newElement() {
    }

    _render(data) {
        if (data) {
            this._element.data = data;
        }
    }
}

class TipsElement extends EnhancedElement {
    static tagName() {
        return "tips-icon";
    }

    newElement() {
        return Renders.TipsRender.newInstance();
    }
}

class ProgressRingElement extends EnhancedElement {
    constructor() {
        super();
    }

    static tagName() {
        return "progress-ring";
    }

    newElement() {
        return Renders.ProgressRender.newInstance(true);
    }
}

class ProgressBarElement extends EnhancedElement {
    constructor() {
        super();
    }

    static tagName() {
        return "progress-bar";
    }

    newElement() {
        return Renders.ProgressRender.newInstance(false);
    }
}

class ScoreElement extends EnhancedElement {
    constructor(rate = false) {
        super();
        this._rate = rate;
    }

    static tagName() {
        return "score-element";
    }

    newElement() {
        return Renders.ScoreRender.newInstance(this._rate);
    }
}

class ResourceElement extends EnhancedElement {
    static tagName() {
        return "resource-details";
    }

    newElement() {
        return Renders.ResourcesRender.newInstance();
    }
}

class BannerElement extends EnhancedElement {
    static tagName() {
        return "link-banner";
    }

    newElement() {
        return Renders.BannerRender.newInstance();
    }
}

class ButtonElement extends EnhancedElement {
    constructor(type = "") {
        super();
        this._type = type;
    }

    static tagName() {
        return "mock-button";
    }

    newElement() {
        return Renders.MockButtonRender.newInstance(this._type);
    }
}

class ChartElement extends EnhancedElement {
    constructor(style = "") {
        super();
        this._style = style;
    }

    newElement() {
        return Renders.ChartRender.newInstance(this._style);
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

class AddressDetailsElement extends EnhancedElement {
    static tagName() {
        return "address-details";
    }

    newElement() {
        return Renders.AddressRender.newInstance();
    }
}

class MessageDetailsElement extends EnhancedElement {
    static tagName() {
        return "message-details";
    }

    newElement() {
        return Renders.DetailsRender.newInstance("message");
    }
}

class CorporateDetailsElement extends EnhancedElement {
    static tagName() {
        return "corporate-details";
    }

    newElement() {
        return Renders.DetailsRender.newInstance("corporate");
    }
}

class MultiMenuElement extends EnhancedElement {
    static tagName() {
        return "menu-multi";
    }

    newElement() {
        return Renders.MenuRender.newInstance("multi");
    }
}

class MenuElement extends EnhancedElement {
    static tagName() {
        return "menu-info";
    }

    newElement() {
        return Renders.MenuRender.newInstance("menu");
    }
}

class MessageListElement extends EnhancedElement {
    static tagName() {
        return "message-list";
    }

    newElement() {
        return Renders.GridListRender.newInstance();
    }
}

class CommentListElement extends EnhancedElement {
    static tagName() {
        return "comment-list";
    }

    newElement() {
        return Renders.CommentListRender.newInstance();
    }
}

class SocialGroupElement extends EnhancedElement {
    static tagName() {
        return "menu-social";
    }

    newElement() {
        return Renders.MenuRender.newInstance("social");
    }
}

class SlideElement extends EnhancedElement {
    static tagName() {
        return "slide-show";
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._element !== null && this._element.dataset.hasOwnProperty("timer")) {
            window.clearInterval(this._element.data.timer);
            delete this._element.dataset.timer;
        }
    }

    newElement() {
        return Renders.SlideRender.newInstance();
    }
}

class CalendarElement extends EnhancedElement {
    static tagName() {
        return "calendar-element";
    }

    newElement() {
        return Renders.CalendarRender.newInstance();
    }
}

class FormItemElement extends EnhancedElement {
    static tagName() {
        return "form-item";
    }

    newElement() {
        return Renders.FormItemRender.newInstance();
    }
}

class FormInfoElement extends EnhancedElement {
    static tagName() {
        return "form-info";
    }

    newElement() {
        return Renders.FormInfoRender.newInstance();
    }
}

class GroupItemElement extends EnhancedElement {
    static tagName() {
        return "group-item";
    }

    newElement() {
        return Renders.GroupItemRender.newInstance();
    }
}

class TabsItemElement extends EnhancedElement {
    static tagName() {
        return "tabs-item";
    }

    newElement() {
        return Renders.TabsItemRender.newInstance();
    }
}

class PropertyElement extends EnhancedElement {
    static tagName() {
        return "property-info";
    }

    newElement() {
        return Renders.PropertyRender.newInstance(true);
    }
}

export {
    CustomElement, EnhancedElement, TipsElement, ProgressRingElement, ProgressBarElement, ScoreElement, ResourceElement,
    BannerElement, ButtonElement, PieChartElement, RoseChartElement, CircleChartElement, ColumnChartElement,
    WaterfallChartElement, BarChartElement, KlineChartElement, AddressDetailsElement, MessageDetailsElement,
    CorporateDetailsElement, MultiMenuElement, MenuElement, MessageListElement, CommentListElement, SocialGroupElement,
    SlideElement, CalendarElement, FormItemElement, FormInfoElement, GroupItemElement, TabsItemElement, PropertyElement
}