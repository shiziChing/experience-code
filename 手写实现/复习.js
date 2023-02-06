

// 1.  发布订阅

class eventListener {
    constructor(){
        this.state = {}
    }
    on(eventName, fn){
        if(!this.state[eventName]){
            this.state[eventName] = [fn]
        }else {
            this.state[eventName].push(fn)
        }
    }

    off(eventName, fn){
        if(!this.state[eventName]){
            return
        }else {
            this.state[eventName] = this.state[eventName].filter(it => it !== fn)
        }
    }
    emit(eventName, ...args) {
        if(!this.state[eventName]){
            return
        }else {
            this.state[eventName].forEach(it => it(...args))
        }
    }
    once(eventName, cb) {
        const fn = (...args) => {
            cb(...args);
            this.off(eventName, fn)
        }
        this.on(eventName, fn)
    }
}

//  2. 柯里化

const  add = (a, b, c) => {
    return a + b + c;
}


function curry(fn){
    const curried = (...args) => {
        if(args.length < fn.length){
            return (...rest) => curried(...args, ...rest);
        }else{
            return fn(...args);
        }
    }

    return curried;
}

const curried = curry(add)
console.log(curried(1, 2, 3))
console.log(curried(1)(2, 3))
console.log(curried(1)(2)(3))


//  深拷贝
const obj = {
    a: 1,
    b: {
        c: 2
    },
    d: [1, 3, 5, 7]
}
function deepClone(obj, cache = new WeakMap()) {
    if(obj === null || typeof obj !== 'object'){
        return obj
    }
    if(cache.has(obj)){
        return cache.get(obj)
    }
    const cloneObj = new obj.constructor()
    cache.set(obj, cloneObj)
    for(const key in obj){
        if(obj.hasOwnProperty(key)){
            cloneObj[key] = deepClone(obj[key])
        }
    }
    return cloneObj
}
console.log(deepClone(obj))

//  reduce 封装map

Array.prototype.mymap = function(fn){
    return this.reduce((prev, cur, index, arr) => {
        return [...prev, fn(cur, index, arr)]
    }, [])
}