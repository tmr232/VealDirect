/*
 *  Use this http://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed
 *  to get the clicked element.
 *  Than use css :after and content: attr(data-hint) to add a hint with the real URL!
 */

var redirectRE = /HTTP\/1\.1 3[\d]{2}/;


function getLocation(responseHeaders) {
    for (var i = responseHeaders.length - 1; i >= 0; --i) {
        if (responseHeaders[i].name === "Location") {
            return responseHeaders[i].value;
        }
    }
    
    throw new Error("No 'Location' in headers.");
}


function callbackOnExecuteScriptFactory(tabId, message) {
    /* Tell the tab to change the link! */
    function callbackOnExecuteScript() {
        console.log("tabID " + tabId);
        chrome.tabs.sendMessage(tabId, message);
    }

    return callbackOnExecuteScript;
}


function callbackOnHeadersReceivedFactory(tabId, originalUrl) {
    function callbackOnHeadersReceived(info) {
        console.log(info);
        console.log("Abc");
        var redirectLocation = originalUrl;
        console.log(info.statusLine.match(redirectRE));
        if (null !== info.statusLine.match(redirectRE)) {
            /* Get the redirect url */
            redirectLocation = getLocation(info.responseHeaders);
        }
		/* Inject code to set a listener on the events... */
		var message = {type:"getClickedEl", original:originalUrl, redirect:redirectLocation};
		chrome.tabs.sendMessage(tabId, message);

        return {cancel:true};
    }
    
    return callbackOnHeadersReceived;
}
var optExtraInfoSpec = ["blocking", "responseHeaders"];

function sendXHR(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send(null);
    
    return xhr;
}


function onClickCallback(info, tab) {
    console.log(info);
    console.log(tab);
    var linkUrl = info.linkUrl;
    
    chrome.webRequest.onHeadersReceived.addListener(
            callbackOnHeadersReceivedFactory(tab.id, linkUrl),
            {types:["xmlhttprequest"], urls:[linkUrl]},
            ["blocking", "responseHeaders"]
        );
    
    var xhr = sendXHR(linkUrl);
    console.log(xhr);
}

var createProperties = {contexts:["link"], title:"VealDirect", onclick:onClickCallback};
function contextMenuCallback() {
    console.log(arguments);
}
chrome.contextMenus.create(createProperties, contextMenuCallback);