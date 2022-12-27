// im gonna change the code - albi

const prompt = require('prompt-sync')();
const crypto = require('crypto');
const req = require('request');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var wallet = prompt("Enter your wallet: ");
var times = parseInt(prompt("How much times to mine (max 250): "));

var getJSON = function(url) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';

  //(xhr.onload removed here because it was used for returning a callback, which I don't need.)

  xhr.send();
}
// https://stackoverflow.com/questions/61628631/how-can-i-get-json-from-an-api-url-on-node-js

// fix the requests so they are fetch or smth
if (times < 250) {
  function getid() {
    return getJSON('https://coin.funwithalbi.xyz/api/block.php?getid=true&wallet=' + wallet)
  }

  function mine(nonce, id, hash) {
    var link = "https://coin.funwithalbi.xyz/api/block.php?nonce=" + nonce + "&to=" + wallet + "&id" + id + "&hash" + hash;
    return getJSON(link)
  }

  function getBalance() {
    return getJSON('https://coin.funwithalbi.xyz/api/getbalance.php?wallet=' + wallet).balance
  }

  var nonce = 0;

  console.log('\n');

  var id = getid();

  var uid = id.id
  var money = id.value
  var trans = id.transactions
  var trans = JSON.stringify(trans).replace(" ", "").replace(money, money.subStr(0, 7));

  while (true) {
    nonce += 1;
    var thing = nonce + "|1|" + money.subStr(0, 7) + "|[" + trans + "]|" + uid + "|alb";
    var hash = crypto.createHash(thing);
    if (hash.subStr(0, 4) == "0000") {
      var block = mine(nonce, uid, hash);
      var code = block.code

      if (code == 200) {
        console.log(`[+] Mined ${money} ALC!`)
      }
      else {
        var error = block.error
        console.log(`[-] Failed to mine ${money} ALC... (${error})`)
      }
      nonce = 0
      break;
    }
  }

  console.log("Done! New Balance: " + getbalance().toString() + " ALC")
}