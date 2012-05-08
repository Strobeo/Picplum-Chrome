// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var plum = {
  // api_base: "https://www.picplum.com/api/1/"
  api_base: "https://www.picplum.com/api/1/"
}


// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.indexOf('www.facebook.com/photo.php') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// add photo to Picplum
function add_photo(tab){
  
  var jqxhr = $.post(plum.api_base+'photos', { image_url: plum.dl_url, via: 'web'})
      .success(function() { 
        var notification = webkitNotifications.createNotification(
          plum.dl_url,
          'Photo added to Picplum'
        );

        // Then show the notification.
        notification.show();
        window.setInterval(function() {
          notification.cancel();
        }, 3500);
      })
      .error(function(error_data, textStatus, errorThrown) { 
        alert("error"); 
        console.log(error_data)
        console.log(textStatus)
        console.log(errorThrown)
      })
      .complete(function() { alert("complete"); });
}

function notify(payload, timeout){
  
}


function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script) was on.
  chrome.pageAction.show(sender.tab.id);

  plum.dl_url = request.href;
  console.log(request.href)

  // Return nothing to let the connection be cleaned up.
  sendResponse({});
};


function getClickHandler() {
  return function(info, tab) {
    plum.dl_url = info.srcUrl;
    add_photo(tab);
  };
};

chrome.contextMenus.create({
  "title" : "Send to Picplum",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : getClickHandler()
});



// Event Listeners 

// When tab is updated (loaded)
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// When page action is clicked (add photo)
chrome.pageAction.onClicked.addListener(add_photo);

// Message recieved from tab - Download url for Facebook imaage
chrome.extension.onRequest.addListener(onRequest);

