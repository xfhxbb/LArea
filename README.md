# LArea

纯原生js的移动端城市选择插件，不依赖任何库

* 增加回调 onSuccess、onClose 接口
* 增加点击空白处收起控件
* 增加 `displayType` 选项，只显示两列数据 
* 链式操作优化，返回 this
* 修改 `valueTo` 元素可以不使用，即使用中文字传输
* 修复拉起控件立即点击一个地区的报错
* 修复动画未停止点确定的报错
* 修改了文件结构，如需预览请打开 `src/index.html`

基于 [LArea v1.72移动端城市选择控件]((https://github.com/xfhxbb/LArea) )，感谢原作者 [xfhxbb](https://github.com/xfhxbb) ，水平有限，如有拙劣感谢指出 ♥️ 。

## 用法


将样式文件引入到页面中：

```
 <link rel="stylesheet" href="LArea.min.css">
```

同时引入js文件到页面中：

```
<script src="js/LArea.js"></script>
```

在html页面中引入input标签，写法如下：

```
<input id="demo1" type="text" readonly="" name="input_area" placeholder="城市选择特效"/>
```

初始化插件：

```javascript
new LArea().init({
    'trigger': '#demo1',// 触发选择控件的文本框，同时选择完毕后name属性输出到该位置
    'valueTo':'#value1',// 选择完毕后id属性输出到该位置 若为空则只使用中文名（如"上海市,闵行区"）
    'keys':{id:'id',name:'name'}, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
    'type':1, //数据源类型
    'displayType': 1,  // 默认为1，显示3列。如果需要2列改为2
    'data':LAreaData,  //数据源
    onSuccess: function(value,triggerValue) {
    		// 修改实际 trigger 的最终显示形式，如只显示市一级
    		this.trrgger.value = triggerValue[1];
    },
    onClose: function() {
    }
});
```

自定义数据源结构参考：

```
//初始化type=1时，参考下列数据源
var LAreaData1 = [{
         "id": "2",
         "name": "一级",
         "child": [{
              "id": "21",
              "name": "二级1",
              "child": [{
                  "id": "211",
                  "name": "三级1"
					}, {
                 "id": "212",
                 "name": "三级2"
					}, {
                 "id": "213",
                 "name": "三级3"
					}]
         }, {
             "id": "22",
             "name": "二级2"
         }, {
             "id": "23",
             "name": "二级3"
         }]
     }];
     
//初始化type=2时，参考下列数据源
var provs_data = [{
    "text": "省",
    "value": "1"
}, {
    "text": "省",
    "value": "2"
}];
var citys_data = {
    "1": [{
        "text": "市",
        "value": "11"
    }, {
        "text": "市",
        "value": "12"
    }],
    "2": [{
        "text": "市",
        "value": "21"
    }, {
        "text": "市",
        "value": "22"
    }]
};
var dists_data = {
    "11": [{
        "text": "区",
        "value": "111"
    }, {
        "text": "区",
        "value": "112"
    }],
    "21": [{
        "text": "区",
        "value": "211"
    }, {
        "text": "区",
        "value": "212"
    }]
};
```


