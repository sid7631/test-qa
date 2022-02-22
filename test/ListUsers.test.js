const { describe, it, after, before } = require('mocha');
const {By, Key} = require('selenium-webdriver');
const Page = require('../lib/Page');

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);




(async function example() {
    try {
        describe ('List Users', async function () {
            this.timeout(20000);
            let driver, page, actions;
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

            it ('The users list can have multiple users', async () => {
                await page.AddUniqueUser()
                await page.AddUniqueUser()
                await page.AddUniqueUser()
                await driver.sleep(1000)

                const username1 = await page.GetTableRow(0,'name')
                const username2 = await page.GetTableRow(1,'name')
                const username3 = await page.GetTableRow(2,'name')

                expect(username1).to.have.lengthOf.greaterThan(0)
                expect(username2).to.have.lengthOf.greaterThan(0)
                expect(username3).to.have.lengthOf.greaterThan(0)

            })

            it ('Table field ID', async () => {
                let idValue1, idValue2
                const headerField = 'id'
                await page.navigate(user_list_url)
                await driver.sleep(2000)

                await page.HeaderAction(headerField,'asc')
                await driver.sleep(1000)
                idValue1 = await page.GetTableRow(0,headerField)
                idValue2 = await page.GetTableRow(1,headerField)
                expect(parseInt(idValue1)).to.be.lessThan(parseInt(idValue2))

                await page.HeaderAction(headerField,'desc')
                await driver.sleep(1000)
                idValue1 = await page.GetTableRow(0,headerField)
                idValue2 = await page.GetTableRow(1,headerField)
                expect(parseInt(idValue1)).to.be.greaterThan(parseInt(idValue2))

                await page.HeaderAction(headerField,'filter')
                await driver.sleep(1000)
                const filterField = await page.findByXpath("//input[@placeholder='Filter value']")
                page.write(filterField,idValue2)

                await driver.sleep(3000)
                
                const postfilterField = await page.findByXpath("//div[@role='cell' and @data-field='"+headerField+"']")
                const postFilterValue = await postfilterField.getText()
                expect(postFilterValue).to.be.equal(idValue2)

            })

            it ('Name field ID', async () => {
                await driver.sleep(1000)
                let result = []
                const headerField = 'name'
                result = await page.HeaderActionTest(headerField)
                expect(result[0]).to.be.equal(result[1])

            })

            it ('Username field ID', async () => {
                await driver.sleep(1000)
                let result = []
                const headerField = 'username'
                result = await page.HeaderActionTest(headerField)
                expect(result[0]).to.be.equal(result[1])
                

            })

            it ('Email field ID', async () => {
                await driver.sleep(1000)
                let result = []
                const headerField = 'email'
                result = await page.HeaderActionTest(headerField)
                expect(result[0]).to.be.equal(result[1])
                

            })

            it ('Phone field ID', async () => {
                await driver.sleep(1000)
                let result = []
                const headerField = 'phone'
                result = await page.HeaderActionTest(headerField)
                expect(result[0]).to.be.equal(result[1])
                

            })

            it ('User Edited', async () => {
                await page.navigate(user_list_url)
                await driver.sleep(1000)
                const firstRow = await page.findByXpath('//div[@data-rowindex="0"]')
                const phoneField = await firstRow.findElement(By.xpath("./child::div[@data-field='phone']"))
                const phoneValue = await phoneField.getText()

                const child = await firstRow.findElement(By.xpath("./child::div[@data-field='actions']"))
                const removeButton = await child.findElement(By.xpath("./child::button/*[contains(text(), 'Edit')]"))
                await removeButton.click()

                await driver.sleep(1000)

                const phone =  await page.findByName('phone')
                await page.write(phone, 1)

                const UpdateUser = await page.findByXpath('//button/*[contains(text(), "Update User")]')
                UpdateUser.click()

                await page.HeaderAction('phone','filter')
                const filterField = await page.findByXpath("//input[@placeholder='Filter value']")
                page.write(filterField,phoneValue+1)

                await driver.sleep(1000)

                const firstRow2 = await page.findByXpath('//div[@data-rowindex="0"]')
                const phoneField2 = await firstRow2.findElement(By.xpath("./child::div[@data-field='phone']"))
                const phone2Value = await phoneField2.getText()

                expect(phoneValue+'1').to.be.equal(phone2Value)
            })

            it ('User Removed', async () => {
                await page.navigate(user_list_url)
                await driver.sleep(1000)
                const firstRow = await page.findByXpath('//div[@data-rowindex="0"]')

                const child = await firstRow.findElement(By.xpath("./child::div[@data-field='actions']"))
                const removeButton = await child.findElement(By.xpath("./child::button/*[contains(text(), 'Remove')]"))
                await removeButton.click()

                await driver.sleep(5000)


                const isElementPresent = await page.isElementPresent('//div[@data-rowindex="0"]')

                expect(isElementPresent).to.be.false
            })

            it ('Rows per page', async () => {
                await page.navigate(user_list_url)
                const rowPerPageButton = await page.findByXpath("//div[@role='button' and contains(@class,'MuiTablePagination-select')]")
                await page.click(rowPerPageButton)

                const rowPerPageMenu = await page.findByXpath("//ul[@role='listbox']/li[@role='option' and @aria-selected='false']")
                await page.click(rowPerPageMenu)

            })

        });

    } catch (ex) {
        console.log (new Error(ex.message));
    } finally {
        //await page.quit();
    }
})();
