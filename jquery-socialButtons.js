/**
 * jQuery Social Buttons Plugin v0.2
 * https://github.com/michaek/jquery-socialButtons
 * 
 * Copyright (c) 2012 Michael Hellein
 * Licensed under the MIT license. http://jquery.org/license
 */
(function($, undefined){
  var services = {
    facebook: {
      display_name: 'Facebook',
      data_url: 'https://graph.facebook.com/fql?q=SELECT+url,total_count,normalized_url+FROM+link_stat+WHERE+url%3D"{{url}}"',
      share_url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}',
      count_key: 'total_count',
      window_width: 640,
      window_height: 320,
    },
    twitter: {
      display_name: 'Twitter',
      data_url: 'https://cdn.api.twitter.com/1/urls/count.json?url={{url}}',
      share_url: 'https://twitter.com/intent/tweet?original_referer={{url}}&url={{url}}&text={{message}}',
      count_key: 'count',
      window_width: 550,
      window_height: 450
    },
    pinterest: {
      display_name: 'Pinterest',
      data_url: 'https://api.pinterest.com/v1/urls/count.json?url={{url}}',
      share_url: 'https://pinterest.com/pin/create/button/?url={{url}}&description={{message}}&media={{media_url}}',
      count_key: 'count',
      window_width: 630,
      window_height: 270
    }
  };
  
  var socialStats = {};
  var serviceKeys = [];
  $.each(services, function(key) { 
    socialStats[key] = {};
    serviceKeys[serviceKeys.length] = key;
  });
  
  function totalForUrl(url) {
    var total = 0;
    for (service_name in socialStats) {
      if (socialStats[service_name][url]) {
        total += parseInt(socialStats[service_name][url].count);
      }
    }
    return total;
  }
  
  function friendlyNumberFormat(number) {
    if (number > 1000) {
      number = Math.round(number/1000) + 'K';
    }
    return number;
  }
  
  function modal(width, height, src, name) {
    window.open(src,name,"width="+width+",height="+height+",menubar=0,personalbar=0,toolbar=0,scrollbars=0,resizable=1");
  }
  
  $.fn.socialButtons = function(options){
    options = $.extend({
      url: window.location.href,
      label: 'Share',
      message: '',
      services: serviceKeys,
      forceRequest: false,
      friendlyCounts: true,
      friendlyTotal: true
    }, options);
    
    // loop over the selected elements
    this.each(function(){
      
      var $buttons = $(this).addClass('social-buttons');
      
      var $label = $('<span class="share">'+options.label+'</span>')
        .appendTo($buttons);
      
      var $services = $('<span class="services" />')
        .appendTo($buttons);
      
      var $total_wrap = $('<span class="count total" />')
        .append('<span class="label">Total</span>')
        .append('<span class="value" />')
        .appendTo($buttons);
      
      var $total = $total_wrap.find('.value');
      
      // set the statistics
      $.each(options.services, function(key, service_name){
        if (services[service_name]) {
          var service = services[service_name];
          
          var $count_wrap = $('<a class="count" />')
            .addClass(service_name)
            .attr('href',
              service.share_url
                .replace(/{{url}}/g, encodeURIComponent(options.url))
                .replace(/{{message}}/g, encodeURIComponent(options.message))
                .replace(/{{media_url}}/g, encodeURIComponent(options.media_url))
            )
            .append('<span class="label">'+service.display_name+'</span>')
            .append('<span class="value" />')
            .appendTo($services);
          
          $count_wrap.click(function(){
            modal(service.window_width, service.window_height, $count_wrap.attr('href'), service_name);
            return false;
          });
          
          var $count = $count_wrap.find('.value');
          
          // don't make another request if we already have the stats
          if (socialStats[service_name][options.url] == undefined || options.forceRequest) {
            // get from the jsonp url
            $.ajax(service.data_url.replace(/{{url}}/g, encodeURIComponent(options.url)), {
              dataType: 'jsonp',
              success: function(data){
                
                // facebook returns an array inside a data object, but we want a single object
                if (data[service.count_key] == undefined && data.data && data.data.length) {
                  data = data.data[0];
                }
                
                var count = data[service.count_key];
                
                // facebook normalizes file:// urls to 'www.' and you get a crazy high count!
                if (data['normalized_url'] == 'www.') {
                  count = 0;
                }

                socialStats[service_name][options.url] = { 
                  count: count,
                  raw: data
                };
                
                // set count for display
                $count_wrap.attr('title', count);
                if (options.friendlyCounts) {
                  $count.html(friendlyNumberFormat(count));
                } else {
                  $count.html(count);
                }

                // set total for display
                var total = totalForUrl(options.url);
                $total_wrap.attr('title', total);
                if (options.friendlyTotal) {
                  $total.html(friendlyNumberFormat(total));
                } else {
                  $total.html(total);
                }
              },
              failure: function(){ console.log('Failed', service_name); }
            });
          }else{
            var count = socialStats[service_name][options.url].count;
            // set count for display
            $count_wrap.attr('title', count);
            if (options.friendlyCounts) {
              $count.html(friendlyNumberFormat(count));
            } else {
              $count.html(count);
            }

            // set total for display
            var total = totalForUrl(options.url);
            $total_wrap.attr('title', total);
            if (options.friendlyTotal) {
              $total.html(friendlyNumberFormat(total));
            } else {
              $total.html(total);
            }
          }
          
        }
      });

      
    })
  }
})(jQuery);
