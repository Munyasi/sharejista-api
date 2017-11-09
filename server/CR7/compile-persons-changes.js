'use strict';

let _ = require('underscore');
let map = require('./fields-map');
/**
 * Resolve persons changes by selecting latest change
 * @param personChanges Array of PersonChange objects
 * @returns {Array}
 */
function compilePersonsChanges (personChanges) {
	personChanges = _.groupBy(personChanges, 'personId');
	let persons = [];
	_.each(personChanges, function (personChange) {
		personChange = _.groupBy(personChange, 'key');
		let person = {};
		person.fields = [];
		_.each(personChange, function (change) {
			person.name = `${change[0].salutation} ${change[0].surname} ${change[0].other_names}`;
			// sort by date modified
			// resolve changes by selecting latest
			change = _.sortBy(change, 'date_modified').reverse();
			let latestChange = change[0];
			let fieldObj = {};
			fieldObj.id = latestChange.id;
			fieldObj.key = latestChange.key;
			fieldObj.value = latestChange.value;
			fieldObj.name = map[latestChange.key];
			let d = new Date(latestChange.date_modified);
			fieldObj.date = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()}`;

			person.fields.push(fieldObj);
		});

		persons.push(person);
	});

	return persons;
}

module.exports = compilePersonsChanges;