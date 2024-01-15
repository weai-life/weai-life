// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'

import { useAuth } from './auth'
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout'
import SubPageLayout from './layouts/SubPageLayout/SubPageLayout'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={DefaultLayout}>
        <Route path="/" page={ToolsPage} name="tools" />
        <Route path="/connections" page={ConnectionsPage} name="connections" />
        <Route path="/data" page={DataPage} name="data" />
        <Route path="/profile" page={ProfilePage} name="profile" />
        <Route notfound page={NotFoundPage} />
      </Set>
      <Set wrap={SubPageLayout}>
        <Route path="/invitations" page={InvitationsPage} name="invitations" />
      </Set>
      <Route path="/we/{id}" page={PeoplePage} name="people" />
    </Router>
  )
}

export default Routes
