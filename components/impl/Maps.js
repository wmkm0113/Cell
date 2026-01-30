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

import {TagRender} from "../Components.js";

export default class MapRender extends TagRender {

    static newInstance() {
        const map = document.createElement("div");
        map.dataset.type = "map";
        return map;
    }

    static selectors() {
        return ['div[data-type="map"]'];
    }

    async colorMode(element = null, darkMode = false) {
        if (element === null) {
            return false;
        }

        try {
            switch (element.dataset.provider) {
                case "baidu":
                    if ((typeof baidu) !== "undefined") {
                        const {Map, NavigationControl, ScaleControl, Point} = await baidu.maps.importLibrary();
                        const mapInstance = new Map(element.id);
                        mapInstance.enableScrollWheelZoom(true);
                        mapInstance.addControl(new NavigationControl());
                        mapInstance.addControl(new ScaleControl());
                        element.map = mapInstance;
                        element.map.centerAndZoom(new Point(element.dataset.longitude.parseFloat(), element.dataset.latitude.parseFloat()), 15);
                        return true;
                    }
                    break;
                case "google":
                    if ((typeof google) !== "undefined") {
                        const [{LatLng, ColorScheme}, {Map, MapTypeId}, {AdvancedMarkerElement}] =
                            await Promise.all([
                                google.maps.importLibrary("core"),
                                google.maps.importLibrary('maps'),
                                google.maps.importLibrary('marker')
                            ]);
                        const mapPoint = new LatLng(element.dataset.latitude.parseFloat(), element.dataset.longitude.parseFloat());
                        element.map = new Map(element, {
                            zoom: 16,
                            center: mapPoint,
                            initialized: true,
                            mapTypeId: MapTypeId.ROADMAP,
                            mapId: element.id,
                            colorScheme: darkMode ? ColorScheme.DARK : ColorScheme.LIGHT
                        });
                        element.marker = new AdvancedMarkerElement({
                            position: mapPoint,
                            map: element.map
                        });
                        return true;
                    }
                    break;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }
        element.id = "container" + Math.floor(Math.random() * 100).toString();
    }

    async _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        if (data.hasOwnProperty("provider") && data.hasOwnProperty("location")) {
            element.dataset.latitude = data.location.latitude.toString();
            element.dataset.longitude = data.location.longitude.toString();
            element.dataset.provider = data.provider;
            this.colorMode(element, Cell.darkMode())
                .then(result => {
                    if (result) {
                        element.show();
                    } else {
                        element.hide();
                    }
                })
                .catch(() => element.hide());
        } else {
            element.hide();
        }
    }
}

(function () {
    Cell.registerRenders(MapRender);
})();