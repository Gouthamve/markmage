var keystone = require('keystone');
var Image = keystone.list('Image');

exports = module.exports = function(req, res) {
	var onSuccess = function(user) {
		res.redirect('/');
	}

	var onFail = function(err) {
		console.log("NOOOO, onFail");
		console.log(err);
		next();
	}

	var view = new keystone.View(req, res),
		locals = res.locals;
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('post', {action: 'login'}, function(next){
		keystone.session.signin(req.body, req, res, onSuccess, onFail);
	});
	// Render the view
	view.render('login');
	
};
