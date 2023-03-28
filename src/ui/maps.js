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

class MapElement extends BaseElement {
    constructor() {
        super();
        super._addSlot("mapContainer");
        this.containerElement = null;
        this.mapInstance = null;
    }

    renderElement(data) {
        this._renderElement(data);
    }

    connectedCallback() {
        if (this.containerElement === null) {
            this.containerElement = document.createElement("div");
            this.containerElement.setAttribute("id", "container" + Math.floor(Math.random() * 100));
            this.containerElement.setAttribute("slot", "mapContainer");
            this.appendChild(this.containerElement);
        }
    }
}

class BaiduMap extends MapElement {
    constructor() {
        super();
    }

    static tagName() {
        return "baidu-map";
    }

    _renderElement(data) {
        super._removeProgress();
        if (data.hasOwnProperty("latitude") && data.hasOwnProperty("longitude")) {
            if ((typeof BMap) !== "undefined") {
                if (this.mapInstance === null) {
                    this.mapInstance = new BMap.Map(this.containerElement.getAttribute("id"));
                    this.mapInstance.enableScrollWheelZoom(true);
                    this.mapInstance.addControl(new BMap.NavigationControl());
                    this.mapInstance.addControl(new BMap.ScaleControl());
                    this.mapInstance.addControl(new BMap.OverviewMapControl());
                }
                this.mapInstance.centerAndZoom(new BMap.Point(data.longitude, data.latitude), 15);
                this.show();
            } else {
                this.hide();
            }
        } else {
            this.hide();
        }
    }
}

class GoogleMap extends MapElement {
    constructor() {
        super();
        this._mapOptions = {
            zoom: 16,
            center: null,
            initialized: ((typeof google) !== "undefined"),
            mapTypeId: null
        };
    }

    static tagName() {
        return "google-map";
    }

    _renderElement(data) {
        super._removeProgress();
        if (this._mapOptions.initialized && data.hasOwnProperty("latitude") && data.hasOwnProperty("longitude")) {
            let mapPoint = new google.maps.LatLng(data.latitude, data.longitude);
            this._mapOptions.center = mapPoint;
            this._mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
            this.mapInstance = new google.maps.Map(this.containerElement, this.mapOptions);
            new google.maps.Marker({
                position: mapPoint,
                map: this.mapInstance
            });
            this.show();
        } else {
            this.hide();
        }
    }
}

export {BaiduMap, GoogleMap}