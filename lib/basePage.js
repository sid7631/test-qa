const {Builder, By, until} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');
let o = new chrome.Options();
// o.addArguments('start-fullscreen');
o.addArguments('disable-infobars');
// o.addArguments('headless'); // running test on visual chrome browser
o.setUserPreferences({ credential_enable_service: false });

var Page = function() {
    this.driver = new Builder()
        .setChromeOptions(o)
        .forBrowser('chrome')
        .build();

    // visit a webpage
    this.visit = async function(theUrl) {
        return await this.driver.get(theUrl);
    };

    // quit current session
    this.quit = async function() {
        return await this.driver.quit();
    };

    // wait and find a specific element with it's id
    this.findById = async function(id) {
        await this.driver.wait(until.elementLocated(By.id(id)), 15000, 'Looking for element');
        return await this.driver.findElement(By.id(id));
    };

    // wait and find a specific element with it's name
    this.findByName = async function(name) {
        await this.driver.wait(until.elementLocated(By.name(name)), 15000, 'Looking for element');
        return this.driver.findElement(By.name(name));
    };

    this.findByXpath = async function(path) {
        await this.driver.wait(until.elementLocated(By.xpath(path)), 15000, 'Looking for element')
        return this.driver.findElement(By.xpath(path));
    }

    this.findByClassName = async function(className) {
        await this.driver.wait(until.elementLocated(By.className(className)), 15000, 'Looking for element')
        return this.driver.findElement(By.className(className));
    }

    this.isElementPresent = async function(xpath) {
        try {
            await this.driver.wait(until.elementLocated(By.xpath(xpath)), 2000, 'Element not present')
            return true     
        } catch (error) {
            return false
        }
    }


    // fill input web elements
    this.write = async function (el, txt) {
        return await el.sendKeys(txt);
    };

    this.click = async function (el) {
        try {
            await this.driver.wait(until.elementIsEnabled(el), 15000, 'Looking for element')
            return el.click()
        } catch (error) {
            return false
        }

    }
};

module.exports = Page;
