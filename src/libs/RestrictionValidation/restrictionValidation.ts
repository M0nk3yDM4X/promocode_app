import { AgeRestriction, MeteoRestriction } from "../../models/promocode.model"

class RestrictionValidation {
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
