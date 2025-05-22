import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// Converts product name to a safe filename (e.g., "Organic Tofu" → "organic-tofu.jpg")
const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // replace non-alphanumerics with dashes
    .replace(/(^-|-$)/g, '');     // remove leading/trailing dashes


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'food-products.json');

// Path to /images folder inside backend
const imgDir = path.join(__dirname, '../images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir);
}


const scrapeAllFoodProducts = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.traderjoes.com/home/products/category/food-8', {
    waitUntil: 'networkidle2'
  });

  const allProducts = new Map(); // Use Map to prevent duplicates
  const MAX_PRODUCTS = 1285; // Adjust as needed
  let pageIndex = 1;

  while (true) {
    await page.evaluate(() => {
    const popupCloseBtn = document.querySelector('button[aria-label="Close dialog"]');
    if (popupCloseBtn) {
    popupCloseBtn.click();
    console.log('❌ Closed popup modal');
    }
});
    console.log(`🌀 Scraping page ${pageIndex}...`);


    // Wait for product cards or exit if not found
    const productSelector = 'li[class^="ProductList_productList__item"]';
    const foundProducts = await page.waitForSelector(productSelector, { timeout: 10000 }).catch(() => null);

    if (!foundProducts) {
      console.log(`🚫 No products found on page ${pageIndex}. This might be the end. Exiting loop.`);
      break;
    }

    // Scrape current page
    const productsOnPage = await page.evaluate(() => {
      const productNodes = document.querySelectorAll('li[class^="ProductList_productList__item"]');

      return [...productNodes].map(node => {
        const nameEl = node.querySelector('h2 a');
        const priceEl = node.querySelector('span[class^="ProductPrice_productPrice__price"]');
        const categoryEl = node.querySelector('span[class^="ProductCard_card__category__text"] a');
        const imgEl = node.querySelector('img[class^="ProductCard_card__cover"]');
        const link = nameEl?.href;

        const name = nameEl?.innerText || 'Unknown';
        const price = priceEl?.innerText || 'Unknown';
        const category = categoryEl?.innerText || 'Unknown';
        const imageUrl = imgEl?.src || null;

        return {
          name,
          price,
          category,
          url: link,
          imageUrl
        };
      });
    });

    // Save products and log
    productsOnPage.forEach(product => allProducts.set(product.url, product));
    console.log(`📦 Total products so far: ${allProducts.size}`);

    // Stop if max product limit is reached
    if (allProducts.size >= MAX_PRODUCTS) {
      console.log(`✅ Reached product limit (${MAX_PRODUCTS}). Stopping scrape.`);
      break;
    }

    // Try clicking the "Next page" button
    const nextBtn = await page.$('button[aria-label^="Next page"]');
    if (!nextBtn) {
      console.log(`🛑 No "Next page" button found on page ${pageIndex}. Exiting.`);
      break;
    } else {
      console.log(`👉 Found next button on page ${pageIndex}.`);
    }

    // Detect content before clicking
    const prevContent = await page.content();

    await nextBtn.click();

    // Force scroll to help with lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait 3 seconds

    // Wait for content change after clicking
    const domChanged = await page.waitForFunction(
      (prev) => document.body.innerHTML !== prev,
      { timeout: 5000 },
      prevContent
    ).catch(() => {
      console.log(`⚠️ DOM did not change after clicking "Next" on page ${pageIndex}. Exiting loop.`);
      return false;
    });

    if (!domChanged) break;

    pageIndex++;
  }

  const result = [...allProducts.values()];
  console.log(`✅ Scraped a total of ${result.length} products:\n`);
  result.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} - ${p.price} (${p.category})`);
  });

  for (const product of result) {
  if (product.imageUrl) {
    const fileName = slugify(product.name) + '.jpg';
    const filePath = path.join(imgDir, fileName);

    try {
      const response = await axios.get(product.imageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, response.data);

      // ✅ ADD THIS LINE HERE
      product.imagePath = `/images/${fileName}`;

      console.log(`🖼️ Saved: ${fileName}`);
    } catch (err) {
      console.warn(`❌ Failed to download image for ${product.name}: ${err.message}`);
    }
  }
}
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

  await browser.close();
};

scrapeAllFoodProducts();



// This is the final correct version of the website scraper to get all of the food items
