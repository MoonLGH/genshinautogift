
# genshinautogift

This program will get the newset genshin promotional code and redeem it


## Usage/Examples
Go to https://genshin.hoyoverse.com/en/gift 
> After that login into your mihoyo account
Open Developer console and paste this code 
```js
let cookie = document.cookie ; cookie = cookie.split('; ')
let data = []
let dataobj = {}
cookie.forEach(docdata => {
if(docdata.startsWith(`account_id`) || docdata.startsWith('cookie_token')){
    docdata = docdata.split("=")
    dataobj[docdata[0]] = docdata[1]
}
});
console.log(dataobj)
```
After that go to 
Go to https://github.com/YOUR_USERNAME/YOUR_REPO/settings/variables/actions

add a new variables with the with the name "login_data", and the value is the result of above code.

And then make a new Github Workflows/actions with the value like this
```yml
on:
  schedule:
    # Runs every 40 minutes or use crontab.guru for custom cron execution
    - cron: '*/30 * * * *'
  workflow_dispatch:

jobs:
  checking-and-redeem-codes:
    name: check-latest-codes
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: genshinautogift check
        uses: MoonLGH@/genshinautogift@main
 ```
