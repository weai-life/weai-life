import type { Tool } from '@prisma/client'

import { tools, tool, createTool, updateTool, deleteTool } from './tools'
import type { StandardScenario } from './tools.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('tools', () => {
  scenario('returns all tools', async (scenario: StandardScenario) => {
    const result = await tools()

    expect(result.length).toEqual(Object.keys(scenario.tool).length)
  })

  scenario('returns a single tool', async (scenario: StandardScenario) => {
    const result = await tool({ id: scenario.tool.one.id })

    expect(result).toEqual(scenario.tool.one)
  })

  scenario('creates a tool', async () => {
    const result = await createTool({
      input: { name: 'String', title: 'String' },
    })

    expect(result.name).toEqual('String')
    expect(result.title).toEqual('String')
  })

  scenario('updates a tool', async (scenario: StandardScenario) => {
    const original = (await tool({ id: scenario.tool.one.id })) as Tool
    const result = await updateTool({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a tool', async (scenario: StandardScenario) => {
    const original = (await deleteTool({
      id: scenario.tool.one.id,
    })) as Tool
    const result = await tool({ id: original.id })

    expect(result).toEqual(null)
  })
})
