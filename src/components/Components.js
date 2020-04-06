/*
 * Licensed to the Nervousync Studio (NSYC) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
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
 * [New] Components Manager
 *
 */
'use strict';

import HttpClient from "../commons/HttpClient.js";

export default class ComponentsManager {
    constructor() {
        this._components = {};
    }

    init(defineUrl = "") {
        if (defineUrl.length > 0) {
            new HttpClient(defineUrl, {
                onComplete : function (_request) {
                    let _responseText = _request.responseText;
                    if (_responseText.isXml()) {
                        Array.from(_responseText.parseXml().getElementsByTagName("component"))
                            .forEach(component => {
                                if (component.textContent && component.textContent.length > 0
                                    && component.hasAttribute("name")) {
                                    Cell.Components.registerComponent(component.getAttribute("name"),
                                        component.textContent.decodeByRegExp(),
                                        (component.getAttribute("resource") === "true"));
                                }
                            });
                    } else if (_responseText.isJSON()) {
                        let _jsonObj = _responseText.parseJSON()["components"];
                        if (Array.isArray(_jsonObj)) {
                            _jsonObj.forEach(_jsonItem => {
                                if (_jsonItem.hasOwnProperty("name") && _jsonItem.hasOwnProperty("url")) {
                                    Cell.Components.registerComponent(_jsonItem["name"], _jsonItem["url"], _jsonItem["resource"]);
                                }
                            });
                        }
                    } else {
                        console.log(Cell.message("Core", "Components.Unknown"));
                    }
                }
            }).send();
        }
    }

    registerComponent(bundle, loadPath, loadResource = false) {
        if (!this._components.hasOwnProperty(bundle)) {
            this._components[bundle] = {
                loaded : false,
                bundlePath : loadPath,
                resource : loadResource
            };
        }
    }

    loadComponent(target, bundle = "", finished) {
        if (this._components.hasOwnProperty(bundle)) {
            let componentDefine = this._components[bundle];
            if (!componentDefine.loaded && componentDefine.resource) {
                Cell.loadResource(bundle);
            }
            import(componentDefine.bundlePath).then(module => {
                Reflect.set(target, bundle, module.default);
                finished = true;
            }).catch(err => {
                console.log(err.toString());
                finished = true;
            });
            return true;
        }
        return false;
    }

    loadedComponents() {
        let _result = [];
        for (let bundle in this._components) {
            _result.push(bundle);
        }
        return _result;
    }
}