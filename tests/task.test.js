const supertest = require('supertest');
const app = require('../app');
const { connect } = require('./database');
const UserModel = require('../models/user');
const TaskModel = require('../models/task');


// Test suite
describe('Task Tests', () => {
    let token;
    let connection
    // before hook
    beforeAll(async () => {
        connection = await connect()
    })

    beforeEach(async() => {
        // create user
        const user = await UserModel.create({
            name: "sojidan",
            password: "12345",
            username: "dan@example.com",
            _id: "12"
        })
        // login user
        const response = await supertest(app)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send({
            username: "dan@example.com",
            password: "12345"     
        })

        token = response.header['set-cookie']
        .map((cookie) => cookie.split(';')[0]) // Get the token cookie value
        .filter((cookie) => cookie.startsWith('token='))[0]; // Filter to find the 'token' cookie
        console.log({token})
       
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


    // // --------------Test case------------
    it('should be able to post tasks', async () => {
        
        const taskData = {
            to_do: "try to eat",
            user_id: "12"
        }
        const taskResponse = await supertest(app)
        .post('/tasks/post')
        .set('Cookie', token)
        .send(taskData)

        // expectations
        expect(taskResponse.header['location']).toBe('/tasks/get');
        const tasksList = await TaskModel.find({ user_id: "12"});
         // Additional checks for the task in the tasksList
        const createdTask = tasksList.find((task) => task.to_do === taskData.to_do);
        expect(createdTask).not.toBeNull();
    })

    // ------------Test case---------
    it('should be able to get tasks', async () => {
        
        const response = await supertest(app)
        .get('/tasks/get')
        .set('Cookie', token)
        .send()

        // expectations
        expect(response.status).toEqual(200); // Correct status code for a successful response
        expect(response.header['content-type']).toContain('text/html'); // Expect HTML content
        expect(response.text).toContain('Dashboard');
    })
})