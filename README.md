LArea v1.2移动端城市选择控件
==========
纯原生js的移动端城市选择插件，不依赖任何库
##用法
在html页面中引入input标签，写法如下：
```
...
<input id="demo1" type="text" readonly="" name="input_area" placeholder="城市选择特效"/>
...
```
将样式文件引入到页面中：
```
...
 <link rel="stylesheet" href="css/LArea.css">
...
```
同时引入js文件到页面中：
```
...
<script src="js/LArea.js"></script>
...
```
初始化插件：
```
...
var area = new LArea();
area.init({
    'trigger': '#demo1',//控件ID
    'data':LAreaData//数组格式数据源，可扩展为自定义数据源
});
...
```
自定义数据源结构参考：
```
var LAreaData = [{
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
```
调用起来非常简单，代码我后续会持续优化，如果喜欢希望赏颗星哦。
