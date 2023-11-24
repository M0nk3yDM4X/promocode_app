import { NextFunction, Request, Response } from "express"
import { PromoCode } from "../models/promocode.model"
import PromoCodeService from "../services/promocode.service"

class PromoCodeController {
    public promoCodeService = new PromoCodeService()

    public createPromoCode = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userData: Partial<PromoCode> | undefined = request.body
            const promoCode = await this.promoCodeService.create(userData)
            response.status(201).json({ message: "Promo code created successfully", promoCode })
        } catch (error) {
            next(error)
        }
    }
}

export default PromoCodeController
