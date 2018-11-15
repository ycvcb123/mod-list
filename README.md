## 列表展示组件

### 用法:

```html
<record-result list="{{list}}"></record-result>
```
### list 格式如下:（需要可以自己扩展和改写）

```js
 list: [{
            id: '1',
            content: 'test1'
        },
        {
            id: '2',
            content: 'test2'
        },
        {
            id: '3',
            content: 'test3'
        },
        {
            id: '4',
            content: 'test4'
        }
        //...
        ]
```
### 功能性:

1. scroll-view 高度精准计算。
2. 支持列表项的删除和置顶功能。
3. 如丝般顺滑的拖动（横向滑动时禁止纵向滑动）。

示例demo:

<image src="./list.gif"/>
