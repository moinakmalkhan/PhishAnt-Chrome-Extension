var background = chrome.extension.getBackgroundPage();
chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
    var tab = tabs[0];
    var isPhish = background.isPhish[tabs[0].id];
    var legitimatePercent = background.legitimatePercents[tabs[0].id];
    $("#site_score").text(parseInt(legitimatePercent));
    var url = new URL(tab.url)
    var domain = url.hostname
    $("#site_url_len").text(tab.url.length);
    $("#host").text(domain);
    $("#protocol").text(url.protocol);
    if (isPhish){
        $("#site_msg").css("color", "#CC0000");
        $("#site_msg").html('<img src="./images/unsuccess.png" id="result_img" alt="" width="40" height="50">  This site is probably a Phishing site.');
        $("#site_score").text(parseInt(legitimatePercent)-20);
    }
});






