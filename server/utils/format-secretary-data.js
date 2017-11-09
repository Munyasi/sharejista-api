/**
 * format secretary for use in Word Documents
 * @param secretary Secretary data object
 * @returns {{secretary_name: string, secretary_postal_code: string, secretary_box: string, secretary_town: string, secretary_email: string, secretary_phone: string, secretary_country: string}}
 */
function formatSecretary (secretary) {
	let NA = 'NA';
	let secName = NA;
	let secPostalCode = NA;
	let secPostalBox = NA;
	let secTown = NA;
	let secEmail = NA;
	let secPhoneNo = NA;
	let secCountry = NA;

	if (secretary !== null) {
		secName = `${secretary.surname} ${secretary.other_names}`.toUpperCase();
		secPostalCode = secretary.postal_code;
		secPostalBox = secretary.box;
		secTown = secretary.town.toUpperCase();
		secEmail = secretary.email_address;
		secPhoneNo = secretary.phone_number;
		secCountry = secretary.country.toUpperCase();
	}

	return {
		secretary_name: secName,
		secretary_postal_code: secPostalCode,
		secretary_box: secPostalBox,
		secretary_town: secTown,
		secretary_email: secEmail,
		secretary_phone: secPhoneNo,
		secretary_country: secCountry,
	};
}

module.exports = formatSecretary;