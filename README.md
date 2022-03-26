# Cell
The Simple and High Performance Progressive JavaScript Framework Using ECMAScript6.

## menu-element
Data Format:
```
{
  "data": [
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
          "link": "Link address"
        },
        {
          "title": "Child Menu 2",
          "link": "Link address"
        },
        {
          "title": "Child Menu 3",
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
          "link": "Link address"
        },
        {
          "title": "Child Menu 2",
          "link": "Link address"
        },
        {
          "title": "Child Menu 3",
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
  "items": [
    {"imagePath": "Image path", "title": "Title Content"},
    {"imagePath": "Image path", "title": "Title Content"},
    {"imagePath": "Image path", "title": "Title Content"},
    {"imagePath": "Image path", "title": "Title Content"}
    ...
  ]
}
```

## message-list
```
{
  "filter": {
    "id": "elementId",
    "method": "post",
    "action": "url",
    "bindTo": "gridElement",
    "sortBy": "sortBy",
    "sortType": "sortType",
    "pageNo": "pageNo",
    "pageLimit": "pageLimit",
    "items": [
      {
        "id": "elementId",
        "name": "elementName",
        "tag": "search-input",
        "value": "",
        "placeholder": "Place holder text",
        "textContent": "Element label text",
        "tips": {"content": "Tips message"}
      },
      {
        "id": "elementId",
        "beginName": "beginElement",
        "endName": "endElement",
        "tag": "number-interval-input",
        "beginValue": "1",
        "endValue": "3",
        "textContent": "Element label text",
        "tips": {"content": "Tips message"}
      },
      {
        "id": "elementId",
        "name": "elementName",
        "tag": "checkbox-group",
        "value": ["value2", "value4"],
        "textContent": "Element label text",
        "tips": {"content": "Tips message"},
        "items": [
          {"id" : "checkbox7", "value" : "value1", "textButton" : "Radio Content"},
          {"id" : "checkbox8", "value" : "value2", "textButton" : "Radio Content"},
          {"id" : "checkbox9", "value" : "value3", "textButton" : "Radio Content"}
        ]
      },
      {
        "id": "elementId",
        "name": "elementName",
        "tag": "radio-group",
        "value": "value1",
        "textContent": "Element label text",
        "tips": {"content": "Tips message"},
        "items": [
          {"id" : "radioButtonId1", "value" : "value1", "textButton" : "Radio Content"},
          {"id" : "radioButtonId2", "value" : "value2", "textButton" : "Radio Content"},
          {"id" : "radioButtonId3", "value" : "value3", "textButton" : "Radio Content"},
          {"id" : "radioButtonId4", "value" : "value1", "textButton" : "Radio Content"}
        ]
      },
      {
        "id": "elementId",
        "name": "elementName",
        "itemType": "search-input",
        "value": "Initialize value",
        "textContent": "Element label text",
        "tips": {"content": "Tips message"}
      }
    ]
  }, 
  "statistics": [
    {
      "index": 1,
      "id": "index1",
      "title": "Title 1",
      "data": "Data 1",
      "className": "error"
    },
    {
      "index": 2,
      "id": "index2",
      "title": "Title 2",
      "data": "Data 2"
    },
    {
      "index": 3,
      "id": "index3",
      "title": "Title 3",
      "data": "Data 3",
      "className": "warning"
    },
    {
      "index": 4,
      "id": "index4",
      "title": "Title 4",
      "data": "Data 4"
    }
  ],
  "title": {
    "textContent": "Message List Title",
    "importUrl": "Import Url"
  },
  "grid":
  {
    "id": "gridElement",
    "selectName": "identifyCode",
    "pageLimit": 15,
    "header": {
      "mainTitle": "标题",
      "operatorTitle": "操作",
      "items": [
        {
          "index": 1,
          "mapKey": "key1",
          "width": "15%",
          "title": "column title 1",
          "sort": false
        },
        {
          "index": 0,
          "mapKey": "key2",
          "width": "15%",
          "title": "column title 2",
          "sort": false
        },
        {
          "index": 2,
          "mapKey": "key3",
          "width": "10%",
          "title": "column title 3",
          "sort": true
        },
        {
          "index": 3,
          "mapKey": "key4",
          "width": "10%",
          "title": "column title 4",
          "sort": false
        },
        {
          "index": 4,
          "mapKey": "key5",
          "width": "10%",
          "title": "column title 5",
          "sort": false
        },
        {
          "index": 5,
          "mapKey": "key6",
          "width": "10%",
          "title": "column title 6",
          "sort": true
        },
        {
          "index": 6,
          "mapKey": "key7",
          "width": "10%",
          "title": "column title 7",
          "sort": false
        },
        {
          "index": 7,
          "mapKey": "key8",
          "width": "10%",
          "title": "column title 8",
          "sort": false
        },
        {
          "index": 8,
          "mapKey": "key9",
          "width": "10%",
          "title": "column title 9",
          "sort": true
        }
      ]
    },
    "itemData": [
      {
        "identifyCode": "1",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content Text content Text content Text content Text content Text content Text content Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "key4": "Column 1 text",
        "key5": "Column 2 text",
        "key6": "Column 3 text",
        "key7": "Column 1 text",
        "key8": "Column 2 text",
        "key9": "Column 3 text",
        "score": 4.2,
        "operators": [
          {
            "title": "Edit",
            "link": "Link address",
            "iconContent": "&#xe6f6;",
            "textContent": "Edit"
          },
          {
            "title": "Delete",
            "link": "Link address",
            "iconContent": "&#xe749;",
            "textContent": "Delete"
          },
          {
            "title": "Multilingual",
            "link": "Link address",
            "iconContent": "&#xe702;",
            "textContent": "Multilingual"
          }
        ]
      },
      {
        "identifyCode": "2",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "score": 3,
        "className": "warning"
      },
      {
        "identifyCode": "3",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "operators": [
          {
            "title": "Edit",
            "link": "Link address",
            "iconContent": "&#xe6f6;",
            "textContent": "Edit"
          },
          {
            "title": "Delete",
            "link": "Link address",
            "iconContent": "&#xe749;",
            "textContent": "Delete"
          },
          {
            "title": "Multilingual",
            "link": "Link address",
            "iconContent": "&#xe702;",
            "textContent": "Multilingual"
          }
        ]
      },
      {
        "identifyCode": "1",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "key4": "Column 1 text",
        "key5": "Column 2 text",
        "key6": "Column 3 text",
        "key7": "Column 1 text",
        "key8": "Column 2 text",
        "key9": "Column 3 text",
        "score": 4.2,
        "operators": [
          {
            "title": "Edit",
            "link": "Link address",
            "iconContent": "&#xe6f6;",
            "textContent": "Edit"
          },
          {
            "title": "Delete",
            "link": "Link address",
            "iconContent": "&#xe749;",
            "textContent": "Delete"
          },
          {
            "title": "Multilingual",
            "link": "Link address",
            "iconContent": "&#xe702;",
            "textContent": "Multilingual"
          }
        ]
      },
      {
        "identifyCode": "2",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "score": 3
      },
      {
        "identifyCode": "3",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "className": "error",
        "operators": [
          {
            "title": "Edit",
            "link": "Link address",
            "iconContent": "&#xe6f6;",
            "textContent": "Edit"
          },
          {
            "title": "Delete",
            "link": "Link address",
            "iconContent": "&#xe749;",
            "textContent": "Delete"
          },
          {
            "title": "Multilingual",
            "link": "Link address",
            "iconContent": "&#xe702;",
            "textContent": "Multilingual"
          }
        ]
      },
      {
        "identifyCode": "1",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "key4": "Column 1 text",
        "key5": "Column 2 text",
        "key6": "Column 3 text",
        "key7": "Column 1 text",
        "key8": "Column 2 text",
        "key9": "Column 3 text",
        "score": 4.2,
        "operators": [
          {
            "title": "Edit",
            "link": "Link address",
            "iconContent": "&#xe6f6;",
            "textContent": "Edit"
          },
          {
            "title": "Delete",
            "link": "Link address",
            "iconContent": "&#xe749;",
            "textContent": "Delete"
          },
          {
            "title": "Multilingual",
            "link": "Link address",
            "iconContent": "&#xe702;",
            "textContent": "Multilingual"
          }
        ]
      },
      {
        "identifyCode": "2",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "score": 3
      },
      {
        "identifyCode": "3",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "operators": [
          {
            "title": "Edit",
            "link": "Link address",
            "iconContent": "&#xe6f6;",
            "textContent": "Edit"
          },
          {
            "title": "Delete",
            "link": "Link address",
            "iconContent": "&#xe749;",
            "textContent": "Delete"
          },
          {
            "title": "Multilingual",
            "link": "Link address",
            "iconContent": "&#xe702;",
            "textContent": "Multilingual"
          }
        ]
      },
      {
        "identifyCode": "1",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content Text content Text content Text content Text content Text content Text content Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "key4": "Column 1 text",
        "key5": "Column 2 text",
        "key6": "Column 3 text",
        "key7": "Column 1 text",
        "key8": "Column 2 text",
        "key9": "Column 3 text",
        "score": 4.2,
        "operators": [
          {
            "title": "Edit",
            "link": "Link address",
            "iconContent": "&#xe6f6;",
            "textContent": "Edit"
          },
          {
            "title": "Delete",
            "link": "Link address",
            "iconContent": "&#xe749;",
            "textContent": "Delete"
          },
          {
            "title": "Multilingual",
            "link": "Link address",
            "iconContent": "&#xe702;",
            "textContent": "Multilingual"
          }
        ]
      },
      {
        "identifyCode": "2",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "score": 3,
        "warning": true
      },
      {
        "identifyCode": "3",
        "link": "Link address",
        "elementId": "Bind element id",
        "imgPath": "./images/test/1.jpg",
        "title": "Text content",
        "key1": "Column 1 text",
        "key2": "Column 2 text",
        "key3": "Column 3 text",
        "operators": [
          {
            "title": "Edit",
            "link": "Link address",
            "iconContent": "&#xe6f6;",
            "textContent": "Edit"
          },
          {
            "title": "Delete",
            "link": "Link address",
            "iconContent": "&#xe749;",
            "textContent": "Delete"
          },
          {
            "title": "Multilingual",
            "link": "Link address",
            "iconContent": "&#xe702;",
            "textContent": "Multilingual"
          }
        ]
      }
      ...
    ],
    "pager": {
      "totalPage": 20,
      "currentPage": 5
    },
    "batchOperators": [
      {
        "link": "Export data url",
        "elementId": "elementId",
        "title": "Export Data",
        "textContent": "Import Data",
        "icon": "&#xe75b"
      }
    ]
  }
}`
```