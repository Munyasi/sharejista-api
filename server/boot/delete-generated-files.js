let CronJob = require('cron').CronJob;
const { exec } = require('child_process');

function deleteDocxInOutputFolder() {
	let output = `server/output`;
	let cmd = `find ${output} -name '*.docx' -delete`;
	exec(cmd, (err, stdout, stderr) => {
		if (err)
			console.log(err);
	});
}

function finished() {
	console.log('Deleting generated files completed');
}
let crontab = '00 00 * * *'; //run every midnight
let job = new CronJob(crontab, deleteDocxInOutputFolder, finished, true);

