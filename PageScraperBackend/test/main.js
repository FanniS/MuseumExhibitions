const puppeteer = require("puppeteer");
const scrapeMuseumExhibitions = require("./backend/scraper");

async function main() {
  const browser = await puppeteer.launch();
  const urls = [
    "https://mnm.hu/hu/kiallitasok/idoszaki",
    "https://www.szepmuveszeti.hu/kiallitasok/",
    "https://www.nhmus.hu/idoszakos-kiallitasok/",
  ];

  const scrapePromises = urls.map((url) => scrapeMuseumExhibitions(url, browser));
  const results = await Promise.all(scrapePromises);

  console.log(results.flat());
  await browser.close();
} 

main();
