const supertest = require('supertest');
const app = require('../app');
const { connect } = require('./database');
const UserModel = require('../models/user');

// Test suite
describe('Authentication Tests', () => {
    let connection
    // before hook
    beforeAll(async () => {
        connection = await connect()
    })

    afterEach(async () => {
        await connection.cleanup()
    })

    // after hook
    afterAll(async () => {
        if(connection){
            await connection.disconnect();
        }
    })


    // Test case
    it('should successfully register a user', async () => {
        const response = await supertest(app)
        .post('/user/signup')
        .set('content-type', 'application/json')
        .send({
            name: "sojidan",
            password: "12345",
            repeat_password: "12345",
            username: "dan@example.com"
            
        })

        // expectations
        expect(response.status).toEqual(302);
        expect(response.header['location']).toBe('/login');
    })


     // Test case
     it('should successfully login a user', async () => {
        await UserModel.create({
            name: "sojidan",
            password: "12345",
            username: "dan@example.com"
        })
        const response = await supertest(app)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send({
            username: "dan@example.com",
            password: "12345"     
        })

        // expectations
        expect(response.status).toEqual(302);
        expect(response.header['location']).toBe('/tasks/get');
    })


        // Test case
    it('should not login a user with invalid password, redirect to login route', async () => {
        await UserModel.create({
            name: "sojidan",
            username: "dan",
            password: "12345"
        })
        const response = await supertest(app)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send({
            username: "dan",
            password: "invalidPassword"     
        })

        // expectations
        expect(response.header['location']).toBe("/login?error=username%20or%20password%20is%20wrong");
    })
})