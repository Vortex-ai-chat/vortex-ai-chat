'use client'
import { useEffect, useState, useCallback, memo } from 'react'
import Clipboard from 'clipboard'
import { useTranslation } from 'react-i18next'
import { Bot, RotateCw, Copy, CopyCheck } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import IconButton from '@/components/IconButton'

type Props = {
  content: string
  onRegenerate: () => void
}

function ErrorMessageItem({ content, onRegenerate }: Props) {
  const { t } = useTranslation()
  const [isCopyed, setIsCopyed] = useState<boolean>(false)

  const handleCopy = useCallback(() => {
    setIsCopyed(true)
    setTimeout(() => {
      setIsCopyed(false)
    }, 2000)
  }, [])

  useEffect(() => {
    const copyContent = new Clipboard('.copy-error', {
      text: () => content,
    })
    return () => {
      copyContent.destroy()
    }
  }, [content])

  return (
    <>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-blue-300 text-white">
          <Bot />
        </AvatarFallback>
      </Avatar>
      <div className="group flex-auto overflow-x-auto">
        <div className="prose chat-content break-words text-base leading-8 text-blue-500">{content}</div>
        <div className="flex justify-end gap-1 text-right opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <IconButton title={t('regenerate')} onClick={() => onRegenerate()}>
            <RotateCw className="h-4 w-4" />
          </IconButton>
          <IconButton title={t('copy')} className="copy-error" onClick={() => handleCopy()}>
            {isCopyed ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </IconButton>
        </div>
      </div>
    </>
  )
}

export default memo(ErrorMessageItem)
