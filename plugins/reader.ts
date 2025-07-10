import { ErrorType } from '@/constant/errors'
import { omit } from 'lodash-es'

type Props = {
  url: string
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
  info: {
    title: 'Web Reader',
    description: 'A plugin for convert a URL to LLM-friendly input.',
    version: 'v1',
  },
  openapi: '3.0.1',
  paths: {
    '/': {
      get: {
        operationId: 'webReader',
        description:
          'Access website content via the Internet. Convert a URL to LLM-friendly input. Interpret the content of the URL.',
        parameters: [
          {
            name: 'url',
            in: 'query',
            required: true,
            description: 'The URL of the web page content to be queried.',
            example: 'https://gemini.u14.app/',
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
                    title: {
                      type: 'string',
                      description: 'The title of the website.',
                    },
                    description: {
                      type: 'string',
                      description: 'The description of the website.',
                    },
                    url: {
                      type: 'string',
                      description: 'The url of the website.',
                    },
                    content: {
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
    },
  },
  servers: [
    {
      url: '@plugins/reader',
    },
  ],
}

export async function handle({ url = '' }: Props) {
  if (url === '') {
    return new Error(ErrorType.MissingParam)
  }

  const response = await fetch(`https://r.jina.ai/${url}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
  const result: ReaderResult = await response.json()
  return omit(result.data, ['usage'])
}
