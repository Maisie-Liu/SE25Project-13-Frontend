describe('响应式布局测试', () => {
  const viewports = [
    { width: 1920, height: 1080, name: '桌面大屏' },
    { width: 1366, height: 768, name: '桌面普通屏' }
  ];
  const testUser = { username: 'test1', password: '123456' };

  // 登录函数
  const login = () => {
    cy.visit('/login');
    cy.get('input[type="text"]').type(testUser.username);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
    cy.wait(1000);
  };

  // 登出函数
  const logout = () => {
    cy.clearCookies();
    cy.clearLocalStorage();
  };

  viewports.forEach((viewport) => {
    // 主页面相关测试（需要登录）
    describe(`在${viewport.name}(${viewport.width}x${viewport.height})下测试主页面`, () => {
      beforeEach(() => {
        logout();
        login();
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
        cy.wait(1000);
      });
      it('导航栏可见', () => {
        cy.get('.nav-menu').should('be.visible');
      });
      it('商品卡片布局', () => {
        cy.visit('/items');
        cy.wait(1000);
        cy.get('.item-card').should('exist');
        if (viewport.width >= 1366) {
          cy.get('.item-card:nth-child(1)').should('be.visible');
        } else {
          cy.get('.item-card:nth-child(1)').should('be.visible');
        }
      });
    });

    // 登录表单测试（必须未登录）
    describe(`在${viewport.name}(${viewport.width}x${viewport.height})下测试登录表单`, () => {
      beforeEach(() => {
        logout();
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/login');
        cy.wait(1000);
      });
      it('登录表单可见', () => {
        cy.get('form').should('be.visible');
        cy.get('input[type="text"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
        // 表单宽度应随视口变化
        cy.get('form').then($form => {
          const formWidth = $form[0].getBoundingClientRect().width;
          expect(formWidth).to.be.lessThan(viewport.width * 0.8);
        });
      });
    });
  });
}); 