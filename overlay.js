var overlay = '\
<html>\
    <head>\
<style>\
#redirect-overlay {\
    width: 100%;\
    height: 100%;\
    min-height:100%;\
    position: fixed;\
    z-index: 1000000;\
    background: rgba(0, 0, 0, 0.4);\
    margin: 0px;\
    top: 0px;\
    left: 0px;\
}  \
\
.redirect-window {\
    width: 500px;\
    background: #383838;\
    border-radius: 10px;\
    border: 2px solid white;\
    border:none;\
    top:40%;\
    left: 50%;\
    margin-left: -250px;\
    margin-top: -150px;\
    position: fixed;\
    font-family: sans-serif;\
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);\
}\
\
a.redirect-button, a.redirect-button:link, a.redirect-button:visited {\
    display: inline-block;\
    width:220px;\
    text-align: center;\
    padding: 10px;\
    margin-top:8px;\
    padding-left: 0;\
    padding-right: 0;\
    color:rgb(43, 9, 0);\
    border-radius: 10px;\
    text-decoration: none;\
    font-family: sans-serif;\
    font-weight: bold;\
    font-size: 20px;\
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);\
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);\
}\
\
.redirect-go {\
    background-color:rgb(168, 255, 140);\
    color:rgb(43, 9, 0);\
    left:0;\
}\
\
.redirect-cancel {\
    background-color:rgb(255, 140, 140);\
    color:rgb(43, 9, 0);\
    right:0;\
}\
\
.redirect-confirm {\
    width:100%;\
}\
\
.redirect-text {\
    background: #383838;\
    color: white;\
    text-shadow: 0 -1px 0px black;\
    padding: 0px 10px;\
    font-size: 16px;\
    line-height: 25px;\
    white-space: nowrap;\
    margin:0;\
    -webkit-transform: translateY(5px);\
    -moz-transform: translateY(5px);\
    transform: translateY(5px);\
}\
\
.redirect-hidden {\
    display: block;\
    -webkit-transition: opacity 0.5s ease-out;\
    opacity: 0; \
    height: 0;\
    overflow: hidden;\
}\
.redirect-active {\
    -webkit-transition: opacity 0.5s ease-out;\
  opacity: 1;\
   height: auto;\
}\
\
#veal-image {\
    right:20px;\
    top:10px;\
    position:absolute;\
    z-index:10;\
    width:100px;\
    margin-right:10px;\
}\
\
\
        </style>\
    </head>\
    <body>\
        <div>\
        <div id="redirect-overlay" class="redirect-active">\
            <div class="redirect-window">\
                <div style="padding:20px;">\
                    <img id="veal-image"/>\
                <p class="redirect-text" style="margin-top:45px">\
                    Following this link will take you to:\
                    </p>\
<p class="redirect-text" style="margin-top:20px;">\
                <p id="redirect-url" style="text-decoration:underline;color:rgb(178, 255, 255);font-size:20px;line-height:30px;word-wrap:break-word;">http://this.is.evil.com/soveryevil/loremipsumdolersitamet</p>\
</p>             \
                <p class="redirect-text" style="margin-top:20px;margin-bottom:20px;">\
                    Would you like to continue?\
                </p>\
                <div id="redirect-confirm">\
                    <div style="display:inline;text-align:left;width:100%;">\
                    <a class="redirect-button redirect-go" id="redirect-go">Yes, Go!</a>\
                    </div>\
                    <div style="display:inline;text-align:right;margin-left:16px;">\
                    <a class="redirect-button redirect-cancel" id="redirect-cancel">No, Cancel.</a>\
                    </div>\
                </div>\
                </div>\
            </div>\
        </div>\
        </div>\
    </body>\
</html>';