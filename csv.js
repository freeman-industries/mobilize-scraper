const fs = require('fs-extra');
const path = require('path');

const RESULTS_FILE = path.join(__dirname, 'results.json');
const CSV_FILE = path.join(__dirname, 'results.csv');

const loadJSON = async filename => {
	try {
		const file = await fs.readFile(filename);

		return JSON.parse(file);
	} catch (error) {
		console.log(`${filename} doesn't exist or is not valid, skipping.`);
	}

	return null;
};

const run = async () => {
	console.log(`Reading any existing information...`);

	const results = await loadJSON(RESULTS_FILE);

	if (!results) throw new Error(`results.json not found, which probably means you didn't run the scraper yet. Do that first and then come back.`);

	const rows = results.map(result => [
		result.name || '',
		result.email || '',
	].join(','));

	const csv = [
		'Name,E-mail 1',
		...rows,
	].join('\n');

	await fs.writeFile(
		CSV_FILE,
		csv,
	);
};

run().then(process.exit).catch(error => {
	console.log(error);

	process.exit(1);
});
