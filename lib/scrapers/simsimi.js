const axios = require('axios');

const chatSimi = (teks, bahasa) => new Promise((resolve, reject) => {
	if (typeof teks !== 'string') {
		console.error('Teks harus berupa string');
		return reject('Teks tidak valid');
	}

	const bahasaValid = [
		'vn', 'en', 'he', 'zh', 'ch', 'id', 'ko', 'ph', 'ru', 'ar',
		'ms', 'es', 'pt', 'de', 'th', 'ja', 'fr', 'sv', 'tr', 'da',
		'nb', 'it', 'nl', 'fi', 'ml', 'hi', 'kh', 'ca', 'ta', 'rs',
		'mn', 'fa', 'pa', 'cy', 'hr', 'el', 'az', 'sw', 'te', 'pl',
		'ro', 'si', 'fy', 'kk', 'cs', 'hu', 'lt', 'be', 'br', 'af',
		'bg', 'is', 'uk', 'jv', 'eu', 'rw', 'or', 'al', 'bn', 'gn',
		'kn', 'my', 'sk', 'gl', 'gu', 'ps', 'ka', 'et', 'tg', 'as',
		'mr', 'ne', 'ur', 'uz', 'cx', 'hy', 'lv', 'sl', 'ku', 'mk',
		'bs', 'ig', 'lb', 'mg', 'ny', 'sn', 'tt', 'yo', 'co', 'eo',
		'ga', 'hm', 'hw', 'lo', 'mi', 'so', 'ug', 'am', 'gd'
	];

	if (!bahasaValid.includes(bahasa)) {
		console.error('Bahasa tidak valid atau tidak didukung');
		return reject('Bahasa tidak valid atau tidak didukung');
	}

	const data = new URLSearchParams();
	data.append('text', teks);
	data.append('lc', bahasa);

	axios.post('https://api.simsimi.vn/v2/simtalk', data)
		.then(response => resolve(response.data.message))
		.catch(err => reject(err));
});

module.exports = chatSimi;