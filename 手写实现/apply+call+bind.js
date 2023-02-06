
const obj = {id: 'qqq'};
function a(a, b, c){
    console.log(this,  a, b, c);
}

Function.prototype.myapply = function(context, params){
    if(typeof a  !== "function"){
        throw new TypeError("this must be a function");
    }
    const key = Symbol("11")
    context[key] = this;
    context[key](...params);
    delete context[key];
}


Function.prototype.mycall = function(context, ...args){
    if(typeof a  !== "function"){
        throw new TypeError("this must be a function");
    }
    const key = Symbol("11")
    context[key] = this;
    context[key](...args);
    delete context[key];
}

Function.prototype.mybind = function(context){
    if(typeof a  !== "function"){
        throw new TypeError("this must be a function");
    }
    const key = Symbol("11")
    context[key] = this;
    // 
    // delete context[key];
    return function(...args){
        context[key](...args);
    }
}

a.mybind(obj)(4, 5,6)