//  在有赞遇到的算法


// 将一天24小时按每半小划分成48段，我们用一个位图表示选中的时间区间，
// 例如`110000000000000000000000000000000000000000000000`，
// 表示第一个半小时和第二个半小时被选中了，其余时间段都没有被选中，
// 也就是对应00:00~01:00这个时间区间。一个位图中可能有多个不连续的
// 时间区间被选中，例如`110010000000000000000000000000000000000000000000`，
// 表示00:00-1:00和02:00-02:30这两个时间区间被选中了。

// 要求：写一个函数timeBitmapToRanges，将上述规则描述的时间位图转换成一个选中时间区间的数组。
// 示例输入：`"110010000000000000000000000000000000000000000000"`
// 示例输出：`["00:00~01:00", "02:00~02:30"]` 
// 0              1                    2            3               4               5              6
// 00:00 ~ 00:30  00:30 ~ 01:00    01:00 ~ 01:30    01:30 ~ 02:00   02:00 ~ 02:30   02:30 ~ 03:00  03:00 ~ 03:30
// [{"start":0,"end":2}, {"start":4,"end":5}]

function timeBitmapToRanges(val) {
    if (typeof val !== 'string') {
        throw new Error("类型错误")
        return;
    }
    if (val.length !== 48) {
        throw new Error("字符串长度不是48")
        return;
    }
    const sourceArr = val.split('');
    const activeIndex = [];
    for (let i = 0; i < sourceArr.length; i++) {
        if (sourceArr[i] == 1) activeIndex.push(i)
    }
    // console.log(activeIndex);
    return parseIndex(activeIndex);
}
function parseIndex(activeIndex) {
    const filterArr = getSerialIndex(activeIndex)
    console.log(filterArr)
    let result = []
    for (let i = 0; i < filterArr.length; i++) {
        const start = filterArr[i][0]
        const end = filterArr[i][filterArr[i].length - 1]
        //  判断始末时间的奇偶性
        const startTemp = start % 2 === 0 ? `${tool(start / 2)}:00` : `${tool(Math.floor(start / 2))}:30`;
        const endTemp = end % 2 === 0 ? `${tool(end / 2)}:30` : `${tool(Math.ceil(end / 2))}:00`;
        result[i] = `${startTemp}~${endTemp}`;
        // if (start % 2 === 0 && end % 2 === 1) {  //  始偶末奇
        //     result[i] = `${tool(start / 2)}:00~${tool(Math.ceil(end / 2))}:00`
        // } else if (start % 2 === 0 && end % 2 === 0) {   //  始偶末偶
        //     result[i] = `${tool(start / 2)}:00~${tool(end / 2)}:30`
        // } else if (start % 2 === 1 && end % 2 === 1) {  // 始奇末奇
        //     result[i] = `${tool(Math.floor(start / 2))}:30~${tool(Math.ceil(end / 2))}:00`
        // } else if (start % 2 === 1 && end % 2 === 0) { // 始奇末偶
        //     result[i] = `${tool(Math.floor(start / 2))}:30~${tool(end / 2)}:30`
        // }
        // if (filterArr[i].length === 1) {  // 就一项 没有连续
        //     // result[i] = 
        //     if (filterArr[i][0] % 2 === 0) {
        //         // console.log(filterArr[i][0])
        //         const temp = filterArr[i][0] / 2
        //         result[i] = `${tool(temp)}:00~${tool(temp)}:30`
        //     } else {
        //         const temp = filterArr[i][0] / 2
        //         result[i] = `${tool(Math.floor(temp))}:30~${tool(Math.ceil(temp))}:00`
        //     }
        // } else if (filterArr[i].length > 1) {  //  有连续的
        //     const start = filterArr[i][0]
        //     const end = filterArr[i][filterArr[i].length - 1]
        //     // console.log(filterArr[i])
        //     // console.log(start, end)
        //     //  判断始末时间的奇偶性
        //     if (start % 2 === 0 && end % 2 === 1) {  //  始偶末奇
        //         // console.log('始偶末奇')
        //         result[i] = `${tool(start / 2)}:00~${tool(Math.ceil(end / 2))}:00`
        //     } else if (start % 2 === 0 && end % 2 === 0) {   //  始偶末偶
        //         result[i] = `${tool(start / 2)}:00~${tool(end / 2)}:30`
        //     } else if (start % 2 === 1 && end % 2 === 1) {  // 始奇末奇
        //         result[i] = `${tool(Math.floor(start / 2))}:00~${tool(Math.ceil(end / 2))}:30`
        //     } else if (start % 2 === 1 && end % 2 === 0) { // 始奇末偶
        //         result[i] = `${tool(Math.floor(start / 2))}:30~${tool(end / 2)}:30`
        //     }
        // }
    }
    console.log(result)
    return result

}
function tool(val) {
    return val > 10 ? val : '0' + val
}
function getSerialIndex(arr) { // 将连续的index拼接在一起
    const result = [];
    let i = 0;
    result[i] = [arr[0]];
    arr.reduce(function (prev, cur) {
        cur - prev === 1 ? result[i].push(cur) : result[++i] = [cur];
        return cur;
    });
    return result;
}
console.log(timeBitmapToRanges('010000110000000000000000000100000000000011100000'))