// Global Variables

let open = false;
let metarAvailable = false;
let tafAvailable = false;

// Functions //

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText;
}

function spaceUp(strArr) {
    let prevObj = '';
    let spacedArr = [];
    for (y in strArr) {
        if ((('PROB30' == strArr[y]) || ('PROB40' == strArr[y]) || ('TEMPO' == strArr[y]) || ('BECMG' == strArr[y])) && (('PROB30' != prevObj) && ('PROB40' != prevObj))) {
            spacedArr[y] = ('<br>&emsp;&ensp;&nbsp;' + strArr[y] + ' ')
        } else if ('METAR:' == strArr[y] || 'TAF:' == strArr[y]) {
            spacedArr[y] = ('<b>' + strArr[y] + '</b> ')
        } else if (('=' == strArr[y]) && i < strArr.length - 1) {
            spacedArr[y] = (strArr[y] + '<br><br>')
        } else {
            spacedArr[y] = (strArr[y] + ' ')
        }
        prevObj = strArr[y];
    }
    return spacedArr;
}

function toggleView() {
    let windowCheck = document.getElementsByClassName("ad-info-metar-taf");
    if ((windowCheck.length > 0) && (open == false)) {
        open = true;
        adjustMetarTaf();
    }

    if ((windowCheck.length == 0) && (open == true)) {
        open = false;
        metarAvailable = false;
        tafAvailable = false;
    }
}

// -= MAIN =- //

function adjustMetarTaf() {
    let metar_taf = document.getElementsByClassName("ad-info-metar-taf");
    const children = metar_taf[0].childNodes;
    
    // Extract childNodes from htmlObject
    
    let content = [];
    for (nodes of children) {
        if (nodes.nodeName == "B") {
            content.push(nodes.outerHTML);
        } else if (nodes.nodeName == "#text") {
            content.push(nodes.nodeValue);
        }
    }

    // Analyze what information is available

    if (content[0] == '- ' && content[3] == '- ') {
        return;
    } else if (content[3] == ': not available!') {
        metarAvailable = true;
    } else {
        metarAvailable = true;
        tafAvailable = true;
    }
    
    // Format information

    let tmpArr = [];
    if (metarAvailable) {
        content[0] += '<br>&ensp;';
        tmpArr = content[1].split(' ');
        content[1] = spaceUp(tmpArr).join(' ');
    }

    if (tafAvailable) {
        content[2] += '<br>&ensp;';
        tmpArr = content[3].split(' ');
        content[3] = spaceUp(tmpArr).join(' ');
    }

    for (let i = 0; i < content.length - 1; i++) {
        if (content[i].charAt(content[i].length - 2) == '=') {
            content[i] += '<br><br>';
        }
    }

    // Display content on website

    document.getElementsByClassName('ad-info-metar-taf')[0].innerHTML = content.join(' ');
}

var checkLoop = setInterval(toggleView, 500);