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

import {SquarePayment} from "../../commons/Commons.js";
import {TagRender} from "../Components.js";

async function renderComponent(config = SquarePayment, elementId) {
    if (elementId.length === 0 || config.AppId.length === 0 || config.LocationId.length === 0) {
        return;
    }
    if ((typeof Square) === "undefined") {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
        script.addEventListener("load", async () => await renderComponent(config, elementId));
        document.head.appendChild(script);
        return;
    }
    const component = $(elementId);
    if (!!component) {
        const card = await Square.payments(config.AppId, config.LocationId).card();
        await card.attach(component);
        const input = $(component.dataset.inputId);
        if (!!input) {
            input.card = card;
        }
    }
}

class SquarePaymentRender extends TagRender {

    _config = null;

    static newInstance() {
        const payment = document.createElement("input");
        payment.dataset.type = "square-payment";
        payment.type = "hidden";
        return payment;
    }

    static selectors() {
        return ['input[type="hidden"][data-type="square-payment"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        element.generateId();

        const component = document.createElement("div");
        component.dataset.type = "payment";
        component.dataset.inputId = element.id;
        component.generateId();
        element.after(component);

        if (this._config === null) {
            this._config = JSON.stringify(SquarePayment).parseJSON();
            Object.freeze(this._config);
        }
        await renderComponent(this._config, component.id);
    }

    async _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }

        if (data.hasOwnProperty("id") && data.id.length > 0) {
            element.id = data.id;
        } else {
            element.generateId();
        }

        if (data.hasOwnProperty("name")) {
            element.name = data.name;
        }

        const component = element.nextElementSibling;
        if (component.matches('div[data-type="payment"]')) {
            component.dataset.inputId = element.id;
        }
    }

    async _process(element = null) {
        if (element === null) {
            return;
        }
        const card = element.card;
        if (!!card) {
            const tokenResponse = await card.tokenize();
            if (tokenResponse.status === "OK") {
                element.value = tokenResponse.token;
            }
        }
    }
}

export {SquarePaymentRender}

(function () {
    Cell.registerRenders(SquarePaymentRender);
})();