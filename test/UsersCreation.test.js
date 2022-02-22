const { describe, it, after, before } = require('mocha');
const {By, Key} = require('selenium-webdriver');
const Page = require('../lib/Page');

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);




(async function example() {
    try {
        describe ('User Creation', async function () {
            this.timeout(20000);
            let driver, page;
            const add_user_url = '/add'
            const user_list_url = '/all'
            let user;

            
            before(async () => {
                page = new Page();
                driver = page.driver;
                await page.visit('http://localhost:3000');
            });

            after (async () => {
                await page.quit();
            });

            it ('A new User with the following information can be added: name, phone number, username and email from a simple form', async () => {


                //add new User
                user = await page.AddUniqueUser()
            })

            it ('New created users will be displayed in the users list', async () => {

                //filter by username of added user
                await page.HeaderAction('username','filter')
                const filterField = await page.findByXpath("//input[@placeholder='Filter value']")
                page.write(filterField,user.username)

                await driver.sleep(1000)

                //verify user is added
                const username = await page.GetTableRow(0,'username')
                expect(username).to.be.equal(user.username)
            })

            it ('Users are unique', async () => {

                //add duplicate users
                user = await page.AddDuplicateUser()

                //filter by username to added user
                await page.HeaderAction('username','filter')
                const filterField = await page.findByXpath("//input[@placeholder='Filter value']")
                page.write(filterField,user.username)

                await driver.sleep(1000)

                //second entry of user should not be added to the userlist
                const isElementPresent = await page.isElementPresent('//div[@data-rowindex="1"]')
                expect(isElementPresent).to.be.false
            })

            it ('Cancel Add User', async () => {

                //enter user details and click on cancel button
                user = await page.CancelAddUser()

                //filter by username of user details entered
                await page.HeaderAction('username','filter')
                const filterField = await page.findByXpath("//input[@placeholder='Filter value']")
                page.write(filterField,user.username)

                await driver.sleep(1000)

                //entry of user should not be added to the userlist
                const isElementPresent = await page.isElementPresent('//div[@data-rowindex="0"]')
                expect(isElementPresent).to.be.false
            })
        });

       
    } catch (ex) {
        console.log (new Error(ex.message));
    } finally {
       // await page.quit();
    }
})();
