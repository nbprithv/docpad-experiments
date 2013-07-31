
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.create = function(req,res){
  console.log(req.params);
  res.render('category-create',{themetype:req.params[0]});
};
