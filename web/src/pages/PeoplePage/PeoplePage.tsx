import { MetaTags } from '@redwoodjs/web'

import PeopleCell from 'src/components/PeopleCell'

const PeoplePage = ({ id }) => {
  const userId = Number(id)
  return (
    <div className="container">
      <MetaTags title="People" description="People page" />

      <PeopleCell id={userId} />
    </div>
  )
}

export default PeoplePage
