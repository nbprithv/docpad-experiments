var docpadConfig,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

docpadConfig = {
  rootPath: process.cwd(),
  packagePath: 'package.json',
  configPaths: ['docpad.coffee', 'docpad.json', 'docpad.cson'],
  templateData: {
    site: {
      url: "http://website.com",
      oldUrls: ['www.website.com', 'website.herokuapp.com'],
      title: "AnS",
      storename: "Al's Stuff",
      description: "This is where you buy your Food and stuff",
      keywords: "place, your, website, keywoards, here, keep, them, related, to, the, content, of, your, website",
      author: "Niranjan B Prithviraj",
      email: "niranjan.prithviraj@yahoo.com",
      styles: ["http://yui.yahooapis.com/pure/0.2.0/pure-min.css", "/styles/style.css"],
      scripts: ["http://use.typekit.net/ajf8ggy.js", "/scripts/script.js"]
    },
    getCurrentPageID: function(){
      return this.window.document.title;
    },
    getPreparedTitle: function() {
      if (this.document.title) {
        return "" + this.document.title + " | " + this.site.title;
      } else {
        return this.site.title;
      }
    },
    getPreparedDescription: function() {
      return this.document.description || this.site.description;
    },
    getPreparedKeywords: function() {
      return this.site.keywords.concat(this.document.keywords || []).join(', ');
    }
  },
  collections: {
    pages: function(database) {
      return database.findAllLive({
        pageOrder: {
          $exists: true
        }
      }, [
        {
          pageOrder: 1,
          title: 1
        }
      ]);
    },
    categories: function(database) {
      return database.findAllLive({
        tags: {
          $has: 'category'
        }
      }, [
        {
          pageOrder: 1,
          title: 1
        }
      ]);
    },
    items: function(database) {
      return database.findAllLive({
        tags: {
          $has: 'item'
        }
      }, [
        {
          pageOrder: 1,
          title: 1
        }
      ]);
    },
    posts: function(database) {
      return database.findAllLive({
        tags: {
          $has: 'post'
        }
      }, [
        {
          date: -1
        }
      ]);
    }
//    getItemsInCategory: function(category) {
//      return [
//        {
//          itemname: 'Citizen Eco Drive - M234',
//          imgpath: '/watches/watch1.jpg',
//          price: '$248.99'
//        },
//        {
//          itemname: 'Citizen Eco Drive - M234',
//          imgpath: '/watches/watch2.jpg',
//          price: '$199.99'
//        },
//        {
//          itemname: 'Citizen Eco Drive - M234',
//          imgpath: '/watches/watch3.jpg',
//          price: '$210.99'
//        },
//        {
//          itemname: 'Citizen Eco Drive - M234',
//          imgpath: '/watches/watch4.jpg',
//          price: '$348.99'
//        },
//        {
//          itemname: 'Citizen Eco Drive - M234',
//          imgpath: '/watches/watch5.jpg',
//          price: '$127.99'
//        },
//        {
//          itemname: 'Citizen Eco Drive - M234',
//          imgpath: '/watches/watch6.jpg',
//          price: '$321.99'
//        }
//      ]
//    }
  },
  events: {
    serverExtend: function(opts) {
      var docpad, latestConfig, newUrl, oldUrls, server;
      server = opts.server;
      docpad = this.docpad;
      latestConfig = docpad.getConfig();
      oldUrls = latestConfig.templateData.site.oldUrls || [];
      newUrl = latestConfig.templateData.site.url;
      return server.use(function(req, res, next) {
        var _ref;
        if (_ref = req.headers.host, __indexOf.call(oldUrls, _ref) >= 0) {
          return res.redirect(newUrl + req.url, 301);
        } else {
          return next();
        }
      });
    }
  }
};

module.exports = docpadConfig;
