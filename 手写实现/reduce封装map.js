

Array.prototype.mymap = function (fn){
    return this.reduce((prev, cur, index, arr) => {
        return [...prev, fn(cur, index, arr)]
    }, [])
}