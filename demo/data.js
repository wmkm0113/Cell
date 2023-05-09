const multiMenuData = `{
    "url": "./index.html?lang={languageCode}",
    "items" : [
        {
            "languageCode" : "en",
            "languageName" : "English"
        },
        {
            "languageCode" : "zh_CN",
            "languageName" : "简体中文"
        },
        {
            "languageCode" : "zh_TW",
            "languageName" : "繁體中文"
        }
    ]
}`;

const categoryList = `{
    "title": "Category Name",
    "items": [
        {
            "tagName": "a",
            "textContent": "Category 1",
            "link": "#1",
            "icon": "icon-pencil"
        },
        {
            "tagName": "a",
            "textContent": "Category 2",
            "link": "#1",
            "icon": "icon-pencil"
        },
        {
            "tagName": "a",
            "textContent": "Category 3",
            "link": "#1",
            "icon": "icon-pencil"
        },
        {
            "tagName": "a",
            "textContent": "Category 4",
            "link": "#1",
            "icon": "icon-pencil"
        },
        {
            "tagName": "a",
            "textContent": "Category 5",
            "link": "#1",
            "icon": "icon-pencil"
        }
    ]
}`;

const indexTopMenuData = `{
    "data" : [
        {
            "title": "Menu 1",
            "link": "#Link1"
        },
        {
            "title": "Demo Menu",
            "items": [
                {
                    "title": "Mock Elements",
                    "link": "#mockElement"
                },
                {
                    "title": "Message List",
                    "link": "#listDemo"
                },
                {
                    "title": "Web Form",
                    "link": "#formDemo"
                },
                {
                    "title": "Message Details",
                    "link": "#detailsDemo"
                },
                {
                    "title": "Corporate Details",
                    "link": "#corpDetailsDemo"
                },
                {
                    "title": "Address Details",
                    "link": "#addressDetails"
                }
            ]
        },
        {
            "title": "Menu 3",
            "items": [
                {
                    "title": "Child Menu 1",
                    "link": "#Link3-1"
                },
                {
                    "title": "Child Menu 2",
                    "link": "#Link3-2"
                },
                {
                    "title": "Child Menu 3",
                    "link": "#Link3-3"
                }
            ]
        }
    ]
}`;

const progressBarDataNumber = `{
    "percent" : "27"
}`;

const progressBarDataDetails = `{
    "processed" : "4466304",
    "total" : "13032864"
}`;

const socialData = `{
    "textContent": "Follow Us",
    "items": [
        {
            "className": "icon icon-facebook",
            "title": "Facebook",
            "link": "#FacebookAddress"
        },
        {
            "className": "icon icon-linkedin",
            "title": "LinkedIn",
            "link": "#LinkedInAddress"
        },
        {
            "className": "icon icon-github-circle",
            "title": "Github",
            "link": "https://github.com/Nervousync"
        },
        {
            "className": "icon icon-twitter",
            "title": "Twitter",
            "link": "#TwitterAddress"
        },
        {
            "className": "icon icon-instagram",
            "title": "Instagram",
            "link": "#InstagramAddress"
        }
    ]
}`;
const listData = `{
    "id" : "listElement",
    "filter" : {
        "pageLimit" : "listLimit",
        "searchText" : "Search Button",
        "method" : "post",
        "sortType" : "sortType",
        "pageNo" : "listPage",
        "action" : "url",
        "sortBy" : "sortBy",
        "items" : [
            {
                "name" : "searchElement",
                "textContent" : "Search Input",
                "id" : "searchElement",
                "tag" : "search-input",
                "placeholder" : "Input keywords",
                "sortCode" : 10,
                "value" : "",
                "tips" : "Tips message"
            },
            {
                "endValue" : 3,
                "endName" : "endElement",
                "textContent" : "Interval Input",
                "id" : "intervalElement",
                "tag" : "number-interval-input",
                "beginValue" : 1,
                "sortCode" : 8,
                "beginName" : "beginElement",
                "tips" : "Interval Tips"
            },
            {
                "name" : "checkGroup",
                "textContent" : "Check Group",
                "id" : "checkGroup",
                "tag" : "checkbox-group",
                "sortCode" : 6,
                "value" : [ "value2", "value4" ],
                "items" : [
                    {"textButton" : "Option1", "id" : "checkbox1", "value" : "value2"},
                    {"textButton" : "Option2", "id" : "checkbox2", "value" : "value4"},
                    {"textButton" : "Option3", "id" : "checkbox3", "value" : "value6"}
                ],
                "tips" : "CheckGroup Tips"
            },
            {
                "name" : "radioGroup",
                "textContent" : "Radio Group",
                "id" : "radioGroup",
                "tag" : "radio-group",
                "sortCode" : 4,
                "value" : "value4",
                "items" : [
                    {"textButton" : "Option4", "id" : "radio1", "value" : "value2"},
                    {"textButton" : "Option5", "id" : "radio2", "value" : "value4"},
                    {"textButton" : "Option6", "id" : "radio3", "value" : "value6"}
                ],
                "tips" : "RadioGroup Tips"
            }
        ]
    },
    "statistics" :
        [
            {
                "data" : "Data 1",
                "index" : 1,
                "className" : "error",
                "id" : "statistics1",
                "title" : "Title 1"
            },
            {
                "data" : "Data 2",
                "index" : 2,
                "id" : "statistics2",
                "title" : "Title 2"
            },
            {
                "data" : "Data 3",
                "index" : 4,
                "className" : "warning",
                "id" : "statistics3",
                "title" : "Title 3",
                "link" : "#"
            },
            {
                "data" : "Data 4",
                "index" : 3,
                "id" : "statistics4",
                "title" : "Title 4"
            }
        ],
    "title" : {
        "textContent" : "Message List Title",
        "styleClass" : "view-list",
        "disableSwitch" : false
    },
    "grid" : {
        "selectName" : "identifyCode",
        "pageLimit" : 20,
        "header" : {
            "mainTitle" : "Title",
            "operatorTitle" : "Operators",
            "items" : [
                {
                    "mapKey" : "key9",
                    "width" : "10%",
                    "index" : 8,
                    "sort" : true,
                    "title" : "Column Title 9"
                },
                {
                    "mapKey" : "key8",
                    "width" : "10%",
                    "index" : 7,
                    "sort" : false,
                    "title" : "Column Title 8"
                },
                {
                    "mapKey" : "key7",
                    "width" : "10%",
                    "index" : 6,
                    "sort" : false,
                    "title" : "Column Title 7"
                },
                {
                    "mapKey" : "key6",
                    "width" : "10%",
                    "index" : 5,
                    "sort" : true,
                    "title" : "Column Title 6"
                },
                {
                    "mapKey" : "key4",
                    "width" : "10%",
                    "index" : 3,
                    "pattern" : "yyyy-MM-dd",
                    "sort" : false,
                    "title" : "Column Title 4"
                },
                {
                    "mapKey" : "key3",
                    "width" : "20%",
                    "index" : 2,
                    "sort" : true,
                    "title" : "Column Title 3"
                },
                {
                    "mapKey" : "key2",
                    "width" : "15%",
                    "index" : 0,
                    "sort" : false,
                    "title" : "Column Title 2"
                },
                {
                    "mapKey" : "key1",
                    "width" : "15%",
                    "index" : 1,
                    "sort" : false,
                    "title" : "Column Title 1"
                }
            ]
        },
        "pager" : {
            "totalPage" : 20,
            "currentPage" : 5
        },
        "itemData" : [
            {
                "elementId" : "elementId",
                "link" : "details-data.json",
                "openWindow": true,
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content",
                "score" : 4.2,
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key5" : "Column 5 Text",
                    "key6" : "Column 6 Text",
                    "key3" : "Column 3 Text",
                    "key4" : 1658958745944,
                    "key9" : "Column 9 Text",
                    "key7" : "Column 7 Text",
                    "key8" : "Column 8 Text"
                },
                "operators" : [
                    {
                        "link" : "form-data.json",
                        "index" : 3,
                        "textContent" : "Edit",
                        "title" : "Edit",
                        "icon" : "icon-pencil",
                        "openWindow": true
                    },
                    {
                        "link" : "DeleteLink",
                        "index" : 2,
                        "textContent" : "Delete",
                        "title" : "Delete",
                        "icon" : "icon-delete"
                    },
                    {
                        "link" : "MultiLink",
                        "index" : 1,
                        "textContent" : "Multilingual",
                        "title" : "Multilingual",
                        "icon" : "icon-earth"
                    }
                ],
                "avatar": {
                    "mimeType": "video/mp4",
                    "resourcePath" : "./images/demoVideo.mp4"
                },
                "identifyCode" : "1"
            },
            {
                "elementId" : "elementId",
                "score" : 3.0,
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "className" : "warning",
                "identifyCode" : "2",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "operators" : [
                    {
                        "link" : "form-data.json",
                        "index" : 3,
                        "textContent" : "Edit",
                        "title" : "Edit",
                        "icon" : "icon-pencil",
                        "openWindow": true
                    },
                    {
                        "link" : "MultiLink",
                        "index" : 1,
                        "textContent" : "Multilingual",
                        "title" : "Multilingual",
                        "icon" : "icon-earth"
                    }
                ],
                "avatar": {
                    "mimeType": "video/mp4",
                    "resourcePath" : "./images/demoVideo.mp4"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "identifyCode" : "3",
                "abstract" : "中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试中文测试",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "key4" : "1658958745944",
                "link" : "details-data.json",
                "openWindow": true,
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key5" : "Column 5 Text",
                    "key6" : "Column 6 Text",
                    "key3" : "Column 3 Text",
                    "key4" : 1658958745944,
                    "key9" : "Column 9 Text",
                    "key7" : "Column 7 Text",
                    "key8" : "Column 8 Text"
                },
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content",
                "score" : 3.2,
                "operators" : [
                    {
                        "link" : "DeleteLink",
                        "index" : 2,
                        "textContent" : "Delete",
                        "title" : "Delete",
                        "icon" : "icon-delete"
                    },
                    {
                        "link" : "MultiLink",
                        "index" : 1,
                        "textContent" : "Multilingual",
                        "title" : "Multilingual",
                        "icon" : "icon-earth"
                    }
                ],
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "identifyCode" : "4"
            },
            {
                "elementId" : "elementId",
                "score" : 3.0,
                "avatar": {
                    "mimeType": "video/mp4",
                    "resourcePath" : "./images/demoVideo.mp4"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "identifyCode" : "5",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "operators" : [
                    {
                        "link" : "form-data.json",
                        "index" : 3,
                        "textContent" : "Edit",
                        "title" : "Edit",
                        "icon" : "icon-pencil",
                        "openWindow": true
                    },
                    {
                        "link" : "DeleteLink",
                        "index" : 2,
                        "textContent" : "Delete",
                        "title" : "Delete",
                        "icon" : "icon-delete"
                    }
                ],
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "className" : "error",
                "identifyCode" : "6",
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "link" : "details-data.json",
                "openWindow": true,
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key5" : "Column 5 Text",
                    "key6" : "Column 6 Text",
                    "key3" : "Column 3 Text",
                    "key4" : 1658958745944,
                    "key9" : "Column 9 Text",
                    "key7" : "Column 7 Text",
                    "key8" : "Column 8 Text"
                },
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content",
                "score" : 4.2,
                "operators" : [
                    {
                        "link" : "form-data.json",
                        "index" : 3,
                        "textContent" : "Edit",
                        "title" : "Edit",
                        "icon" : "icon-pencil",
                        "openWindow": true
                    },
                    {
                        "link" : "DeleteLink",
                        "index" : 2,
                        "textContent" : "Delete",
                        "title" : "Delete",
                        "icon" : "icon-delete"
                    },
                    {
                        "link" : "MultiLink",
                        "index" : 1,
                        "textContent" : "Multilingual",
                        "title" : "Multilingual",
                        "icon" : "icon-earth"
                    }
                ],
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "identifyCode" : "7"
            },
            {
                "elementId" : "elementId",
                "score" : 3.0,
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "identifyCode" : "8",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "operators" : [
                    {
                        "link" : "form-data.json",
                        "index" : 3,
                        "textContent" : "Edit",
                        "title" : "Edit",
                        "icon" : "icon-pencil",
                        "openWindow": true
                    },
                    {
                        "link" : "MultiLink",
                        "index" : 1,
                        "textContent" : "Multilingual",
                        "title" : "Multilingual",
                        "icon" : "icon-earth"
                    }
                ],
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "identifyCode" : "9",
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "score" : 3.0,
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "className" : "warning",
                "identifyCode" : "10",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "score" : 3.0,
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "className" : "warning",
                "identifyCode" : "11",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "score" : 3.0,
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "className" : "warning",
                "identifyCode" : "12",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "score" : 3.0,
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "className" : "warning",
                "identifyCode" : "13",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "elementId" : "elementId",
                "score" : 3.0,
                "avatar": {
                    "mimeType": "image/jpg",
                    "resourcePath" : "./images/1.jpg"
                },
                "properties": {
                    "key1" : "Column 1 Text",
                    "key2" : "Column 2 Text",
                    "key3" : "Column 3 Text"
                },
                "link" : "details-data.json",
                "openWindow": true,
                "className" : "warning",
                "identifyCode" : "14",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            }
        ],
        "batchOperators" : [
            {
                "elementId" : "elementId",
                "link" : "ExportUrl",
                "icon" : "icon-download",
                "title" : "Export Data"
            },
            {
                "elementId" : "importId",
                "link" : "ImportUrl",
                "icon" : "icon-upload",
                "title" : "Import Data"
            }
        ]
    }
}`;

const bannerData = `{
    "title": "Banner Title",
    "resource": {
        "mimeType": "image/jpg",
        "resourcePath": "./images/slides/1.jpg"
    }
}`;

const slideData = `{
    "transitionTime": 1000,
    "openWindow" : false,
    "timeOut" : 5000,
    "slideType" : "scrollLeft",
    "items" : [
        {
            "href" : "#",
            "resource" : {
                "mimeType" : "image/jpg",
                "resourcePath" : "./images/slides/1.jpg",
                "title" : "Title 1"
            }
        },
        {
            "href" : "#",
            "resource" : {
                "mimeType" : "image/jpg",
                "resourcePath" : "./images/slides/2.jpg",
                "title" : "Title 2"
            }
        },
        {
            "href" : "#",
            "resource" : {
                "mimeType" : "image/jpg",
                "resourcePath" : "./images/slides/3.jpg",
                "title" : "Title 3"
            }
        },
        {
            "href" : "#",
            "resource" : {
                "mimeType" : "image/jpg",
                "resourcePath" : "./images/slides/4.jpg",
                "title" : "Title 4"
            }
        },
        {
            "href" : "#",
            "resource" : {
                "mimeType": "video/mp4",
                "resourcePath" : "./images/demoVideo.mp4"
            }
        }
    ]
}`;

const formData = `{
    "method": "post",
    "action": "/#",
    "title": "Form title",
    "validate": "true",
    "items": [
        {
            "tag": "property-details",
            "class": "formItem",
            "data": {
                "textContent": "Property Name",
                "value": "Property Content",
                "tips": "Tips message"
            }
        },
        {
            "tag": "select-input",
            "class": "formItem",
            "data": {
                "id": "selectElement",
                "name": "selectElement",
                "value": "4",
                "textContent": "Element label text",
                "tips": "Tips message",
                "options": [
                    {"text":"option0","value":0},{"text":"option1","value":1},
                    {"text":"option2","value":2},{"text":"option3","value":3},
                    {"text":"option4","value":4},{"text":"option5","value":5},
                    {"text":"option6","value":6},{"text":"option7","value":7},
                    {"text":"option8","value":8},{"text":"option9","value":9}
                ]
            }
        },
        {
            "tag": "textarea-input",
            "class": "formItem",
            "data": {
                "id": "textareaElement",
                "name": "textareaElement",
                "placeholder": "Placeholder string",
                "value": "Initialize value",
                "textContent": "Element label text",
                "multilingual": true,
                "language": "English",
                "reference": "Reference context",
                "tips": "Tips message"
            }
        },
        {
            "tag": "email-input",
            "class": "formItem",
            "data": {
                "id": "emailElement",
                "name": "emailElement",
                "autocomplete": "email username",
                "placeholder": "Placeholder string",
                "textContent": "Element label text",
                "verify": {
                    "type": "email"
                },
                "value": "Initialize value",
                "tips": "Tips message"
            }
        },
        {
            "tag": "password-input",
            "class": "formItem",
            "data": {
                "id": "passwordElement",
                "name": "passwordElement",
                "placeholder": "Placeholder string",
                "autocomplete": "new-password",
                "textContent": "Element label text",
                "value": "Initialize value",
                "tips": "Tips message"
            }
        },
        {
            "tag": "hidden-input",
            "class": "formItem",
            "data": {
                "id": "hiddenElement",
                "name": "hiddenElement",
                "placeholder": "Placeholder string",
                "textContent": "Element label text",
                "value": "Initialize value",
                "tips": "Tips message"
            }
        },
        {
            "tag": "text-input",
            "class": "formItem",
            "data": {
                "id": "textElement",
                "name": "textElement",
                "placeholder": "Placeholder string",
                "textContent": "Element label text",
                "value": "Initialize value",
                "multilingual": true,
                "verify": {
                    "regex": "\\\\d+",
                    "type": "luhn"
                },
                "language": "简体中文",
                "reference": "Reference context",
                "tips": "Tips message"
            }
        },
        {
            "tag": "search-input",
            "class": "formItem",
            "data": {
                "id": "searchFormElement",
                "name": "searchFormElement",
                "placeholder": "Placeholder string",
                "textContent": "Element label text",
                "value": "Initialize value",
                "tips": "Tips message"
            }
        },
        {
            "tag": "number-input",
            "class": "formItem",
            "data": {
                "id": "numberElement",
                "name": "numberElement",
                "placeholder": "Placeholder string",
                "textContent": "Element label text",
                "value": "Initialize value",
                "tips": "Tips message"
            }
        },
        {
            "tag": "number-input",
            "class": "formItem",
            "data": {
                "id": "luhnElement",
                "name": "luhnElement",
                "placeholder": "Bank card number",
                "textContent": "Bank card number",
                "error": "Bank card number invalid",
                "verify": {
                    "type": "luhn"
                },
                "tips": "Tips message"
            }
        },
        {
            "tag": "date-input",
            "class": "formItem",
            "data": {
                "id": "dateElement",
                "name": "dateElement",
                "placeholder": "Placeholder string",
                "textContent": "Element label text",
                "value": "1658958745944",
                "tips": "Tips message"
            }
        },
        {
            "tag": "time-input",
            "class": "formItem",
            "data": {
                "id": "timeElement",
                "name": "timeElement",
                "placeholder": "Placeholder string",
                "textContent": "Element label text",
                "value": "Initialize value",
                "tips": "Tips message"
            }
        },
        {
            "tag": "datetime-input",
            "class": "formItem",
            "data": {
                "id": "datetimeElement",
                "name": "datetimeElement",
                "placeholder": "Placeholder string",
                "textContent": "Element label text",
                "value": 1658958745944,
                "tips": "Tips message"
            }
        },
        {
            "tag": "number-interval-input",
            "class": "formItem",
            "data": {
                "id": "numberIntervalElement",
                "tips": "Tips message",
                "textContent": "Element label text",
                "beginName": "numberBegin",
                "beginValue": 10,
                "endName": "numberEnd",
                "endValue": 100
            }
        },
        {
            "tag": "date-interval-input",
            "class": "formItem",
            "data": {
                "id": "dateIntervalElement",
                "tips": "Tips message",
                "textContent": "Element label text",
                "beginName": "dateBegin",
                "beginValue": "1658958745944",
                "endName": "dateEnd",
                "endValue": "1658958745944"
            }
        },
        {
            "tag": "time-interval-input",
            "class": "formItem",
            "data": {
                "id": "timeIntervalElement",
                "tips": "Tips message",
                "textContent": "Element label text",
                "beginName": "timeBegin",
                "beginValue": "1658958745944",
                "endName": "timeEnd",
                "endValue": "1658958745944"
            }
        },
        {
            "tag": "datetime-interval-input",
            "class": "formItem",
            "data": {
                "id": "datetimeIntervalElement",
                "tips": "Tips message",
                "textContent": "Element label text",
                "beginName": "datetimeBegin",
                "beginValue": "1658958745944",
                "endName": "datetimeEnd",
                "endValue": "1658958745944"
            }
        },
        {
            "tag": "checkbox-group",
            "class": "formItem",
            "data": {
                "id": "checkBoxGroupElement",
                "name": "checkBoxGroupElement",
                "value": ["checkBoxValue2", "checkBoxValue3"],
                "textContent": "Element label text",
                "tips": "Tips message",
                "items": [
                    {"id" : "checkBoxButtonId1", "value" : "checkBoxValue1", "textButton" : "checkBox Content"},
                    {"id" : "checkBoxButtonId2", "value" : "checkBoxValue2", "textButton" : "checkBox Content"},
                    {"id" : "checkBoxButtonId3", "value" : "checkBoxValue3", "textButton" : "checkBox Content"},
                    {"id" : "checkBoxButtonId4", "value" : "checkBoxValue4", "textButton" : "checkBox Content"}
                ]
            }
        },
        {
            "tag": "radio-group",
            "class": "formItem",
            "data": {
                "id": "radioGroupElement",
                "name": "radioGroupElement",
                "value": "radioValue2",
                "textContent": "Element label text",
                "items": [
                    {"id" : "radioButtonId1", "value" : "radioValue1", "textButton" : "Radio Content"},
                    {"id" : "radioButtonId2", "value" : "radioValue2", "textButton" : "Radio Content"},
                    {"id" : "radioButtonId3", "value" : "radioValue3", "textButton" : "Radio Content"},
                    {"id" : "radioButtonId4", "value" : "radioValue4", "textButton" : "Radio Content"}
                ]
            }
        },
        {
            "tag": "drag-upload",
            "class": "formItem",
            "data": {
                "id": "uploadElement",
                "multipleFile": "true",
                "name": "uploadElement",
                "textContent": "Upload label text",
                "multilingual": true,
                "reference": [
                    {
                        "mimeType": "image/jpg",
                        "resourcePath": "images/1.jpg"
                    },
                    {
                        "mimeType": "image/jpg",
                        "resourcePath": "images/1.jpg"
                    }
                ],
                "tips": "Tips message"
            }
        }
    ]
}`;

const detailsData = `{
    "messageTitle": "Message Title Message Title Message Title Message Title",
    "properties": [
        {
            "textContent": "Properties1",
            "value": "Content1"
        },
        {
            "textContent": "Properties2",
            "value": "Content2"
        },
        {
            "textContent": "Properties3",
            "value": "Content3"
        }
    ],
    "avatar": {
        "resourcePath": "images/demoVideo.mp4",
        "mimeType": "video/mp4",
        "controls": true,
        "autoplay": true,
        "loop": true
    },
    "abstractMessage": "Abstract Message Abstract Message Abstract Message Abstract Message Abstract Message Abstract Message Abstract Message Abstract Message",
    "contentMessage": "Message Content Message Content Message Content Message Content Message Content Message Content Message Content Message Content Message Content Message Content Message Content Message Content Message Content Message Content",
    "resourceList": [
        {
            "mimeType": "image/jpg",
            "resourcePath": "images/slides/1.jpg"
        },
        {
            "mimeType": "image/jpg",
            "resourcePath": "images/slides/2.jpg"
        },
        {
            "mimeType": "image/jpg",
            "resourcePath": "images/slides/3.jpg"
        },
        {
            "mimeType": "image/jpg",
            "resourcePath": "images/slides/4.jpg"
        }
    ],
    "attachList": {
        "title": "Attach Files",
        "attachList": [
            {
                "resourceName": "Attach File1",
                "resourcePath": "#File1"
            },
            {
                "resourceName": "Attach File2",
                "resourcePath": "#File2"
            },
            {
                "resourceName": "Attach File3",
                "resourcePath": "#File3"
            },
            {
                "resourceName": "Attach File4",
                "resourcePath": "#File4"
            },
            {
                "resourceName": "Attach File5",
                "resourcePath": "#File5"
            }
      ]
    }
}`;

const addressData = `{
    "title" : "Address Title",
    "content" : "Room 909, Building A, Broadtec International Plaza, Chaoyang District, Beijing, China",
    "provider" : "baidu-map",
    "location" : {
        "latitude" : "40.009068571369137",
        "longitude" : "116.4790988860714"
    }
}`;

const widgetData = `{
    "linkAddress": "#widgetButton",
    "resource" : {
        "mimeType": "image/jpg",
        "resourcePath": "images/1.jpg"
    }
}`;

const corporateData = `{
    "contentInfo": "Corporate details article Corporate details article Corporate details article Corporate details article Corporate details article Corporate details article Corporate details article Corporate details article ",
    "resourceList": [
        {
            "mimeType": "image/jpg",
            "resourcePath": "images/1.jpg"
        },
        {
            "mimeType": "video/mp4",
            "resourcePath": "images/demoVideo.mp4"
        },
        {
            "mimeType": "image/jpg",
            "resourcePath": "images/1.jpg"
        },
        {
            "mimeType": "video/mp4",
            "resourcePath": "images/demoVideo.mp4"
        },
        {
            "mimeType": "image/jpg",
            "resourcePath": "images/1.jpg"
        },
        {
            "mimeType": "video/mp4",
            "resourcePath": "images/demoVideo.mp4"
        }
    ],
    "addressList": [
        {
            "title" : "Address Title 1",
            "content" : "Room 909, Building A, Broadtec International Plaza, Chaoyang District, Beijing, China",
            "provider" : "google-map",
            "location" : {
                "latitude" : "40.009068571369137",
                "longitude" : "116.4790988860714"
            }
        },
        {
            "title" : "Address Title 2",
            "content" : "Room 909, Building A, Broadtec International Plaza, Chaoyang District, Beijing, China",
            "provider" : "baidu-map",
            "location" : {
                "latitude" : "40.009068571369137",
                "longitude" : "116.4790988860714"
            }
        },
        {
            "title" : "Address Title 3",
            "content" : "Room 909, Building A, Broadtec International Plaza, Chaoyang District, Beijing, China",
            "provider" : "baidu-map",
            "location" : {
                "latitude" : "40.009068571369137",
                "longitude" : "116.4790988860714"
            }
        }
    ]
}`;

export {
    multiMenuData, categoryList, indexTopMenuData, progressBarDataNumber, progressBarDataDetails, bannerData,
    formData, listData, slideData, socialData, detailsData, addressData, widgetData, corporateData
}