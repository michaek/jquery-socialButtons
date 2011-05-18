/*
 * jQuery Social Buttons Plugin v0.1
 * http://
 *
 * Copyright (c) 2010 Bearded Studio LLC
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function($, undefined){
  var services = {
    facebook: {
      display_name: 'Facebook',
      data_url: 'http://api.facebook.com/restserver.php?method=links.getStats&format=json-strings&urls=',
      count_key: 'total_count'
    },
    twitter: { 
      display_name: 'Twitter',
      data_url: 'http://urls.api.twitter.com/1/urls/count.json?url=',
      count_key: 'count'
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
  
  $.fn.socialButtons = function(options){
    options = $.extend({
      url: window.location.href,
      // url: 'http://www.kickstarter.com/projects/bearded/new-digital-fonts-from-rare-letterpress-wood-type',
      services: serviceKeys,
      forceRequest: false,
      friendlyCounts: true,
      friendlyTotal: true
    }, options);
    
    // loop over the selected elements
    this.each(function(){
      
      var $buttons = $(this).addClass('social-buttons');

      var $label = $('<div class="share">Share</div>')
        .appendTo($buttons);
      
      var $total_wrap = $('<div class="count total" />')
        .append('<span class="label">Total</span>')
        .append('<span class="value" />')
        .appendTo($buttons);

      var $total = $total_wrap.find('.value');

      // set the statistics
      $.each(options.services, function(key, service_name){
        if (services[service_name]) {
          var service = services[service_name];
          
          var $count_wrap = $('<div class="count" />')
            .addClass(service_name)
            .append('<span class="label">'+service.display_name+'</span>')
            .append('<span class="value" />')
            .insertBefore($total_wrap);
            
          var $count = $count_wrap.find('.value');

          // don't make another request if we already have the stats
          if (socialStats[service_name][options.url] == undefined || options.forceRequest) {
            // get from the jsonp url
            $.ajax(service.data_url+escape(options.url), {
              dataType: 'jsonp',
              success: function(data){
                // facebook returns an array, but we want a single object
                if (data.length) {
                  data = data[0];
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
              }
            });
          }
          
        }
      });

      
    })
  }
})(jQuery);
