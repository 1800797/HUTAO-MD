const cheerio = require('cheerio');
const axios = require('axios');

const Kusonime = {
    info: async () => {
        try {
            const { data } = await axios.get('https://kusonime.com/');
            const $ = cheerio.load(data);
            const animeList = [];

            $('.venz .detpost').each((i, el) => {
                const element = $(el);
                const title = element.find('.content h2 a').text().trim();
                const url = element.find('.content h2 a').attr('href');
                const thumbnail = element.find('.thumbz img').attr('src');
                const genres = element
                    .find('.content p:contains("Genre") a')
                    .map((i, el) => $(el).text())
                    .get();
                const releaseTime = element.find('.content p:contains("Released on")').text().replace('Released on ', '').trim();

                animeList.push({
                    title,
                    url,
                    thumbnail,
                    genres,
                    releaseTime,
                });
            });

            return animeList;
        } catch (error) {
            console.error('Error fetching Kusonime info:', error.message);
            return [];
        }
    },

    search: async (anime) => {
        try {
            const { data } = await axios.get(`https://kusonime.com/?s=${encodeURIComponent(anime)}`);
            const $ = cheerio.load(data);
            const searchResults = [];

            $('.venz .detpost').each((i, el) => {
                const element = $(el);
                const title = element.find('.content h2 a').text().trim();
                const url = element.find('.content h2 a').attr('href');
                const thumbnail = element.find('.thumbz img').attr('src');
                const genres = element
                    .find('.content p:contains("Genre") a')
                    .map((i, el) => $(el).text())
                    .get();
                const releaseTime = element.find('.content p:contains("Released on")').text().replace('Released on ', '').trim();

                searchResults.push({
                    title,
                    url,
                    thumbnail,
                    genres,
                    releaseTime,
                });
            });

            return searchResults.length ? searchResults : 'No results found';
        } catch (error) {
            console.error('Error searching Kusonime:', error.message);
            return 'Error fetching search results';
        }
    }
};

module.exports = Kusonime;