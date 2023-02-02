
const obj = {
    a: 1,
    b: {
        c: 2
    },
    d: {
        e: 3,
        f: 4
    },
    g: [1,2,3,4]
}
const obj1 = {
    name: 'Jack',
    address: {
        x: 100,
        y: 200
    }
}
function cloneDeep(obj, cache = new WeakMap()) {
    // const res = {};
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (cache.has(obj)) return cache.get(obj);//  防止循环引用

    const copyObj = new obj.constructor();
    cache.set(obj, copyObj)

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copyObj[key] = cloneDeep(obj[key], cache)
        }
    }

    return copyObj;
}
// const res = cloneDeep(obj);
// console.table('res------>', res)

function deepCopy(obj, cache = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj //原始值
    if (obj instanceof Date) return new Date(obj) //日期值
    if (obj instanceof RegExp) return new RegExp(obj) //正则

    if (cache.has(obj)) return cache.get(obj) //防止循环引用情况
    let copyObj = new obj.constructor() //创建一个和obj类型一样的对象
    cache.set(obj, copyObj) //放入缓存中
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copyObj[key] = deepCopy(obj[key], cache)
        }
    }
    return copyObj
}

// const obj1 = {
//     name: 'Jack',
//     address: {
//         x: 100,
//         y: 200
//     }
// }
// obj1.a = obj1

// console.log(copyObj.address === obj.address)  //false

function cloneDeep(obj, cache = new WeakMap()) {
    if(obj === null || typeof obj !== 'object'){
        return obj;
    }
    if(cache.has(obj)) return cache.get(obj);

    const cloneObj = new obj.constructor(obj);
    for(const key in obj){
        cloneObj[key] = cloneDeep(obj[key], cache);
    }
    cache.set(obj, cloneObj);
    return cloneObj;
}
let copyObj = cloneDeep(obj1)
console.log('00000----->', copyObj)