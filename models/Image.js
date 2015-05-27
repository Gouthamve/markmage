var keystone = require('keystone'),
	Types = keystone.Field.Types,
	randomString = require('../lib/utils.js').randomString;

/**
 * Image Model
 * ==========
 */

var Image = new keystone.List('Image');

Image.add({
	image: { type: Types.LocalFile, dest: 'public/images/',
		filename: function(item, file){
			return randomString(7) + '.' + file.extension
		},
		format: function(item, file){
			return '<img src="/images/'+file.filename+'" style="max-width: 300px">'
		}
	},
	who: {type: Types.Relationship, ref: 'User'}
});

/**
 * Registration
 */

Image.register();
