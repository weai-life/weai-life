import { Button } from 'weai-ui'

import { Link, routes } from '@redwoodjs/router'

export default () => (
  <main className="flex h-dvh w-full flex-col items-center justify-center">
    <section>
      <h1 className="text-2xl font-semibold italic text-muted-foreground">
        Page Not Found
      </h1>
    </section>
    <Button variant="link" asChild className="text-md mt-4 underline">
      <Link to={routes.tools()}>Back to home page</Link>
    </Button>
  </main>
)
