
console.log("Code injected!");

var clickedEl = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        clickedEl = event.target;
    }
}, true);

function createHTMLFragment(htmlStr, divID) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
        temp.id = divID;
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}


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
        // Comparing to the original was removed because JS on facebook kills it.
        // Another solution is to go up the tree till we reach the link...
        // But since our actions are non-destructive (we do not change the link)
        // it does not really matter for the time being.
        /*if (link.href !== request.original) {
            return;
        }*/
        // if everything matches - add a redirect hint.
//        link.dataset["redirect"] = request.redirect;
//        addKeyboardListener(link);
        
        console.log("yay");
        var body = document.body;
        var fragment = createHTMLFragment(overlay, "redirect-div-id");
        var vealImage = chrome.extension.getURL("veal.svg");
        var img = fragment.querySelector("#veal-image");
        fragment.querySelector("div").dir="ltr";
        img.src = vealImage;
        var go = fragment.querySelector("#redirect-go");
        go.href = request.redirect;
        var cancel = fragment.querySelector("#redirect-cancel");
        function onclick() {
            var elem = document.body.querySelector("#redirect-overlay");
            elem.parentElement.removeChild(elem);
        }
        cancel.onclick = onclick;
        
        var redirectUrl = fragment.querySelector("#redirect-url");
        redirectUrl.innerHTML = request.redirect;
        console.log("yay2");
        body.appendChild(fragment);
        
    }
}

chrome.extension.onMessage.addListener(callbackOnMessage);