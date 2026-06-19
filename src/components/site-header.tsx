import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { CartDrawer } from '@/components/cart-drawer'
import { ThemeToggle } from '@/components/theme-toggle'
import { assetUrl } from '@/lib/asset-url'
import { cn } from '@/lib/utils'

type SiteHeaderProps = {
  transparentOnTop?: boolean
}

export function SiteHeader({ transparentOnTop = false }: SiteHeaderProps) {
  const [isPastTop, setIsPastTop] = useState(() =>
    transparentOnTop && typeof window !== 'undefined'
      ? window.scrollY > 24
      : false,
  )
  const isHeaderPinned = !transparentOnTop || isPastTop

  useEffect(() => {
    if (!transparentOnTop) {
      return
    }

    const updateHeaderState = () => {
      setIsPastTop(window.scrollY > 24)
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateHeaderState)
    }
  }, [transparentOnTop])

  return (
    <header
      className={cn(
        'site-header fixed inset-x-0 top-0 z-50',
        isHeaderPinned ? 'site-header--pinned' : 'site-header--top',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-gutter py-3">
        <Link
          className={cn(
            'site-header-logo inline-flex shrink-0 items-center gap-2 font-heading text-base font-semibold tracking-normal',
            isHeaderPinned
              ? 'drop-shadow-none'
              : 'drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]',
          )}
          to="/"
        >
          <img
            alt=""
            aria-hidden="true"
            className="size-5 rounded-full"
            src={assetUrl(
              '/skym-shop-assets/images/theme/skymshop-favicon.png',
            )}
          />
          SKYMSHOP
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle
            activeButtonClassName="header-control-button--active"
            buttonClassName="header-control-button"
            className="header-control-group"
          />
          <CartDrawer buttonClassName="header-control-button size-[38px]" />
        </div>
      </div>
    </header>
  )
}
