'use strict';
let Promise = require('bluebird');
let async = require('async');
let app = require('../server');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');
let uuid = require('uuid/v4');
let moment = require('moment');

function generateCR8 (companyId, from, to, cb) {
	from = new Date(from);
	from = moment(new Date(from)).format('YYYY-MM-DD HH:mm:ss');
	to = moment(new Date(to)).format('YYYY-MM-DD HH:mm:ss');
	console.log(from, to);
	// pull PersonChanges for the company
	// group by directorId
	let PersonChanges = app.models.PersonChanges;
	let Person = app.models.Person;
	let Company = app.models.Company;
	let CR7 = app.models.CR7;
	let template_path = '../templates/CR8.docx';
	let output_path = '../output/CR8s';
	let NA = 'NA';
	let map = {
		'street': 'Street',
		'house_number': 'House number',
		'building_name': 'Building name',
		'estate': 'Estate'
	};
	let ds = PersonChanges.dataSource;
	let sql = `SELECT 
		PersonChanges.id,
		PersonChanges.key,
	    PersonChanges.value, 
	    Person.id AS personId,
	    Person.salutation,
	    Person.surname,
	    Person.salutation,
	    Person.other_names,
	    Person.house_number,
	    Person.building_name,
	    Person.street,
	    Person.town,
	    Person.country
	FROM PersonChanges
	INNER JOIN Person on PersonChanges.personId = Person.id
	WHERE (PersonChanges.companyId=?) 
	AND (
		DATE(PersonChanges.date_modified) >=? AND 
		DATE(PersonChanges.date_modified) <= ?)
	AND (
	    (PersonChanges.key='street') OR 
	    (PersonChanges.key='house_number') OR 
	    (PersonChanges.key='building_name') OR 
	    (PersonChanges.key='estate') OR 
	    (PersonChanges.key='town') OR 
	    (PersonChanges.key='country')
	)`;

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id','company_name', 'registration_no','company_type_id'],
		include: ['CompanyType']
	});

	findCompanyPromise.then(function (company) {
		if (company === null) return cb(null, {
			success: 0,
			message: 'Company information not found. Please try again.'
		});

		company = JSON.parse(JSON.stringify(company));

		function handleResults(err, personChanges) {
			if(err) return cb(err);
			else
			if (personChanges.length > 0) {
				personChanges = JSON.parse(JSON.stringify(personChanges));
				let persons = compilePersonsChanges(personChanges);
				console.log(persons);
				let findSecPromise = Person.findOne({
					where: {
						company_id: companyId, person_type: 'Secretary'
					}
				});

				findSecPromise.then(function (secretary) {
					processCR8(company, secretary, persons);
				});

				findSecPromise.catch((err) => { cb(err);});
			}
			else {
				return cb(null, {
					success: 0,
					message: 'There no residential changes for directors to be filed within the specified dates.'
				});
			}
		}

		ds.connector.query(sql,[companyId,from, to],handleResults);
	});

	findCompanyPromise.catch((err) => { cb(err);});

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

	function formatCR8Data (company, secretary) {
		let secName = NA;
		let secPostalCode = NA;
		let secPostalBox = NA;
		let secTown = NA;
		let secEmail = NA;
		let secPhoneNo = NA;

		if (secretary !== null) {
			secName = `${secretary.surname} ${secretary.other_names}`.toUpperCase();
			secPostalCode = secretary.postal_code;
			secPostalBox = secretary.box;
			secTown = secretary.town.toUpperCase();
			secEmail = secretary.email_address;
			secPhoneNo = secretary.phone_number;
		}
		let today = new Date();
		console.log(company.CompanyType);
		return {
			company_name: company.company_name.toUpperCase(),
			registration_no: company.registration_no.toUpperCase(),
			dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
			company_type: company.CompanyType.name.toString().toUpperCase(),
			secretary_name: secName.toString().toUpperCase(),
			secretary_postal_code: secPostalCode,
			secretary_box: secPostalBox,
			secretary_town: secTown,
			secretary_email: secEmail,
			secretary_phone: secPhoneNo
		};
	}

	function createCR8Form (data) {
		let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
		let zip = new JSZip(content);
		let doc = new Docxtemplater();
		doc.loadZip(zip);
		doc.setData(data);

		try {
			doc.render();
			let buf = doc.getZip().generate({type: 'nodebuffer'});
			let token = uuid().toString().substring(0, 7);
			let fileName = `CR8-${data.company_name}-${token}.docx`;
			fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
			return fileName;
		}
		catch (error) { cb(error);}
	}

	function processCR8 (company, secretary, persons) {
		let itemsPerForm = 5;
		// if items found are more than itemsPerForm
		// they have to be output into n forms
		// n = Math.ceil(directors.length/itemsPerForm)
		let groupCount = Math.ceil(persons.length / itemsPerForm);
		let data = formatCR8Data(company, secretary);
		let formsPath = [];

		for (let i = 0; i < groupCount; i++) {
			data.directors = persons.slice(i * itemsPerForm, (i + 1) * itemsPerForm);
			let fileName = createCR8Form(data);
			formsPath.push(fileName);
		}

		let cr8 = {
			from: new Date(from),
			to: new Date(to),
			type: 'CR8',
			date: new Date(),
			companyId: companyId
		};

		function createCR8ItemTask (formPath, callback) {
			cr8.name = formPath;
			let createCR8Promise = CR7.create(cr8);
			createCR8Promise.then((cr6Item) => { callback(null, cr6Item); });
			createCR8Promise.catch((err) => { callback(err); });
		}

		function finalize (err) {
			if (err) cb(err);
			else
				return cb(null, {
					success: 1,
					message: `CR8 form for  ${company.company_name} created successfully.`,
					paths: formsPath
				});
		}

		async.each(formsPath, createCR8ItemTask, finalize);
	}
}

module.exports = generateCR8;