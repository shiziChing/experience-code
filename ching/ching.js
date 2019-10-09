(function (window, underfind) {
    /**
     * Created by Administrator on 2017/2/16 0016.
     */
//定义push方法和slice方法
    var arr = [],
        push = arr.push,
        slice = arr.slice;

//声明入口函数
    function ching(html) {
        return new ching.fn.init(html);
    }

//定义入口函数ching的原型对象
    ching.fn = ching.prototype = {
        constructor: ching,
        length: 0,
        // 作为构造函数
        selector: '',
        type: 'ching',
        init: function (html) {
            this.events = {};
            if (html == null || html === '') {
                //结束
                return;
            }
            if (typeof html === 'function') {
                var oldFn = onload;
                if (typeof oldFn === 'function') {
                    onload = function () {
                        oldFn();
                        html();
                    }
                } else {
                    onload = html;
                }
            }
            //通过构造函数的isString方法判断
            if (ching.isString(html)) {
                //是符合标签规则的字符串
                if (/^</.test(html)) {
                    push.apply(this, parseHTML(html));
                } else {
                    //当做选择器来处理
                    push.apply(this, ching.select(html));
                    //用传入的html记录selector
                    this.selector = html;
                }
            }
            if (html && html.type === 'ching') {
                push.apply(this, html);
                this.selector = html.selector;
                this.events = html.events;
            }
            if (html.nodeType) {
                this[0] = html;
                this.length = 1;
            }
        }
    }
    // 将构造函数的原型设置为入口函数的原型  保证new出的对象具有一些属性和方法
    ching.fn.init.prototype = ching.prototype;
//选择器引擎开始
    /**
     * Created by Administrator on 2017/2/16 0016.
     */
    var select =

        (function () {

// 正则表达式
            var rnative = /\{\s*\[native/;
            var rtrim = /^\s+|\s+$/g;
//                          1           2         3     4
            var rbaseselector = /^(?:\#([\w\-]+)|\.([\w\-]+)|(\*)|(\w+))$/;


// 基本函数, support 对象, 验证 qsa 与 byclass
            var support = {};

            support.qsa = rnative.test(document.querySelectorAll + '');
            support.getElementsByClassName =
                rnative.test(document.getElementsByClassName + '');
            support.trim = rnative.test(String.prototype.trim + '');
            support.indexOf = rnative.test(Array.prototype.indexOf + '');


// 基本方法
            function getByClassName(className, node) {
                node = node || document;
                var allElem, res = [], i;

                if (support.getElementsByClassName) {
                    return node.getElementsByClassName(className);
                } else {
                    allElem = node.getElementsByTagName('*');
                    for (i = 0; i < allElem.length; i++) {
                        if ((" " + allElem[i].className + " ").indexOf(" " + className + " ") > -1) {
                            res.push(allElem[i]);
                        }
                    }
                    return res;
                }
            }

// 自定义实现 trim 方法 去除前后空格
            var myTrim = function (str) {
                // 表示两端去空格, 然后返回去除空格的结果
                if (support.trim) {
                    return str.trim();
                } else {
                    // 自定义实现
                    return str.replace(rtrim, '');
                }
            }
// 数组的indexOf方法有兼容性的问题：实现在数组中查找search元素返回查找元素的索引
            var myIndexOf = function (array, search, startIndex) {
                startIndex = startIndex || 0;
                if (support.indexOf) {
                    return array.indexOf(search, startIndex);
                } else {
                    for (var i = startIndex; i < array.length; i++) {
                        if (array[i] === search) {
                            return i;
                        }
                    }
                    return -1;
                }
            }

// 去除重复  将数组中重复的元素删除  将不重复烦人元素加入到结果数组中返回
            var unique = function (array) {
                var resArray = [], i = 0;
                for (; i < array.length; i++) {
                    if (myIndexOf(resArray, array[i]) == -1) {
                        resArray.push(array[i]);
                    }
                }
                return resArray;
            }

// 使用基本选择器来查找元素的函数，根据selector参数在node元素中进行查找元素的操作
            function basicSelect(selector, node) {
                node = node || document;
                var m, res;
                //使用m变量得到rbaseselector正则表达式在selector字符串中提取的结果
                if (m = rbaseselector.exec(selector)) {
                    if (m[1]) { // id
                        res = document.getElementById(m[1]);
                        if (res) {
                            return [res];
                        } else {
                            return [];
                        }
                    } else if (m[2]) {  // class
                        // return node.getElementsByClassName( m[ 2 ] );
                        return getByClassName(m[2], node);
                    } else if (m[3]) {
                        return node.getElementsByTagName(m[3]);
                    } else if (m[4]) {
                        return node.getElementsByTagName(m[4]);
                    }
                }
                return [];
            }

//select2函数  根据selector参数查找后代元素
            function select2(selector, results) {

                results = results || [];

                var selectors = selector.split(' ');

                // 假定 'div p .c'

                var arr = [], node = [document];


                for (var j = 0; j < selectors.length; j++) {
                    for (var i = 0; i < node.length; i++) {
                        arr.push.apply(arr, basicSelect(selectors[j], node[i]));
                    }
                    node = arr;
                    arr = [];
                }

                results.push.apply(results, node);
                return results;

            }

            function select(selector, results) {
                results = results || [];
                var m, temp, selectors, i, subselector;

                if (typeof selector != 'string') return results;

                // 表明参数都没有问题, 接下来就是如何选择
                // 首先判断 qsa 是否可用
                // 然后再 一步步的 自己实现
                if (support.qsa) {
                    results.push.apply(results, document.querySelectorAll(selector));
                } else {
                    // 不存在再来考虑自己实现
                    selectors = selector.split(',');
                    // 循环
                    for (i = 0; i < selectors.length; i++) {
                        subselector = myTrim(selectors[i]);
                        // 接下来就是 处理 subselector
                        if (rbaseselector.test(subselector)) {
                            // 基本选择器
                            results.push.apply(results, basicSelect(subselector));
                        } else {
                            // select2 函数
                            select2(subselector, results);
                        }
                    }
                }
                // 返回 result
                return unique(results);
            }


            return select;
        })();
    //将选择器引擎赋值给ching
    ching.select = select;

//选择器引擎结束
//添加可拓展的方法 extend
    ching.extend = ching.fn.extend = function (obj) {
        for (var k in obj) {
            this[k] = obj[k];
        }
    }
//给构造函数添加一些判断的方法和一些工具方法
    ching.extend({
        isString: function (data) {
            return typeof data === 'string';
        },
        //
        each: function (arr, func) {
            if (arr instanceof Array || arr.length >= 0) {
                for (var i = 0; i < arr.length; i++) {
                    func.call(arr[i], i, arr[i]);
                }
            } else {
                for (var i in arr) {
                    func.call(arr[i], i, arr[i]);
                }
            }
            return arr;
        },
        map: function (arr, func) {
            var temp;
            var res = [];
            if (arr instanceof Array || arr.length >= 0) {
                for (var i = 0; i < arr.length; i++) {
                    temp = func(i, arr[i]);
                    if (temp != null) {
                        res.push(temp);
                    }
                }
            } else {
                for (var i in arr) {
                    temp = func(i, arr[i]);
                    if (temp != null) {
                        res.push(temp);
                    }
                }
            }
            return res;
        },
        perpendChild: function (parent, element) {
            parent.insertBefore(element, parent.firstChild);
        }
    })
    //给构造函数的原型添加toArray方法和其他的一些方法
    ching.fn.extend({
        toArray: function () {
            return slice.call(this, 0);
        },
        //get、方法返回DOM对象
        get: function (index) {
            if (index === underfind) {
                return this.toArray();
            } else {
                return this[index];
            }
        },
        //eq方法返回ching对象
        eq: function (index) {
            var dom;
            //大于0时获取其相应的元素
            if (index >= 0) {
                dom = this.get(index);
            } else {
                //小于0
                dom = this.get(index + this.length);
            }
            return ching(dom);
        },
        each: function (func) {
            return ching.each(this, func);
        },
        map: function (func) {
            return ching.map(this, func);
        }
    })
    //DOM操作模块
    ching.fn.extend({
        //appendTo方法的封装
        appendTo: function (selector) {
            //将传入的参数统统交给ching函数来处理返回一个伪数组
            var iObj = this.constructor(selector);
            //创建一个空的ching对象  用来存放本体和复制的元素
            var newObj = ching();
            var temp;
            //外部循环是将要被添加元素的元素 通常是已存在代码中的选择器
            for (var i = 0; i < iObj.length; i++) {
                //内部循环是将要去添加的元素通常是传入的符合标签规则的字符串
                for (var j = 0; j < this.length; j++) {
                    //当是最后一个元素需要被添加时 直接赋值  //当不是最后一个需要去克隆赋值
                    temp = i === iObj.length - 1 ? this[j] : this[j].cloneNode(true);
                    iObj[i].appendChild(temp);
                    push.call(newObj, temp);
                }
            }
            return newObj;
        },
        append: function (selector) {
            var iObj = this.constructor(selector);
            var temp;
            //外部循环是将要被添加元素的元素 通常是已存在代码中的选择器
            for (var i = 0; i < this.length; i++) {
                //内部循环是将要去添加的元素通常是传入的符合标签规则的字符串
                for (var j = 0; j < iObj.length; j++) {
                    //当是最后一个元素需要被添加时 直接赋值  //当不是最后一个需要去克隆赋值
                    temp = i === this.length - 1 ? iObj[j] : iObj[j].cloneNode(true);
                    this[i].appendChild(temp);
                }
            }
        },
        perpendTo: function (selector) {
            var iObj = this.constructor(selector);
            //创建一个空的ching对象  用来存放本体和复制的元素

            var newObj = ching();
            var temp;
            for (var i = 0; i < iObj.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    //当是最后一个元素需要被添加时 直接赋值  //当不是最后一个需要去克隆赋值
                    temp = i === iObj.length - 1 ? this[j] : this[j].cloneNode(true);
                    ching.perpendChild(iObj[i], temp);
                    push.call(newObj, temp);
                }
            }
        },
        perpend: function (selector) {
            var iObj = this.constructor(selector);
            var temp;
            for (var i = 0; i < this.length; i++) {
                for (var j = 0; j < iObj.length; j++) {
                    //当是最后一个元素需要被添加时 直接赋值  //当不是最后一个需要去克隆赋值
                    temp = i === this.length - 1 ? iObj[j] : iObj[j].cloneNode(true);
                    ching.perpendChild(this[i], temp);
                }
            }
        }
    })
//定义parseHTML函数  将字符串转化成DOM对象的函数
    var parseHTML = (function () {
        var div = document.createElement('div');

        function parseHTML(html) {
            div.innerHTML = html;
            var res = [];
            for (var i = 0; i < div.childNodes.length; i++) {
                res.push(div.childNodes[i]);
            }
            div.innerHTML = '';
            return res;
        }

        return parseHTML;
    })();
//
    //事件处理模块开始
    ching.fn.extend({
        //处理on方法
        on: function (type, fn) {
            //声明that变量 存放当前的ching对象
            var that = this;
            //如果当前的this.events[type]为underfind
            if (!this.events[type]) {
                this.events[type] = [];//定义this.events[type]
                //遍历当前的ching对象
                this.each(function () {
                    //声明self变量 存放当前的DOM对象
                    var self = this;
                    var f = function (e) {
                        for (var i = 0; i < that.events[type].length; i++) {
                            that.events[type][i].call(self, e);
                        }
                    }
                    //如果当前的DOM对象有this.addEventListener
                    if (this.addEventListener) {
                        this.addEventListener(type, f);
                    } else {
                        this.attachEvent('on' + type, f);
                    }
                })
            }
            //将传入的函数追加给this.events[type]
            this.events[type].push(fn);
            //返回当前的ching对象
            return this;
        },
        //处理off方法
        off: function (type, fn) {
            var arr = this.events[type];//存放传入 函数
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == fn) {
                        break;
                    }
                }
                if (i != arr.length) {
                    arr.splice(i, 1);
                }
            }
            //返回当前的ching对象
            return this;
        }
    })
//给其他的方法添加给原型
    var arr = ( "blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(' ');
    ching.each(arr, function (i, v) {
        ching.fn[v] = function (fn) {
            this.on(v, fn);
        }
    })
    //操作样式
    ching.extend({
        getStyle: function (dom, name) {
            if (dom.currentStyle) {
                return dom.currentStyle[name];
            } else {
                return window.getComputedStyle(dom)[name];
            }
        }
    })
    ching.fn.extend({
        css: function (option) {
            var args = arguments,
                len = arguments.length;
            if (len === 2) {
                if (ching.isString(args[0]) && ching.isString(args[1])) {
                    this.each(function () {
                        this.style[args[0]] = args[1];
                    })
                }
            } else if (len === 1) {
                if (ching.isString(option)) {
                    return this[0].style[option] || ching.getStyle(this[0], option);
                } else if (typeof option === 'object') {
                    this.each(function () {
                        for (var k in option) {
                            this.style[k] = option[k];
                        }
                    });
                }
            }
            return this;
        },
        addClass: function (name) {
            this.each(function () {
                var classTxt = this.className;
                if (classTxt) {
                    if ((' ' + classTxt + ' ').indexOf(' ' + name + ' ') == -1) {
                        this.className += name;
                    }
                } else {
                    this.className = name;
                }

            });
            return this;
        },
        removeClass: function (name) {
            this.each(function () {
                var classTxt = this.className;
                if (classTxt) {
                    var arr = classTxt.split(' ');
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i] === name) {
                            arr.splice(i, 1);
                        }
                    }
                    this.className = arr.join(' ');
                }
            })
            return this;
        },
        hasClass: function (name) {
            var temp = false;
            this.each(function () {
                var classTxt = this.className;
                if ((' ' + classTxt + ' ').indexOf(' ' + name + ' ') != -1) {
                    temp = true;
                }
            })
            return temp;
        },
        //属性操作
        attr: function (name, value) {
            if (value) {
                if (ching.isString(name) && ching.isString(value)) {
                    return this.each(function () {
                        this.setAttribute(name, value);
                    })
                }
            } else {
                if (ching.isString(name)) {
                    return this[0].getAttribute(name);
                }
            }
            return this;
        },
        prop: function (name, value) {
            if (value || value === '') {
                if (ching.isString(name) && ching.isString(value)) {
                    return this.each(function () {
                        this[name] = value;
                    })
                }
            } else {
                if (ching.isString(name)) {
                    return this[0][name];
                }
            }
            return this;
        },
        val: function (v) {
            return this.attr('value', v);
        },
        html: function (html) {
            return this.prop('innerHTML', html);
        },
        text: function (txt) {
            if (txt || txt == '') {
                this.each(function () {
                    this.innerHTML = '';
                    var temp = document.createTextNode(txt + '');
                    this.appendChild(temp);
                })
            } else {
                var res = [];
                getStyle(this[0], res);
                return res.join(' ');
            }
            function getStyle(node, list) {
                var arr = node.childNodes;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].nodeType === 3) {
                        list.push(arr[i].nodeValue);
                    }
                    if (arr[i].nodeType === 1) {
                        getStyle(arr[i], list);
                    }
                }
            }
        }
    })
    //动画处理模块
    // 动画处理
    //将相关的动画函数通过原型的extend方法
    ching.fn.extend({
        //定义intervalId，主要目的用于后面的stop方法能够调用intervalId
        intervalId: null,
        //定义stop方法，用于停止动画
        stop: function () {
            //停止动画的相关处理
            clearInterval(this.intervalId);
            this.intervalId = null;
        },
        //给原型添加animate函数
        animate: function (propertys, dur, easing, fn) {
            //为了后面方便使用当前的ching对象，用一个变量存储一下
            var iObj = this;
            //调用原型的ching对象
            this.each(function () {
                //在animate函数中调用move方法
                move(this, propertys, dur, easing, fn);
                //为了
                return this;
            })
            function move(node, propertys, dur, easing, fn) {
                var start = {},
                    isOver = false,
                    startTime = +new Date();
                for (var k in propertys) {
                    var temp = parseInt(ching.getStyle(node, k));
                    start[k] = temp;
                }
                iObj.intervalId = setInterval(function () {
                    var deltaTime = (+new Date()) - startTime;
                    if (deltaTime >= dur) {
                        clearInterval(iObj.intervalId);
                        deltaTime = dur;
                        isOver = true;
                    }
                    easing = easing || 'line';
                    for (var k in propertys) {
                        node.style[k] = start[k] +
                            g(deltaTime, start[k], parseInt(propertys[k]), dur, easing) + 'px';
                    }
                    if (isOver && fn) {
                        fn.call(node);
                    }
                }, 20)
            }

            function g(deltaTime, start, end, dur, easing) {
                if (easing == 'line') {
                    var speed = (end - start) / dur;
                    return speed * deltaTime;
                } else if (easing == 'change') {
                    var distance = end - start;
                    return Math.log(deltaTime + 1) / Math.log(dur + 1) * distance;
                }
            }
        }
    })

//相当于暴露入口函数
    window.ching = window.C = ching;
//整个框架在沙包中  闭包框架中的变量污染外部环境
})(window);