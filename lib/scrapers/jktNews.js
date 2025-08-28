const axios = require("axios");
const cheerio = require("cheerio");

async function jktNews(lang = "id") {
	try {
		const { data } = await axios.get(`https://jkt48.com/news/list?lang=${lang}`);
		const $ = cheerio.load(data);

		const news = [];
		$(".entry-news__list").each((index, element) => {
			const title = $(element).find("h3 a").text().trim();
			const link = $(element).find("h3 a").attr("href");
			const date = $(element).find("time").text().trim();

			news.push({
				title,
				link: "https://jkt48.com" + link,
				date,
			});
		});

		return news;
	} catch (error) {
		console.error("Terjadi kesalahan:", error);
		return { error: error.message };
	}
}

module.exports = jktNews;