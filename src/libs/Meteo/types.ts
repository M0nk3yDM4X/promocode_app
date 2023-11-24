export interface IAxiosResponse<T> {
    data: T
}

export interface IMeteo {
    weather: IWeather[]
    main: {
        temp: number
    }
}

interface IWeather {
    main: "Thunderstorm" | "Drizzle" | "Rain" | "Snow" | "Clear" | "Clouds"
}

export interface IGeoLoc {
    lat: number
    lon: number
}
