const axios = require("axios")
const {JSDOM} = require("jsdom")

async function main(){
    const data = await axios.get("https://www.gensh.in/events/promotion-codes")
    const dom = new JSDOM(data.data)
    let list = dom.window.document.querySelectorAll("div.promocode-row > div:nth-child(5) > span")
    let array = (Array.apply(null, list)).map(ele => ele.textContent)

    const dataWiki = await axios.get("https://genshin-impact.fandom.com/wiki/Promotional_Codes")
    const domWiki = new JSDOM(dataWiki.data)
    let listWiki = domWiki.window.document.querySelectorAll("#mw-content-text > div.mw-parser-output > table > tbody > tr > td:nth-child(1)")
    let arrayWiki = (Array.apply(null, listWiki)).map(ele => ele.textContent.replaceAll(/ *\[[^\]]*]/,"").replace("\n","").replaceAll(/ *\([^)]*\) */g, ""))
    arrayWiki = arrayWiki.filter(ele => !ele.spaces())
    arrays = [...array, ...arrayWiki].remdup()
    console.log(arrays)
    console.log(arrays.length)
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

Array.prototype.remdup = function () {
    let s = new Set(this);
    let it = s.values();
    return Array.from(it);
}