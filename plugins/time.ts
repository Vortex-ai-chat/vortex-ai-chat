import { parseSpiceBody } from '@/utils/plugin'

type Props = {
  location: string
}

export const openapi: OpenAPIDocument = {
  components: {
    schemas: {
      Location: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          geo: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              country: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                },
              },
              latitude: {
                type: 'number',
              },
              longitude: {
                type: 'number',
              },
              zonename: {
                type: 'string',
              },
            },
          },
          matches: {
            type: 'string',
          },
          score: {
            type: 'integer',
          },
          time: {
            type: 'object',
            properties: {
              iso: {
                type: 'string',
              },
              datetime: {
                type: 'object',
                properties: {
                  year: {
                    type: 'integer',
                  },
                  month: {
                    type: 'integer',
                  },
                  day: {
                    type: 'integer',
                  },
                  hour: {
                    type: 'integer',
                  },
                  minute: {
                    type: 'integer',
                  },
                  second: {
                    type: 'integer',
                  },
                },
              },
              timezone: {
                type: 'object',
                properties: {
                  offset: {
                    type: 'string',
                  },
                  zoneabb: {
                    type: 'string',
                  },
                  zonename: {
                    type: 'string',
                  },
                  zoneoffset: {
                    type: 'integer',
                  },
                  zonedst: {
                    type: 'integer',
                  },
                  zonetotaloffset: {
                    type: 'integer',
                  },
                },
              },
            },
          },
          timechanges: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
          astronomy: {
            type: 'object',
            properties: {
              objects: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    events: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: {
                            type: 'string',
                          },
                          hour: {
                            type: 'integer',
                          },
                          minute: {
                            type: 'integer',
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
      },
      LocationResponse: {
        type: 'object',
        properties: {
          version: {
            type: 'integer',
          },
          locations: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Location',
            },
          },
        },
      },
    },
  },
  info: {
    title: 'Current Time',
    description: 'Get the current time for a given location.',
    version: 'v1',
  },
  openapi: '3.0.1',
  paths: {
    '/': {
      get: {
        operationId: 'currentTime',
        description: 'Get the current time for a given location.',
        parameters: [
          {
            name: 'location',
            in: 'query',
            required: true,
            description: 'The location where the current time request was made. Parameters only accept English.',
            example: 'New York',
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
                  $ref: '#/components/schemas/LocationResponse',
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
      url: '@plugins/time',
    },
  ],
}

export async function handle({ location }: Props) {
  const response = await fetch(`https://api.gemini.u14.app/time/${encodeURIComponent(location)}`)
  const result = await response.text()
  return parseSpiceBody(result)
}
