const puppeteer = require("puppeteer");
const months = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];

async function scrapeMuseumExhibitions(url, browser = null, ...rest) {
    if (!browser) {
        browser = await puppeteer.launch({ headless: true });
    }

    let exhibitions = [];

    try {
        switch (url) {
            case "https://mnm.hu/hu/kiallitasok/idoszaki":
                exhibitions = await scrapeMnmExhibitions(browser, url, exhibitions);
                break;

            case "https://www.szepmuveszeti.hu/kiallitasok/":
                exhibitions = await scrapeSzepMuvExhibition(browser, url, exhibitions);
                break;

            case "https://www.nhmus.hu/idoszakos-kiallitasok/":
                exhibitions = await scrapeNhmusExhibitions(browser, url, exhibitions);
                break;

            default:
                return [];
        }
        return exhibitions;
    } catch (error) {
        console.error("Error scraping:", error);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function scrapeMnmExhibitions(browser, url, exhibitions) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".node-exhibition", { timeout: 5000 });
        const exhibitionUrls = await page.evaluate(() => Array.from(document.querySelectorAll(".node-link-overlay")).map((url) => url.href));
        if (exhibitionUrls.length > 0) {
            for (const exUrl of exhibitionUrls) {
                await page.goto(exUrl, { waitUntil: "domcontentloaded" });
                await page.waitForSelector(".page-title", { timeout: 5000 });
                const name = await page.evaluate(() => document.querySelector(".page-title")?.innerText || "No title");
                let from = await page.evaluate(() => document.querySelector(".date-display-start")?.innerText || null);
                let to = await page.evaluate(() => document.querySelector(".date-display-end")?.innerText || null);
                if (from !== null && to !== null) {
                    from = new Date(from);
                    to = new Date(to);
                }
                const link = exUrl;
                const museum = "Magyar Nemzeti Múzeum";
                exhibitions.push({ name, from, to, link, museum });
            }
        } else {
            exhibitions = [];
        }
    } catch (error) {
        console.error("Error scraping MNM exhibitions:", error);
    } finally {
        await page.close();
    }
    return exhibitions;
}

async function scrapeSzepMuvExhibition(browser, url, exhibitions) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".card--exhibition", { timeout: 5000 });
        exhibitions = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".card--exhibition"))
                .map((item) => {
                    const name = item.querySelector(".card__title")?.innerText || "No title";
                    let [from, to] = (item.querySelector(".card__lead")?.innerText || "").split(" — ");
                    const link = item.querySelector(".card__link")?.href;
                    const museum = "Szépművészeti Múzeum";
                    return { name, from, to, link, museum};
                })
                .filter((exhibition) => exhibition.name !== "No title");
        });
        for (const ex of exhibitions) {
            ex.from = convertToDate(ex.from);
            ex.to = convertToDate(ex.to);
        }
    } catch (error) {
        console.error("Error scraping SzepMuv exhibitions:", error);
    } finally {
        await page.close();
    }
    return exhibitions;
}

async function scrapeNhmusExhibitions(browser, url, exhibitions) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".item-title", { timeout: 5000 });
        const exhibitionUrls = await page.evaluate(() => Array.from(document.querySelectorAll(".item-title")).map((title) => title.href));

        if (exhibitionUrls.length > 0) {
            for (const exUrl of exhibitionUrls) {
                await page.goto(exUrl, { waitUntil: "domcontentloaded" });
                await page.waitForSelector(".title", { timeout: 5000 });
                const name = await page.evaluate(() => document.querySelector(".title")?.innerText || "No title");
                const from = new Date();
                let to = await page.evaluate(() => document.querySelector(".event-end")?.innerText?.split("\n")[1].slice(0, -3) || "No end date");
                to = convertToDate(to);
                const link = exUrl;
                const museum = "Magyar Természettudományi Múzeum";

                exhibitions.push({ name, from, to, link, museum });
            }
        } else {
            exhibitions = [];
        }
    } catch (error) {
        console.error("Error scraping NHMUS exhibitions:", error);
    } finally {
        await page.close();
    }
    return exhibitions;
}

function convertToDate(date) {
    const [year, month, day] = date.split(" ");
    return new Date(year.slice(0, 4), months.indexOf(month), day.slice(0, 2));
}

module.exports = scrapeMuseumExhibitions;