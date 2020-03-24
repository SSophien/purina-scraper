const axios = require('axios');
const cheerio = require('cheerio');

const parseLinks = data => {
	const $ = cheerio.load(data);
	const links = [];

	$('a.callout').each((i, element) => {
		const link = $(element).attr('href');
		links.push("https://www.purina.com" + link);
	})

	return links;
};

module.exports.scrapeLinks = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseLinks(data);
  }

  console.error(status);

  return null;
};


const parseCats = data => {
  const $ = cheerio.load(data);
  const name = $('h1').text();
  const size = $('div.statsDef-content-list-item-value').eq(0).text().trim()
  const coat = $('div.statsDef-content-list-item-value').eq(1).text().trim()
  const color = $('div.statsDef-content-list-item-value').eq(2).text().trim()
  const lifespan = $('p:contains("Lifespan")').next().text().trim()
  const imageLink = "https://www.purina.com" + $('div.statsDef-media > img').attr('srcset').split(',')[2].split('?')[0].trim()
  //const address = $('.restaurant-details__heading--list > li:not([class])').first().text();

  return {name, size, coat, color, lifespan, imageLink};
};


module.exports.scrapeCatsInfo = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseCats(data);
  }

  console.error(status);

  return null;
};

module.exports.get = () => {
  return [];
};
