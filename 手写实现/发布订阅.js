
class eventEmmiter{
    constructor(){
        this.state = {}
    }
    on(eventName, fn){
        if(!this.state[eventName]){
            this.state[eventName] = [fn] 
        }else {
            this.state[eventName].psuh(fn)
        }
    }
    off(eventName, fn){
        if(!this.state[eventName]){
            return
        }else {
            this.state[eventName] = this.state[eventName].filter(it => it !== fn)
        }
    }
    emit(eventName, ...args){
        if(!this.state[eventName]){
            return
        }else {
            this.state[eventName].forEach(it => it(...args))
        }
    }
    once(eventName, fn, ...args){
        const cb = () => {
            fn(...args)
            this.off(eventName, cb)
        }
        this.on(eventName, cb)
    }
}