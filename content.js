console.log("Code injected!");

// Add a listener for getClickedEl requests from the extension
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    window.alert("xxx");
    console.log("abcdef");
    if ("getClickedEl" === request.type) {
        var link = document.activeElement;
        if (link.href !== request.original) {
            return;
        }
        // if everything matches - add a redirect hint.
        link.dataset["redirect"] = request.redirect;
    }
});