// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var plum = {
  // api_base: "https://www.picplum.com/api/1/"
  api_base: "http://dodeja.mine.nu:3000/api/1/"
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
function  add_photo(tab){
  
  
  $.post(plum.api_base+'photos', 
    { image_url: plum.dl_url, via: 'web'},
    function(data) {
      var notification = webkitNotifications.createNotification(
        plum.dl_url,
        'Photo added to Picplum'
      );
  
      // Then show the notification.
      notification.show();
      window.setInterval(function() {
        notification.cancel();
      }, 3500);
  });
  

  // $.get(plum.api_base+'user', function(data) {
  //   var notification = webkitNotifications.createNotification(
  //     'icon1.png',  // icon url - can be relative
  //     'Photo added to Picplum',  // notification title
  //     data.name  // notification body text
  //   );
  // 
  //   // Then show the notification.
  //   notification.show();
  //   window.setInterval(function() {
  //     notification.cancel();
  //   }, 3500);
  // });
  // 
  // console.log(plum.dl_url)
}

// $.post('https://www.picplum.com/api/1/photos', 
//   { image_url: 'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/582033_747992485321_42002206_34075714_1838519744_n.jpg', via: 'fb_send'}
// );


// $.post(plum.api_base+'photos', 
//   { image_url: plum.dl_url, via: 'fb_send'},
//   function(data) {
//     var notification = webkitNotifications.createNotification(
//       'icon1.png',  // icon url - can be relative
//       'Photo added to Picplum'
//     );
// 
//     // Then show the notification.
//     notification.show();
//     window.setInterval(function() {
//       notification.cancel();
//     }, 3500);
// });

function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script) was on.
  chrome.pageAction.show(sender.tab.id);

  plum.dl_url = request.href;
  console.log(request.href)

  // Return nothing to let the connection be cleaned up.
  sendResponse({});
};

// Listen for the content script to send a message to the background page.


// Event Listeners 

// When tab is updated (loaded)
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// When page action is clicked (add photo)
chrome.pageAction.onClicked.addListener(add_photo);

// Message recieved from tab - Download url for Facebook imaage
chrome.extension.onRequest.addListener(onRequest);

