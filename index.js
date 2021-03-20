const Axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const INTERVAL = 5000; // 5 seconds between API calls
const COUNT = 20; // fetch 20 at a time. A value greater than this doesn't appear to do anything.

const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const RESULTS_FILE = path.join(__dirname, 'results.json');

const loadJSON = async filename => {
	try {
		const file = await fs.readFile(filename);

		return JSON.parse(file);
	} catch (error) {
		console.log(`${filename} doesn't exist or is not valid, skipping.`);
	}

	return null;
};

const saveJSON = async (filename, data) => {
	await fs.writeFile(
		filename,
		JSON.stringify(data),
	);
};

const run = async () => {
	if (!process.env.DOMAIN) throw new Error(`You need to specify the DOMAIN that your group lives under in environment.`);
	if (!process.env.GROUP_ID) throw new Error(`You need to specify a GROUP_ID in environment. Get this from the Mobilize address bar.`);
	if (!process.env.COOKIE) throw new Error(`You need to specify a COOKIE in environment. This can be found in your session data in the browser. See README for formatting.`);

	console.log(`Reading any existing information...`);

	let results = await loadJSON(RESULTS_FILE);

	// initialize results array on first load.
	if (!results) results = [];

	const progress = await loadJSON(PROGRESS_FILE);

	// total users starts at infinity so the loop can begin.
	let total_users = progress ? progress.total_users : Infinity;
	let offset = progress ? progress.offset : 0;

	while (offset < total_users) {
		console.log(`⏬ ${offset}/${total_users}`);

		const url = `https://${process.env.DOMAIN}.mobilize.io/members.json?offset=${offset}&count=${COUNT}&search=&group_id=${process.env.GROUP_ID}&filters=%7B%7D`;

		const { data } = await Axios.request({
			url,
			headers: {
				Cookie: process.env.COOKIE,
			}, 
		});
    
		// append fetched users to results json
		results = results.concat(data.users);

		await saveJSON(
			RESULTS_FILE,
			results,
		);
    
		// update total users so the loop can continue with the next batch.
		total_users = data.total_users;
		offset += COUNT;

		// save progress to json in case of an abort.
		await saveJSON(
			PROGRESS_FILE,
			{ total_users, offset },
		);
    
		// wait a bit to be respectful to the Mobilize API
		await new Promise(resolve => setTimeout(resolve, INTERVAL));
	}
};

run().then(process.exit).catch(error => {
	console.log(error);

	process.exit(1);
});
