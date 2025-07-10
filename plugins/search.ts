type Props = {
  query: string
}

interface ReaderResult {
  code: number
  status: number
  data: {
    title: string
    description: string
    url: string
    content: string
    usage: {
      tokens: number
    }
  }
}

export const openapi: OpenAPIDocument = {
  components: {
    schemas: {
      searchResponse: {
        type: 'object',
        description: 'The search results.',
      },
    },
  },
  info: {
    title: 'Web Search',
    description: 'A plugin for search the web with DuckDuckGo.',
    version: 'v1',
  },
  openapi: '3.0.1',
  paths: {
    '/': {
      get: {
        operationId: 'searchWeb',
        description: 'Searching for data information on the Internet. Get the latest data content from the network.',
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            description: 'The query to search. Please use keywords to search.',
            example: 'RMB and USD exchange rate',
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
                  type: 'string',
                  description: 'LLM-friendly web content, returned in markdown format.',
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
      url: '@plugins/search',
    },
  ],
}

export async function handle({ query }: Props) {
  const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`
  const response = await fetch(`https://r.jina.ai/${url}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
  const result: ReaderResult = await response.json()
  return result.data.content
}
