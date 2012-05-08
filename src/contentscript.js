/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

var plum_fb = {
  photo_url_test: /facebook.com\/photo.php/
}

function check_downloadlink(){
  $('.fbPhotosPhotoActionsItem').each(function(i, el){
    var this_el = $(el);
    var href = null;

    if((this_el.attr('data-label') === "Download")) href = this_el.find('a').attr('href');
    else if($.trim(this_el.text()) === "Download") href = this_el.attr('href');
    if(href) chrome.extension.sendRequest({msg: 'facebook_image', href: href}, function(response) {});

  });
}

function check_photo_url(){
  var lasthash = window.location.href;
  plum_fb.has_interval = setInterval(function(){
    var currenthash = window.location.href;
    if((lasthash != currenthash) && plum_fb.photo_url_test.test(currenthash)){
      check_downloadlink();
      lasthash = currenthash;
    }
  }, 500);
}

check_downloadlink();
check_photo_url();

$(window).on('blur', function(){
  clearInterval(plum_fb.has_interval);
})

$(window).on('focus', function(){
  check_photo_url();
})