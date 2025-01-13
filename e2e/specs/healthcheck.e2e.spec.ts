import { ping } from "tcp-ping"

describe("Health", () => {
    test("Invoice", async () => {
        const response = await fetch("http://invoice:3000")
        expect(response.ok).toBeTruthy()
    })

    test("Auth", async () => {
        const response = await fetch("http://auth:3001")
        expect(response.ok).toBeTruthy()
    })

    test("Payments", (done) => {
        ping({ address: 'payments' }, err => {
            if (err) {
                fail()
            }
            done()
        })
    })

    test("Payments", (done) => {
        ping({ address: 'notifications' }, err => {
            if (err) {
                fail()
            }
            done()
        })
    })
})