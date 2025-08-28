const cheerio = require("cheerio");
const { fetch } = require("undici");
const { lookup } = require("mime-types");

async function mediaFire(url) {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const $ = cheerio.load(html);

		const typeElement = $(".dl-btn-cont").find(".icon");
		const type = typeElement.length
			? typeElement.attr("class").split("archive")[1].trim()
			: null;

		const filename = $(".dl-btn-label").attr("title") || "unknown";
		const sizeText = $('.download_link .input').text().trim();
		const size = sizeText ? sizeText.match(/(.*?)/)?.[1] : null;

		const ext = filename.split(".").pop();
		const mimetype =
			lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();

		const downloadElement = $(".input");
		const download = downloadElement.length ? downloadElement.attr("href") : null;

		return {
			filename,
			type,
			size,
			ext,
			mimetype,
			download,
		};
	} catch (error) {
		throw {
			msg: "Gagal mengambil data dari link tersebut",
			error,
		};
	}
}

module.exports = mediaFire;