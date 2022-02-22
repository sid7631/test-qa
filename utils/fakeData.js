const Faker = require('Faker');

const generateUser = function () {
    return {
        name:Faker.Name.findName(),
        username:Faker.Internet.userName(),
        email:Faker.Internet.email(),
        phone:Faker.PhoneNumber.phoneNumber()
    }
}

module.exports = {
    nameKeyword: Faker.Name.findName(),
    usernameKeyword: Faker.Internet.userName(),
    emailKeyword: Faker.Internet.email(),
    phoneKeyword: Faker.PhoneNumber.phoneNumber(),
    generateUser:generateUser,
};