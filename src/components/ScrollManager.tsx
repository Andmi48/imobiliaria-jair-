import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const NAVBAR_HEIGHT = 64

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function scrollToHash(hash: string) {
  const id = hash.replace('#', '')
  const element = document.getElementById(id)

  if (!element) {
    scrollToTop()
    return
  }

  const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => scrollToHash(hash), 0)
      return () => window.clearTimeout(timer)
    }

    scrollToTop()
  }, [pathname, hash])

  return null
}
