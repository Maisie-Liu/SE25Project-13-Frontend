describe('浏览器兼容性测试', () => {
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
    // 如有登出按钮可加：cy.get('.logout-btn').click();
  };

  viewports.forEach((viewport) => {
    // 首页
    describe(`在${viewport.name}(${viewport.width}x${viewport.height})下测试首页`, () => {
      beforeEach(() => {
        logout();
        login();
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
        cy.wait(1000);
      });
      it('首页元素可见', () => {
        cy.get('header').should('be.visible');
        cy.get('footer').should('exist');
        cy.get('.header-search-box').should('be.visible');
      });
    });

    // 登录页
    describe(`在${viewport.name}(${viewport.width}x${viewport.height})下测试登录页`, () => {
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
      });
    });

    // 商品列表页
    describe(`在${viewport.name}(${viewport.width}x${viewport.height})下测试商品列表页`, () => {
      beforeEach(() => {
        logout();
        login();
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/items');
        cy.wait(1000);
      });
      it('商品列表页元素可见', () => {
        cy.get('.item-list-container').should('exist');
        cy.get('.item-list-header').should('be.visible');
        cy.get('.ant-select-selection-search').should('exist');
      });
    });

    // 个人中心页
    describe(`在${viewport.name}(${viewport.width}x${viewport.height})下测试个人中心页`, () => {
      beforeEach(() => {
        logout();
        login();
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/users/2');
        cy.wait(1000);
      });
      it('个人中心页元素可见', () => {
        cy.get('.profile-layout').should('exist');
        cy.get('.ant-avatar').should('exist');
        cy.get('.profile-content').should('be.visible');
      });
    });
  });
}); 