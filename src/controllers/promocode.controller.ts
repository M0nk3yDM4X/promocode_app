import { NextFunction, Request, Response } from "express"
import { PromoCode } from "../models/promocode.model"
import PromoCodeService from "../services/promocode.service"
import { IUsePromoCodeUserArgs } from "../interfaces/promocode.interfaces"
import { HttpException } from "../exceptions/HttpException"

class PromoCodeController {
    private promoCodeService = new PromoCodeService()

    public createPromoCode = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userData: Partial<PromoCode> | undefined = request.body
            const promoCode = await this.promoCodeService.create(userData)
            response.status(201).json({ message: "Promo code created successfully", promoCode })
        } catch (error) {
            next(error)
        }
    }

    public usePromoCode = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userData: IUsePromoCodeUserArgs | undefined = request.body
            const { name, avantage, restrictions } = await this.promoCodeService.findByName(
                userData
            )

            if (!restrictions) {
                return response.status(201).json({
                    promocode_name: name,
                    status: "accepted",
                    avantage
                })
            }

            const userArguments = userData?.arguments

            const isRestrictionListValidated = await this.promoCodeService.validateRestrictionList(
                restrictions,
                userArguments
            )

            if (!isRestrictionListValidated) {
                return response.status(400).json({
                    promocode_name: name,
                    status: "denied"
                })
            }

            return response.status(201).json({
                promocode_name: name,
                status: "accepted",
                avantage
            })
        } catch (error) {
            next(error)
        }
    }
}

export default PromoCodeController
