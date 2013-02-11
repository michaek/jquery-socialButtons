## jQuery Social Buttons

Inspired by http://dribbble.com/shots/151761-Share-this-v2, this plugin can be used by calling:

    $('#selector').socialButtons({
      url: 'http://your.url/'
    });

The url option is optional, defaulting to the browser's current url.

The ouput of this plugin is currently a pretty ugly (though easily stylable) display of stats for Twitter and Facebook. Initial support for like/tweet links exists, though Facebook's is pretty rudimentary. The goal is to avoid the use of the IFRAMEs provided by Twitter and Facebook, though it may make sense to use modal IFRAMEs upon clicking the like links.

[View the demo](http://michaek.github.com/jquery-socialButtons/demo.html)

## Use SocialCount

*You may want to use [SocialCount](https://github.com/filamentgroup/SocialCount/) instead.* SocialCount is more fully-featured, but it seems to rely on a PHP service to interact with the count APIs instead of JSONP in the browser. That's not a design decision that sits well with me, so I'm going to put maintenance for this library back on my queue.
