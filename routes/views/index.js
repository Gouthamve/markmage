var keystone = require('keystone');
var Image = keystone.list('Image');

exports = module.exports = function(req, res) {
	var onSuccess = function(user) {
		res.redirect('/');
	}

	var onFail = function(err) {
		console.log("NOOOO, onFail");
		console.log(err);
		res.redirect('/');
	}

	var view = new keystone.View(req, res),
		locals = res.locals;
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('post', {action: 'login'}, function(next){
		keystone.session.signin(req.body, req, res, onSuccess, onFail);
	});

	view.on('post', {action: 'upload.image'}, function(next) {
		console.log(req.files)
		if(req.user)
			var newImage = new Image.model({
				who: req.user._id
			});
		else
			var newImage = new Image.model();
		var updater = newImage.getUpdateHandler(req, res, {
				errorMessage: 'There was an error uploading your image'
			});

		updater.process(req.body, {
			fields: 'image'
		}, function(err) {
			if(err)
				console.log(err)
			else
				console.log("YAYA")
			if(req.user) {
				Image.model.find()
					.where('who', req.user._id)
					.exec(function(err, images) {
						if(!images) {
							return next();
						} else {
							locals.images = images;
							return next();
						}
					})
			} else {
				return next();
			}
		})

	});

	view.on('init', function(next) {
		if(req.user) {
			Image.model.find()
				.where('who', req.user._id)
				.exec(function(err, images) {
					if(!images) {
						return next();
					} else {
						locals.images = images;
						next();
					}
				})
		} else {
			next();
		}
	})
	// Render the view
	view.render('index');
	
};
