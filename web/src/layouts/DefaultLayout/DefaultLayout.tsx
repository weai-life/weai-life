import { useEffect } from 'react'

import { useLocation, navigate } from '@redwoodjs/router'

import Header from 'src/components/Header/Header'

type DefaultLayoutProps = {
  children?: React.ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const token = searchParams.get('token')

    if (token) {
      localStorage.setItem('TOKEN', token)
      searchParams.delete('token')
      navigate(`${pathname}?${searchParams.toString()}`, {
        replace: true,
      })
    }
  }, [search, pathname])

  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  )
}

export default DefaultLayout
