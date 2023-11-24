import express from "express"
import bodyParser from "body-parser"
import { connect } from "mongoose"
import "dotenv/config"
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware"
import { dbConnection } from "./databases"
import { Routes } from "./interfaces/routes.interfaces"

class App {
    public app: express.Application
    public port: string | number

    constructor(routes: Routes[]) {
        this.app = express()
        this.port = 3000

        this.connectToDatabase()
        this.initializeMiddlewares()
        this.initializeRoutes(routes)
        this.initializeErrorHandling()
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`=================================`)
            console.log(`🚀 App listening on the port ${this.port}`)
            console.log(`=================================`)
        })
    }

    private connectToDatabase() {
        connect(dbConnection)
    }

    private initializeMiddlewares() {
        this.app.use(cors())
        this.app.use(bodyParser.json())
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use("/", route.router)
        })
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware)
    }
}

export default App
