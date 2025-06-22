describe('Order status workflow', () => {
  const username = `pharma${Date.now()}`;
  const user = {
    username,
    password: 'secret0',
    iceNumber: 'ICE0010',
    address: '1 rue Test0',
    phone: '06000000000'
  };

  const adminAuth = 'Basic ' + btoa('Achraf2:Achraf1234');

  before(() => {
    // Inscrit un nouveau client
    cy.request('POST', '/api/users/register', user);
    cy.wrap(user).as('user');
  });

  it('creates an order and verifies the status-change notification', function () {
    const auth = 'Basic ' + btoa(`${this.user.username}:${this.user.password}`);

    // Récupère l’ID de l’utilisateur authentifié
    cy.request({
      method: 'GET',
      url: '/api/users/me',
      headers: { Authorization: auth }
    }).then(loginResp => {
      const clientId = loginResp.body.id;

      // 2. Création de la commande (avec authentification)
      cy.request({
        method: 'POST',
        url: '/api/orders',
        qs: { userId: clientId },
        body: [{ medicationId: 1, quantity: 2 }],
        headers: { Authorization: auth }
      }).then(orderResp => {
        const orderId = orderResp.body.id;

        // Authentifie l’admin en Basic avant d’appeler l’API d’admin
        cy.request({
          method: 'GET',
          url: '/api/users/me',
          headers: { Authorization: adminAuth }
        });

        cy.request({
          method: 'PUT',
          url: `/api/admin/orders/${orderId}/status`,
          qs: { status: 'COMPLETED' },
          headers: { Authorization: adminAuth }
        }).its('status').should('eq', 200);

        cy.request({
          method: 'GET',
          url: '/api/admin/notifications/recent',
          headers: { Authorization: adminAuth }
        }).its('body').should(notifications => {
          const exists = notifications.some(n =>
            n.message.includes(`#${orderId}`) && n.type === 'orderStatus'
          );
          expect(exists).to.be.true;
        });
      });
    });
  });
});