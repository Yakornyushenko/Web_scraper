const browserObject = require('./browser');
const scraperController = require('./pageController');

let browserInstance = browserObject.startBrowser();

scraperController(browserInstance);

    // async function start() {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //     await page.goto('https://habr.com/ru/search/page1/?q=frontend%20%D0%B4%D0%BB%D1%8F%20%D0%BD%D0%BE%D0%B2%D0%B8%D1%87%D0%BA%D0%B0&target_type=posts&order=relevance');
    //
    //     const subs = await page.$eval('#\\35 05268', (el) => el.innerText)
    //     console.log(subs)
    //
    //     await page.waitForSelector('#\\35 05268 > div.tm-article-snippet > h2 > a > span');
    //     await page.click('#\\35 05268 > div.tm-article-snippet > h2 > a > span');
    //
    //     await page.waitForSelector('#app > div.tm-layout__wrapper > div.tm-layout > main > div > div > div.tm-page__wrapper > div.tm-page__main.tm-page__main_has-sidebar > div > div.tm-article-presenter > div.tm-article-presenter__body > div.tm-misprint-area > div > article');
    //     const post = await page.$eval('#app > div.tm-layout__wrapper > div.tm-layout > main > div > div > div.tm-page__wrapper > div.tm-page__main.tm-page__main_has-sidebar > div > div.tm-article-presenter > div.tm-article-presenter__body > div.tm-misprint-area > div > article', (el) => el.innerText)
    //
    //     console.log(post)
    //     await browser.close();
    // }
    //
    // start()