describe("Invoice", () => {
    let jwt: string

    beforeAll(async () => {
        const user = {
            email: "invoice.project.2025@gmail.com",
            password: "Password123!",
            // roles: ["Admin"]
        }

        await fetch('http://auth:3001/users', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const response = await fetch("http://auth:3001/auth/login", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        })

        jwt = await response.text()
    })

    test("Create Invoice", async () => {

        const createInvoice = await fetch('http://invoice:3000/invoice', {
            method: "POST",
            body: JSON.stringify({
                "amount": 140,
                "items": [{
                    "sku": "icecream",
                    "qt": 14
                }],
                "card": {
                    "cvc": "413",
                    "exp_month": "12",
                    "exp_year": "34",
                    "number": "4242 4242 4242 4242"
                }
            }),
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })
        
        expect(createInvoice.ok).toBeTruthy()

        const createdInvoice = await createInvoice.json()

        const findInvoice = await fetch(`http://invoice:3000/invoice/${createdInvoice._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })

        const findedInvoice = await findInvoice.json()
        expect(findedInvoice).toEqual(createdInvoice)
    })
})