interface IUsePromoCodeArgument {
    age?: number
    meteo?: { town: string }
}

export interface IUsePromoCodeUserArgs {
    name?: string
    arguments?: IUsePromoCodeArgument
}
