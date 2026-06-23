import type { ImgHTMLAttributes, ReactNode } from 'react'

type ProtectedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'draggable'> & {
  wrapperClassName?: string
  children?: ReactNode
}

export default function ProtectedImage({
  className = '',
  wrapperClassName = '',
  alt = '',
  children,
  ...imgProps
}: ProtectedImageProps) {
  const blockEvent = (event: React.SyntheticEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      className={`protected-image relative overflow-hidden select-none ${wrapperClassName}`}
      onContextMenu={blockEvent}
      onDragStart={blockEvent}
    >
      <img
        {...imgProps}
        alt={alt}
        draggable={false}
        className={`pointer-events-none select-none ${className}`}
        style={{ ...(imgProps.style ?? {}), userSelect: 'none' } as React.CSSProperties}
      />
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden
        onContextMenu={blockEvent}
        onDragStart={blockEvent}
      />
      {children}
    </div>
  )
}
