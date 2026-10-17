const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");

function loadBrowserScript() {
    const values = new Map();
    const handlers = new Map();
    const document = {};

    function $(selector) {
        if (selector === document) {
            return { ready: callback => callback() };
        }

        return {
            html(value) {
                if (value === undefined) return values.get(selector);
                values.set(selector, value);
            },
            on(event, callback) {
                handlers.set(selector + ":" + event, callback);
            },
            val(value) {
                if (value === undefined) return values.get(selector) || "";
                values.set(selector, value);
            }
        };
    }

    const context = { $, document };
    const script = fs.readFileSync(path.join(projectRoot, "src/script.js"), "utf8");
    vm.runInNewContext(script, context);

    return { context, values };
}

test("the displayed tip and total use the same rounded cents", () => {
    const { context } = loadBrowserScript();
    const amounts = context.calculateAmounts(0.10, 0.15);

    assert.equal(amounts.tip.toFixed(2), "0.02");
    assert.equal(amounts.total.toFixed(2), "0.12");
    assert.equal((0.10 + amounts.tip).toFixed(2), amounts.total.toFixed(2));
});

test("a preset tip clears a stale custom percentage", () => {
    const { context, values } = loadBrowserScript();
    values.set(".custom", "25");

    context.changePercent(0.10);

    assert.equal(values.get(".custom"), "");
});

test("results are a sibling of the closed options container", () => {
    const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");

    assert.match(html, /<\/div>\s*<\/div>\s*<div class="results">/);
});

test("the card width stays within the viewport", () => {
    const css = fs.readFileSync(path.join(projectRoot, "src/style.css"), "utf8");

    assert.match(css, /width:\s*min\(390px, calc\(100% - 24px\)\)/);
    assert.match(css, /box-sizing:\s*border-box/);
});
