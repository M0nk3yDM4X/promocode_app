import { Router } from "express"
import { Routes } from "../interfaces/routes.interfaces"

class PromoCodeRoute implements Routes {
    public path = "/promo-code"
    public router = Router()

    constructor() {
        this.initializePromoCodeRoutes()
    }

    private initializePromoCodeRoutes() {}
}

export default PromoCodeRoute
