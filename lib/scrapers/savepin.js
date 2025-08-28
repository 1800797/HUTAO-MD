const cheerio = require("cheerio");
const axios = require('axios');

async function savePin(url) {
	try {
		const response = await axios.get(`https://www.savepin.app/download.php?url=${encodeURIComponent(url)}&lang=en&type=redirect`);
		const html = response.data;
		const $ = cheerio.load(html);

		let results = [];
		$('td.video-quality').each((index, element) => {
			const type = $(element).text().trim();
			const format = $(element).next().text().trim();
			const downloadLinkElement = $(element).nextAll().find('#submiturl').attr('href');
			if (downloadLinkElement) {
				let downloadLink = downloadLinkElement;
				if (downloadLink.startsWith('force-save.php?url=')) {
					downloadLink = decodeURIComponent(downloadLink.replace('force-save.php?url=', ''));
				}
				results.push({ type, format, downloadLink });
			}
		});
		const title = $('h1').text().trim();

		return {
			title,
			results
		};
	} catch (error) {
		console.error("Error:", error.response ? error.response.data : error.message);
		return { success: false, message: error.message };
	}
};

module.exports = savePin;