const config = require('../config');
const { I } = inject();

module.exports = {
  fields: {
    username: '#username',
    password: '#password',
  },
  submitButton: 'input[value="Sign in"]',

  async SignInUser() {
    console.log('User using the URL= ' + config.baseUrl);
    await I.amOnPage(config.baseUrl)
    await I.fillField(this.fields.username, "ds-ui2022@mailinator.com");
    await I.fillField(this.fields.password, "Automation123");
    I.wait(5)
    await I.click(this.submitButton);
  },
};
