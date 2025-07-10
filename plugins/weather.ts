import { parseSpiceBody } from '@/utils/plugin'

type Props = {
  location: string
  locale?: string
}

export const openapi: OpenAPIDocument = {
  components: {
    schemas: {
      CurrentWeather: {
        type: 'object',
        properties: {
          asOf: {
            type: 'string',
            format: 'date-time',
            description: 'The time at which the data is current.',
          },
          cloudCover: {
            type: 'number',
            description: 'The percentage of the sky covered by clouds.',
          },
          cloudCoverHighAltPct: {
            type: 'number',
            description: 'Cloud cover percentage at high altitude.',
          },
          cloudCoverLowAltPct: {
            type: 'number',
            description: 'Cloud cover percentage at low altitude.',
          },
          cloudCoverMidAltPct: {
            type: 'number',
            description: 'Cloud cover percentage at mid altitude.',
          },
          conditionCode: {
            type: 'string',
            description: 'Description of the current weather condition.',
          },
          daylight: {
            type: 'boolean',
            description: "Indicates whether it's currently daylight.",
          },
          humidity: {
            type: 'number',
            description: 'The current humidity level.',
          },
          precipitationIntensity: {
            type: 'number',
            description: 'The intensity of precipitation.',
          },
          pressure: {
            type: 'number',
            description: 'The current atmospheric pressure.',
          },
          pressureTrend: {
            type: 'string',
            description: 'The trend of the pressure (e.g., rising, steady).',
          },
          temperature: {
            type: 'number',
            description: 'The current temperature.',
          },
          temperatureApparent: {
            type: 'number',
            description: 'The apparent temperature, for example, considering humidity and wind chill.',
          },
          temperatureDewPoint: {
            type: 'number',
            description: 'The dew point temperature.',
          },
          uvIndex: {
            type: 'integer',
            description: 'The UV index.',
          },
          visibility: {
            type: 'number',
            description: 'The visibility in meters.',
          },
          windDirection: {
            type: 'integer',
            description: 'The wind direction in degrees.',
          },
          windGust: {
            type: 'number',
            description: 'The maximum wind gust speed.',
          },
          windSpeed: {
            type: 'number',
            description: 'The current wind speed.',
          },
        },
      },
      ForecastDaily: {
        type: 'object',
        properties: {
          days: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/DailyForecast',
            },
            description: 'Array of daily forecasts.',
          },
        },
      },
      DailyForecast: {
        type: 'object',
        properties: {
          conditionCode: {
            type: 'string',
            description: 'Description of the weather condition.',
          },
          daytimeForecast: {
            $ref: '#/components/schemas/DaytimeForecast',
          },
          forecastEnd: {
            type: 'string',
            format: 'date-time',
            description: 'End time for the forecast.',
          },
          forecastStart: {
            type: 'string',
            format: 'date-time',
            description: 'Start time for the forecast.',
          },
          maxUvIndex: {
            type: 'integer',
            description: 'The maximum UV index for the day.',
          },
          moonPhase: {
            type: 'string',
            description: 'The moon phase for the day.',
          },
          moonrise: {
            type: 'string',
            format: 'date-time',
            description: 'Time of moonrise.',
          },
          moonset: {
            type: 'string',
            format: 'date-time',
            description: 'Time of moonset.',
          },
          overnightForecast: {
            $ref: '#/components/schemas/NightForecast',
          },
          precipitationAmount: {
            type: 'number',
            description: 'Total precipitation amount for the day.',
          },
          precipitationChance: {
            type: 'number',
            description: 'Chance of precipitation as a percentage.',
          },
          precipitationType: {
            type: 'string',
            description: 'Type of precipitation expected.',
          },
          temperatureMax: {
            type: 'number',
            description: 'Maximum temperature for the day.',
          },
          temperatureMin: {
            type: 'number',
            description: 'Minimum temperature for the day.',
          },
          windSpeedAvg: {
            type: 'number',
            description: 'Average wind speed for the day.',
          },
          windSpeedMax: {
            type: 'number',
            description: 'Maximum wind speed for the day.',
          },
        },
      },
      DaytimeForecast: {
        type: 'object',
        properties: {
          cloudCover: {
            type: 'number',
            description: 'Cloud cover percentage during the day.',
          },
          conditionCode: {
            type: 'string',
            description: 'Description of the daytime weather condition.',
          },
          forecastEnd: {
            type: 'string',
            format: 'date-time',
            description: 'End time for the daytime forecast.',
          },
          forecastStart: {
            type: 'string',
            format: 'date-time',
            description: 'Start time for the daytime forecast.',
          },
          humidity: {
            type: 'number',
            description: 'Daytime humidity level.',
          },
          precipitationAmount: {
            type: 'number',
            description: 'Total precipitation amount expected during the day.',
          },
          precipitationChance: {
            type: 'number',
            description: 'Chance of precipitation during the day as a percentage.',
          },
          precipitationType: {
            type: 'string',
            description: 'Type of precipitation expected during the day.',
          },
          temperatureMax: {
            type: 'number',
            description: 'Maximum temperature during the day.',
          },
          temperatureMin: {
            type: 'number',
            description: 'Minimum temperature during the day.',
          },
          windDirection: {
            type: 'integer',
            description: 'Wind direction during the day in degrees.',
          },
          windGustSpeedMax: {
            type: 'number',
            description: 'The maximum wind gust speed during the day.',
          },
          windSpeed: {
            type: 'number',
            description: 'Average wind speed during the day.',
          },
          windSpeedMax: {
            type: 'number',
            description: 'Maximum wind speed during the day.',
          },
        },
      },
      NightForecast: {
        type: 'object',
        properties: {
          cloudCover: {
            type: 'number',
            description: 'Cloud cover percentage during the night.',
          },
          conditionCode: {
            type: 'string',
            description: 'Description of the nighttime weather condition.',
          },
          forecastEnd: {
            type: 'string',
            format: 'date-time',
            description: 'End time for the nighttime forecast.',
          },
          forecastStart: {
            type: 'string',
            format: 'date-time',
            description: 'Start time for the nighttime forecast.',
          },
          humidity: {
            type: 'number',
            description: 'Nighttime humidity level.',
          },
          precipitationAmount: {
            type: 'number',
            description: 'Total precipitation amount expected during the night.',
          },
          precipitationChance: {
            type: 'number',
            description: 'Chance of precipitation during the night as a percentage.',
          },
          precipitationType: {
            type: 'string',
            description: 'Type of precipitation expected during the night.',
          },
          temperatureMax: {
            type: 'number',
            description: 'Maximum temperature during the night.',
          },
          temperatureMin: {
            type: 'number',
            description: 'Minimum temperature during the night.',
          },
          windDirection: {
            type: 'integer',
            description: 'Wind direction during the night in degrees.',
          },
          windGustSpeedMax: {
            type: 'number',
            description: 'The maximum wind gust speed during the night.',
          },
          windSpeed: {
            type: 'number',
            description: 'Average wind speed during the night.',
          },
          windSpeedMax: {
            type: 'number',
            description: 'Maximum wind speed during the night.',
          },
        },
      },
    },
  },
  info: {
    title: 'Weather Forecast',
    description: 'Get the weather forecast for a given location.',
    version: 'v1',
  },
  openapi: '3.0.1',
  paths: {
    '/': {
      get: {
        operationId: 'weatherForecast',
        description:
          'Get the weather forecast for a given location. Includes latitude and longitude coordinates for a given location, time zone, current weather, minute-by-minute forecast, hourly forecast and weather forecast for the next few days, as well as severe weather warnings.',
        parameters: [
          {
            name: 'location',
            in: 'query',
            required: true,
            description: 'Query the weather conditions for a given location.',
            example: 'New York',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'locale',
            in: 'query',
            description: 'The locale to give the summaries in. Default is "en"',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    location: {
                      type: 'string',
                      description: 'Name of the location',
                      example: 'Beijing, China',
                    },
                    timezone: {
                      type: 'string',
                      description: 'Time zone of the location',
                      example: 'Asia/Shanghai',
                    },
                    currentWeather: {
                      $ref: '#/components/schemas/CurrentWeather',
                    },
                    forecastDaily: {
                      $ref: '#/components/schemas/ForecastDaily',
                    },
                    forecastHourly: {
                      $ref: '#/components/schemas/ForecastHourly',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  servers: [
    {
      url: '@plugins/weather',
    },
  ],
}

export async function handle({ location, locale = 'en' }: Props) {
  const response = await fetch(`https://api.gemini.u14.app/weather/${encodeURIComponent(location)}/${locale}`)
  const result = await response.text()
  return parseSpiceBody(result)
}
