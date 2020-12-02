var results = {};
var legitimatePercents = {};
var isPhish = {};
fetchLive=(callback)=> {
  fetch('./classifier.json').then(response => {
    return response.json();
  }).then(data => {
    chrome.storage.local.set({cache: data, cacheTime: Date.now()}, function() {
      callback(data);
    });
  }).catch(err => {
    alert("classifier not found")
  });

}

fetchCLF=(callback)=> {
  chrome.storage.local.get(['cache', 'cacheTime'], function(items) {
      if (items.cache && items.cacheTime) {
          return callback(items.cache);
      }
      fetchLive(callback);
  });
}

classify=(tab, result)=> {
  tabId=tab.id;
  let legitimateCount = 0;
  let suspiciousCount = 0;
  var datafounded;
  let phishingCount = 0;
  for(let key in result) {
    if(result[key] == "1") phishingCount++;
    else if(result[key] == "0") suspiciousCount++;
    else legitimateCount++;
  }
  legitimatePercents[tabId] = legitimateCount / (phishingCount+suspiciousCount+legitimateCount) * 100;

  if(result.length != 0) {
    var X = [];
    X[0] = [];
    for(let key in result) {
        X[0].push(parseInt(result[key]));
    }
    // console.log(result);
    // console.log(X);
    fetchCLF(function(clf) {
    var url = new URL(tab.url)
    domain=url.hostname
    let rf = random_forest(clf);
      y = rf.predict(X);

      // console.log(y[0]);
      chrome.storage.sync.get(['legitimate','phishing'], function(result) {
        data=result.legitimate;
        if (data){
          for (i of data){
            // if (String(tab.url).search(i)!=-1){
            if (domain==i){
              datafounded=1;
              isPhish[tabId] = false;
            }
          }
        }
        data=result.phishing;
        if (data){
          for (i of data){
            // if (String(tab.url).search(i)!=-1){
            if (domain==i){
              datafounded=1;
              isPhish[tabId] = true;
            }
          }
        }
      if(y[0][0] || datafounded)
      {
        if (!datafounded){
          isPhish[tabId] = true;
        }
        if (isPhish[tabId]){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "alert_user"}, function(response) {
            });
          });}
      } else {
        isPhish[tabId] = false;
      }
      });
    });
  }

}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  results[sender.tab.id]=request;
  classify(sender.tab, request);
  sendResponse({received: "result"});
});