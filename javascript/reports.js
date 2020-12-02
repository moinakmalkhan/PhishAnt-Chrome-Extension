$("#phishing_btn").on('click',function(){
    var url = $("#url_input").val();
    chrome.storage.sync.get(['phishing'], function(result) {
        data=result.phishing
        if (data){
            for (i of data){
                if (i==url){
                    $("#showmsg").text("This site is already stored.").css("color","#000")
                    return;
                }
            }
            data.push(url)
        }
        else{
            data=[url]
        }
        chrome.storage.sync.set({'phishing' : data}, function() {
            $("#showmsg").text("URL successfully Reported as phishing.").css("color","#5cb85c")
                });
    });
});
$("#legit_btn").on('click',function(){
    url = $("#url_input").val();
    chrome.storage.sync.get(['legitimate'], function(result) {
        data=result.legitimate
        if (data){
            for (i of data){
                if (i==url){
                    $("#showmsg").text("This site is already stored.").css("color","#000")
                    return;
                }
            }
            data.push(url)
        }
        else{
            data=[url]
        }
        chrome.storage.sync.set({'legitimate' : data}, function() {
            $("#showmsg").text("URL successfully Reported as legitimate.").css("color","#5cb85c")
        });
    });
});
$("#delete_btn").on('click',function(){
    url = $("#url_input").val();
    chrome.storage.sync.get(['legitimate','phishing'], function(result) {
        data=result.legitimate
        if (data){
            for (i of data){
                if (i==url){
                    data.splice(data.indexOf(i), 1)
                    chrome.storage.sync.set({'legitimate' : data}, function() {
                        $("#showmsg").text("URL successfully deleted.").css("color","#f0ad4e")
                    });
                }
            }
        }
        data=result.phishing
        if (data){
            for (i of data){
                if (i==url){
                    data.splice(data.indexOf(i), 1)
                    chrome.storage.sync.set({'phishing' : data}, function() {
                        $("#showmsg").text("URL successfully deleted.").css("color","#f0ad4e")
                    });
                    return;
                }
            }
        }
        $("#showmsg").text("Url not found in report list.").css("color","#d9534f")
    });
});




chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
    var tab = tabs[0];
    var url = new URL(tab.url)
    $("#url_input").val(url.hostname)
});

