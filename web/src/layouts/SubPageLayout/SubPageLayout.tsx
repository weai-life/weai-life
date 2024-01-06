import { ArrowLeft } from 'lucide-react'
import { Button } from 'weai-ui'

import { back } from '@redwoodjs/router'

type SubPageLayoutProps = {
  children?: React.ReactNode
}

const SubPageLayout = ({ children }: SubPageLayoutProps) => {
  const handleNavigteBack = () => {
    back()
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="sticky top-0 z-50 w-full h-14 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center ">
        <Button
          variant="ghost"
          onClick={handleNavigteBack}
          className="cursor-pointer flex items-center p-0"
        >
          <ArrowLeft className="inline-block mr-2" size="20" />
        </Button>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default SubPageLayout
