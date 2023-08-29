import type { Applet } from '@prisma/client'

import {
  applets,
  applet,
  createApplet,
  updateApplet,
  deleteApplet,
} from './applets'
import type { StandardScenario } from './applets.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('applets', () => {
  scenario('returns all applets', async (scenario: StandardScenario) => {
    const result = await applets()

    expect(result.length).toEqual(Object.keys(scenario.applet).length)
  })

  scenario('returns a single applet', async (scenario: StandardScenario) => {
    const result = await applet({ id: scenario.applet.one.id })

    expect(result).toEqual(scenario.applet.one)
  })

  scenario('creates a applet', async () => {
    const result = await createApplet({
      input: { name: 'String', title: 'String' },
    })

    expect(result.name).toEqual('String')
    expect(result.title).toEqual('String')
  })

  scenario('updates a applet', async (scenario: StandardScenario) => {
    const original = (await applet({ id: scenario.applet.one.id })) as Applet
    const result = await updateApplet({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a applet', async (scenario: StandardScenario) => {
    const original = (await deleteApplet({
      id: scenario.applet.one.id,
    })) as Applet
    const result = await applet({ id: original.id })

    expect(result).toEqual(null)
  })
})
