'use client'
import { useLayoutEffect } from 'react'
import { useEnvStore } from '@/store/setting'

const NEXT_PUBLIC_BUILD_MODE = process.env.NEXT_PUBLIC_BUILD_MODE || 'default'

interface Props {
  children: React.ReactNode
}

function StoreProvider({ children }: Props) {
  useLayoutEffect(() => {
    if (NEXT_PUBLIC_BUILD_MODE !== 'export') {
      const { update } = useEnvStore.getState()
      fetch('/api/env')
        .then(async (response) => {
          const env = await response.json()
          update(env)
        })
        .catch(console.error)
    }
  }, [])

  return children
}

export default StoreProvider
