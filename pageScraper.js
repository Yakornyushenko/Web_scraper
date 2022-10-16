const scraperObject = {
    url: 'http://books.toscrape.com',
    async scraper(browser, category){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        // Выберите категорию книги для отображения
        let selectedCategory = await page.$$eval('.side_categories > ul > li > ul > li > a', (links, _category) => {
            // Search for the element that has the matching text
            links = links.map(a => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);
            let link = links.filter(tx => tx !== null)[0];
            return link.href;
        }, category);
        // Переход к выбранной категории
        await page.goto(selectedCategory);
        let scrapedData = [];
        // Дождитесь рендеринга требуемого DOM.
        async function scrapeCurrentPage() {
            await page.waitForSelector('.page_inner');
            let urls = await page.$$eval('section ol > li', links => {
                links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
                links = links.map(el => el.querySelector('h3 > a').href)
                return links;
            });

            let pagePromise = (link) => new Promise(async (resolve, reject) => {
                let dataObject = {};
                let newPage = await browser.newPage();
                await newPage.goto(link);

                // Прокрутите каждую из этих ссылок, откройте новый экземпляр страницы и получите от них соответствующие данные.
                dataObject['bookTitle'] = await newPage.$eval('.product_main > h1', text => text.textContent);
                dataObject['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
                dataObject['noAvailable'] = await newPage.$eval('.instock.availability', text => {
                    // Удалить новую строку и табуляцию
                    text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                    let regexp = /^.*\((.*)\).*$/i;
                    let stockAvailable = regexp.exec(text)[1].split('')[0];
                    return stockAvailable;
                });
                dataObject['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
                dataObject['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
                dataObject['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
                resolve(dataObject);
                await newPage.close();
            });
            for (let link in urls) {
                let currentPageData = await pagePromise(urls[link]);
                scrapedData.push(currentPageData);
                // console.log(currentPageData);
            }
            // Когда все данные на этой странице будут готовы, нажмите кнопку «Далее» и начните парсинг следующей страницы
            // Сначала вы проверите, существует ли эта кнопка, чтобы знать, действительно ли есть следующая страница.
            let nextButtonExist = false;
            try {
                const nextButton = await page.$eval('.next > a', a => a.textContent);
                nextButtonExist = true;
            } catch (err) {
                nextButtonExist = false;
            }
            if (nextButtonExist) {
                await page.click('.next > a');
                return scrapeCurrentPage(); // Вызвать эту функцию рекурсивно
            }
            await page.close();
            return scrapedData;
        }
        let data = await scrapeCurrentPage();
        console.log(data);
        return data;
        }

}

module.exports = scraperObject;