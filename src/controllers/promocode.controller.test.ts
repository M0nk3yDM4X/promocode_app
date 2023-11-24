import { connect, disconnect } from "mongoose"
import { dbConnection } from "../databases"
import axios from "axios"

describe("PromoCodeController", () => {
    beforeAll(async () => {
        console.log("1")
        await connect(dbConnection)
        console.log("2")
    })

    afterAll(async () => {
        await disconnect()
    })

    describe("createPromoCode", () => {
        it("should create a promo code and return a 201 status", async () => {
            const randomName = `controllerTest${Math.random()}`
            const userData = {
                name: randomName,
                avantage: {
                    percent: 20
                }
            }

            const response = await axios.post("http://localhost:3000/promo-code/create", userData)
            expect(response.status).toBe(201)
            expect(response.data).toEqual(
                expect.objectContaining({ message: "Promo code created successfully" })
            )
        })
    })
})
