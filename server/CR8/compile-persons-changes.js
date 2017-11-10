'use strict';
const _ = require('underscore');

function compilePersonsChanges (personChanges) {
	personChanges = _.groupBy(personChanges, 'personId');
	let persons = [];
	_.each(personChanges, function (change) {
		let person = {};
		let name = '';
		let house_number = '';
		let building_name = '';
		let estate = '';
		let street = '';
		let town = '';
		let country = '';
		let p = change[0];

		if(p !== null){
			name = `${p.salutation || ''} ${p.surname || ''} ${p.other_names || ''}`;
			house_number = p.house_number || '';
			building_name = p.building_name || '';
			estate = p.estate || '';
			street = p.street || '';
			town = p.town || '';
			country = p.country || '';
		}

		person.name = name.toString().toUpperCase();
		person.house = house_number.toString().toUpperCase();
		person.building = building_name.toString().toUpperCase();
		person.estate = estate.toString().toUpperCase();
		person.street = street.toString().toUpperCase();
		person.town = town.toString().toUpperCase();
		person.country = country.toString().toUpperCase();
		persons.push(person);
	});

	return persons;
}

module.exports = compilePersonsChanges;