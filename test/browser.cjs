// Run with Playwright installed and TIP_TEST_URL pointing to a local preview.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    try {
        for (const [width, height] of [[320, 568], [390, 844], [667, 375], [768, 1024], [1024, 768], [1440, 900]]) {
            const page = await browser.newPage({ viewport: { width, height } });
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(process.env.TIP_TEST_URL || 'http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
            await page.locator('.billInput').fill('100');
            await page.getByRole('button', { name: '15%' }).click();
            assert.equal(await page.locator('.totalResult').textContent(), '$115.00');
            assert.equal(await page.getByRole('button', { name: '15%' }).getAttribute('aria-pressed'), 'true');
            await page.locator('.custom').fill('22.5');
            assert.equal(await page.locator('.totalResult').textContent(), '$122.50');
            assert.equal(await page.locator('[aria-pressed="true"]').count(), 0);
            await page.getByRole('button', { name: '10%' }).click();
            assert.equal(await page.locator('.custom').inputValue(), '');
            assert.equal(await page.locator('.totalResult').textContent(), '$110.00');
            await page.locator('.billInput').fill('-1');
            assert.equal(await page.locator('.billInput').getAttribute('aria-invalid'), 'true');
            assert.equal(await page.locator('.totalResult').textContent(), '—');
            await page.getByRole('button', { name: 'Start over' }).click();
            assert.equal(await page.locator('.billInput').inputValue(), '');
            assert.equal(await page.locator('.totalResult').textContent(), '$0.00');
            assert.equal(await page.locator('[aria-pressed="true"]').count(), 0);
            await page.locator('.billInput').fill('0.10');
            await page.getByRole('button', { name: '15%' }).focus();
            await page.keyboard.press('Enter');
            assert.equal(await page.locator('.result').textContent(), '$0.02');
            assert.equal(await page.locator('.totalResult').textContent(), '$0.12');
            const geometry = await page.evaluate(() => {
                const controls = document.querySelector('.controls').getBoundingClientRect();
                const results = document.querySelector('.results').getBoundingClientRect();
                return {
                    overflows: document.documentElement.scrollWidth > innerWidth,
                    columns: results.left >= controls.right,
                    stacked: results.top >= controls.bottom,
                    targets: [...document.querySelectorAll('button, input')].every(element => element.getBoundingClientRect().height >= 44)
                };
            });
            assert.equal(geometry.overflows, false, `overflow at ${width}`);
            assert.equal(width >= 700 ? geometry.columns : geometry.stacked, true, `layout at ${width}`);
            assert.equal(geometry.targets, true);
            assert.deepEqual(errors, []);
            if (process.env.TIP_SCREENSHOT_DIR && [390, 768, 1440].includes(width)) {
                await page.locator('.billInput').fill('84.50');
                await page.screenshot({ path: `${process.env.TIP_SCREENSHOT_DIR}/tips-${width}.png`, fullPage: true });
            }
            console.log(`Passed layout and interactions at ${width}×${height}`);
            await page.close();
        }
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
