import { useEffect } from 'react'

import { useLocation, navigate } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import Header from 'src/components/Header/Header'

type DefaultLayoutProps = {
  children?: React.ReactNode
}

const QUERY_PROFILE = gql`
  query profile {
    profile {
      id
      name
      email
      avatarUrl
    }
  }
`

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { pathname, search } = useLocation()
  const { loading, error, data } = useQuery(QUERY_PROFILE, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
    },
  })

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

  useEffect(() => {
    console.log({
      loading,
      error,
      data,
    })
  }, [data, error, loading])

  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  )
}

export default DefaultLayout
