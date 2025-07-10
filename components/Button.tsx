'use client'
import { memo, forwardRef, type ForwardedRef } from 'react'
import { Button as OriginalButton, type ButtonProps } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { omit } from 'lodash-es'

function Button(props: ButtonProps, forwardedRef: ForwardedRef<HTMLButtonElement>) {
  if (props.title) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <OriginalButton ref={forwardedRef} {...omit(props, ['title'])} />
          </TooltipTrigger>
          <TooltipContent className="max-md:hidden">
            <p>{props.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  } else {
    return <OriginalButton {...props} />
  }
}

export default memo(forwardRef(Button))
