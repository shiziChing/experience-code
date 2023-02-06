//  防抖  例如文本输入框输入操作，触发ajax请求

const debounce = (cb, delay) => {
    let timer;

    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            cb()
        }, delay);
    }
}

//  节流  例如鼠标滚轮事件

const  throttle = (cb, delay) => {
    let flag = true
    return function () {
        if(flag){
            setTimeout(() => {
                cb()
                flag = true
            }, delay);
        }
        flag = false
    }
}

function debounce(fn, delay) {
    let timer;
    return function() {
        if(timer) {
            clearTimeout(timer)
            timer = null;
        }
        timer = setTimeout(() => {
            fn()
        }, delay)

    }
}

function throttle(fn, delay) {
    let flag = true;

    return function() {
        if(flag) {
            setTimeout(() => {
                fn()
                flag = true
            }, delay)
        }
        flag = false
    }
}


function throttling(fn, delay){
    let time = 0;
    return function() {
        const now = Date.now();
        if(now - time > delay) {
            fn()
            time = now
        }
    }
}