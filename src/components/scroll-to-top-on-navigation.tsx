import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

function isProductListPath(pathname: string) {
  return pathname === '/items' || pathname.startsWith('/items/')
}

export function ScrollToTopOnNavigation() {
  const { hash, pathname, search, state } = useLocation()
  const navigationType = useNavigationType()
  const previousLocationRef = useRef<{
    pathname: string
    search: string
  } | null>(null)
  const preserveScroll =
    typeof state === 'object' &&
    state !== null &&
    'preserveScroll' in state &&
    state.preserveScroll === true

  useLayoutEffect(() => {
    const previousLocation = previousLocationRef.current
    const preserveProductListScroll =
      previousLocation?.search === search &&
      isProductListPath(previousLocation.pathname) &&
      isProductListPath(pathname)

    previousLocationRef.current = { pathname, search }

    if (
      navigationType === 'POP' ||
      hash ||
      preserveScroll ||
      preserveProductListScroll
    ) {
      return
    }

    const scrollOptions = {
      top: 0,
      left: 0,
      behavior: 'instant',
    } satisfies ScrollToOptions

    window.scrollTo(scrollOptions)

    document
      .querySelector('[data-admin-scroll-container]')
      ?.scrollTo(scrollOptions)
  }, [hash, navigationType, pathname, preserveScroll, search])

  return null
}
