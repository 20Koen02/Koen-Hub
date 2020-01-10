const c = require('chalk');
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}


function formatDate(date) {
    return `${date.getHours().pad(2)}:${date.getMinutes().pad(2)}:${date.getSeconds().pad(2)} ${date.getDate().pad(2)}-${(date.getMonth()+1).pad(2)}-${date.getFullYear()}`
}

let log = (msg) => {
    console.log(`${c.black.bgCyan(formatDate(new Date()))}  ${c.black.bgYellow("INFO")}  =>  ${c.yellow(msg)}`)
}

module.exports = {
    log: log
}