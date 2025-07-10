import { convertXML } from 'simple-xml-to-json'
import { ErrorType } from '@/constant/errors'

type Props = {
  query: string
  size?: number
  page?: number
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
              link: {
                type: 'string',
              },
              title: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
              updated: {
                type: 'string',
              },
              total: {
                type: 'number',
              },
              page: {
                type: 'number',
              },
              size: {
                type: 'number',
              },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    updated: {
                      type: 'string',
                    },
                    published: {
                      type: 'string',
                    },
                    title: {
                      type: 'string',
                    },
                    summary: {
                      type: 'string',
                    },
                    author: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    link: {
                      type: 'string',
                    },
                    pdf: {
                      type: 'string',
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
  info: {
    title: 'Arxiv Search',
    description: 'Run Arxiv search and get the article information.',
    version: 'v1.0.0',
  },
  openapi: '3.1.0',
  paths: {
    '/': {
      get: {
        operationId: 'ArxivSearch',
        description: 'Run Arxiv search and get the article information.',
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            description: 'Same as the search_query parameter rules of the arxiv API.',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'page',
            in: 'query',
            description: 'The index of the first returned result.',
            schema: {
              type: 'number',
            },
          },
          {
            name: 'size',
            in: 'query',
            description: 'The number of results returned by the query.',
            schema: {
              type: 'number',
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
      url: '@plugins/arxiv',
    },
  ],
}

export async function handle({ query = '', size = 20, page }: Props) {
  if (query === '') {
    return new Error(ErrorType.MissingParam)
  }

  const searchParams = new URLSearchParams(`search_query=${query}&max_results=${size}`)
  if (page) searchParams.append('start', page.toString())
  const response = await fetch(`https://export.arxiv.org/api/query?${searchParams.toString()}`)
  const xmlResult = await response.text()
  const JsonResult = convertXML(xmlResult)
  const feed = JsonResult.feed.children
  const result: ArxivResult = {
    link: feed[0].link.href,
    title: feed[1].title.content,
    id: feed[2].id.content,
    updated: feed[3].updated.content,
    total: Number(feed[4]['opensearch:totalResults'].content),
    page: Number(feed[5]['opensearch:startIndex'].content),
    size: Number(feed[6]['opensearch:itemsPerPage'].content),
    data: [],
  }
  const entries = feed.slice(7)
  for (const item of entries) {
    const entry = item.entry.children
    const article: ArxivArticle = {
      id: '',
      updated: '',
      published: '',
      title: '',
      summary: '',
      author: [],
      link: '',
      pdf: '',
    }
    for (const content of entry) {
      if (content.id) article.id = content.id.content.replace('http://arxiv.org/abs/', '')
      if (content.updated) article.updated = content.updated.content
      if (content.published) article.published = content.published.content
      if (content.title) article.title = content.title.content
      if (content.summary) article.summary = content.summary.content
      if (content.author) {
        for (const author of content.author.children) {
          article.author.push(author.name.content)
        }
      }
      if (content.link) {
        if (content.link.type === 'text/html') article.link = content.link.href
        if (content.link.type === 'application/pdf') article.pdf = content.link.href
      }
    }
    result.data.push(article)
  }
  return result
}
