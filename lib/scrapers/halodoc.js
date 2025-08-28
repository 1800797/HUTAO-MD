const axios = require("axios");
const cheerio = require("cheerio");

const halodoc = (penyakit = null) => {
    const baseSearchArtikel = `https://www.halodoc.com/artikel/search/${penyakit}`;
    const obatBaseUrl = `https://www.halodoc.com/obat-dan-vitamin/search/${penyakit}`;

    const getArtikelSearch = async () => {
        try {
            const { data } = await axios.get(baseSearchArtikel);
            const $ = cheerio.load(data);
            const articles = [];

            $("magneto-card").each((index, element) => {
                const title = $(element).find("header a").text().trim();
                const description = $(element).find(".description").text().trim();
                const link = $(element).find("header a").attr("href");
                const image = $(element).find("picture img").attr("src");

                if (title && link) {
                    articles.push({
                        title,
                        description,
                        link: `https://www.halodoc.com${link}`,
                        image,
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error("Error fetching articles:", error.message);
            return [];
        }
    };

    const getObatSearch = async () => {
        try {
            const { data } = await axios.get(obatBaseUrl);
            const $ = cheerio.load(data);
            const obatList = [];

            $("li.custom-container__list__container").each((index, element) => {
                const title = $(element).find(".hd-base-product-search-card__title").text().trim();
                const subtitle = $(element).find(".hd-base-product-search-card__subtitle").text().trim();
                const price = $(element).find(".hd-base-product-search-card__price").text().trim();
                const image = $(element).find(".hd-base-image-mapper__img").attr("src");
                const link = $(element).find(".hd-base-product-search-card__content a").attr("href");

                if (title && link) {
                    obatList.push({
                        title,
                        subtitle,
                        price,
                        image,
                        link: `https://www.halodoc.com${link}`,
                    });
                }
            });

            return obatList;
        } catch (error) {
            console.error("Error fetching medicines:", error.message);
            return [];
        }
    };

    const getDetailUrl = async (url) => {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            const title = $("h3.section-header__content-text-title").text().trim();
            const subheadline = $(".article-page__article-subheadline").text().trim();
            const summary = $(".article-page__summary").text().trim();
            const reviewer = $(".article-page__reviewer").text().trim();
            const readTime = $(".article-page__reading-time").text().trim();
            const image = $(".article-page__image-container img").attr("src");

            return {
                title,
                subheadline,
                summary,
                review: reviewer,
                readTime,
                imageBase64: image,
            };
        } catch (error) {
            console.error("Error fetching article details:", error.message);
            return null;
        }
    };

    return {
        getArtikelSearch,
        getObatSearch,
        getDetailUrl,
    };
};

module.exports = halodoc;