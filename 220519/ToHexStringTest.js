const toHexString = (byteArray) => {
    // byte 값들을 문자열로 치환 
    let testChar = Array.from(byteArray, (byte) => {
        let char = ('0' + (byte & 0xFF).toString(16)).slice(-2);
        // 0xFF 16진수 F하나에 bit 4개 
        // 0000 0000랑 &연산 한다는 뜻
        console.log(char);
        return char;
    }).join('');

    console.log(testChar)
}

toHexString([1,30])