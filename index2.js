const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request-promise');

function cleanTitle(title) {
  return title.replace(/[/\\?%*:|"<>]/g, '-');
}

async function downloadImage(uri, filename) {
  try {
    const buffer = await request({ uri, encoding: null });
    fs.writeFileSync(filename, buffer);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function scrape() {
  const url = 'https://www.imdb.com/list/ls000041191';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  const divSelector = '.lister-item';
  const titleSelector = '.lister-item-header';
  const imgSelector = '.lister-item-image img';
  const scoreSelector = '.ratings-metascore';
  const minute = '.lister-item .runtime';

  const results = await page.evaluate(
    (divSelector, titleSelector, scoreSelector, imgSelector, runtime) => {
      const divElements = Array.from(document.querySelectorAll(divSelector));
      const data = [];

      for (const element of divElements) {
        const title = element
          .querySelector(titleSelector)
          ?.textContent.trim()
          .replace(/\s*\n\s*/g, ' ');
        const score = element
          .querySelector(scoreSelector)
          ?.textContent.trim()
          .replace(/\s*\n\s*/g, ' ');
        const time = element
          .querySelector(runtime)
          ?.textContent.trim()
          .replace(/\s*\n\s*/g, ' ');
        const imgSrc = element.querySelector(imgSelector)?.getAttribute('src');

        data.push({
          title: title,
          score: score,
          time: time,
          pictureURL: imgSrc,
        });
      }

      return data;
    },
    divSelector,
    titleSelector,
    scoreSelector,
    imgSelector,
    minute
  );

  await browser.close();

  for (const [index, result] of results.entries()) {
    if (result.pictureURL) {
      const cleanedTitle = cleanTitle(result.title);
      const fileName = `${cleanedTitle}_${index}.jpg`;
      console.log(`Picture Downloaded: ${result.pictureURL}`);
      await downloadImage(result.resimURL, fileName);
      console.log(`${fileName} saved.`);
    }
  }

  return JSON.stringify(results, null, 2);
}

scrape()
  .then((jsonResults) => {
    console.log(jsonResults);
    fs.writeFileSync('result2.json', jsonResults);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });
