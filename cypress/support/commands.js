// ***********************************************
// 该文件可以定义您想要的自定义命令
// 详情查看: https://on.cypress.io/custom-commands
// ***********************************************

// 登录命令
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// 模拟图片上传
Cypress.Commands.add('uploadFile', { prevSubject: 'element' }, (subject, fileName, fileType = '') => {
  cy.fixture(fileName)
    .then(Cypress.Blob.base64StringToBlob)
    .then(blob => {
      const el = subject[0];
      const testFile = new File([blob], fileName, { type: fileType });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      el.files = dataTransfer.files;
      return cy.wrap(subject).trigger('change', { force: true });
    });
});

// 检查元素是否在视口内
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();
  
  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  
  return cy.wrap(subject);
}); 