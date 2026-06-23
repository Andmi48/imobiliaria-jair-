import { forwardRef, type ImgHTMLAttributes, type ReactNode } from 'react'

type ProtectedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'draggable'> & {
  wrapperClassName?: string
  children?: ReactNode
}

const ProtectedImage = forwardRef<HTMLImageElement, ProtectedImageProps>(function ProtectedImage(
  { className = '', wrapperClassName = '', alt = '', children, ...imgProps },
  ref,
) {
  const blockEvent = (event: React.SyntheticEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const isAbsolute = /\babsolute\b/.test(wrapperClassName)

  return (
    <div
      className={`protected-image overflow-hidden select-none ${isAbsolute ? '' : 'relative'} ${wrapperClassName}`}
      onContextMenu={blockEvent}
      onDragStart={blockEvent}
    >
      <img
        {...imgProps}
        ref={ref}
        alt={alt}
        draggable={false}
        className={`block w-full h-full pointer-events-none select-none ${className}`}
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
})

export default ProtectedImage
