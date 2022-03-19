require("dotenv").config()
const axios = require("axios")
const {JSDOM} = require("jsdom")
let currentList = require("./current.json")
let sleep = require('util').promisify(setTimeout)

async function getNewCode(){
    const data = await axios.get("https://www.gensh.in/events/promotion-codes")
    const dom = new JSDOM(data.data)
    let list = dom.window.document.querySelectorAll("div.promocode-row > div:nth-child(5) > span")
    let array = (Array.apply(null, list)).map(ele => ele.textContent)
    return array
}

async function main() {
    let newList = await getNewCode()
    let diff = newList.filter(ele => !currentList.includes(ele))
    newList = [...currentList,...diff]
    if(diff.length > 0){
        require("fs").writeFileSync("./current.json", JSON.stringify(newList))
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
    let cookie = {
        cookie_token : process.env.token,
        account_id : process.env.account_id,
        uid: process.env.uid,
    }
    let url = `https://hk4e-api-os.hoyoverse.com/common/apicdkey/api/webExchangeCdkey?uid=${cookie.uid}&region=os_asia&lang=en&cdkey=${code}&game_biz=hk4e_global`
    let data = await axios.get(url, {
        headers : {
            "Cookie" : `cookie_token=${cookie.cookie_token}; account_id=${cookie.account_id}`
        }
    })
    return data.data
}

main()
