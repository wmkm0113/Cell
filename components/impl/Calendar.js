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
import {Comment} from "../../commons/Commons.js";
import {FormItemRender} from "./Form.js";
import {PropertyRender} from "./Enhance.js";

const switchCalendar = function (event, calendar = null, current = null) {
    if (calendar !== null && calendar.dataset.switch === "true") {
        const btn = event.target;
        if (current === null || current.childList().length === 0) {
            event.preventDefault();
            event.stopPropagation();
            let dataCategory = "";
            switch (calendar.dataset.category.toLowerCase()) {
                case "year":
                    dataCategory = btn.dataset.hasOwnProperty("month") ? "month" : "year";
                    if (dataCategory === "year" && btn.matches('span[data-type="title"]')) {
                        return;
                    }
                    break;
                case "month":
                    dataCategory = btn.dataset.hasOwnProperty("category") ? btn.dataset.category : "week";
                    break;
                case "week":
                    dataCategory = btn.dataset.hasOwnProperty("category") ? btn.dataset.category : "month";
                    break;
            }
            calendar.data = {
                category: dataCategory,
                year: btn.dataset.year,
                month: btn.dataset.hasOwnProperty("month") ? btn.dataset.month : "",
                week: btn.dataset.hasOwnProperty("week") ? btn.dataset.week : "",
                weekend: calendar.dataset.hasOwnProperty("weekend") ? calendar.dataset.weekend : "true",
                beginIndex: calendar.dataset.hasOwnProperty("beginIndex") ? calendar.dataset.beginIndex : "0",
                loadLink: calendar.dataset.hasOwnProperty("loadLink") ? calendar.dataset.loadLink : ""
            }
        }
    }
}

/**
 * Chart component render
 *
 * 日历组件渲染器
 */
class CalendarRender extends TagRender {

    static newInstance() {
        const calendar = document.createElement("span");
        calendar.dataset.type = "calendar";
        return calendar;
    }

    static selectors() {
        return ['span[data-type="calendar"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.dataset.multi = "true";
        element.clearChildNodes();

        const prevBtn = document.createElement("a");
        prevBtn.href = "#";
        prevBtn.dataset.sortCode = "0";
        prevBtn.dataset.type = "previous";
        prevBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Previous);
        element.appendChild(prevBtn);
        prevBtn.addEventListener("click", (event) => switchCalendar(event, element));

        const title = document.createElement("span");
        title.dataset.type = "title";
        title.dataset.sortCode = "1";
        element.appendChild(title);
        let parent = element.parentElement;
        if (parent && parent.matches('span[data-type="content"]')) {
            title.addEventListener("click", (event) => switchCalendar(event, parent.parentElement));
        } else {
            title.addEventListener("click", (event) => switchCalendar(event, element));
        }

        const nextBtn = document.createElement("a");
        nextBtn.href = "#";
        nextBtn.dataset.sortCode = "2";
        nextBtn.dataset.type = "next";
        nextBtn.innerText = String.fromCodePoint(Comment.Icons.Pager.Next);
        element.appendChild(nextBtn);
        nextBtn.addEventListener("click", (event) => switchCalendar(event, element));

        const header = document.createElement("span");
        header.dataset.type = "header";
        header.dataset.sortCode = "3";
        element.appendChild(header);

        for (let index = 0; index < 7; index++) {
            const item = document.createElement("p");
            //  Compatible JS day of week value
            item.dataset.dayOfWeek = index === 6 ? "0" : (index + 1).toString();
            item.dataset.index = index.toString();
            item.dataset.sortCode = index.toString();
            switch (item.dataset.dayOfWeek.parseInt()) {
                case 0:
                    item.dataset.fullMultiKey = "Calendar.Sunday";
                    item.dataset.shortMultiKey = "Calendar.Sunday.Short";
                    break;
                case 1:
                    item.dataset.fullMultiKey = "Calendar.Monday";
                    item.dataset.shortMultiKey = "Calendar.Monday.Short";
                    break;
                case 2:
                    item.dataset.fullMultiKey = "Calendar.Tuesday";
                    item.dataset.shortMultiKey = "Calendar.Tuesday.Short";
                    break;
                case 3:
                    item.dataset.fullMultiKey = "Calendar.Wednesday";
                    item.dataset.shortMultiKey = "Calendar.Wednesday.Short";
                    break;
                case 4:
                    item.dataset.fullMultiKey = "Calendar.Thursday";
                    item.dataset.shortMultiKey = "Calendar.Thursday.Short";
                    break;
                case 5:
                    item.dataset.fullMultiKey = "Calendar.Friday";
                    item.dataset.shortMultiKey = "Calendar.Friday.Short";
                    break;
                case 6:
                    item.dataset.fullMultiKey = "Calendar.Saturday";
                    item.dataset.shortMultiKey = "Calendar.Saturday.Short";
                    break;
            }
            header.appendChild(item);
        }

        const content = document.createElement("span");
        content.dataset.type = "content";
        content.dataset.sortCode = "4";
        element.appendChild(content);

        this._multilingual(element);
    }

    _multilingual(element = null) {
        const elements = this._elements(element);
        elements.header.querySelectorAll(':scope > p')
            .forEach(header => {
                if (header.dataset.hasOwnProperty("fullMultiKey")) {
                    header.dataset.fullName = Cell.multiMsg(header.dataset.fullMultiKey);
                }
                if (header.dataset.hasOwnProperty("shortMultiKey")) {
                    header.dataset.shortName = Cell.multiMsg(header.dataset.shortMultiKey);
                }
            });

        if (element.dataset.category === "month" || element.dataset.category === "week") {
            switch (elements.title.dataset.month.parseInt()) {
                case 1:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.January");
                    break;
                case 2:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.February");
                    break;
                case 3:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.March");
                    break;
                case 4:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.April");
                    break;
                case 5:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.May");
                    break;
                case 6:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.June");
                    break;
                case 7:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.July");
                    break;
                case 8:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.August");
                    break;
                case 9:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.September");
                    break;
                case 10:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.October");
                    break;
                case 11:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.November");
                    break;
                case 12:
                    elements.title.dataset.monthName = Cell.multiMsg("Calendar.December");
                    break;
            }
        }

        if (element.dataset.category === "week") {
            elements.title.innerText = Cell.multiMsg("Calendar.Week", elements.title.dataset.week);
            elements.content.querySelectorAll(':scope > span')
                .forEach(day => {
                    switch (day.dataset.dayOfWeek.parseInt()) {
                        case 0:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Monday");
                            break;
                        case 1:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Tuesday");
                            break;
                        case 2:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Wednesday");
                            break;
                        case 3:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Thursday");
                            break;
                        case 4:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Friday");
                            break;
                        case 5:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Saturday");
                            break;
                        case 6:
                            day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Sunday");
                            break;
                    }
                });
        }
    }

    async _setData(element = null, data = {}) {
        if (element === null) {
            return;
        }
        const category = data.hasOwnProperty("category") ? data.category.toLowerCase() : "month";
        element.dataset.weekend = data.hasOwnProperty("weekend") ? data.weekend.toString() : "true";
        element.dataset.beginIndex = data.hasOwnProperty("beginIndex") ? data.beginIndex.toString() : "0";
        element.dataset.switch = data.hasOwnProperty("switch") ? (data.switch.toString() === "true") : "true";

        if (data.hasOwnProperty("dataLink")) {
            element.dataset.dataLink = data.dataLink;
        }
        switch (category) {
            case "week":
                this._weekCalendar(element, data);
                break;
            case "month":
                this._monthCalendar(element, data);
                break;
            case "year":
                this._yearCalendar(element, data);
                break;
        }
        this._multilingual(element);
        if (category !== "year") {
            this._loadData(element);
        }
    }

    _loadData(element = null) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (element.dataset.hasOwnProperty("dataLink") && element.dataset.dataLink.length > 0) {
            const urlAddress =
                element.dataset.dataLink.replace("{year}", elements.title.dataset.year)
                    .replace("{month}", elements.title.dataset.month)
                    .replace("{week}", elements.title.dataset.hasOwnProperty("week") ? elements.title.dataset.week : "-1");
            Cell.sendRequest(urlAddress).then(data => {
                if (data.isJSON()) {
                    const items = data.parseJSON();
                    Object.entries(items).forEach(([key, value]) => {
                        const dateArray = key.split("-");
                        if (dateArray.length === 3) {
                            const day = elements.content.querySelector(`:scope > span[data-year="${dateArray[0]}"][data-month="${dateArray[1].parseInt()}"][data-current="${dateArray[2].parseInt()}"]`)
                            if (day) {
                                this._schedule(day, value);
                            }
                        }
                    });
                }
            });
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        const elements = {
            prevBtn: element.querySelector(':scope > a[data-type="previous"]'),
            title: element.querySelector(':scope > span[data-type="title"]'),
            nextBtn: element.querySelector(':scope > a[data-type="next"]'),
            header: element.querySelector(':scope > span[data-type="header"]'),
            content: element.querySelector(':scope > span[data-type="content"]')
        }
        const switchCalendar = element.dataset.switch === "true";
        if (switchCalendar) {
            elements.prevBtn.style.visibility = "visible";
            elements.nextBtn.style.visibility = "visible";
        } else {
            elements.prevBtn.style.visibility = "hidden";
            elements.nextBtn.style.visibility = "hidden";
        }

        return elements;
    }

    _yearCalendar(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        const year = data.hasOwnProperty("year") ? data.year.parseInt() : new Date().getFullYear();
        elements.prevBtn.dataset.year = (year - 1).toString();
        elements.prevBtn.dataset.category = "year";
        delete elements.prevBtn.dataset.month;
        delete elements.prevBtn.dataset.day;
        elements.nextBtn.dataset.year = (year + 1).toString();
        elements.nextBtn.dataset.category = "year";
        delete elements.nextBtn.dataset.month;
        delete elements.nextBtn.dataset.day;
        elements.title.dataset.year = year.toString();
        delete elements.title.dataset.month;
        delete elements.title.dataset.monthName;
        elements.title.innerText = year.toString();
        elements.header.hide();

        if (element.dataset.hasOwnProperty("category") && element.dataset.category.toLowerCase() !== "year") {
            elements.content.clearChildNodes();
        }
        element.dataset.category = "year";
        const monthArray = elements.content.querySelectorAll(':scope > span');
        for (let month = 0; month < 12; month++) {
            const monthCalendar = month < monthArray.length ? monthArray[month] : CalendarRender.newInstance();
            if (monthArray.length <= month) {
                elements.content._appendChild(monthCalendar);
            }
            monthCalendar.data = {
                beginIndex: data.hasOwnProperty("beginIndex") ? data.beginIndex.toString() : "0",
                category: "month",
                year: year.toString(),
                month: (month + 1).toString()
            };
        }
    }

    _monthCalendar(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        const currentDate = new Date(),
            selectedDate = (data.hasOwnProperty("selected") && data.selected.length > 0)
                ? Date.parse(data.current).parseTime(data.hasOwnProperty("utc") ? Boolean(data.utc) : false)
                : currentDate;
        let year = currentDate.getFullYear(), month = currentDate.getMonth();
        if (data.hasOwnProperty("year") && data.hasOwnProperty("month")) {
            year = data.year.parseInt();
            month = data.month.parseInt() - 1;
        }

        elements.prevBtn.dataset.category = "month";
        if (month === 0) {
            elements.prevBtn.dataset.year = (year - 1).toString();
            elements.prevBtn.dataset.month = "12";
        } else {
            elements.prevBtn.dataset.year = year.toString();
            elements.prevBtn.dataset.month = month.toString();
        }
        delete elements.prevBtn.dataset.day;

        elements.nextBtn.dataset.category = "month";
        if (month === 11) {
            elements.nextBtn.dataset.year = (year + 1).toString();
            elements.nextBtn.dataset.month = "1";
        } else {
            elements.nextBtn.dataset.year = year.toString();
            elements.nextBtn.dataset.month = (month + 2).toString();
        }
        delete elements.nextBtn.dataset.day;

        elements.title.dataset.year = year.toString();
        elements.title.dataset.month = (month + 1).toString();
        elements.title.dataset.category = "year";
        elements.title.innerText = "";

        const dayOfWeekArray = [];
        const beginIndex = data.hasOwnProperty("beginIndex") ? data.beginIndex.parseInt() : 0;
        const headerArray = elements.header.querySelectorAll(':scope > p');
        headerArray.forEach(item => {
            const index = item.dataset.index.parseInt();
            let sortCode = index - beginIndex;
            if (sortCode < 0) {
                sortCode += 7;
            }
            item.dataset.sortCode = sortCode.toString();
            dayOfWeekArray[sortCode] = item.dataset.dayOfWeek;
        });
        elements.header.sortChildrenBy(':scope > p', "data-sort-code");
        elements.header.show();

        const firstDay = new Date(year, month, 1),
            weekOfFirstDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1,
            lastDayOfPreviousMonth = firstDay.lastDayOfPreviousMonth(),
            lastDayOfCurrentMonth = firstDay.lastDayOfCurrentMonth();
        let current, appendCount = (beginIndex === weekOfFirstDay) ? 0 : 7 - beginIndex + weekOfFirstDay;
        if (appendCount > 7) {
            appendCount -= 7;
        }
        if (appendCount === 0) {
            current = 0;
        } else {
            current = lastDayOfPreviousMonth - appendCount;
        }
        let appendLimit = lastDayOfCurrentMonth + appendCount;
        while (appendLimit % 7 !== 0) {
            appendLimit++;
        }

        if (element.dataset.hasOwnProperty("category") && element.dataset.category.toLowerCase() !== "month") {
            elements.content.clearChildNodes();
        }
        element.dataset.category = "month";
        const dayArray = elements.content.querySelectorAll(':scope > span');
        let currentMonth = month;
        if (current !== 0) {
            currentMonth--;
        }
        let parent = element.parentElement, calendar = element;
        while (parent != null) {
            if (parent.matches('span[data-type="calendar"]')) {
                calendar = parent;
            }
            parent = parent.parentElement;
        }
        for (let index = 0; index < appendLimit; index++) {
            current++;
            const day = (index < dayArray.length) ? dayArray[index] : document.createElement("span");
            if (dayArray.length <= index) {
                elements.content.appendChild(day);
                day.addEventListener("click", (event) => switchCalendar(event, calendar, day));
            }
            day.dataset.current = current.toString();
            day.dataset.dayOfWeek = dayOfWeekArray[index % 7];
            day.dataset.beginIndex = beginIndex.toString();
            day.clearChildNodes();
            if (currentMonth < 0) {
                day.dataset.year = (year - 1).toString();
                day.dataset.month = "12";
                day.dataset.week = new Date((year - 1), 11, current).weekOfYear(beginIndex).toString();
            } else if (currentMonth > 11) {
                day.dataset.year = (year + 1).toString();
                day.dataset.month = "1";
                day.dataset.week = new Date((year + 1), 0, current).weekOfYear(beginIndex).toString();
            } else {
                day.dataset.year = year.toString();
                day.dataset.month = (currentMonth + 1).toString();
                day.dataset.week = new Date(year, currentMonth, current).weekOfYear(beginIndex).toString();
            }
            if (currentMonth !== month) {
                day.removeClass("current");
                day.removeClass("selected");
                day.dataset.disabled = "true";
            } else {
                delete day.dataset.disabled;
                if (currentDate.matches(year, month, current)) {
                    day.appendClass("current");
                } else {
                    day.removeClass("current");
                }
                if (selectedDate.matches(year, month, current)) {
                    day.appendClass("selected");
                } else {
                    day.removeClass("selected");
                }
            }
            if ((currentMonth < month && current === lastDayOfPreviousMonth) || (currentMonth === month && current === lastDayOfCurrentMonth)) {
                currentMonth++;
                current = 0;
            }
            if (appendLimit < index + 7) {
                day.dataset.lastRow = "true";
            } else {
                delete day.dataset.lastRow;
            }
        }
        for (let index = appendLimit; index < dayArray.length; index++) {
            elements.content.removeChild(dayArray[index]);
        }

        //  Hidden last row if all display item is disabled
        if (data.hasOwnProperty("weekend") && data.weekend.toString().toLowerCase() === "false") {
            const checkArray = elements.content.querySelectorAll(':scope > span[data-last-row]');
            const count = Array.from(checkArray).filter(day => {
                if (day.dataset.hasOwnProperty("disabled")) {
                    return true;
                }
                const index = day.dataset.dayOfWeek.parseInt();
                return index === 0 || index === 6;
            }).length;
            if (count === checkArray.length) {
                checkArray.forEach(day => elements.content.removeChild(day));
            }
        }
    }

    _weekCalendar(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (element.dataset.hasOwnProperty("category") && element.dataset.category.toLowerCase() !== "week") {
            elements.content.clearChildNodes();
        }
        element.dataset.category = "week";
        const current = new Date(),
            year = data.hasOwnProperty("year") ? data.year.parseInt() : current.getFullYear(),
            beginIndex = data.hasOwnProperty("beginIndex") ? data.beginIndex.parseInt() : 0,
            week = data.hasOwnProperty("week") ? data.week.parseInt() : current.weekOfYear(beginIndex),
            firstDayOfYear = new Date(year, 0, 1);
        elements.prevBtn.dataset.category = "week";
        if (week === 1) {
            elements.prevBtn.dataset.year = (year - 1).toString();
            elements.prevBtn.dataset.week = new Date(year, 0, 0).weekOfYear(beginIndex).toString();
        } else {
            elements.prevBtn.dataset.year = year.toString();
            elements.prevBtn.dataset.week = (week - 1).toString();
        }

        elements.nextBtn.dataset.category = "week";
        const weekCountOfCurrentYear = new Date(year + 1, 0, 0).weekOfYear(beginIndex);
        if (week === weekCountOfCurrentYear) {
            elements.nextBtn.dataset.year = (year + 1).toString();
            elements.nextBtn.dataset.week = "1";
        } else {
            elements.nextBtn.dataset.year = year.toString();
            elements.nextBtn.dataset.week = (week + 1).toString();
        }

        const dayCount = (week - 1) * 7 - firstDayOfYear.getDay() - (7 - (beginIndex === 0 ? 7 : beginIndex)) + 1;
        let dateTimestamp = firstDayOfYear.valueOf() + dayCount * (24 * 60 * 60 * 1000);
        const month = dayCount < 0 ? firstDayOfYear.getMonth() : dateTimestamp.parseTime(true).getMonth();

        elements.title.dataset.year = year.toString();
        elements.title.dataset.month = (month + 1).toString();
        elements.title.dataset.week = week.toString();
        elements.title.dataset.category = "month";
        elements.title.innerText = Cell.multiMsg("Calendar.Week", week);

        const dayArray = elements.content.querySelectorAll(':scope > span');
        for (let index = 0; index < 7; index++) {
            const day = (index < dayArray.length) ? dayArray[index] : document.createElement("span");
            if (dayArray.length <= index) {
                elements.content.appendChild(day);
            }
            let weekOfIndex = beginIndex + index;
            if (weekOfIndex > 6) {
                weekOfIndex -= 7;
            }
            day.dataset.weekOfIndex = weekOfIndex.toString();
            switch (weekOfIndex) {
                case 0:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Monday");
                    break;
                case 1:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Tuesday");
                    break;
                case 2:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Wednesday");
                    break;
                case 3:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Thursday");
                    break;
                case 4:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Friday");
                    break;
                case 5:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Saturday");
                    break;
                case 6:
                    day.dataset.dayOfWeek = Cell.multiMsg("Calendar.Sunday");
                    break;
            }
            let date = dateTimestamp.parseTime(true);
            day.dataset.year = date.getFullYear().toString();
            day.dataset.month = (date.getMonth() + 1).toString();
            day.dataset.current = date.getDate().toString();
            if (current.matches(date.getFullYear(), date.getMonth(), date.getDate())) {
                day.setClass("current");
            } else {
                day.removeClass("current");
            }
            day.clearChildNodes();
            dateTimestamp += (24 * 60 * 60 * 1000);
        }
        for (let index = 7; index < dayArray.length; index++) {
            elements.content.removeChild(dayArray[index]);
        }
    }

    _schedule(day = null, plans = {}) {
        if (day === null || plans.length === 0) {
            return;
        }
        day.clearChildNodes();

        plans.filter(plan => plan.hasOwnProperty("tagName") && plan.hasOwnProperty("data"))
            .forEach(plan => {
                switch (plan.tagName) {
                    case "form-item":
                        const formItem = FormItemRender.newInstance();
                        day._appendChild(formItem);
                        formItem.data = plan.data;
                        break;
                    case "schedule-item":
                        const scheduleItem = ScheduleItemRender.newInstance();
                        day._appendChild(scheduleItem);
                        scheduleItem.data = plan.data;
                        break;
                }
            });
    }
}

class ScheduleItemRender extends TagRender {

    static newInstance() {
        const element = document.createElement("span");
        element.dataset.type = "schedule-item";
        return element;
    }

    static selectors() {
        return ['span[data-type="schedule-item"]'];
    }

    async _enhance(element = null) {
        if (element === null) {
            return;
        }

        element.clearChildNodes();

        const container = document.createElement("span");
        container.dataset.type = "container";
        container.dataset.sortCode = "0";
        element.appendChild(container);

        const operators = document.createElement("span");
        operators.dataset.type = "operators";
        operators.dataset.sortCode = "2";
        element.appendChild(operators);
    }

    async _setData(element = null, data = {}) {
        const elements = this._elements(element);
        if (elements === null) {
            return;
        }
        if (data.hasOwnProperty("items")) {
            const properties = elements.container.querySelectorAll(':scope > span[data-type="property"]');
            data.items.forEach((item, index) => {
                const property = (index < properties.length) ? properties[index] : PropertyRender.newInstance();
                if (properties.length <= index) {
                    elements.container._appendChild(property);
                }
                property.data = {
                    sortCode: index.toString(),
                    title: {
                        content: item.title
                    },
                    value: item.content,
                    category: item.hasOwnProperty("category") ? item.category : ""
                }
            });
            for (let index = data.items.length; index < properties.length; index++) {
                elements.container.removeChild(properties[index]);
            }
            elements.container.sortChildrenBy(':scope > span[data-type="property"]', "data-sort-code");
        }
        if (data.hasOwnProperty("operators")) {
            const operatorArray = elements.operators.querySelectorAll("a");
            data.operators
                .filter(oper => oper.hasOwnProperty("title") && oper.hasOwnProperty("link"))
                .forEach((oper, index) => {
                    const operator = (index < operatorArray.length) ? operatorArray[index] : document.createElement("a");
                    if (operatorArray.length <= index) {
                        operator.dataset.mock = "button";
                        elements.operators.appendChild(operator);
                        operator.addEventListener("click", (event) => Cell.eventRequest(event));
                    }
                    operator.innerText = oper.title;
                    operator.setAttribute("title", oper.title);
                    operator.href = oper.link;
                })
        } else {
            elements.operators.clearChildNodes();
        }
    }

    _elements(element = null) {
        if (element === null) {
            return null;
        }
        return {
            container: element.querySelector(':scope > span[data-type="container"]'),
            operators: element.querySelector(':scope > span[data-type="operators"]')
        }
    }
}

export default class CalendarElement extends EnhancedElement {
    static tagName() {
        return "calendar-element";
    }

    constructor() {
        super(CalendarRender);
    }
}

(function () {
    Cell.registerRenders(CalendarRender, ScheduleItemRender);
    Cell.registerComponents(CalendarElement);
})();