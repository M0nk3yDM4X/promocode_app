import { HttpException } from "../exceptions/HttpException"
import { IUsePromoCodeUserArgs } from "../interfaces/promocode.interfaces"
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

    public async findByName(userData?: IUsePromoCodeUserArgs) {
        if (!userData?.name) {
            throw new HttpException(409, "Couldn't find promocode, as promocode name is missing")
        }

        const promoCode = await PromoCodeModel.findOne({ name: userData.name })

        if (!promoCode) {
            throw new HttpException(409, "Promo code doesn't exist")
        }

        return promoCode
    }
}

export default PromoCodeService
