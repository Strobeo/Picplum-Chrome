/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var regex = /sandwich/;

// Test the text of the body element against our regular expression.
if (regex.test(document.body.innerText)) {
  // The regular expression produced a match, so notify the background page.
} else {
  // No match was found.
}

function check_downloadlink(){
  $('.fbPhotosPhotoActionsItem').each(function(i, el){
    var this_el = $(el);
    if($.trim(this_el.text()) === "Download"){
      chrome.extension.sendRequest({msg: 'facebook_image', href: this_el.attr('href')}, function(response) {});
    }

  });
}

check_downloadlink();

var lasthash = window.location.href;
setInterval(function(){
  var currenthash = window.location.href;
  if(lasthash != currenthash){
    check_downloadlink();
    console.log('url change')
    lasthash = currenthash;
  }
}, 500);//check every half second if the url has changed

