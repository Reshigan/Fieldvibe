import React from 'react'

interface AccessibleIconProps {
  label: string
  children: React.ReactNode
}

export function AccessibleIcon({ label, children }: AccessibleIconProps) {
  return (
    <span role="img" aria-label={label}>
      {children}
    </span>
  )
}

interface SkipLinkProps {
  targetId: string
  children?: React.ReactNode
}

export function SkipLink({ targetId, children }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-[#00E87B] focus:text-black focus:px-4 focus:py-2 focus:rounded"
    >
      {children || 'Skip to main content'}
    </a>
  )
}
