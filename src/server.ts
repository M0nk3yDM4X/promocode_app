import App from "./app"
import PromoCodeRoute from "./routes/promocode.routes"

const app = new App([new PromoCodeRoute()])

app.listen()
