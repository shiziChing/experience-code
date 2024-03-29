
// function add(a, b, c) {
//     return a + b + c;
// }
// // console.log(add.length)

// function curry(func) {
//     const curried = (...args) => {// [1, 2, 3]
//         if(args.length < func.length){//[2]
//             return (...rest)=>curried(...args,...rest);// [1,2,3]
//         }
//         return func(...args); //6
//     }
//     return curried;
// }



const add = (a, b, c) => {
    return a+b+c;
}

function curry(fn){
    const curried = (...args) => {
        if(args.length === fn.length) return fn(...args);
        if(args.length < fn.length){
            return (...rest) => curried(...args, ...rest);
        }
    }

    return curried
}
const curriedAdd = curry(add);
console.log(curriedAdd(1, 2, 3));
console.log(curriedAdd(1)(2, 3));
console.log(curriedAdd(1)(2)(3));
