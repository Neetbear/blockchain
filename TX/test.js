// const arr = [10,20,30,40];
// for(let i=0; i<arr.length; i++){
//     setTimeout(()=>{
//         console.log(`index ${i} = ${arr[i]}`)
//     }, 3000)
// }

class Test {
    constructor(eyes, nose) {
        this.eyes = 2;
        this.nose = 1;
    }
}

const kim =  new Test()
console.log(kim);
console.log(kim.prototype);
console.log(kim.__proto__);

function Test2 () {}

Test2.prototype.eyes = 2;
Test2.prototype.nose = 1;

const park = new Test2()
console.log(park);
console.log(park.prototype);
console.log(park.__proto__.__proto__);

function Test3 () {
    this.eyes = 2
    this.nose = 1
}

const lee = new Test3()
console.log(lee)
console.log(lee.prototype)
console.log(lee.__proto__)