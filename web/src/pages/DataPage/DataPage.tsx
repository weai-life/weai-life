import { MetaTags } from '@redwoodjs/web'

import MyPostsCell from 'src/components/MyPostsCell'

const DataPage = () => {
  return (
    <div className="container">
      <MetaTags title="Data" description="Your all data in WeAI" />

      <div className="flex items-center justify-center mt-6">
        <div className="text-3xl tracking-wider subpixel-antialiased">Data</div>
      </div>

      <MyPostsCell />
    </div>
  )
}

export default DataPage
