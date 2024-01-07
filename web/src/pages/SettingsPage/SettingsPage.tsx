import { MetaTags } from '@redwoodjs/web'

const SettingsPage = () => {
  return (
    <div className="container">
      <MetaTags title="Settings" description="WeAI settings." />

      <div className="flex items-center justify-center mt-6">
        <div className="text-3xl tracking-wider subpixel-antialiased">
          Settings
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
