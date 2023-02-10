// 谈谈对 async/await 的理解，async/await 的实现原理是什么?
// 1）async/await 就是 Generator 的语法糖，使得异步操作变得更加方便
// 2）async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成await
// 3）async 是 Generator 的语法糖，这个糖体现在这几个方面：
// async函数内置执行器，函数调用之后，会自动执行，输出最后结果，而Generator需要调用next或者配合co模块使用
// 更好的语义，async和await，比起星号和yield，语义更清楚了，async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果
// 更广的适用性，co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值
// 返回值是Promise，async函数的返回值是 Promise 对象，Generator的返回值是 Iterator，Promise 对象使用起来更加方便
// 4）async/await 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里
// 5）实例代码分析：

function my_co(it) {
    return new Promise((resolve, reject) => {
        function next(data) {
            try {
                var { value, done } = it.next(data);
            } catch (e) {
                return reject(e);
            }
            if (!done) {
                //done为true,表示迭代完成
                //value 不一定是 Promise，可能是一个普通值。使用 Promise.resolve 进行包装。
                Promise.resolve(value).then(val => {
                    next(val);
                }, reject);
            } else {
                resolve(value);
            }
        }
        next(); //执行一次next
    });
}
function* test() {
    yield new Promise((resolve, reject) => {
        setTimeout(resolve, 100);
    });
    yield new Promise((resolve, reject) => {
        // throw Error(1);
        resolve(10)
    });
    yield 10;
    return 1000;
}

my_co(test()).then(data => {
    console.log(data); //输出1000
}).catch((err) => {
    console.log('err: ', err);
});