const axios = require("axios");
const cheerio = require("cheerio");

function PlayStore(search) {
	return new Promise(async (resolve, reject) => {
		try {
			const { data, status } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`)
			const hasil = []
			const $ = cheerio.load(data)
			$('.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a').each((i, u) => {
				const linkk = $(u).attr('href')
				const nama = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text()
				const developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text()
				const img = $(u).find('.j2FCNc > img').attr('src')
				const rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label')
				const rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text()
				const link = `https://play.google.com${linkk}`
				hasil.push({
					link: link,
					nama: nama ? nama : 'No name',
					developer: developer ? developer : 'No Developer',
					img: img ? img : 'https://i.ibb.co/G7CrCwN/404.png',
					rate: rate ? rate : 'No Rate',
					rate2: rate2 ? rate2 : 'No Rate',
					link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(" ").join('+')}`
				})
			})
			if (hasil.every(x => x === undefined))
			return resolve({
				message: 'Tidak ada result!'
			})
			resolve(hasil)
		} catch (err) {
			console.error(err)
		}
	})
};

module.exports = PlayStore;