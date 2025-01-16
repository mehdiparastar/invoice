import { invoices } from "./invoices";
import { truncateTestDB } from "./truncateTestDB";
import { adminUser } from "./users";

describe("Invoice", () => {
    let jwt: string

    beforeAll(async () => {
        await truncateTestDB()

        // Create the admin user
        const createUserResponse = await fetch("http://auth:3001/users", {
            method: "POST",
            body: JSON.stringify(adminUser),
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Authenticate the admin user
        const loginResponse = await fetch("http://auth:3001/auth/login", {
            method: "POST",
            body: JSON.stringify(adminUser),
            headers: {
                "Content-Type": "application/json",
            },
        });

        jwt = await loginResponse.text();
    })

    test("CRUD Invoice", async () => {
        // create invoice section
        const createInvoice1 = await fetch('http://invoice:3000/invoice', {
            method: "POST",
            body: JSON.stringify(invoices[0]),
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })
        const createInvoice2 = await fetch('http://invoice:3000/invoice', {
            method: "POST",
            body: JSON.stringify(invoices[1]),
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })
        const createInvoice3 = await fetch('http://invoice:3000/invoice', {
            method: "POST",
            body: JSON.stringify(invoices[2]),
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })

        expect(createInvoice1.ok).toBeTruthy()
        const createdInvoice1 = await createInvoice1.json()

        expect(createInvoice2.ok).toBeTruthy()
        const createdInvoice2 = await createInvoice2.json()

        expect(createInvoice3.ok).toBeTruthy()
        const createdInvoice3 = await createInvoice3.json()


        // find invoice1 section
        const findInvoice = await fetch(`http://invoice:3000/invoice/${createdInvoice1._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })

        const findedInvoice = await findInvoice.json()
        expect(findedInvoice).toEqual(createdInvoice1)


        //find all invoices
        const findAllInvoices = await fetch(`http://invoice:3000/invoice`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })

        const findedAllInvoices = await findAllInvoices.json()
        expect(findedAllInvoices.map((item: any) => item._id).sort((a: any, b: any) => a - b)).toEqual(([createdInvoice1, createdInvoice2, createdInvoice3]).map((item: any) => item._id).sort((a: any, b: any) => a - b))


        // Update invoice1
        const updateInvoice1 = await fetch(`http://invoice:3000/invoice/${createdInvoice1._id}`, {
            method: "PATCH",
            body: JSON.stringify({ amount: 400 }),
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })
        expect(updateInvoice1.ok).toBeTruthy()
        const updatedInvoice1 = await updateInvoice1.json()
        expect(updatedInvoice1.amount).toEqual(400)

        // Delete invoice1
        const DeleteInvoices1 = await fetch(`http://invoice:3000/invoice/${createdInvoice1._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authentication": jwt
            }
        })
        expect(DeleteInvoices1.ok).toBeTruthy()
        const DeletedInvoices1 = await DeleteInvoices1.json()
        expect(DeletedInvoices1._id).toEqual(createdInvoice1._id)
    })
})