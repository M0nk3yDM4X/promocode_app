import { HttpException } from "../exceptions/HttpException"
import { PromoCode, PromoCodeModel } from "../models/promocode.model"

class PromoCodeService {
    public async create(userData?: Partial<PromoCode>) {
        if (!userData?.name || !userData.avantage) {
            throw new HttpException(409, "Couldn't create promo code without name or avantage")
        }
        const promoCode = new PromoCodeModel(userData)
        const createdPromoCode = await promoCode.save()
        return createdPromoCode
    }
}

export default PromoCodeService
