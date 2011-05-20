Inspired by http://dribbble.com/shots/151761-Share-this-v2, this plugin can be used by calling:

    $('#selector').socialButtons({
      url: 'http://your.url/'
    });

The url option is optional, defaulting to the browser's current url.

The ouput of this plugin is currently a pretty ugly (though easily stylable) display of stats for Twitter and Facebook. Initial support for like/tweet links exists, though Facebook's is pretty rudimentary. The goal is to avoid the use of the IFRAMEs provided by Twitter and Facebook, though it may make sense to use modal IFRAMEs upon clicking the like links.