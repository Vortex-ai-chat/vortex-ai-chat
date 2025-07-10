'use client'
import { memo, useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Sparkles,
  SendHorizontal,
  BookOpen,
  GraduationCap,
  School,
  PersonStanding,
  Baby,
  Swords,
  Languages,
  SlidersVertical,
  SmilePlus,
  ScrollText,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  EllipsisVertical,
  LoaderCircle,
} from 'lucide-react'
import Button from '@/components/Button'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSettingStore } from '@/store/setting'
import artifact from '@/utils/artifact'
import { encodeToken } from '@/utils/signature'

type Props = {
  content: string
  isEditing: boolean
  onChange: (content: string) => void
  onCancel: () => void
}

async function textStream(readableStream: ReadableStream, onMessage: (content: string) => void) {
  let text = ''
  const reader = readableStream.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    text += new TextDecoder().decode(value)
    onMessage(text)
  }
}

function EditableArea({ content: originalContent, isEditing, onChange, onCancel }: Props) {
  const { t } = useTranslation()
  const isMobile = useIsMobile(450)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState<string>(originalContent)
  const [contentHeight, setContentHeight] = useState<number>(80)
  const [loadingAction, setLoadingAction] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')

  const handleCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  const getApikey = () => {
    const { apiKey, password } = useSettingStore.getState()
    return apiKey === '' ? encodeToken(password) : apiKey
  }

  const getBaseUrl = () => {
    const { apiKey, apiProxy } = useSettingStore.getState()
    return apiKey === '' ? '/api/google' : apiProxy
  }

  const handleAIWrite = useCallback(
    async (prompt: string) => {
      const { model } = useSettingStore.getState()

      try {
        setLoadingAction('aiWrite')
        const readableStream = await artifact({
          action: 'AIWrite',
          apiKey: getApikey(),
          baseUrl: getBaseUrl(),
          model,
          content,
          args: JSON.stringify({ prompt }),
        })
        await textStream(readableStream, setContent)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingAction('')
      }
    },
    [content, setContent],
  )

  const handleTranslate = useCallback(
    async (lang: string) => {
      const { model } = useSettingStore.getState()

      try {
        setLoadingAction('translate')
        const readableStream = await artifact({
          action: 'translate',
          apiKey: getApikey(),
          baseUrl: getBaseUrl(),
          model,
          content,
          args: JSON.stringify({ lang }),
        })
        await textStream(readableStream, setContent)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingAction('')
      }
    },
    [content, setContent],
  )

  const changeReadingLevel = useCallback(
    async (level: string) => {
      const { model } = useSettingStore.getState()

      try {
        setLoadingAction('readingLevel')
        const readableStream = await artifact({
          action: 'changeReadingLevel',
          apiKey: getApikey(),
          baseUrl: getBaseUrl(),
          model,
          content,
          args: JSON.stringify({ level }),
        })
        await textStream(readableStream, setContent)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingAction('')
      }
    },
    [content],
  )

  const changeAdjustLength = useCallback(
    async (lengthDesc: string) => {
      const { model } = useSettingStore.getState()

      try {
        setLoadingAction('adjustLength')
        const readableStream = await artifact({
          action: 'changeLength',
          apiKey: getApikey(),
          baseUrl: getBaseUrl(),
          model,
          content,
          args: JSON.stringify({ lengthDesc }),
        })
        await textStream(readableStream, setContent)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingAction('')
      }
    },
    [content],
  )

  const continuation = useCallback(async () => {
    const { model } = useSettingStore.getState()

    try {
      setLoadingAction('continuation')
      const readableStream = await artifact({
        action: 'continuation',
        apiKey: getApikey(),
        baseUrl: getBaseUrl(),
        model,
        content,
      })
      const originalContent = content + '\n'
      await textStream(readableStream, (text) => {
        setContent(originalContent + text)
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAction('')
    }
  }, [content])

  const addEmojis = useCallback(async () => {
    const { model } = useSettingStore.getState()

    try {
      setLoadingAction('addEmojis')
      const readableStream = await artifact({
        action: 'addEmojis',
        apiKey: getApikey(),
        baseUrl: getBaseUrl(),
        model,
        content,
      })
      await textStream(readableStream, setContent)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAction('')
    }
  }, [content])

  useEffect(() => {
    if (isEditing && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight + 14)
      contentRef.current.focus()
    }
  }, [isEditing])

  if (!isEditing) return null

  return (
    <>
      <Textarea
        ref={contentRef}
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
        className="chat-content max-h-[320px] resize-none"
        style={{ height: `${contentHeight}px` }}
      />
      <div className="mb-1 mt-2 flex justify-between">
        <div className="inline-flex gap-1">
          <Popover onOpenChange={(open) => open && setPrompt('')}>
            <PopoverTrigger asChild>
              <Button
                className="h-7 w-7 [&_svg]:size-5"
                type="button"
                size="icon"
                variant="ghost"
                title={t('AIWrite')}
                disabled={loadingAction !== ''}
              >
                {loadingAction === 'aiWrite' ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex gap-2 p-2">
              <Input
                className="h-8"
                placeholder={t('writingPromptTip')}
                value={prompt}
                onChange={(ev) => setPrompt(ev.target.value)}
              />
              <PopoverClose asChild>
                <Button
                  className="h-8"
                  size="icon"
                  variant="secondary"
                  title={t('send')}
                  onClick={() => handleAIWrite(prompt)}
                >
                  <SendHorizontal />
                </Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-7 w-7 [&_svg]:size-5"
                type="button"
                size="icon"
                variant="ghost"
                title={t('readingLevel')}
                disabled={loadingAction !== ''}
              >
                {loadingAction === 'readingLevel' ? <LoaderCircle className="animate-spin" /> : <BookOpen />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeReadingLevel('PhD student')}>
                <GraduationCap />
                <span>{t('PhD')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeReadingLevel('college student')}>
                <School />
                <span>{t('college')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeReadingLevel('high school student')}>
                <PersonStanding />
                <span>{t('teenager')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeReadingLevel('elementary school student')}>
                <Baby />
                <span>{t('child')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeReadingLevel('pirate')}>
                <Swords />
                <span>{t('pirate')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-7 w-7 [&_svg]:size-5"
                type="button"
                size="icon"
                variant="ghost"
                title={t('adjustLength')}
                disabled={loadingAction !== ''}
              >
                {loadingAction === 'adjustLength' ? <LoaderCircle className="animate-spin" /> : <SlidersVertical />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeAdjustLength('much longer than it currently is')}>
                <ChevronsUp />
                <span>{t('longest')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeAdjustLength('slightly longer than it currently is')}>
                <ChevronUp />
                <span>{t('long')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeAdjustLength('slightly shorter than it currently is')}>
                <ChevronDown />
                <span>{t('shorter')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeAdjustLength('much shorter than it currently is')}>
                <ChevronsDown />
                <span>{t('shortest')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-7 w-7 [&_svg]:size-5"
                type="button"
                size="icon"
                variant="ghost"
                title={t('translate')}
                disabled={loadingAction !== ''}
              >
                {loadingAction === 'translate' ? <LoaderCircle className="animate-spin" /> : <Languages />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleTranslate('English')}>
                <span>🇬🇧</span>
                <span>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('Simplified Chinese')}>
                <span>🇨🇳</span>
                <span>简体中文</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('Traditional Chinese')}>
                <span>🇭🇰</span>
                <span>繁体中文</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('Japanese')}>
                <span>🇯🇵</span>
                <span>日本語</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('Korean')}>
                <span>🇰🇷</span>
                <span>한국어</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('Spanish')}>
                <span>🇪🇸</span>
                <span>Español</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('German')}>
                <span>🇩🇪</span>
                <span>Deutsch</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('French')}>
                <span>🇫🇷</span>
                <span>Français</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('Portuguese')}>
                <span>🇧🇷</span>
                <span>Português</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('Russian')}>
                <span>🇷🇺</span>
                <span>Русский</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate('Arabic')}>
                <span>🇸🇦</span>
                <span>العربية</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-7 w-7 [&_svg]:size-5"
                  type="button"
                  size="icon"
                  variant="ghost"
                  title={t('moreTools')}
                  disabled={loadingAction !== ''}
                >
                  {loadingAction === 'continuation' || loadingAction === 'addEmojis' ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <EllipsisVertical />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => continuation()}>
                  <ScrollText />
                  <span>{t('continuation')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addEmojis()}>
                  <SmilePlus />
                  <span>{t('addEmojis')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                className="h-7 w-7 [&_svg]:size-5"
                type="button"
                size="icon"
                variant="ghost"
                title={t('continuation')}
                disabled={loadingAction !== ''}
                onClick={() => continuation()}
              >
                {loadingAction === 'continuation' ? <LoaderCircle className="animate-spin" /> : <ScrollText />}
              </Button>
              <Button
                className="h-7 w-7 [&_svg]:size-5"
                type="button"
                size="icon"
                variant="ghost"
                title={t('addEmojis')}
                disabled={loadingAction !== ''}
                onClick={() => addEmojis()}
              >
                {loadingAction === 'addEmojis' ? <LoaderCircle className="animate-spin" /> : <SmilePlus />}
              </Button>
            </>
          )}
        </div>
        <div className="inline-flex gap-2">
          <Button className="h-7 px-4" variant="secondary" size="sm" onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button className="h-7 px-4" size="sm" onClick={() => onChange(content)}>
            {t('save')}
          </Button>
        </div>
      </div>
    </>
  )
}

export default memo(EditableArea)
