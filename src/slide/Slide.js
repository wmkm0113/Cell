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
 * 1.0.0
 * [New] Images/Videos Slide
 */
'use strict';

class Slide {
    constructor(element) {
        this._options = {
            openWindow : Boolean(element.dataset.openWindow),
            timeOut : parseInt(element.dataset.timeout),
            slideType : element.dataset.slideType
        };
        this._element = element;
        this._element.dataset.currentIndex = "0";
        this._interval = setInterval(this.process, this._options.timeOut);
        let _elementList = this._element.getElementsByTagName("a"), _length = _elementList.length, i;
        if (_length > 1) {
            switch (this._options.slideType) {
                case "Scroll":
                    this._element.addEvent("mouseover", this.pause);
                    this._element.addEvent("mouseout", this.resume);
                    break;
                case "Zoom":
                    for (i = 0 ; i < _length ; i++) {
                        _elementList[i].style.transform = (i === 0) ? "scale(1, 1)" : "scale(0, 0)";
                        _elementList[i].style.transition = "all 1s";
                        _elementList[i].style.zIndex = "-1";
                    }
                    break;
                case "Opacity":
                    for (i = 0 ; i < _length ; i++) {
                        _elementList[i].style.opacity = (i === 0) ? "1" : "0";
                        _elementList[i].style.transition = "all 1s";
                        _elementList[i].style.zIndex = "-1";
                    }
                    break;
            }
            this._element.addEvent("", Slide.eventProcess(this, true));
            this._element.addEvent("", Slide.eventProcess(this, false));
        }
    }

    pause() {
        clearInterval(this._interval);
    }

    resume() {
        this._interval = setInterval(this.process, this._options.timeOut);
    }

    static eventProcess(slide, next) {
        return function() {
            slide.process(next);
        }
    }

    process(next = true) {
        if (this._element.dataset.currentIndex !== undefined) {
            let _elementList = this._element.getElementsByTagName("a"), _length = _elementList.length;
            if (_length > 1) {
                let _currentIndex = this._element.dataset.currentIndex.parseInt(),
                    _nextIndex = _currentIndex + next ? 1 : -1;
                if (_nextIndex === _length) {
                    _nextIndex = 0;
                }
                _elementList[_nextIndex].style.zIndex = "0";
                switch (this._options.slideType) {
                    case "Scroll":
                        _elementList[_nextIndex].scrollIntoView();
                        break;
                    case "Zoom":
                        _elementList[_currentIndex].style.transform = "scale(0, 0)";
                        _elementList[_nextIndex].style.transform = "scale(1, 1)";
                        break;
                    case "Opacity":
                        _elementList[_currentIndex].style.opacity = "0";
                        _elementList[_nextIndex].style.opacity = "1";
                        break;
                }
                _elementList[_nextIndex].style.zIndex = "-1";
                this._element.dataset.currentIndex = _nextIndex.toString();
            }
        }
    }
}

(function () {
    if (typeof window.Cell === "undefined") {
        throw new Error("Undefined Cell");
    }
    Cell.Render.registerUIProcessor("*[data-slide='true']", function (element) {
        new Slide(element).process();
    });
})();