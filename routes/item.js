
/*
 * GET home page.
 */
var fs = require('fs');
var tmpldir = "/Users/nprithvi/nodeApps/docpad-express/views/templates/";

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.create = function(req, res){
  var categoryname = req.body.categoryname, themetype = req.body.themetype, bgcolor="white", color="black";
  if(themetype === "dark"){
    bgcolor = "black";
    color = "white";
  }
  fs.readFile(tmpldir+"category.tmpl",'utf8', function (err, data) {
    if(err) throw err;
    data = data.replace(/{%categoryname%}/g,categoryname);
    data = data.replace(/{%theme-bgcolor%}/g,bgcolor);
    data = data.replace(/{%theme-color%}/g,color);
    fs.writeFile("/Users/nprithvi/nodeApps/docpad-express/src/documents/categories/"+categoryname+".html.eco",data, function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
      }
    });
  });
  res.render('item-create',{categoryname:categoryname, themetype:themetype});
};

exports.submit = function(req, res){
  var itemimage = req.files, 
  categoryname = req.body.categoryname, 
  itemname = req.body.itemname, 
  itemprice = req.body.itemprice,
  itemimagepath = "/"+itemimage.itemimage.name,
  themetype = req.body.themetype,
  bgcolor = "black",
  color = "white";
  if(themetype === "dark"){
    bgcolor = "black";
    color = "white";
  }
  fs.readFile(itemimage.itemimage.path, function (err, data) {
    var newPath = '/Users/nprithvi/nodeApps/docpad-express/src/files/'+itemimage.itemimage.name;
    fs.writeFile(newPath, data, function (err) {
      if(err) throw err;
    });
  });
  fs.readFile(tmpldir+"item.tmpl",'utf8', function (err, data) {
    if(err) throw err;
    console.log(data);
    data = data.replace(/{%categoryname%}/g, categoryname);
    data = data.replace(/{%itemname%}/g, itemname);
    data = data.replace(/{%itemprice%}/g, itemprice);
    data = data.replace(/{%itemimage%}/g, itemimagepath);
    data = data.replace(/{%theme-bgcolor%}/g, bgcolor);
    data = data.replace(/{%theme-color%}/g, color);
    fs.writeFile("/Users/nprithvi/nodeApps/docpad-express/src/documents/items/"+itemname+".html.eco", data, function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The item was saved!");
          res.render('item-create',{categoryname:categoryname,ressuccess:"item was created successfully.",successclass:"message-success",themetype:themetype});
      }
    });
  });
};


var categoryTemplate = function(categoryname){
return "---\n"+
"title: "+categoryname+"\n"+
"layout: category\n"+
"pageOrder: 2\n"+
"tags: ['category','"+categoryname+"']\n"+
"---\n"+
"<nav class='linklist'>"+
"        <% for document in @getCollection('items').toJSON(): %>"+
"<%if document.tags[0] == '"+categoryname+"': %>"+
"                <li class='category-items-grid'>"+
"      <img src='<%= document.image %>' /><br>"+
"      <a href='<%= document.url %>'><%= document.title %></a>"+
"    </li>"+
"<% end %>"+
"        <% end %>"+
"</nav>"+
"<div style='clear:both'></div>";
};

var itemTemplate = function(categoryname,itemname,itemprice,itemimagepath){
return "```\n"+
"title: "+itemname+"\n"+
"layout: item\n"+
"tags: ['"+categoryname+"','item']\n"+
"image: "+itemimagepath+"\n"+
"price: "+itemprice+"\n"+
"```\n"+

"<img src='"+itemimagepath+"' />"+
"<div class='price'>"+itemprice+"</div>"+
"<button type='submit' class='pure-button pure-button-primary'>Add to cart</button>";
  
};

