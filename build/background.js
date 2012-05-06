// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.indexOf('www.facebook.com/photo.php') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};


function  add_photo(tab){
  var notification = webkitNotifications.createNotification(
    'icon1.png',  // icon url - can be relative
    'Photo added to Picplum',  // notification title
    'Lorem ipsum...'  // notification body text
  );

  // Then show the notification.
  notification.show();
  window.setInterval(function() {
    notification.cancel();
  }, 3500);
  
}



// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.pageAction.onClicked.addListener(add_photo);