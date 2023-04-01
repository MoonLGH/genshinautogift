require("dotenv").config()
const axios = require("axios")
const {JSDOM} = require("jsdom")
let currentList = require("./data/current.json")
let sleep = require('util').promisify(setTimeout)

async function getNewCode(){
    const data = await axios.get("https://www.gensh.in/events/promotion-codes")
    const dom = new JSDOM(data.data)
    let list = dom.window.document.querySelectorAll("div.promocode-row > div:nth-child(5) > span")
    let array = (Array.apply(null, list)).map(ele => ele.textContent)

    const dataWiki = await axios.get("https://genshin-impact.fandom.com/wiki/Promotional_Codes")
    const domWiki = new JSDOM(dataWiki.data)
    let listWiki = domWiki.window.document.querySelectorAll("#mw-content-text > div.mw-parser-output > table > tbody > tr > td:nth-child(1)")
    let arrayWiki = (Array.apply(null, listWiki)).map(ele => ele.textContent.replaceAll(/ *\[[^\]]*]/,"").replace("\n","").replaceAll(/ *\([^)]*\) */g, ""))
    arrayWiki = arrayWiki.filter(ele => !ele.spaces())
    return [...array, ...arrayWiki].remdup()
}

async function main() {
    let newList = await getNewCode()
    let diff = newList.filter(ele => !currentList.includes(ele))
    newList = [...currentList,...diff]
    if(diff.length > 0){
        require("fs").writeFileSync("./data/current.json", JSON.stringify(newList))
        for(let i = 0; i < diff.length; i++){
            let code = diff[i]
            let data = await login(code)
            console.log(`${code} : ${JSON.stringify(data)}`)
            await sleep(10000)
        }
    } else {
        console.log("No new code")
    }

}

async function login(code){
    let cookie = process.env.login_data
    if(cookie === "") throw new Error(`Login Credentials is Empty!`)
    try{
        JSON.parse(cookie)
    }catch(err){
        throw new Error(`Login Credentials is not A Valid JSON!`)
    }
    let url = `https://sg-hk4e-api.hoyoverse.com/common/apicdkey/api/webExchangeCdkey?uid=${account_id}&region=os_asia&lang=en&cdkey=${code}&game_biz=hk4e_global`
    let data = await axios.get(url, {
        headers : {
            "Cookie" : `cookie_token=${cookie.cookie_token}; account_id=${cookie.account_id}`
        }
    })
    return data.data
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