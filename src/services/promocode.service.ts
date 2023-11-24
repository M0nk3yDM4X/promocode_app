import { HttpException } from "../exceptions/HttpException"
import { IUsePromoCodeUserArgs } from "../interfaces/promocode.interfaces"
import RestrictionValidation from "../libs/RestrictionValidation/restrictionValidation"
import { PromoCode, PromoCodeModel, PromoCodeRestriction } from "../models/promocode.model"

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

    public async validateRestrictionList(
        restrictions: PromoCodeRestriction[],
        userArguments?: IUsePromoCodeUserArgs["arguments"]
    ) {
        const restrictionValidation = new RestrictionValidation()

        for (const restriction of restrictions) {
            let result: boolean = false

            if (restriction.date) {
                const { before, after } = restriction.date
                result = restrictionValidation.handleDateRestriction(before, after)
            }

            if (restriction.meteo && userArguments?.meteo) {
                result = await restrictionValidation.handleMeteoRestriction(
                    restriction.meteo,
                    userArguments.meteo.town
                )
            }

            if (restriction.age && userArguments?.age) {
                result = restrictionValidation.handleAgeRestriction(
                    restriction.age,
                    userArguments.age
                )
            }

            if (restriction.or) {
                result = await restrictionValidation.handleOperatorRestriction(
                    restriction.or,
                    "OR",
                    userArguments
                )
            }

            if (restriction.and) {
                result = await restrictionValidation.handleOperatorRestriction(
                    restriction.and,
                    "AND",
                    userArguments
                )
            }

            if (result) {
                return true
            }
        }
        return false
    }
}

export default PromoCodeService
