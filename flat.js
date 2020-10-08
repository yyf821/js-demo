const flat = function (arr) {
    let result = arr.reduce((accumulator, currentValue) => {
        return accumulator.concat(
            Array.isArray(currentValue) ? flat(currentValue) : currentValue
        )
    }, [])
    return result
}

// const arr2 = [0, 1, 2, [[[3, 4]]]];
// console.log(flat(arr2));
function toObject(str) {
    let arr = str.split('&')
    let obj = {}
    arr.forEach(element => {
        let index = element.indexOf('=')
        let left = element.slice(0, index)
        let right = element.slice(index + 1)
        obj[left] = right
    });
    return obj
}
// console.log(toObject("a=1&b=2&c=3"));
var sortArray = function (nums) {
    if (nums.length < 2) {
        return nums
    }
    let p = nums[0]
    let left = nums.slice(1).filter(num => num <= p)
    let right = nums.slice(1).filter(num => num > p)
    return sortArray(left).concat(p).concat(sortArray(right))
};
console.log(sortArray([5,1,1,2,0,0]));