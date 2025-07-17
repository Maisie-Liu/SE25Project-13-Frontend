// ***********************************************************
// This support/e2e.js文件会在所有e2e测试文件运行之前自动加载
// ***********************************************************

// 导入命令
import './commands';

// 导入cypress-file-upload
import 'cypress-file-upload';

// 导入报告器
import 'cypress-mochawesome-reporter/register';

// 在测试失败时自动截图
Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshot = `${Cypress.config('screenshotsFolder')}/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
    addContext({ test }, screenshot);
  }
}); 