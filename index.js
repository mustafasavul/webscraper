const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.imdb.com/list/ls000041191';

const results = [];

axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);

    const divSelector = '.lister-item';
    const titleSelector = '.lister-item-header';
    const imgSelector = '.lister-item-image img';
    const scoreSelector = '.ratings-metascore';

    $(divSelector).each((index, element) => {
      const title = $(element).find(titleSelector).text();
      const score = $(element).find(scoreSelector).text();
      const imgSrc = $(element).find(imgSelector).attr('src');

      let stitle = title.trim().replace(/\s*\n\s*/g, ' ');
      let smetascore = score.trim().replace(/\s*\n\s*/g, ' ');

      results.push({
        title: stitle,
        score: smetascore,
        time: time,
        pictureURL: imgSrc,
      });

      const jsonResults = JSON.stringify(results, null, 2);
      fs.writeFileSync('result.json', jsonResults);
      console.log(jsonResults);
    });
  })
  .catch((error) => {
    console.error(`Erro: ${error.message}`);
  });
