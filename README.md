Inspired by http://dribbble.com/shots/151761-Share-this-v2, this plugin can be used by calling:

    $('#selector').socialButtons({
      url: 'http://your.url/'
    });

The url option is optional, defaulting to the browser's current url.

The ouput of this plugin is currently a pretty ugly read-only display of stats for Twitter and Facebook. I'm planning to add support for like/tweet links soon, but the goal is to avoid the use of the Iframes provided by Twitter and Facebook.