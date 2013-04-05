
console.log("Code injected!");

var clickedEl = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        clickedEl = event.target;
    }
}, true);


function callbackOnTimeoutFactory(link) {
    function callback() {
        delete(link.dataset["redirect"]);
    }

    return callback;
}


// Add a listener for getClickedEl requests from the extension
function callbackOnMessage(request) {
    console.log("abcdef");
    if ("getClickedEl" === request.type) {
        var link = clickedEl;
        console.log(link);
        if (link.href !== request.original) {
            return;
        }
        // if everything matches - add a redirect hint.
        link.dataset["redirect"] = request.redirect;
        
//        window.setTimeout(callbackOnTimeoutFactory(link), 5000);
    }
}

chrome.extension.onMessage.addListener(callbackOnMessage);