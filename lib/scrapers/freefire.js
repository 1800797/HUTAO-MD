const cheerio = require('cheerio');
const axios = require('axios');

async function ffCh() {
	let response = await axios.get("https://ff.garena.com/id/chars/");
	let $ = cheerio.load(response.data);
	let hasil = [];

	$(".char-box.char-box-new").each((index, element) => {
		let name = $(element).find(".char-item-name").text();
		let desc = $(element).find(".char-item-desc").text();
		let id = $(element).find("a").attr("href");
		const match = id.match(/\/(\d+)$/);
		const idRes = match ? parseInt(match[1]) : null;
		hasil.push({
			name: name.trim(),
			desc: desc.trim(),
			id: idRes,
		});
	});

	return hasil;
}

async function ffChSkill(id) {
	let response = await axios.get(`https://ff.garena.com/id/chars/${id}`);
	let $ = cheerio.load(response.data);
	let hasil = [];

	let title = $(".skill-profile-r .skill-profile-title").text();
	let name = $(".skill-profile-name").text();
	let skill = $(".skill-introduction").text();
	hasil.push({
		title: title.trim(),
		name: name.trim(),
		skill: skill.trim(),
	});

	return hasil;
}

async function ffNews() {
	let response = await axios.get('https://ff.garena.com/id/news/');
	let $ = cheerio.load(response.data);
	let hasil = [];
	$('.news-item.news-elem').each((index, element) => {
		let time = $(element).find('.news-time').text().trim();
		let title = $(element).find('.news-title').text().trim();
		let link = $(element).find('a').attr('href').trim();
		hasil.push({
			title: title,
			time: time,
			link: 'https://ff.garena.com' + link
		});
	});
	return hasil;
}

async function ffPet() {
	try {
		let response = await axios.get('https://ff.garena.com/id/pets/');
		let $ = cheerio.load(response.data);
		let hasil = [];

		$('.pet-box.pet-box-new').each((index, element) => {
			let name = $(element).find('.pet-name').text();
			let talk = $(element).find('.pet-abstract').text();
			let idElement = $(element).find('a');

			if (idElement.length > 0) {
				let id = idElement.attr('href');
				const match = id.match(/\/(\d+)$/);
				const idRes = match ? parseInt(match[1]) : null;

				hasil.push({
					name: name.trim(),
					talk: talk.trim(),
					id: idRes
				});
			} else {
				console.error('Error: Anchor element not found for the following element:');
				console.log(element);
			}
		});

		return hasil;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

async function ffPetSkill(id) {
	let response = await axios.get(`https://ff.garena.com/id/pets/${id}`);
	let $ = cheerio.load(response.data);
	let hasil = [];
	let name = $('.skill-profile-name').text();
	let skill = $('.skill-introduction').text();
	hasil.push({
		name: name.trim(),
		skill: skill.trim()
	});
	return hasil;
}

module.exports = {
	ffCh,
	ffChSkill,
	ffNews,
	ffPet,
	ffPetSkill
};