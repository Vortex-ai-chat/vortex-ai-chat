'use client'
import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, ChevronRight } from 'lucide-react'
import ResponsiveDialog from '@/components/ResponsiveDialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SearchResult {
  hostname: string
  url: string
  title: string
  description: string
  rawDescription: string
  icon: string
}

type Props = {
  query: string
}

function WebSearch({ query }: Props) {
  const { t } = useTranslation()
  const [data, setData] = useState<SearchResult[]>([])
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    async function fetchDuckDuckGoResults() {
      if (!query) return

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error(`API error ${res.status}`)

        const json = await res.json()
        const results: SearchResult[] = (json.results || []).map((item: any) => ({
          hostname: new URL(item.link).hostname,
          url: item.link,
          title: item.title,
          description: item.snippet,
          rawDescription: item.snippet,
          icon: `https://www.google.com/s2/favicons?sz=64&domain_url=${item.link}`
        }))
        setData(results)
      } catch (error) {
        setData([])
        console.error('DuckDuckGo search API error:', error)
      }
    }

    fetchDuckDuckGoResults()
  }, [query])

  if (data.length === 0) return null

  return (
    <>
      <div className="chat-content overflow-x-auto scroll-smooth">
        <div className="flex gap-1.5 max-md:gap-1">
          {data.slice(0, 4).map((item, idx) => (
            <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer">
              <Card className="w-40 flex-1 hover:bg-gray-50 hover:dark:bg-gray-900">
                <CardHeader className="p-2">
                  <CardTitle className="truncate text-sm text-blue--500" title={item.title}>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 py-0" title={item.description}>
                  <p className="text-line-clamp-2 text-sm" dangerouslySetInnerHTML={{ __html: item.description }}></p>
                </CardContent>
                <CardFooter className="p-2" title={item.url}>
                  <div className="inline-flex w-full">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={item.icon} />
                      <AvatarFallback>
                        <Link />
                      </AvatarFallback>
                    </Avatar>
                    <span className="ml-1.5 truncate text-sm leading-4">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.hostname}
                      </a>
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </a>
          ))}
        </div>
      </div>

      <div className="flex justify-between py-2">
        <div className="inline-flex">
          <div className="grid h-5 w-32 grid-cols-4 p-0.5">
            {data.slice(4, 8).map((item, idx) => (
              <Avatar key={idx} className="h-4 w-4" title={item.title}>
                <AvatarImage src={item.icon} />
                <AvatarFallback>
                  <Link />
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-sm">
            <span className="text-blue--500">{data.length}</span> {t('plugins.webSearch.totalDataSources')}
          </p>
        </div>
        <div className="inline-flex cursor-pointer text-blue--500" onClick={() => setDialogOpen(true)}>
          <span className="text-sm underline-offset-2 hover:underline">{t('plugins.webSearch.viewAll')}</span>
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>

      <ResponsiveDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={t('plugins.webSearch.dialogTitle')}
        description={t('plugins.webSearch.dialogDescription')}
      >
        <ScrollArea className="h-[500px]">
          <ol>
            {data.map((item, idx) => (
              <li
                className="mb-2 border-b-[1px] border-solid border-gray-200 last:border-b-0 dark:border-gray-700"
                key={idx}
              >
                <div className="inline-flex text-blue--400">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={item.icon} />
                    <AvatarFallback>
                      <Link className="scale-75" />
                    </AvatarFallback>
                  </Avatar>
                  <small className="ml-1.5 truncate text-sm leading-4">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.hostname}
                    </a>
                  </small>
                </div>
                <h3 className="my-1 text-base text-blue--500 underline-offset-2 hover:underline">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p className="my-2 text-sm" dangerouslySetInnerHTML={{ __html: item.description }}></p>
              </li>
            ))}
          </ol>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </ResponsiveDialog>
    </>
  )
}

export default memo(WebSearch)
