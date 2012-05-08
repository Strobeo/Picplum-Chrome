class PicplumSend
  api_base: "https://www.picplum.com/api/1"
  fb_url: 'www.facebook.com/photo.php'
  download_url: null
  constructor: ->
    @chrome_events()
    @setup_context_menu()
    
  checkForValidUrl: (tabId, changeInfo, tab) ->
    chrome.pageAction.show(tabId) if tab.url.indexOf @fb_url > -1
  
  content_msg: (request, sender, send_response) ->
    chrome.pageAction.show sender.tab.id
    
    # Set download URL
    @download_url = request.href

    # Message received handshake
    send_response({})

  notify: (args, timeout = 3500) ->
    noti = webkitNotifications.createNotification args.img, args.title, args.sub_title 
    noti.show() 
    window.setInterval -> 
      noti.cancel()
    , timeout
  
  getClickHandler: ->
    (info, tab) => 
      @download_url = info.srcUrl
      @add_photo(tab)

  # chrome Context menu
  setup_context_menu: ->
    chrome.contextMenus.create 
      "title": "Send to Picplum"
      "type": "normal"
      "contexts": ["image"]
      "onclick": @getClickHandler()

  # Find the download url for the photo and send it to extension.  
  chrome_events: ->
    # When tab is updated (loaded)
    chrome.tabs.onUpdated.addListener @checkForValidUrl

    # When page action is clicked (add photo)
    chrome.pageAction.onClicked.addListener @add_photo

    # Message recieved from tab - Download url for Facebook imaage
    chrome.extension.onRequest.addListener @content_msg
  
  add_photo: (tab) ->
    thiz = @
    post_image = $.post "https://www.picplum.com/api/1/photos", { image_url: @download_url, via: 'web'}

    post_image.success (data) => 
      thiz.notify {img: thiz.fb_url, title: 'Photo added to Picplum', sub_title: ''}

    post_image.error (error_data, textStatus, errorThrown) => 
        console.log error_data
        console.log textStatus
        console.log errorThrown
        if error_data.status is 401
          thiz.notify {img: '', title: 'Please login to Picplum', sub_title: ''} 
          chrome.tabs.create
            'url':'https://www.picplum.com/login'
            'selected':true

    post_image.complete -> 
      console.log 'complete'
        
chrome_send = new PicplumSend()



