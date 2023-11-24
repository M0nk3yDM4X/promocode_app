import { Router } from "express"
import { Routes } from "../interfaces/routes.interfaces"
import PromoCodeController from "../controllers/promocode.controller"

class PromoCodeRoute implements Routes {
    public path = "/promo-code"
    public router = Router()
    public promoCodeController = new PromoCodeController()

    constructor() {
        this.initializePromoCodeRoutes()
    }

    private initializePromoCodeRoutes() {
        this.router.post(`${this.path}/create`, this.promoCodeController.createPromoCode)
    }
}

export default PromoCodeRoute
