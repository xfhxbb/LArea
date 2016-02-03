lArea v1.0移动端城市选择控件
==========
纯原生js的移动端城市选择插件，不依赖任何库
##用法
在html页面中引入input标签，写法如下：
```
...
<input id="demo1" type="text" readonly="" name="input_date" placeholder="城市选择特效"/>
...
```
将样式文件引入到页面中：
```
...
 <link rel="stylesheet" href="css/common/lArea.css">
...
```
同时引入js文件到页面中：
```
...
<script src="lArea.js"></script>
...
```
初始化插件：
```
...
var area = new lArea();
area.init({
    'trigger': '#demo1',//控件ID
    'data':lAreaData//数组格式数据源，可扩展为自定义数据源
});
...
```
调用起来非常简单，代码我后续会持续优化，如果喜欢希望赏颗星哦。
