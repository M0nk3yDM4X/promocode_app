import axios from "axios"
import { METEO_API_KEY } from "../../config"
import { IAxiosResponse, IMeteo, IGeoLoc } from "./types"

const DOMAIN = "https://api.openweathermap.org"

class Meteo {
    private API_KEY = METEO_API_KEY

    public async getCityMeteo(city: string) {
        try {
            const { lat, lon } = await this.getCityLocation(city)
            const query = `lat=${lat}&lon=${lon}&appid=${this.API_KEY}`
            const { data }: IAxiosResponse<IMeteo> = await axios.get(
                `${DOMAIN}/data/2.5/weather?${query}`
            )

            const { main, weather } = data
            const celsius = this.convertKelvinToCelsius(main.temp)
            const [{ main: mainWeather }] = weather

            return { temp: celsius, mainWeather: mainWeather.toLowerCase() }
        } catch (error) {
            console.log(error)
        }
    }

    private async getCityLocation(city: string) {
        const { data }: IAxiosResponse<IGeoLoc[]> = await axios.get(
            `${DOMAIN}/geo/1.0/direct?q=${city}&appid=${this.API_KEY}`
        )

        const [{ lat, lon }] = data
        return { lat, lon }
    }

    private convertKelvinToCelsius(kelvinTemp: number) {
        return Math.round(kelvinTemp - 273.15)
    }
}

export default Meteo
