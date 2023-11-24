import { connect, disconnect } from "mongoose"
import "dotenv/config"
import { dbConnection } from "../databases"
import PromoCodeService from "./promocode.service"

describe("Promo code", () => {
    beforeAll(async () => {
        await connect(dbConnection)
    })
    afterAll(async () => {
        await disconnect()
    })
    describe("Create Promo Code", () => {
        it("Should return a promo code when params are set", async () => {
            const promocodeService = new PromoCodeService()
            const randomName = `test${Math.random()}`
            const promocodeTest = {
                name: randomName,
                avantage: {
                    percent: 20
                }
            }
            const createdPromocode = await promocodeService.create(promocodeTest)

            expect(createdPromocode).toMatchObject({
                name: randomName,
                avantage: {
                    percent: 20
                }
            })
        })

        it("should return error when name/avantage is missing", async () => {
            const promocodeService = new PromoCodeService()
            const promocodeTest = {
                avantage: {
                    percent: 20
                }
            }
            await expect(promocodeService.create(promocodeTest)).rejects.toThrow(
                "Couldn't create promo code without name or avantage"
            )
        })
    })

    describe("Find Promo Code By Name", () => {
        it("Should return a promo code when name is found", async () => {
            const promocodeService = new PromoCodeService()
            const promocodeTest = {
                name: "test"
            }
            const createdPromocode = await promocodeService.findByName(promocodeTest)

            expect(createdPromocode).toHaveProperty("name")
            expect(createdPromocode).toHaveProperty("avantage")
            expect(createdPromocode).toHaveProperty("restrictions")
        })
        it("should return error when name isn't found", async () => {
            const promocodeService = new PromoCodeService()
            const promocodeTest = {
                name: "ceci-est-un-test"
            }
            await expect(promocodeService.findByName(promocodeTest)).rejects.toThrow(
                "Promo code doesn't exist"
            )
        })
        it("should return error when name is missing", async () => {
            const promocodeService = new PromoCodeService()
            const promocodeTest = {}
            await expect(promocodeService.findByName(promocodeTest)).rejects.toThrow(
                "Couldn't find promocode, as promocode name is missing"
            )
        })
    })

    describe("Restrictions", () => {
        it("should directly return when logical operator is missing", async () => {
            const promocodeService = new PromoCodeService()
            const restrictions = [{ date: { after: "01-01-2023", before: "01-01-2024" } }]
            const toto = await promocodeService.validateRestrictionList(restrictions)
            expect(toto).toBe(true)
        })

        it("should handle nesting with logical operators", async () => {
            const promocodeService = new PromoCodeService()
            const restrictions = [
                {
                    date: {
                        after: "2019-01-01",
                        before: "2020-06-30"
                    }
                },
                {
                    or: [
                        {
                            age: {
                                eq: 40
                            }
                        },
                        {
                            and: [
                                {
                                    age: {
                                        lt: 30,
                                        gt: 15
                                    }
                                },
                                {
                                    meteo: {
                                        is: "clear",
                                        temp: {
                                            gt: 15
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
            const userArguments = {
                age: 25,
                meteo: { town: "Lyon" }
            }
            const toto = await promocodeService.validateRestrictionList(restrictions, userArguments)
            expect(toto).toBe(false)
        })
    })
})
