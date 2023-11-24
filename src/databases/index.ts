import { DB_HOST, DB_PORT, DB_DATABASE } from "../config/index"

const dbHost = DB_HOST || "127.0.0.1"
const dbPort = DB_PORT || "27017"
const dbDatabase = DB_DATABASE || "promoCodeApp"

export const dbConnection = `mongodb://${dbHost}:${dbPort}/${dbDatabase}`
