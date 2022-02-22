let Page = require('./basePage');
const fake = require('../utils/fakeData');
const {Builder, By, until} = require('selenium-webdriver');


const fakeNameKeyword = fake.nameKeyword;
const fakeUsernameKeyword = fake.usernameKeyword;
const fakeEmailKeyword = fake.emailKeyword;
const fakePhoneKeyword = fake.phoneKeyword;

let searchInput, searchButton, resultStat;
const add_user_url = '/add'
const user_list_url = '/all'


Page.prototype.EnterUserDetails = async function (user) {
    const name =  await this.findByName('name')
    this.write(name, user.name)
    const username =  await this.findByName('username')
    this.write(username, user.username)
    const email =await  this.findByName('email')
    this.write(email, user.email)
    const phone =await  this.findByName('phone')
    this.write(phone, user.phone)
    return user
}

Page.prototype.AddUser = async function (user) {
    
    await this.EnterUserDetails(user)
    const addUserButton = await this.findByXpath('//button/*[contains(text(), "Add User")]')
    return addUserButton.click()
}

Page.prototype.AddUniqueUser = async function () {
    const user = fake.generateUser()
    await this.navigate(add_user_url)
    await this.AddUser(user)
    return user
}

Page.prototype.AddDuplicateUser = async function () {
    const user = fake.generateUser()
    await this.navigate(add_user_url) 
    await this.AddUser(user)
    await this.navigate(add_user_url)
    await this.AddUser(user)
    return user
}

Page.prototype.CancelAddUser = async function () {
    await this.navigate(add_user_url)
    const user = fake.generateUser()
    await this.navigate(add_user_url) 
    await this.EnterUserDetails(user)
    const cancelButton = await this.findByXpath('//button/*[contains(text(), "Cancel")]')
    cancelButton.click()
    return user
}

Page.prototype.GetTableRow = async function (rowNumber, dataField) {
    const Row = await this.findByXpath('//div[@data-rowindex="'+rowNumber+'"]')
    const Field = await Row.findElement(By.xpath("./child::div[@data-field='"+dataField+"']"))
    const fieldValue = await Field.getText()
    return fieldValue
}

Page.prototype.GetHearderActionButton = async function (dataField) {
    const idField = await this.findByXpath("//div[@role='columnheader' and  @data-field='"+dataField+"']")
    await this.driver.actions({ bridge:true}).move({origin:idField}).perform()
    const actionIcon = await this.findByXpath("//div[@role='columnheader' and  @data-field='"+dataField+"']//button[@aria-label='Menu']")
    await this.driver.actions({ bridge:true}).move({origin:actionIcon}).click().perform()
}

Page.prototype.HeaderAction = async function (dataField,action) {
    if(action =='filter'){
        await this.GetHearderActionButton(dataField)
        const filter = await this.findByXpath("//ul[@role='menu']//li[@data-value='desc']/following-sibling::li")
        return filter.click()
    } else {
        await this.GetHearderActionButton(dataField)
        const sortAsc = await this.findByXpath("//ul[@role='menu']//li[@data-value='"+action+"']")
        return sortAsc.click()
    }

}


Page.prototype.HeaderActionTest = async function(headerField) {
    let fieldValue

    await this.navigate(user_list_url)

    await this.HeaderAction(headerField,'asc')
    await this.HeaderAction(headerField,'desc')
    fieldValue = await this.GetTableRow(0,headerField)
    await this.HeaderAction(headerField,'filter')
    await this.driver.sleep(1000)
    const filterField = await this.findByXpath("//input[@placeholder='Filter value']")
    this.write(filterField,fieldValue)

    await this.driver.sleep(3000)

    const postfilterField = await this.findByXpath("//div[@role='cell' and @data-field='"+headerField+"']")
    const postFilterValue = await postfilterField.getText()


    const filterDeleteField = await this.findByXpath("//button[@aria-label='Delete' and @title='Delete']")
    this.click(filterDeleteField)

    return [postFilterValue,fieldValue]
}


Page.prototype.navigate = async function (url) {
    const navigateAddUser = await this.findByXpath('//a[@href="'+url+'"]')
    return navigateAddUser.click()
}

module.exports = Page;