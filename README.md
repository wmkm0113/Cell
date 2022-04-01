# Cell
The Simple and High Performance Progressive JavaScript Framework Using ECMAScript6.

## menu-element
Data Format:
```
{
    "data": 
    [
        {
            "title": "Menu 1",
            "link": "Link address"
        },
        {
            "title": "Menu 2",
            "icon": "icon class name",
            "items": [
                {
                    "title": "Child Menu 1",
                    "icon": "icon class name",
                    "link": "Link address"
                },
                {
                    "title": "Child Menu 2",
                    "icon": "icon class name",
                    "link": "Link address"
                },
                {
                    "title": "Child Menu 3",
                    "icon": "icon class name",
                    "link": "Link address"
                }
            ]
        },
        {
            "title": "Menu 3",
            "icon": "icon class name",
            "items": [
                {
                    "title": "Child Menu 1",
                    "icon": "icon class name",
                    "link": "Link address"
                },
                {
                    "title": "Child Menu 2",
                    "icon": "icon class name",
                    "link": "Link address"
                },
                {
                    "title": "Child Menu 3",
                    "icon": "icon class name",
                    "link": "Link address"
                }
            ]
        }
        ...
    ]
}
```

## social-group
```
{
    "textContent": "Follow Us",
    "items": [
        {
            "className": "amazon-btn",
            "title": "Amazon",
            "link": "Link Address"
        },
        {
            "className": "dropbox-btn",
            "title": "Dropbox",
            "link": "Link Address"
        },
        {
            "className": "google-btn",
            "title": "Google",
            "link": "Link Address"
        }
        ...
    ]
}
```

## slide-show
slideType option: slideLeft/slideTop/slideRight/slideBottom/zoomIn/zoomOut/opacityIn/opacityOut
```
{
    "width": "100%",
    "height": "500px",
    "transitionTime": "1000",
    "openWindow": "true",
    "timeOut": "5000",
    "slideType": "opacityOut",
    "items": 
    [
        {
            "imagePath": "Image path", 
            "href" : "Link Address",
            "title": "Title Content"
        },
        {
            "imagePath": "Image path", 
            "href" : "Link Address",
            "title": "Title Content"
        },
        {
            "imagePath": "Image path", 
            "href" : "Link Address",
            "title": "Title Content"
        },
        {
            "imagePath": "Image path", 
            "href" : "Link Address",
            "title": "Title Content"
        }
        ...
    ]
}
```

## message-list
```
{
    "filter" :
    {
        "pageLimit" : "pageLimit",
        "searchText" : "Search Button",
        "method" : "post",
        "sortType" : "sortType",
        "pageNo" : "pageNo",
        "action" : "url",
        "sortBy" : "sortBy",
        "id" : "elementId",
        "items" : [
            {
                "name" : "searchElement",
                "textContent" : "Search Input",
                "id" : "searchElement",
                "tag" : "search-input",
                "placeholder" : "Input keywords",
                "sortCode" : 10,
                "value" : "",
                "tips" :
                {
                    "content" : "Tips message"
                }
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
                "tips" : {
                    "content" : "Interval Tips"
                }
            },
            {
                "name" : "checkGroup",
                "textContent" : "Check Group",
                "id" : "checkGroup",
                "tag" : "checkbox-group",
                "sortCode" : 6,
                "value" : [ "value2", "value4" ],
                "items" : [
                    {
                "textButton" : "Option1",
                "id" : "checkbox1",
                "value" : "value2"
                    },
                    {
                "textButton" : "Option2",
                "id" : "checkbox2",
                "value" : "value4"
                    },
                    {
                "textButton" : "Option3",
                "id" : "checkbox3",
                "value" : "value6"
                    }
                ],
                "tips" :
                {
                    "content" : "CheckGroup Tips"
                }
            },
            {
                "name" : "radioGroup",
                "textContent" : "Check Group",
                "id" : "radioGroup",
                "tag" : "radio-group",
                "sortCode" : 4,
                "value" : "value4",
                "items" : [
                    {
                "textButton" : "Option4",
                "id" : "radio1",
                "value" : "value2"
                    },
                    {
                "textButton" : "Option5",
                "id" : "radio2",
                "value" : "value4"
                    },
                    {
                "textButton" : "Option6",
                "id" : "radio3",
                "value" : "value6"
                    }
                ],
                "tips" :
                {
                    "content" : "RadioGroup Tips"
                }
            }
            ...
        ],
        "bindTo" : "gridElement"
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
            "index" : 3,
            "className" : "warning",
            "id" : "statistics3",
            "title" : "Title 3"
        },
        {
            "data" : "Data 4",
            "index" : 4,
            "id" : "statistics4",
            "title" : "Title 4"
        }
        ...
    ],
    "title" :
    {
        "textContent" : "Message List Title",
        "importUrl" : "ImportUrl",
        "styleClass" : "view-list",
        "disableSwitch" : false
    },
    "grid" :
    {
        "id" : "gridElement",
        "selectName" : "identifyCode",
        "pageLimit" : 20,
        "header" :
        {
            "mainTitle" : "Title",
            "operatorTitle" : "Operators",
            "items" :
            [
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
                    "mapKey" : "key5",
                    "width" : "10%",
                    "index" : 4,
                    "sort" : false,
                    "title" : "Column Title 5"
                },
                {
                    "mapKey" : "key4",
                    "width" : "10%",
                    "index" : 3,
                    "sort" : false,
                    "title" : "Column Title 4"
                },
                {
                    "mapKey" : "key3",
                    "width" : "10%",
                    "index" : 2,
                    "sort" : true,
                    "title" : "Column Title 3"
                },
                {
                    "mapKey" : "key1",
                    "width" : "15%",
                    "index" : 1,
                    "sort" : false,
                    "title" : "Column Title 1"
                },
                {
                    "mapKey" : "key2",
                    "width" : "15%",
                    "index" : 0,
                    "sort" : false,
                    "title" : "Column Title 2"
                }
                ...
            ]
        },
        "pager" :
        {
            "totalPage" : 20,
            "currentPage" : 5
        },
        "itemData" :
        [
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "key5" : "Column 5 Text",
                "key6" : "Column 6 Text",
                "key3" : "Column 3 Text",
                "key4" : "Column 4 Text",
                "link" : "LinkAddress1",
                "key9" : "Column 9 Text",
                "key7" : "Column 7 Text",
                "key8" : "Column 8 Text",
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content",
                "score" : 4.2,
                "operators" :
                [
                    {
                "link" : "EditLink",
                "index" : 3,
                "textContent" : "Edit",
                "title" : "Edit",
                "iconClass" : "icon-pen"
                    },
                    {
                "link" : "DeleteLink",
                "index" : 2,
                "textContent" : "Delete",
                "title" : "Delete",
                "iconClass" : "icon-trash_can"
                    },
                    {
                "link" : "MultiLink",
                "index" : 1,
                "textContent" : "Multilingual",
                "title" : "Multilingual",
                "iconClass" : "icon-globe"
                    }
                ],
                "imgPath" : "./images/1.jpg",
                "identifyCode" : "1"
            },
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "score" : 3.0,
                "key3" : "Column 3 Text",
                "imgPath" : "./images/1.jpg",
                "link" : "LinkAddress2",
                "className" : "warning",
                "identifyCode" : "2",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "operators" :
                [
                    {
                "link" : "EditLink",
                "index" : 3,
                "textContent" : "Edit",
                "title" : "Edit",
                "iconClass" : "icon-pen"
                    },
                    {
                "link" : "DeleteLink",
                "index" : 2,
                "textContent" : "Delete",
                "title" : "Delete",
                "iconClass" : "icon-trash_can"
                    },
                    {
                "link" : "MultiLink",
                "index" : 1,
                "textContent" : "Multilingual",
                "title" : "Multilingual",
                "iconClass" : "icon-globe"
                    }
                ],
                "key3" : "Column 3 Text",
                "imgPath" : "./images/1.jpg",
                "link" : "LinkAddress2",
                "identifyCode" : "3",
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "key5" : "Column 5 Text",
                "key6" : "Column 6 Text",
                "key3" : "Column 3 Text",
                "key4" : "Column 4 Text",
                "link" : "LinkAddress1",
                "key9" : "Column 9 Text",
                "key7" : "Column 7 Text",
                "key8" : "Column 8 Text",
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content",
                "score" : 3.2,
                "operators" :
                [
                    {
                "link" : "EditLink",
                "index" : 3,
                "textContent" : "Edit",
                "title" : "Edit",
                "iconClass" : "icon-pen"
                    },
                    {
                "link" : "DeleteLink",
                "index" : 2,
                "textContent" : "Delete",
                "title" : "Delete",
                "iconClass" : "icon-trash_can"
                    },
                    {
                "link" : "MultiLink",
                "index" : 1,
                "textContent" : "Multilingual",
                "title" : "Multilingual",
                "iconClass" : "icon-globe"
                    }
                ],
                "imgPath" : "./images/1.jpg",
                "identifyCode" : "4"
            },
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "score" : 3.0,
                "key3" : "Column 3 Text",
                "imgPath" : "./images/1.jpg",
                "link" : "LinkAddress2",
                "identifyCode" : "5",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "operators" :
                [
                    {
                "link" : "EditLink",
                "index" : 3,
                "textContent" : "Edit",
                "title" : "Edit",
                "iconClass" : "icon-pen"
                    },
                    {
                "link" : "DeleteLink",
                "index" : 2,
                "textContent" : "Delete",
                "title" : "Delete",
                "iconClass" : "icon-trash_can"
                    },
                    {
                "link" : "MultiLink",
                "index" : 1,
                "textContent" : "Multilingual",
                "title" : "Multilingual",
                "iconClass" : "icon-globe"
                    }
                ],
                "key3" : "Column 3 Text",
                "imgPath" : "./images/1.jpg",
                "link" : "LinkAddress2",
                "className" : "error",
                "identifyCode" : "6",
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "key5" : "Column 5 Text",
                "key6" : "Column 6 Text",
                "key3" : "Column 3 Text",
                "key4" : "Column 4 Text",
                "link" : "LinkAddress1",
                "key9" : "Column 9 Text",
                "key7" : "Column 7 Text",
                "key8" : "Column 8 Text",
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content",
                "score" : 4.2,
                "operators" :
                [
                    {
                "link" : "EditLink",
                "index" : 3,
                "textContent" : "Edit",
                "title" : "Edit",
                "iconClass" : "icon-pen"
                    },
                    {
                "link" : "DeleteLink",
                "index" : 2,
                "textContent" : "Delete",
                "title" : "Delete",
                "iconClass" : "icon-trash_can"
                    },
                    {
                "link" : "MultiLink",
                "index" : 1,
                "textContent" : "Multilingual",
                "title" : "Multilingual",
                "iconClass" : "icon-globe"
                    }
                ],
                "imgPath" : "./images/1.jpg",
                "identifyCode" : "7"
            },
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "score" : 3.0,
                "key3" : "Column 3 Text",
                "imgPath" : "./images/1.jpg",
                "link" : "LinkAddress2",
                "identifyCode" : "8",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            },
            {
                "key1" : "Column 1 Text",
                "elementId" : "elementId",
                "key2" : "Column 2 Text",
                "operators" :
                [
                    {
                "link" : "EditLink",
                "index" : 3,
                "textContent" : "Edit",
                "title" : "Edit",
                "iconClass" : "icon-pen"
                    },
                    {
                "link" : "DeleteLink",
                "index" : 2,
                "textContent" : "Delete",
                "title" : "Delete",
                "iconClass" : "icon-trash_can"
                    },
                    {
                "link" : "MultiLink",
                "index" : 1,
                "textContent" : "Multilingual",
                "title" : "Multilingual",
                "iconClass" : "icon-globe"
                    }
                ],
                "key3" : "Column 3 Text",
                "imgPath" : "./images/1.jpg",
                "link" : "LinkAddress2",
                "identifyCode" : "9",
                "abstract" : "Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content Abstract content ",
                "title" : "Text content Text content Text content Text content Text content Text content Text content Text content"
            }
            ...
        ],
        "batchOperators" :
        [
            {
                "elementId" : "elementId",
                "link" : "ExportUrl",
                "icon" : "icon-download",
                "title" : "Export Data"
            }
            ...
        ]
    }
}
```