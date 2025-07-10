import { ErrorType } from '@/constant/errors'

type Props = {
  query: string
}

type SearchResult = {
  results: {
    id: string
    width: number
    height: number
    description: string
    alt_description: string
    color: string
    created_at: string
    updated_at: string
    links: {
      download: string
      download_location: string
      html: string
      self: string
    }
    tags_preview: {
      type: string
      title: string
    }[]
    urls: {
      raw: string
      full: string
      regular: string
      small: string
      small_s3: string
      thumb: string
    }
    user: {
      name: string
      profile_image: {
        large: string
        medium: string
        small: string
      }
      links: {
        html: string
        photos: string
      }
    }
  }[]
  total: number
  total_pages: number
}

export const openapi: OpenAPIDocument = {
  components: {
    schemas: {
      queryResponse: {
        type: 'object',
        description: 'The query results from unsplash.',
        properties: {
          results: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'The id of the image',
              },
              width: {
                type: 'number',
                description: 'The width of the image',
              },
              height: {
                type: 'number',
                description: 'The height of the image',
              },
              title: {
                type: 'string',
                description: 'The title of the image',
              },
              src: {
                type: 'string',
                description: 'The URL of the image',
              },
              color: {
                type: 'string',
                description: 'The main color of the image',
              },
              createdAt: {
                type: 'string',
                description: 'The time the image was created',
              },
              download: {
                type: 'string',
                description: 'Download link for the image',
              },
              link: {
                type: 'string',
                description: "Link to the image's Unsplash page",
              },
              tags: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'Image tags',
                },
              },
              user: {
                type: 'string',
                description: 'The author of the image',
              },
              avatar: {
                type: 'string',
                description: 'Avatar of the author of the image',
              },
            },
          },
        },
      },
    },
  },
  info: {
    title: 'Unsplash Image',
    description: 'Get copyright-free images from Unsplash.',
    version: 'v1',
  },
  openapi: '3.0.1',
  paths: {
    '/': {
      get: {
        operationId: 'unsplashImage',
        description: 'Get copyright-free images from Unsplash.',
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            description: 'The query to search. Please use keywords to search. The query text only supports English.',
            example: 'cute cat',
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
                  $ref: '#/components/schemas/queryResponse',
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
      url: '@plugins/unsplash',
    },
  ],
}

export async function handle({ query = '' }: Props) {
  if (query === '') {
    return new Error(ErrorType.MissingParam)
  }

  const searchParams = new URLSearchParams('page=1&per_page=20&plus=none')
  searchParams.append('query', query)
  const response = await fetch(`https://api.gemini.u14.app/unsplash/search/photos?${searchParams.toString()}`)
  const result: SearchResult = await response.json()
  const unsplashImages: UnsplashImage[] = result.results.map((item) => {
    return {
      id: item.id,
      width: item.width,
      height: item.height,
      title: item.description || item.alt_description,
      color: item.color,
      createdAt: item.created_at,
      download: item.urls.raw,
      link: item.links.html,
      tags: item.tags_preview.map((tag) => tag.title),
      src: item.urls.regular,
      thumbnail: item.urls.small,
      user: {
        name: item.user.name,
        avatar: item.user.profile_image.small,
        link: item.user.links.html,
      },
    }
  })
  return unsplashImages
}
