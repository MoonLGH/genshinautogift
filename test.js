const axios = require("axios")
const {JSDOM} = require("jsdom")

async function main(){
    const data = await axios.get("https://genshin-impact.fandom.com/wiki/Promotional_Codes")
    const dom = new JSDOM(data.data)
    
    let list = dom.window.document.querySelectorAll("#mw-content-text > div.mw-parser-output > table > tbody > tr > td:nth-child(1)")
    let array = (Array.apply(null, list)).map(ele => ele.textContent.replaceAll(/ *\[[^\]]*]/,"").replace("\n","").replaceAll(/ *\([^)]*\) */g, ""))
    array = array.filter(ele => !ele.spaces())
    console.log(array)
}

main()

String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.spaces = function() {
    if(this.indexOf(' ') >= 0){
        return true
    }
    return false
}
