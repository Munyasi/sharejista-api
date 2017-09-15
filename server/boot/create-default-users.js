'use strict';
let app = require('../server');
let User = app.models.SystemUser;

//create default user
createDefaultUser();

function createDefaultUser () {
	checkIfUsersExist()
		.then(function (count) {
			if(!count){
				User.create({
					'name': 'Sharejista',
					'email': 'sharejista@sharejista.net',
					'password': 'sharejista',
					'username': 'sharejista',
					'account_status': 1
				}, function (err, user) {
					if(err)
						console.error(err);
					console.log('Default user created')
				});
			}
		})
		.catch(function (err) {
			Logger.error(err);
		});
}

//check if there are any users
function checkIfUsersExist () {
	return new Promise(function (resolve, reject) {
		User.count({}, (err, count) => {
			if(err)
				reject(err);
			resolve(count);
		});
	});
}