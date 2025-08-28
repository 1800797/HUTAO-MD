const axios = require('axios');
const cheerio = require('cheerio');

async function komiku(type = "manga", name) {
	try {
		const { data } = await axios.get(`https://api.komiku.id/?post_type=${type}&s=${name}&APIKEY=undefined`);
		const $ = cheerio.load(data);

		const mangaList = [];
		$('.bge').each((i, elem) => {
			const title = $(elem).find('h3').text().trim();
			const genre = $(elem).find('.tpe1_inf b').text().trim();
			const description = $(elem).find('p').text().trim();
			const imageUrl = $(elem).find('img').attr('src');
			const mangaUrl = $(elem).find('a').attr('href');

			mangaList.push({
				title,
				genre,
				description,
				img: imageUrl,
				url: "https://komiku.id/" + mangaUrl,
			});
		});

		return mangaList;
	} catch (error) {
		console.error("Terjadi kesalahan:", error);
		return { error: error.message };
	}
}

async function detail(url) {
	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const title = $('span[itemprop="name"]').text().trim();
		const description = $('p[itemprop="description"]').text().trim();
		const awalChapter = $('a[title*="Chapter 01"]').text().trim();
		const terbaruChapter = $('a[title*="Chapter 165"]').text().trim();
		const coverImage = $('img[itemprop="image"]').attr('src');
		const genres = [];
		$('ul.genre li').each((i, el) => {
			genres.push($(el).text().trim());
		});

		return {
			title,
			description,
			awalChapter,
			newChapter: terbaruChapter,
			coverImage,
			genres,
		};
	} catch (error) {
		console.error("Terjadi kesalahan:", error);
		return { error: error.message };
	}
}

module.exports = {
	komiku,
	detail
};