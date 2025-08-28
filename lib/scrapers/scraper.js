const axios = require('axios');
const cheerio = require('cheerio');

function wallpaper(title, page = '1') {
	return new Promise((resolve, reject) => {
		axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
		.then(({ data }) => {
			const $ = cheerio.load(data);
			const hasil = [];
			$('div.grid-item').each((i, elem) => {
				hasil.push({
					title: $(elem).find('div.info > a > h3').text(),
					type: $(elem).find('div.info > a:nth-child(2)').text(),
					source: 'https://www.besthdwallpaper.com/' + $(elem).find('div > a:nth-child(3)').attr('href'),
					image: [
						$(elem).find('picture > img').attr('data-src') || $(elem).find('picture > img').attr('src'),
						$(elem).find('picture > source:nth-child(1)').attr('srcset'),
						$(elem).find('picture > source:nth-child(2)').attr('srcset')
					]
				});
			});
			resolve(hasil);
		})
		.catch(reject);
	});
};

function wikimedia(title) {
	return new Promise((resolve, reject) => {
		axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
		.then(({ data }) => {
			const $ = cheerio.load(data);
			const hasil = [];
			$('.sdms-search-results__list-wrapper > div > a').each((i, elem) => {
				hasil.push({
					title: $(elem).find('img').attr('alt'),
					source: $(elem).attr('href'),
					image: $(elem).find('img').attr('data-src') || $(elem).find('img').attr('src')
				});
			});
			resolve(hasil);
		})
		.catch(reject);
	});
};

function happymod(query) {
	return new Promise((resolve, reject) => {
		const baseUrl = 'https://www.happymod.com/';
		axios.get(`${baseUrl}search.html?q=${query}`)
		.then(({ data }) => {
			const $ = cheerio.load(data);
			const hasil = [];
			$("div.pdt-app-box").each((i, elem) => {
				hasil.push({
					title: $(elem).find("a").text().trim(),
					icon: $(elem).find("img.lazy").attr('data-original'),
					rating: $(elem).find("span").text(),
					link: baseUrl + $(elem).find("a").attr('href')
				});
			});
			resolve(hasil);
		})
		.catch(reject);
	});
};

function ringtone(title) {
	return new Promise((resolve, reject) => {
		axios.get('https://meloboom.com/en/search/' + title)
		.then(({ data }) => {
			const $ = cheerio.load(data);
			const hasil = [];
			$('ul > li').each((i, elem) => {
				hasil.push({
					title: $(elem).find('h4').text(),
					source: 'https://meloboom.com/' + $(elem).find('a').attr('href'),
					audio: $(elem).find('audio').attr('src')
				});
			});
			resolve(hasil);
		})
		.catch(reject);
	});
};

function umma(url) {
	return new Promise((resolve, reject) => {
		axios.get(url)
		.then((res) => {
			const $ = cheerio.load(res.data);
			const image = [];
			$('#article-content > div').find('img').each((i, elem) => {
				image.push($(elem).attr('src'));
			});
			const hasil = {
				title: $('#wrap > div.content-container.font-6-16 > h1').text().trim(),
				author: {
					name: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.user-ame.font-6-16.fw').text().trim(),
					profilePic: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.profile-photo > img.photo').attr('src')
				},
				caption: $('#article-content > div > p').text().trim(),
				media: $('#article-content > div > iframe').attr('src') ? [$('#article-content > div > iframe').attr('src')] : image,
				type: $('#article-content > div > iframe').attr('src') ? 'video' : 'image',
				like: $('#wrap > div.bottom-btns > div > button:nth-child(1) > div.text.font-6-12').text(),
			};
			resolve(hasil);
		})
		.catch(reject);
	});
};

async function githubstalk(user) {
	return new Promise((resolve, reject) => {
		axios.get('https://api.github.com/users/' + user)
		.then(({ data }) => {
			const hasil = {
				username: data.login,
				nickname: data.name,
				bio: data.bio,
				id: data.id,
				nodeId: data.node_id,
				profile_pic: data.avatar_url,
				url: data.html_url,
				type: data.type,
				admin: data.site_admin,
				company: data.company,
				blog: data.blog,
				location: data.location,
				email: data.email,
				public_repo: data.public_repos,
				public_gists: data.public_gists,
				followers: data.followers,
				following: data.following,
				created_at: data.created_at,
				updated_at: data.updated_at
			};
			resolve(hasil);
		})
		.catch(reject);
	});
};

async function npmstalk(packageName) {
	let stalk = await axios.get("https://registry.npmjs.org/" + packageName);
	let versions = stalk.data.versions;
	let allver = Object.keys(versions);
	let verLatest = allver[allver.length - 1];
	let verPublish = allver[0];
	let packageLatest = versions[verLatest];
	return {
		name: packageName,
		versionLatest: verLatest,
		versionPublish: verPublish,
		versionUpdate: allver.length,
		latestDependencies: Object.keys(packageLatest.dependencies).length,
		publishDependencies: Object.keys(versions[verPublish].dependencies).length,
		publishTime: stalk.data.time.created,
		latestPublishTime: stalk.data.time[verLatest]
	};
}

async function mlstalk(id, zoneId) {
	return new Promise(async (resolve, reject) => {
		axios.post(
			'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
			new URLSearchParams(
				Object.entries({
					productId: '1',
					itemId: '2',
					catalogId: '57',
					paymentId: '352',
					gameId: id,
					zoneId: zoneId,
					product_ref: 'REG',
					product_ref_denom: 'AE',
				})
			),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Referer: 'https://www.duniagames.co.id/',
					Accept: 'application/json',
				},
			}
		)
		.then((response) => {
			resolve(response.data.data.gameDetail);
		})
		.catch((err) => {
			reject(err);
		});
	});
};

module.exports = { 
	wallpaper, 
	wikimedia, 
	happymod, 
	ringtone, 
	umma, 
	githubstalk, 
	npmstalk, 
	mlstalk 
};