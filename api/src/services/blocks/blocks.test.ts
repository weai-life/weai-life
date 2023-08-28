import { db } from 'src/lib/db'
import {
  blocks,
  myBlocks,
  block,
  createBlock,
  updateBlock,
  deleteBlock,
} from './blocks'
import type { StandardScenario } from './blocks.scenarios'

describe('blocks', () => {
  scenario('returns all blocks', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.two)
    const result = await blocks()

    expect(result.data.length).toEqual(Object.keys(scenario.block).length)
  })

  scenario('returns all my blocks', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await myBlocks()

    expect(result.data.length).toEqual(1)
  })

  scenario('search by searchText', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await myBlocks({
      where: { searchText: { contains: 'love' } },
    })

    expect(result.data.length).toEqual(1)
  })

  scenario('returns a single block', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await block({ id: scenario.block.one.id })

    expect(result).toEqual(scenario.block.one)
  })

  scenario('creates a block', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await createBlock({
      input: {
        content: 'String',
        contentType: 'Text',
        searchText: 'SearchText',
      },
    })

    expect(result.userId).toEqual(scenario.user.one.id)
    expect(result.content).toEqual('String')
    expect(result.searchText).toEqual('SearchText')
  })

  scenario('updates a block', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await block({ id: scenario.block.one.id })
    const result = await updateBlock({
      id: original.id,
      input: { content: '2021-09-28T08:44:45Z', searchText: 'updateSearch' },
    })

    expect(result.content).toEqual('2021-09-28T08:44:45Z')
    expect(result.searchText).toEqual('updateSearch')
  })

  scenario('deletes a block', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await deleteBlock({ id: scenario.block.one.id })
    const result = await db.block.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })
})
