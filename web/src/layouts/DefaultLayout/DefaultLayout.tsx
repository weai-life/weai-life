import Header from 'src/components/Header/Header'

type DefaultLayoutProps = {
  children?: React.ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  )
}

export default DefaultLayout
