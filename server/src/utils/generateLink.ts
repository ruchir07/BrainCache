export function random(len:number):string{
    let options = "qwjeiqjewiqj23234hgjf";
    let length = options.length;

    let ans = "";
    for(let i=0;i<len;i++){
        ans += options[Math.floor(Math.random()*length)];
    }
    return ans;
}