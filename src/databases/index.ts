import { DB_HOST, DB_PORT, DB_DATABASE } from "../config/index"

const dbHost = DB_HOST
const dbPort = DB_PORT
const dbDatabase = DB_DATABASE

export const dbConnection = `mongodb://${dbHost}:${dbPort}/${dbDatabase}`
