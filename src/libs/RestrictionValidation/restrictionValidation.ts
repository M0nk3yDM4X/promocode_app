import { IUsePromoCodeUserArgs } from "../../interfaces/promocode.interfaces"
import {
    AgeRestriction,
    MeteoRestriction,
    PromoCodeRestriction
} from "../../models/promocode.model"
import Meteo from "../Meteo/meteo"

class RestrictionValidation {
    public meteo = new Meteo()

    public handleAgeRestriction(ageRestriction: AgeRestriction, age: number) {
        const isAgeValid = this.compareNumericValueToRestrictionNumeric(age, ageRestriction)
        return isAgeValid
    }

    public handleDateRestriction(before: string, after: string): boolean {
        const beforeTimestamp = new Date(before).getTime()
        const afterTimestamp = new Date(after).getTime()
        const today = Date.now()

        return today >= afterTimestamp && today <= beforeTimestamp
    }

    public async handleMeteoRestriction(meteoRestriction: MeteoRestriction, town: string) {
        const cityMeteo = await this.meteo.getCityMeteo(town)

        if (!cityMeteo) {
            return false
        }

        const isWeatherValid = meteoRestriction.is === cityMeteo.mainWeather
        const isTempValid = this.compareNumericValueToRestrictionNumeric(
            cityMeteo.temp,
            meteoRestriction.temp
        )

        return isWeatherValid && isTempValid
    }

    public async handleOperatorRestriction(
        restrictionList: PromoCodeRestriction[],
        type: "AND" | "OR",
        userArguments?: IUsePromoCodeUserArgs["arguments"]
    ): Promise<boolean> {
        const resultList = await this.reduceLogicalOperatorRestriction(
            restrictionList,
            userArguments
        )

        if (type === "AND") {
            return resultList.length === 0 ? false : resultList.every((result) => result === true)
        }

        return resultList.some((result) => result === true)
    }

    private async reduceLogicalOperatorRestriction(
        restrictionList: PromoCodeRestriction[],
        userArguments?: IUsePromoCodeUserArgs["arguments"]
    ) {
        const result = await Promise.all(
            restrictionList.map(async (restriction) => {
                if (restriction.date) {
                    const { before, after } = restriction.date
                    return this.handleDateRestriction(before, after)
                }

                if (restriction.age && userArguments?.age) {
                    return this.handleAgeRestriction(restriction.age, userArguments.age)
                }

                if (restriction.meteo && userArguments?.meteo) {
                    return this.handleMeteoRestriction(restriction.meteo, userArguments.meteo.town)
                }

                if (restriction.or) {
                    return this.handleOperatorRestriction(restriction.or, "OR", userArguments)
                }

                if (restriction.and) {
                    return this.handleOperatorRestriction(restriction.and, "AND", userArguments)
                }

                return false
            })
        )

        return result
    }

    private compareNumericValueToRestrictionNumeric(
        valueToCompare: number,
        restriction?: MeteoRestriction["temp"] | AgeRestriction
    ) {
        if (restriction?.eq) {
            return restriction.eq === valueToCompare
        }

        if (restriction?.gt && restriction.lt) {
            return valueToCompare < restriction.lt && valueToCompare > restriction.gt
        }

        if (restriction?.gt) {
            return valueToCompare > restriction.gt
        }

        if (restriction?.lt) {
            return valueToCompare < restriction.lt
        }

        return false
    }
}

export default RestrictionValidation
