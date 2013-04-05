/* 
 * Background script to manage the request handling.
 */

/*
 * Workflow for the extension:
 *      Content Script                  |       Background Script
 * 1. Sends the URL to test             | saves it in special list
 * 2. XMLHttpRequest to the desired URL | 
 * 3.                                   | Request capruted and data extracted
 * 4. replaces original link            | sends data back to content script
 * 
 * to make things faster for other links - only set the listener when waiting
 * for a url to test!
 */

//TODO: instead of adding and removing listeners, build a more robust one.
// Also, filter based on xmlhttprequest as well (other requests are not from the
// content script)
//
//function getLocation(responseHeaders) {
//    for (var i = responseHeaders.length - 1; i >= 0; --i) {
//        if (responseHeaders[i].name === "Location") {
//            return responseHeaders[i].value;
//        }
//    }
//    
//    return "";
//}
//
//var redirectRE = /HTTP\/1\.1 30[12378]/;
//function addListener(url, tabId, callbackUID, sendResponse) {
//    function callback(info) {
//        
//        // Get the location from the headers
//        var redirectLocation = getLocation(info.responseHeaders);
//        
//        // If no new location - no redirect. Continue as normal.
//        if (redirectLocation === "") {
//            chrome.webRequest.onHeadersReceived.removeListener(callback);
//            return;
//        }
////        console.log("response");
////        console.log(info);
////        console.log(redirectLocation);
//        // Send back the new url
//        //sendResponse({redirectUrl:redirectLocation});
////        console.log({redirectUrl:redirectLocation, callbackUID: callbackUID});
//        chrome.tabs.sendMessage(tabId, {redirectUrl:redirectLocation, callbackUID: callbackUID});
//        
//        // Remove the listener
//        chrome.webRequest.onHeadersReceived.removeListener(callback);
//        
//        return {cancel:true};
//    }
//    chrome.webRequest.onHeadersReceived.addListener(
//      callback,
//      {urls: [url]},
//      ["blocking", "responseHeaders"]
//      );
//          
//    sendResponse({url:url});
//    
//}
//
//function messageHandler(request, sender, sendResponse) {
////    console.log(sender.tab ?
////                "from a content script:" + sender.tab.url :
////                "from the extension");
////    console.log(request);
//    if (request.type === "urlquery") {
////        console.log("indeed?");
////        console.log(request);
//        addListener(request.url, sender.tab.id, request.callbackUID, sendResponse);
//        return true;
//    }
//}
//
//chrome.extension.onMessage.addListener(messageHandler);


/*
 *  New code starts here!
 */

/*
 * TODO:
 *  Use this http://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed
 *  to get the clicked element.
 *  Than use css :after and content: attr(data-hint) to add a hint with the real URL!
 */

var redirectRE = /HTTP\/1\.1 3[\d]{2}/;
var filter = {types:["main_frame"], urls:["*://tinyurl.com/*", "*://bit.ly/*", "*://goo.gl/*"]};


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
        var redirectLocation = null;
        console.log(info.statusLine.match(redirectRE));
        if (null !== info.statusLine.match(redirectRE)) {
            /* Get the redirect url */
            redirectLocation = getLocation(info.responseHeaders);
        
            /* Inject code to set a listener on the events... */
            var message = {type:"getClickedEl", original:originalUrl, redirect:redirectLocation};
            var callback = callbackOnExecuteScriptFactory(tabId, message);
            var injectDetailes = {file:"content.js", allFrames:true};
            chrome.tabs.executeScript(injectDetailes, callback);
        }
        return {cancel:true};
    }
    
    return callbackOnHeadersReceived;
}
var optExtraInfoSpec = ["blocking", "responseHeaders"];
/*
chrome.webRequest.onHeadersReceived.addListener(callbackOnHeadersReceived, filter, optExtraInfoSpec);
*/

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

var createProperties = {contexts:["link"], title:"pRedirect", onclick:onClickCallback};
function contextMenuCallback() {
    console.log(arguments);
}
chrome.contextMenus.create(createProperties, contextMenuCallback);