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

import {SlideType} from "../../commons/Commons.js";
import {EnhancedElement, TagRender} from "../Components.js";
import {BannerRender} from "./Enhance.js";

class SlideRender extends TagRender {

    static newInstance() {
        const slide = document.createElement("section");
        slide.dataset.type = "slide";
        return slide;
    }

    static selectors() {
        return ['section[data-type="slide"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        element.addEventListener('mouseover', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (element.dataset.hasOwnProperty("timer")) {
                window.clearInterval(element.dataset.timer.parseInt());
                delete element.dataset.timer;
            }
        });
        element.addEventListener('mouseout', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!element.dataset.hasOwnProperty("timer")) {
                const timeout = element.dataset.hasOwnProperty("timeout") ? element.dataset.timeout.parseInt() : 5000;
                element.dataset.timer = window.setInterval(() => element.slide(), timeout).toString();
            }
        });

        const sortContainer = document.createElement("span");
        sortContainer.dataset.type = "sort-container";
        element.appendChild(sortContainer);

        const slideContainer = document.createElement("span");
        slideContainer.dataset.type = "slide-container";
        element.appendChild(slideContainer);
    }

    async _setData(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }

        if (element.dataset.hasOwnProperty("timer")) {
            window.clearInterval(element.data.timer);
            delete element.dataset.timer;
        }

        if (data.hasOwnProperty("timeout")) {
            element.dataset.timeout = data.timeout.parseInt().toString();
        } else {
            element.dataset.timeout = "5000";
        }

        const openWindow = Boolean(data.openWindow);
        const transitionTime = data.hasOwnProperty("transitionTime") ? data.transitionTime.parseInt() : 0;
        const timeout = element.dataset.timeout.parseInt();
        const slideType = data.hasOwnProperty("slideType") ? SlideType[data.slideType] : SlideType.ScrollLeft;

        const items = data.hasOwnProperty("items") ? data.items.filter(item => item.hasOwnProperty("avatar")) : [];
        const sortArray = elements.sort.querySelectorAll(':scope > i');
        const slideArray = elements.slide.querySelectorAll(':scope > a[data-type="banner"]');
        if (items.length !== sortArray.length) {
            items.forEach((item, index) => {
                if (sortArray.length <= index) {
                    const sort = document.createElement("i");
                    sort.dataset.sortCode = index.toString();
                    elements.sort.appendChild(sort);
                    sort.addEventListener("click", (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        element.dataset.next = event.target.dataset.sortCode;
                        element.slide(true);
                    });
                    if (index === 0) {
                        sort.appendClass("current");
                    }
                } else {
                    if (index === 0) {
                        sortArray[index].appendClass("current");
                    }
                }
                const slide = (index < slideArray.length) ? slideArray[index] : BannerRender.newInstance();
                if (slideArray.length <= index) {
                    elements.slide._appendChild(slide);
                }
                slide.dataset.sortCode = index.toString();
                if (openWindow) {
                    slide.dataset.openWindow = "true";
                } else {
                    delete slide.dataset.openWindow;
                }
                slide.data = item;
                slide.style.transition = `all ${transitionTime}ms`;
                switch (slideType) {
                    case SlideType.ScrollLeft:
                    case SlideType.ScrollTop:
                    case SlideType.ScrollRight:
                    case SlideType.ScrollBottom:
                        slide.style.top = "0";
                        slide.style.left = "0";
                        break;
                    case SlideType.ZoomIn:
                        slide.style.scale = (index === 0) ? "1" : "0";
                        break;
                    case SlideType.ZoomOut:
                        slide.style.scale = "1";
                        break;
                    case SlideType.OpacityIn:
                        slide.style.opacity = (index === 0) ? "1" : "0";
                        break;
                    case SlideType.OpacityOut:
                        slide.style.opacity = "1";
                        break;
                }
                if (index === 0) {
                    slide.setClass("current");
                }
            });
            for (let index = items.length; index < Math.max(sortArray.length, slideArray.length); index++) {
                if (index < sortArray.length) {
                    elements.sort.removeChild(sortArray[index]);
                }
                if (index < slideArray.length) {
                    elements.slide.removeChild(slideArray[index]);
                }
            }

            element.dataset.slideType = slideType.toString();
            elements.sort.sortChildrenBy(':scope > i', "data-sort-code");
            elements.slide.sortChildrenBy(':scope > a[data-type="banner"]', "data-sort-code");
        }

        element.dataset.transitionTime = transitionTime.toString();
        element.dataset.timer = window.setInterval(() => element.slide(), timeout).toString();
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            sort: element.querySelector(':scope > span[data-type="sort-container"]'),
            slide: element.querySelector(':scope > span[data-type="slide-container"]')
        }
    }
}

export default class SlideElement extends EnhancedElement {
    static tagName() {
        return "slide-show";
    }

    constructor() {
        super(SlideRender);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._element !== null && this._element.dataset.hasOwnProperty("timer")) {
            window.clearInterval(this._element.data.timer);
            delete this._element.dataset.timer;
        }
    }
}

(function () {
    Cell.registerRenders(SlideRender);
    Cell.registerComponents(SlideElement);
})();