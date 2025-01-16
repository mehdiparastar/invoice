import { truncateTestDB } from "./truncateTestDB";
import { adminUser, simpleUser } from "./users";

describe("Invoice", () => {
    beforeEach(async () => {
        await truncateTestDB()
    });

    test('create admin user', async () => {
        // Create the admin user
        const createUserResponse = await fetch("http://auth:3001/users", {
            method: "POST",
            body: JSON.stringify(adminUser),
            headers: {
                "Content-Type": "application/json",
            },
        });

        expect(createUserResponse.ok).toBeTruthy()
        const createdUser = await createUserResponse.json()

        expect(createdUser.email).toBe(adminUser.email)
        expect(createdUser.roles[0]).toBe(adminUser.roles[0])
    })

    test('create simple user', async () => {
        // Create the simple user
        const createUserResponse = await fetch("http://auth:3001/users", {
            method: "POST",
            body: JSON.stringify(simpleUser),
            headers: {
                "Content-Type": "application/json",
            },
        });

        expect(createUserResponse.ok).toBeTruthy()
        const createdUser = await createUserResponse.json()

        expect(createdUser.email).toBe(simpleUser.email)
        expect(createdUser.roles[0]).toBe('User')
    })

    test('login user', async () => {
        // Create the admin user
        const createUserResponse = await fetch("http://auth:3001/users", {
            method: "POST",
            body: JSON.stringify(adminUser),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const createdUser = await createUserResponse.json()

        // credentials
        const loginResponse = await fetch("http://auth:3001/auth/login", {
            method: "POST",
            body: JSON.stringify(adminUser),
            headers: {
                "Content-Type": "application/json",
            },
        });
        expect(loginResponse.ok).toBeTruthy()

        // jwt = await loginResponse.text()
    })

    test('get current user', async () => {
        // Create the admin user
        const createUserResponse = await fetch("http://auth:3001/users", {
            method: "POST",
            body: JSON.stringify(adminUser),
            headers: {
                "Content-Type": "application/json",
            },
        });

        // credentials
        const loginResponse = await fetch("http://auth:3001/auth/login", {
            method: "POST",
            body: JSON.stringify(adminUser),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const jwt = await loginResponse.text()

        // Get Current User
        const getCurrentUser = await fetch("http://auth:3001/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            },
        });

        expect(getCurrentUser.ok).toBeTruthy()

        const currentUser = await createUserResponse.json()

        expect(currentUser.email).toBe(adminUser.email)
        expect(currentUser.roles[0]).toBe(adminUser.roles[0])

    })

    afterAll(async () => {
        await truncateTestDB()
    })
})