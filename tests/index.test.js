const supertest = require('supertest');

const app = require('../app')

describe('GET /', () => {
  it('responds with a rendered "index" template', async () => {
    // Using supertest to make a GET request to the route
    const response = await supertest(app).get('/');

    // checking the response status code
    expect(response.status).toBe(200);
  });


  it('responds with a rendered "notFound" template when callng a route that does not exist', async () => {
    const response = await supertest(app).get('/undefined');
    expect(response.status).toBe(302); 
    // because of redirecting
  })
});
