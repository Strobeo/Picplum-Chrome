class SendImage
  photo_url_test: /facebook.com\/photo.php/
  constructor: ->
    @check_downloadlink()
    @check_photo_url()
    @watch_window()
  
  # Find the download url for the photo and send it to extension.  
  check_downloadlink: ->
    $('.fbPhotosPhotoActionsItem').each (i, el) ->
      this_el = $(el)
      href = null

      if this_el.attr('data-label') is "Download"
        href = this_el.find('a').attr('href')
      else if $.trim(this_el.text()) is "Download"
        href = this_el.attr('href')
      chrome.extension.sendRequest({msg: 'facebook_image', href: href}, (response) -> ) if href 

  # Regularly check current FB url matches a photo url. 
  check_photo_url: ->
    last_url = window.location.href
    @fb_link_watch = setInterval =>
      current_url = window.location.href
      if last_url isnt current_url and @photo_url_test.test current_url
        @check_downloadlink()
        last_url = current_url;
    , 500
    
  # Watch window to see if user has switched tabs or come back. 
  watch_window: ->
    $(window).on 'blur', => clearInterval @fb_link_watch
    $(window).on 'focus', => @check_photo_url()
  

send_image = new SendImage()