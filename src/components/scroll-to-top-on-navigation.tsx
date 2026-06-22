import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

export function ScrollToTopOnNavigation() {
  const { hash, pathname, search } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (navigationType === 'POP' || hash) {
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
  }, [hash, navigationType, pathname, search])

  return null
}
