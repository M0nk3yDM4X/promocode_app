import { prop, getModelForClass } from "@typegoose/typegoose"

class DateRestriction {
    @prop({ required: true })
    after!: string

    @prop({ required: true })
    before!: string
}

class AgeRestriction {
    @prop()
    eq?: number

    @prop()
    lt?: number

    @prop()
    gt?: number
}

class TemperatureRestriction {
    @prop()
    lt?: number

    @prop()
    gt?: number

    @prop()
    eq?: number
}

class MeteoRestriction {
    @prop()
    is?: string

    @prop({ _id: false })
    temp?: TemperatureRestriction
}

class PromoCodeRestriction {
    @prop({ _id: false })
    date?: DateRestriction

    @prop({ _id: false })
    age?: AgeRestriction

    @prop({ _id: false })
    meteo?: MeteoRestriction

    @prop({ _id: false })
    or?: PromoCodeRestriction[]

    @prop({ _id: false })
    and?: PromoCodeRestriction[]
}

class PromoCode {
    @prop({ required: true, unique: true })
    name!: string

    @prop({ required: true })
    avantage!: {
        percent: number
    }

    @prop({ _id: false })
    restrictions?: PromoCodeRestriction[]
}

const PromoCodeModel = getModelForClass(PromoCode)

export { PromoCodeModel, PromoCodeRestriction, MeteoRestriction, AgeRestriction, PromoCode }
