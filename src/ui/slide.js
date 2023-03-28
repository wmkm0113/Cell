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
import {ResourceDetails} from "./details.js";

/**
 * Slide show element
 *
 * Value of attribute named "data" is json string like:
 * {
 *      "width": "1000px",              //  Slide width
 *      "height": "300px",              //  Slide height
 *      "transitionTime": "1000",       //  transition time, Unit time: milliseconds
 *      "openWindow": "true",           //  Open link in new window, true or false
 *      "timeOut": "5000",              //  Switch time out, Unit time: milliseconds
 *      "slideType": "opacityOut",      //  Switch type, optional value: slideLeft/slideTop/slideRight/slideBottom/zoomIn/zoomOut/opacityIn/opacityOut
 *      "items": [
 *          {
 *              "href": "link address",
 *              "imagePath": "image path",
 *              "title": "Title text"
 *          },
 *          ...
 *      ]
 * }
 */
export default class SlideShow extends BaseElement {
    constructor() {
        super();
        this._timer = null;
        this._options = {
            transitionTime: 1000,
            openWindow: false,
            timeOut: 5000,
            slideType: "scrollLeft"
        };
        Object.seal(this._options);
        super._addSlot("slide", "sort");
        this.sortElement = null;
    }

    static tagName() {
        return "slide-show";
    }

    renderElement(data) {
        this.dataset.transitionTime =
            data.transitionTime === undefined ? this.dataset.transitionTime : data.transitionTime;
        this.dataset.openWindow = data.openWindow === undefined ? this.dataset.openWindow : data.openWindow;
        this.dataset.timeOut = data.timeOut === undefined ? this.dataset.timeOut : data.timeOut;
        this.dataset.slideType = data.slideType === undefined ? this.dataset.slideType : data.slideType;
        if (data.items !== undefined) {
            this.dataset.items = JSON.stringify(data.items);
        } else {
            if (this.dataset.items === undefined) {
                this.dataset.items = "";
            }
        }
        this.renderSlides();
    }

    connectedCallback() {
        this._appendProgress();
        if (this.hasAttribute("data") && this.getAttribute("data").isJSON()) {
            this.renderElement(this.getAttribute("data").parseJSON());
        }
    }

    renderSlides() {
        if (this.dataset.items === undefined) {
            return;
        }
        if (this.sortElement === null) {
            this.sortElement = document.createElement("div");
            this.sortElement.setAttribute("slot", "sort");
            this.appendChild(this.sortElement);
        }
        if (this._timer !== null) {
            window.clearInterval(this._timer);
            this._timer = null;
        }

        let itemList = this.dataset.items;
        if (itemList.isJSON()) {
            let jsonItems = itemList.parseJSON();
            let frameElement = this.querySelector("div[slot='slide']");
            if (frameElement === null) {
                frameElement = document.createElement("div");
                frameElement.setAttribute("slot", "slide");
                this.appendChild(frameElement);
            }
            frameElement.style.width = (this.offsetWidth + "px");
            frameElement.style.height = (this.offsetHeight + "px");
            let slideElement = this.querySelector("div > div");
            if (slideElement === null) {
                slideElement = document.createElement("div");
                frameElement.appendChild(slideElement);
            }
            let existsItems = slideElement.querySelectorAll("resource-details");
            let existsDots = this.sortElement.querySelectorAll("span");
            let slideType = this.dataset.slideType === undefined ? this._options.slideType : this.dataset.slideType;
            let transitionTime = (this.dataset.transitionTime === undefined || !this.dataset.transitionTime.isNum())
                ? this._options.transitionTime
                : this.dataset.transitionTime.parseInt();
            let timeOut = (this.dataset.timeOut === undefined || !this.dataset.timeOut.isNum())
                ? this._options.timeOut
                : this.dataset.timeOut.parseInt();
            if (transitionTime > timeOut) {
                transitionTime = timeOut - 1000;
                if (transitionTime < 0) {
                    transitionTime = 0;
                }
                this.dataset.transitionTime = transitionTime.toString();
            }
            if (slideType.startsWith("scroll")) {
                if (transitionTime > 0) {
                    slideElement.style.transition = "all " + transitionTime + "ms";
                }
                if (slideType === "scrollLeft" || slideType === "scrollRight") {
                    slideElement.style.width = (jsonItems.length * 100) + "%";
                } else if (slideType === "scrollTop" || slideType === "scrollBottom") {
                    slideElement.style.height = (jsonItems.length * 100) + "%";
                }

                if (slideType === "scrollRight" || slideType === "scrollBottom") {
                    jsonItems = jsonItems.reverse();
                }
            }
            let indexValue = jsonItems.length;
            jsonItems.forEach((itemInfo, index) => {
                let slideItem;
                if (index < existsItems.length) {
                    slideItem = existsItems[index];
                } else {
                    slideItem = new ResourceDetails();
                    slideElement.appendChild(slideItem);
                    slideItem.addEventListener("click", (event) => Cell.sendRequest(event));
                }
                slideItem.style.zIndex = "" + indexValue;
                indexValue--;
                let spanElement = slideItem.querySelector("span");
                if (spanElement === null) {
                    spanElement = document.createElement("span");
                    slideItem.appendChild(spanElement);
                }
                if (this.dataset.openWindow === undefined ? this._options.openWindow : this.dataset.openWindow) {
                    slideItem.setAttribute("target", "_blank");
                } else {
                    slideItem.removeAttribute("target");
                }
                slideItem.dataset.sortIndex = index;

                switch (slideType) {
                    case "scrollTop":
                        slideElement.style.top = "0";
                        break;
                    case "scrollLeft":
                        slideElement.style.left = "0";
                        break;
                    case "scrollBottom":
                        slideElement.style.top = ((jsonItems.length - 1) * -100) + "%";
                        break;
                    case "scrollRight":
                        slideElement.style.left = ((jsonItems.length - 1) * -100) + "%";
                        break;
                    case "zoomIn":
                        slideItem.style.transform = (index === 0) ? "scale(1, 1)" : "scale(0, 0)";
                        break;
                    case "zoomOut":
                        slideItem.style.transform = "scale(1, 1)";
                        break;
                    case "opacityIn":
                        slideItem.style.opacity = (index === 0) ? "1" : "0";
                        break;
                    case "opacityOut":
                        slideItem.style.opacity = "1";
                        break;
                }

                if (transitionTime > 0) {
                    slideItem.style.transition = "all " + transitionTime + "ms";
                }
                slideItem.style.width = (this.offsetWidth + "px");
                slideItem.style.height = (this.offsetHeight + "px");
                if (!slideType.startsWith("scroll")) {
                    slideItem.style.position = "absolute";
                    slideItem.style.top = "0";
                    slideItem.style.left = "0";
                }
                slideItem.dataset.link = itemInfo.hasOwnProperty("href") ? itemInfo.href : "#";
                if (itemInfo.hasOwnProperty("resource")) {
                    slideItem.data = JSON.stringify(itemInfo.resource);
                }

                let dotItem;
                if (index < existsDots.length) {
                    dotItem = existsDots[index];
                } else {
                    dotItem = document.createElement("span");
                    this.sortElement.appendChild(dotItem);
                }
                dotItem.dataset.sortIndex = index;
                if (index === 0) {
                    dotItem.appendClass("current");
                }
            });
            if (jsonItems.length < existsItems.length) {
                for (let i = jsonItems.length; i < existsItems.length; i++) {
                    slideElement.removeChild(existsItems[i]);
                }
            }
            if (jsonItems.length < existsDots.length) {
                for (let i = jsonItems.length; i < existsDots.length; i++) {
                    this.sortElement.removeChild(existsDots[i]);
                }
            }
        }
        this.addEventListener("mouseover", this.pause);
        this.addEventListener("mouseout", this.resume);
        this.resume();
    }

    process() {
        let slideElement = this.querySelector("div > div");
        if (slideElement !== null) {
            let existsItems = this.querySelectorAll("div > div > resource-details");
            if (existsItems.length > 1) {
                let currentIndex =
                    this.dataset.index === undefined ? 0 : this.dataset.index.parseInt(), nextIndex;
                if (this.dataset.slideType.startsWith("scroll")) {
                    if ((currentIndex + 1) === existsItems.length) {
                        nextIndex = 0;
                    } else {
                        nextIndex = currentIndex + 1;
                    }
                    switch (this.dataset.slideType) {
                        case "scrollTop":
                            slideElement.style.top = (nextIndex * -100) + "%";
                            break;
                        case "scrollLeft":
                            slideElement.style.left = (nextIndex * -100) + "%";
                            break;
                        case "scrollBottom":
                            slideElement.style.top = ((existsItems.length - nextIndex - 1) * -100) + "%";
                            break;
                        case "scrollRight":
                            slideElement.style.left = ((existsItems.length - nextIndex - 1) * -100) + "%";
                            break;
                    }
                } else {
                    nextIndex = currentIndex + 1;
                    if (nextIndex === existsItems.length) {
                        nextIndex = 0;
                    }
                    if (this.dataset.slideType.endsWith("In")) {
                        this.sortIndex(nextIndex);
                    }
                    let moveItem =
                        this.dataset.slideType.endsWith("Out") ? existsItems[currentIndex] : existsItems[nextIndex];
                    if (this.dataset.slideType.endsWith("Out")) {
                        existsItems[currentIndex].show();
                        existsItems[nextIndex].show();
                    }
                    switch (this.dataset.slideType) {
                        case "zoomIn":
                            moveItem.style.transform = "scale(1, 1)";
                            break;
                        case "zoomOut":
                            moveItem.style.transform = "scale(0, 0)";
                            break;
                        case "opacityIn":
                            moveItem.style.opacity = "1";
                            break;
                        case "opacityOut":
                            moveItem.style.opacity = "0";
                            break;
                    }
                    let frameElement = this;
                    let transitionTime = this.dataset.transitionTime === undefined
                        ? this._options.transitionTime.parseInt()
                        : this.dataset.transitionTime.parseInt();
                    if (transitionTime === 0) {
                        if (this.dataset.slideType.endsWith("Out")) {
                            this.sortIndex(currentIndex);
                        }
                        this.resetItems();
                    } else {
                        window.setTimeout(function () {
                            if (frameElement.dataset.slideType.endsWith("Out")) {
                                frameElement.sortIndex(nextIndex);
                            }
                            frameElement.resetItems.apply(frameElement);
                        }, transitionTime);
                    }
                }
                this.dataset.index = nextIndex.toString();
                Array.from(this.sortElement.querySelectorAll("span"))
                    .forEach(dotElement => dotElement.removeClass("current"));
                let currentDot =
                    this.sortElement.querySelector("span[data-sort-index='" + nextIndex + "']");
                if (currentDot !== null) {
                    currentDot.appendClass("current");
                }
            }
        }
    }

    sortIndex(currentIndex) {
        let existsItems = this.querySelectorAll("div > div > resource-details");
        if (existsItems.length > 1) {
            let itemCount = existsItems.length, indexValue = itemCount;
            for (let i = 0; i < itemCount; i++) {
                let itemIndex = currentIndex + i;
                if (itemIndex >= itemCount) {
                    itemIndex -= itemCount;
                }
                existsItems[itemIndex].style.zIndex = "" + indexValue;
                indexValue--;
            }
        }
    }

    resetItems() {
        let existsItems = this.querySelectorAll("div > div > resource-details");
        if (existsItems.length > 1) {
            let currentIndex = this.dataset.index.parseInt();
            Array.from(existsItems)
                .filter(itemElement => itemElement.dataset.sortIndex !== currentIndex.toString())
                .forEach(itemElement => {
                    if (this.dataset.slideType.endsWith("Out")) {
                        itemElement.hide();
                    }
                    switch (this.dataset.slideType) {
                        case "opacityIn":
                            itemElement.style.opacity = "0";
                            break;
                        case "opacityOut":
                            itemElement.style.opacity = "1";
                            break;
                        case "zoomIn":
                            itemElement.style.transform = "scale(0, 0)";
                            break;
                        case "zoomOut":
                            itemElement.style.transform = "scale(1, 1)";
                            break;
                    }
                });
        }
    }

    pause() {
        if (this._timer !== null) {
            window.clearInterval(this._timer);
            this._timer = null;
        }
    }

    resume() {
        if (this._timer === null) {
            let existsItems = this.querySelectorAll("div > div > resource-details");
            if (existsItems.length > 1) {
                let timeOut;
                if (this.dataset.timeOut === undefined || !this.dataset.timeOut.isNum()) {
                    timeOut = this._options.timeOut;
                } else {
                    timeOut = this.dataset.timeOut.parseInt();
                }
                let frameElement = this;
                this._timer = window.setInterval(function () {
                    frameElement.process.apply(frameElement);
                }, timeOut);
            }
        }
    }
}