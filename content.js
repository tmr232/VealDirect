
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

function addKeyboardListener(link) {
    function callbackOnKeyup(event) {
        if (event.keyIdentifier === "U+001B") {
            delete(link.dataset["redirect"]);
            console.log("yay");
        }
        document.removeEventListener("keyup", arguments.callee, false);
    }

    document.addEventListener("keyup", callbackOnKeyup, false);
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
        addKeyboardListener(link);
        
    }
}

chrome.extension.onMessage.addListener(callbackOnMessage);