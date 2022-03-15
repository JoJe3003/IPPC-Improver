
// const container = document.getElementById("ippcwide-main");
// var observer = new MutationObserver(entries => {
//     console.log(entries)
// })
// observer.observe(container, { childList: true })

let open = false;

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText;
}

function toggleView() {
    let windowCheck = document.getElementsByClassName("ad-info-metar-taf");
    if ((windowCheck.length > 0) && (open == false)) {
        open = true;
        adjustMetarTaf();
    }

    if ((windowCheck.length == 0) && (open == true)) {
        open = false;
    }
}

function adjustMetarTaf() {
    let metar_taf = document.getElementsByClassName("ad-info-metar-taf");

    // console.log(metar_taf);
    // console.log(typeof metar_taf);

    if (metar_taf.length != 0) {
        let mtstring = metar_taf[0].innerHTML;
        if(mtstring.charAt(0) == '-') {return;}

        mtstring = strip(mtstring);
        console.log('mtstring = ' + mtstring);

        mtstring = mtstring.replaceAll('  ', ' ');

        let info = mtstring.split("=");

        let strArr = [];
        
        for (let i = 0; i < info.length; i++) {
            if (info[i].length <= 1) {
                info.splice(i, i);
            } else {
                if (info[i].charAt(0) == '-') {
                    console.log('Not available detected!');
                } else {
                    strArr[i] = info[i].split(' ');
                    strArr[i].push("=");
                    console.log(strArr[i]);    
                }
            }
        }
        
        console.log('strArr = ' + strArr);
        
        let newStr = '';
        let prevObj = '';

        for (let i = 0; i < strArr.length; i++) {
            for (y in strArr[i]) {
                if ((('PROB30' == strArr[i][y]) || ('PROB40' == strArr[i][y]) || ('TEMPO' == strArr[i][y]) || ('BECMG' == strArr[i][y])) && (('PROB30' != prevObj) && ('PROB40' != prevObj))) {
                    newStr += ('<br>' + strArr[i][y] + ' ')
                } else if ('METAR:' == strArr[i][y] || 'TAF:' == strArr[i][y]) {
                    newStr += ('<b>' + strArr[i][y] + '</b> ')
                } 
                else if (('=' == strArr[i][y]) && i < strArr.length - 1) {
                    newStr += (strArr[i][y] + '<br><br>')
                } else {
                    newStr += (strArr[i][y] + ' ')
                }
                prevObj = strArr[i][y];
    
                console.log(prevObj);
                console.log(y);
            }
        }

        // newstr = mtstring.replace('<b>', '');
        // newstr = newstr.replace('</b>', '');
        // newstr = newstr.replace('=', '= <br> ');
        // newstr = newstr.replace('TEMPO', ' <br> TEMPO');
        // newstr = newstr.replace('BECMG', ' <br> BECMG');
        // newstr = newstr.replace('PROB40', ' <br> PROB40');
        // newstr = newstr.replace('PROB30', ' <br> PROB30');

        console.log(newStr);
        // console.log(metar_taf.length);
        // console.log(typeof metar_taf);
        // console.log(typeof strArr[1]);
        // console.log(metar_taf[0]);

        // for (i = 0; i < metar_taf[0].innerHTML.length; i++) {
        //     console.log(metar_taf[0].innerHTML[i]);
        // }

        // console.log(typeof metar_taf[0].innerHTML);

        document.getElementsByClassName('ad-info-metar-taf')[0].innerHTML = newStr;
    }
}

var checkLoop = setInterval(toggleView, 500);