// console.log( new Date().getTime())
function x () {
    let a = 1
    let b = 2
    let c = 3

    return [a, b, c]
}
let [a, b, c] = x()
console.log(a, b, c);
// multi return 불가 