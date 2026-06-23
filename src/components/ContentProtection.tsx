import { useEffect } from 'react'

/** Bloqueia cópia e salvamento de imagens no site público. */
export default function ContentProtection() {
  useEffect(() => {
    const isProtectedTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return false
      return Boolean(
        target.closest('.protected-image') ||
          target instanceof HTMLImageElement ||
          target.closest('img'),
      )
    }

    const onContextMenu = (event: MouseEvent) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault()
      }
    }

    const onDragStart = (event: DragEvent) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault()
      }
    }

    const onCopy = (event: ClipboardEvent) => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) return
      const anchor = selection.anchorNode
      if (anchor && anchor instanceof Element && anchor.closest('.protected-image, img')) {
        event.preventDefault()
      }
      if (anchor?.parentElement?.closest('.protected-image, img')) {
        event.preventDefault()
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      const key = event.key.toLowerCase()
      if (key === 's' || key === 'u') {
        const active = document.activeElement
        if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return
        event.preventDefault()
      }
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('dragstart', onDragStart)
    document.addEventListener('copy', onCopy)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}
