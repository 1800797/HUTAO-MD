const axios = require('axios');
const cheerio = require('cheerio');

function quotesAnime() {
	return new Promise((resolve, reject) => {
		const page = Math.floor(Math.random() * 184)
		axios.get('https://otakotaku.com/quote/feed/'+page)
		.then(({ data }) => {
			const $ = cheerio.load(data)
			const hasil = []
			$('div.kotodama-list').each(function(l, h) {
				hasil.push({
					link: $(h).find('a').attr('href'),
					gambar: $(h).find('img').attr('data-src'),
					karakter: $(h).find('div.char-name').text().trim(),
					anime: $(h).find('div.anime-title').text().trim(),
					episode: $(h).find('div.meta').text(),
					up_at: $(h).find('small.meta').text(),
					quotes: $(h).find('div.quote').text().trim()
				})
			})
			resolve(hasil)
		}).catch(reject)
	})
};

module.exports = quotesAnime;