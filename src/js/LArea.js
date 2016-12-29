/**
 * LArea移动端城市选择控件
 * 
 * version:1.7.2
 * 
 * author:黄磊
 * 
 * git:https://github.com/xfhxbb/LArea
 * 
 * Copyright 2016
 * 
 * Licensed under MIT
 * 
 * 最近修改于： 2016-6-12 16:47:41
 *
 * author: Nutlee
 *
 * 最近修改于： 2016-8-30
 */
window.LArea = (function() {
    var MobileArea = function() {
        this.gearArea = null;
        this.data = {};
        this.index = 0;
        this.value = [0, 0, 0];
    };
    MobileArea.prototype = {
        init: function(params) {
            this.params = params;
            this.trigger = document.querySelector(params.trigger);
            if(params.valueTo){
              this.valueTo=document.querySelector(params.valueTo);
            }
            this.keys = params.keys;
            this.type = params.type||1;
            switch (this.type) {
                case 1:
                case 2:
                    break;
                default:
                    throw new Error('错误提示: 没有这种数据源类型');
            }
            this.displayType =params.displayType || 1;
            this.bindEvent();
            this.successCallBack = params.onSuccess || function(){};
            this.closeCallBack = params.onClose || function(){};
            return this;
        },
        getData: function(callback) {
            var _self = this;
            if (typeof _self.params.data == "object") {
                _self.data = _self.params.data;
                callback();
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open('get', _self.params.data);
                xhr.onload = function(e) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
                        var responseData = JSON.parse(xhr.responseText);
                        _self.data = responseData.data;
                        if (callback) {
                            callback();
                        }
                    }
                };
                xhr.send();
            }
        },
        bindEvent: function() {
            var _self = this;
            var displayType = _self.displayType;
            //呼出插件
            function popupArea(e) {
                _self.gearArea = document.createElement("div");
                _self.gearArea.className = "gearArea";
                if (displayType === 2) {
                    _self.gearArea.innerHTML = '<div class="area_ctrl slideInUp">' +
                        '<div class="area_btn_box">' +
                        '<div class="area_btn larea_cancel">取消</div>' +
                        '<div class="area_btn larea_finish">确定</div>' +
                        '</div>' +
                        '<div class="area_roll_mask">' +
                        '<div class="area_roll">' +
                        '<div>' +
                        '<div class="gear area_province" data-areatype="area_province"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '<div>' +
                        '<div class="gear area_city" data-areatype="area_city"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                } else {
                    _self.gearArea.innerHTML = '<div class="area_ctrl slideInUp">' +
                        '<div class="area_btn_box">' +
                        '<div class="area_btn larea_cancel">取消</div>' +
                        '<div class="area_btn larea_finish">确定</div>' +
                        '</div>' +
                        '<div class="area_roll_mask">' +
                        '<div class="area_roll">' +
                        '<div>' +
                        '<div class="gear area_province" data-areatype="area_province"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '<div>' +
                        '<div class="gear area_city" data-areatype="area_city"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '<div>' +
                        '<div class="gear area_county" data-areatype="area_county"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    
                }
                document.body.appendChild(_self.gearArea);
                areaCtrlInit();
                var larea_cancel = _self.gearArea.querySelector(".larea_cancel");
                larea_cancel.addEventListener('touchstart', function(e) {
                    _self.close(e);
                });
                var larea_finish = _self.gearArea.querySelector(".larea_finish");
                larea_finish.addEventListener('touchstart', function(e) {
                    _self.finish(e);
                });
                var area_province = _self.gearArea.querySelector(".area_province");
                var area_city = _self.gearArea.querySelector(".area_city");
                if (displayType === 1) {
                    var area_county = _self.gearArea.querySelector(".area_county");
                    area_county.addEventListener('touchstart', gearTouchStart);
                    area_county.addEventListener('touchmove', gearTouchMove);
                    area_county.addEventListener('touchend', gearTouchEnd);
                }
                _self.gearArea.addEventListener('click',function(e){
                    e.target.removeEventListener(e.type,arguments.callee);
                    return gearTouchOut(e,document.querySelector('.area_ctrl'));
                }); 
                area_province.addEventListener('touchstart', gearTouchStart);
                area_province.addEventListener('touchmove', gearTouchMove);
                area_province.addEventListener('touchend', gearTouchEnd);
                area_city.addEventListener('touchmove', gearTouchMove);
                area_city.addEventListener('touchstart', gearTouchStart);
                area_city.addEventListener('touchend', gearTouchEnd);
            }
            //初始化插件默认值
            function areaCtrlInit() {
                _self.gearArea.querySelector(".area_province").setAttribute("val", _self.value[0]);
                _self.gearArea.querySelector(".area_city").setAttribute("val", _self.value[1]);
                if (displayType === 1) {
                    _self.gearArea.querySelector(".area_county").setAttribute("val", _self.value[2]);
                }
                switch (_self.type) {
                    case 1:
                        _self.setGearTooth(_self.data);
                        break;
                    case 2:
                        _self.setGearTooth(_self.data[0]);
                        break;
                }
            }
            //触摸开始
            function gearTouchStart(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches[0].screenY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
                } else {
                    target["o_d_" + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
            }
            //手指移动
            function gearTouchMove(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                target["new_" + target.id] = e.targetTouches[0].screenY;
                target["n_t_" + target.id] = (new Date()).getTime();
                var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
                target["pos_" + target.id] = target["o_d_" + target.id] + f;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'em');
                if(e.targetTouches[0].screenY<1){
                    gearTouchEnd(e);
                }
            }
            //离开屏幕
            function gearTouchEnd(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var new_ = target["new_" + target.id],
                    old_ = target["old_" + target.id];
                if ( new_ && old_ ) {
                    var flag = (new_ - old_ ) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                    if (Math.abs(flag) <= 0.2) {
                        target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                    } else {
                        if (Math.abs(flag) <= 0.5) {
                            target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                        } else {
                            target["spd_" + target.id] = flag / 2;
                        }
                    }
                    if (!target["pos_" + target.id]) {
                        target["pos_" + target.id] = 0;
                    }
                    rollGear(target);
                }
            }
            //缓动效果
            function rollGear(target) {
                var d = 0;
                var stopGear = false;
                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                    stopGear = true;
                }
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                    var pos = target["pos_" + target.id];
                    var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {} else {
                        var b = Math.round(pos / 2) * 2;
                        pos = b;
                        setDuration();
                    }
                    if (pos > 0) {
                        pos = 0;
                        setDuration();
                    }
                    var minTop = -(target.dataset.len - 1) * 2;
                    if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                    }
                    if (stopGear) {
                        var gearVal = Math.abs(pos) / 2;
                        setGear(target, gearVal);
                        clearInterval(target["int_" + target.id]);
                    }
                    target["pos_" + target.id] = pos;
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                    target.setAttribute('top', pos + 'em');
                    d++;
                }, 30);
            }
            //控制插件滚动后停留的值
            function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);
                switch (_self.type) {
                    case 1:
                         _self.setGearTooth(_self.data);
                        break;
                    case 2:
                     switch(target.dataset.areatype){
                         case 'area_province':
                         _self.setGearTooth(_self.data[0]);
                             break;
                         case 'area_city':
                             var ref = target.childNodes[val].getAttribute('ref');
                             var childData=[];
                             var nextData= _self.data[2];
                             for (var i in nextData) {
                                 if(i==ref){
                                    childData = nextData[i];
                                    break;
                                 }
                             }
                        _self.index=2;
                        _self.setGearTooth(childData);
                             break;
                     }
                }
            }
            function gearTouchOut(event,parent) {
                function hasThisElement(child,parent) {
                    if (parent === child) {
                        return true;
                    }
                    var nodes = parent.getElementsByTagName('*');
                    for (var i = 0,len = nodes.length; i < len; i++) {
                        if (nodes[i] === child) {
                            return true;
                        }
                    }
                    return false;
                }
                event = event ? event :window.event;
                    target = event.target || event.scrElement;
                if (!hasThisElement(target,parent)) {
                    _self.close(event);
                }
            }
            _self.getData(function() {
                _self.trigger.addEventListener('click', popupArea);
            });
        },
        // 重置节点个数
        // 遍历省、市、区 插入 HTML ，递归调用 省、市、区
        setGearTooth: function(data) {
            var _self = this;
            var item = data || [];
            // 数据长度
            var l = item.length;
            if (!_self.gearArea) {
                return;
            }
            var gearChild = _self.gearArea.querySelectorAll(".gear");
            var gearWrap = gearChild[_self.index];
            // 遍历列 当前 focus
            var gearVal = gearWrap.getAttribute('val');
            // 当前列 max 索引
            var maxVal = l - 1;
            if (gearVal > maxVal) {
                gearVal = maxVal;
            }
            gearWrap.setAttribute('data-len', l);
            if (l > 0) {
                var id = item[gearVal][this.keys.id];
                var childData;
                switch (_self.type) {
                    case 1:
                    childData = item[gearVal].child;
                        break;
                    case 2:
                    var nextData= _self.data[_self.index+1];
                    for (var i in nextData) {
                         if(i==id){
                            childData = nextData[i];
                            break;
                         }
                    }
                    break;
                }
                var itemStr = "";
                for (i = 0; i < l; i++) {
                    itemStr += "<div class='tooth'  ref='" + item[i][this.keys.id] + "'>" + item[i][this.keys.name] + "</div>";
                }
                // 插入省
                gearWrap.innerHTML = itemStr;
                gearWrap.style["-webkit-transform"] = 'translate3d(0,' + (-gearVal * 2) + 'em,0)';
                gearWrap.setAttribute('top', -gearVal * 2 + 'em');
                gearWrap.setAttribute('val', gearVal);
                _self.index++;
                if (_self.index > 2 || (_self.displayType === 2 && _self.index > 1)) {
                    _self.index = 0;
                    return;
                }
                _self.setGearTooth(childData);
            } else {
                gearWrap.innerHTML = "<div class='tooth'></div>";
                gearWrap.setAttribute('val', 0);
                if(_self.index==1){
                    gearChild[2].innerHTML = "<div class='tooth'></div>";
                    gearChild[2].setAttribute('val', 0);
                }
                _self.index = 0;
            }
        },
        finish: function(e) {
            var _self = this;
            var area_province = _self.gearArea.querySelector(".area_province");
            var area_city = _self.gearArea.querySelector(".area_city");
            var area_county,countyVal,countyText,countyCode;
            if (_self.displayType === 1) {
                area_county = _self.gearArea.querySelector(".area_county");
                countyVal = parseInt(area_county.getAttribute("val"));
                countyText = area_county.childNodes[countyVal].textContent;
                countyCode = area_county.childNodes[countyVal].getAttribute('ref');
            }
            var provinceVal = parseInt(area_province.getAttribute("val"));
            var provinceText = area_province.childNodes[provinceVal].textContent;
            var provinceCode = area_province.childNodes[provinceVal].getAttribute('ref');
            var cityVal = parseInt(area_city.getAttribute("val"));
            var cityText = area_city.childNodes[cityVal].textContent;
            var cityCode = area_city.childNodes[cityVal].getAttribute('ref');
            function filterBlankParams(paramsArr) {
                for (var i = 0,len = paramsArr.length ; i < len ; i++) {
                    var param = paramsArr[i];
                    if ( param ==='' || param === undefined || param === null ) {
                        paramsArr.splice(i,1);
                        len = paramsArr.length;
                    }
                }
                return paramsArr.length>0 ? paramsArr:[];
            }
            var triggerValueArray = filterBlankParams([provinceText,cityText,countyText]);
            var valueArray = filterBlankParams([provinceVal, cityVal, countyVal]);
            _self.trigger.value = triggerValueArray.join(',');
            _self.value = valueArray;
            if (this.valueTo) {
                this.valueTo.value = valueArray.join(',');
            }
            _self.successCallBack(valueArray,triggerValueArray);
            _self.close(e);
        },
        close: function(e) {
            e.preventDefault();
            var _self = this;
            var evt = new CustomEvent('input');
            _self.trigger.dispatchEvent(evt);
            document.body.removeChild(_self.gearArea);
            _self.gearArea=null;
            _self.closeCallBack();
        }
    };
    return MobileArea;
})();