class SendImage
  photo_url_test: /facebook.com\/photo.php/
  fb_views_selectors: '.fbPhotoImage, .spotlight'
  fb_views:
    fbPhotoImage:
      name: 'photo_page'
      selectors: 
        img: '.fbPhotoImage'
        buttons_bar: '.stageButtons'
        insert_scope: '.tagButton'
      insert: (scope, html) -> 
        $(html).insertAfter(scope)
      templates: '<a class="picplum_send_action rfloat uiButton uiButtonOverlay" href="#" role="button" style="margin: 6px; background: #85638e;"><span style="color: white;" class="uiButtonText">Send to Picplum</span></a>'
    spotlight:
      selectors: 
        img: '.spotlight'
        buttons_bar: '.stageActions'
        insert_scope: '.bottomButtonsBar'
      insert: (scope, html) -> 
        $(html).insertBefore(scope)
      templates: '<a class="picplum_send_action buttonLink" rel="button" href="#">Send to Picplum</a><div class="separatorBorder"></div>'

  constructor: ->
    @check_downloadlink()
    @check_photo_url()
    @watch_window()
  
  # Find the download url for the photo and send it to extension.  
  check_downloadlink: ->
    $('.fbPhotosPhotoActionsItem').each (i, el) =>
      this_el = $(el)
      href = null

      if this_el.attr('data-label') is "Download"
        href = this_el.find('a').attr('href')
      else if $.trim(this_el.text()) is "Download"
        href = this_el.attr('href')
      if href
        chrome.extension.sendRequest({msg: 'facebook_image', href: href}, (response) -> )
        @add_fb_buttons()

  # Regularly check current FB url matches a photo url. 
  check_photo_url: ->
    last_url = window.location.href
    @fb_link_watch = setInterval =>
      current_url = window.location.href
      if last_url isnt current_url and @photo_url_test.test current_url
        @check_downloadlink()
        last_url = current_url;
    , 500
    
  add_fb_buttons: => 
    $.each @fb_views, (key, value) =>
      if $(value.selectors.img).length
        unless $('.picplum_send_action').length
          value.insert(value.selectors.insert_scope, value.templates)
          @watch_send_btn()
  
  # Watch window to see if user has switched tabs or come back. 
  watch_window: ->
    $(window).on 'blur', => clearInterval @fb_link_watch
    $(window).on 'focus', => @check_photo_url()
    
  watch_send_btn: =>
    $('.picplum_send_action').on 'click', =>
      console.log('sned action')
      chrome.extension.sendRequest({msg: 'send_button_click'}, (response) -> )
  
send_image = new SendImage()