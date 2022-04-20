// -= GLOBAL VARIABLES =- //

let defaultHTML = '';
let formatedHTML = '';

let metarAvailable = false;
let tafAvailable = false;

// -= FUNCTIONS =- //

function addObserverIfDesiredNodeAvailable() {
    var div = document.querySelector('div[style="position: absolute; left: 0px; top: 0px; z-index: 107; width: 100%;"]')

    if(!div) {
        //The node we need does not exist yet.
        //Wait 500ms and try again
        // console.log("div not found. Retrying in 1 second.");
        window.setTimeout(addObserverIfDesiredNodeAvailable,1000);
        return;
    }

    var observer = new MutationObserver(function (event) {
        event.forEach(function (mutation) {
            mutation.addedNodes.forEach(function(added_node) {
                added_node.childNodes.forEach(function(sub_node) {
                    sub_node.childNodes.forEach(function(subsub_node) {
                        if(subsub_node.className == 'ad-info-metar-taf') {
                            adjustMetarTaf();
                        }
                    })
                })
            })
        })
    })

    observer.observe(div, {
        subtree: true,
        childList: true, 
        characterData: true
    })
}
addObserverIfDesiredNodeAvailable();

function spaceUp(strArr) {
    let prevObj = '';
    let spacedArr = [];
    for (y in strArr) {
        if ((('PROB30' == strArr[y]) || ('PROB40' == strArr[y]) || ('TEMPO' == strArr[y]) || ('BECMG' == strArr[y]) || ('RMK' == strArr[y])) && (('PROB30' != prevObj) && ('PROB40' != prevObj))) {
            spacedArr[y] = ('<br>&ensp;&nbsp;' + strArr[y] + ' ')
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

// -= MAIN =- //

function adjustMetarTaf() {
    let metar_taf = document.getElementsByClassName("ad-info-metar-taf");
    const children = metar_taf[0].childNodes;
    defaultHTML = metar_taf[0].innerHTML;
    
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
        content[0] += '<br>';
        tmpArr = content[1].split(' ');
        content[1] = spaceUp(tmpArr).join(' ');
        content[1] = '<div style="padding-left: 1rem;">' + content[1] + '</div>'
    }

    if (tafAvailable) {
        content[2] += '<br>';
        tmpArr = content[3].split(' ');
        content[3] = spaceUp(tmpArr).join(' ');
        content[3] = '<div style="padding-left: 1rem;">' + content[3] + '</div>'
    }

    for (let i = 0; i < content.length - 1; i++) {
        if (content[i].charAt(content[i].length - 8) == '=') {
            content[i] += '<br>';
        }
    }

    // Display content on website
    let button = '<div id="toggleButton"><input type="checkbox" id="checkToggle" name="Toggle" title="Toggle formated view" checked></input></div>';
    
    formatedHTML = content.join(' ');

    document.getElementsByClassName('ad-info-metar-taf')[0].innerHTML = '<div style="position: relative;"><div id="contentmettaf">' + formatedHTML + '</div>' + button + '</div>';

    let checkbox = document.getElementById('checkToggle');
    checkbox.addEventListener('change', () => {
        if(checkbox.checked) {
            document.getElementById('contentmettaf').innerHTML = formatedHTML;
        } else {
            document.getElementById('contentmettaf').innerHTML = defaultHTML;
        }
      });
}