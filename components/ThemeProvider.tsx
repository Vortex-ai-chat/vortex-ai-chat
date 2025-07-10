'use client'
import { useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Remove color picker UI, just keep this logic if you want to support dynamic theme color
  // (You can even remove themeColor state if not needed)
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}