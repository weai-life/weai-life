import {
  categories,
  category,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories'
import type { StandardScenario } from './categories.scenarios'

describe('categories', () => {
  scenario('returns all categories', async (scenario: StandardScenario) => {
    await mockCurrentUser(scenario.user.one)
    const result = await categories()

    expect(result.data.length).toEqual(Object.keys(scenario.category).length)
  })

  scenario('returns a single category', async (scenario: StandardScenario) => {
    await mockCurrentUser(scenario.user.one)
    const result = await category({ id: scenario.category.one.id })

    expect(result).toEqual(scenario.category.one)
  })

  scenario('creates a category', async (scenario: StandardScenario) => {
    await mockCurrentUser(scenario.user.one)

    const result = await createCategory({
      input: {
        title: 'title',
        imageUrl: 'image',
        channelId: scenario.category.one.channelId,
      },
    })

    expect(result.title).toEqual('title')
    expect(result.imageUrl).toEqual('image')
    expect(result.channelId).toEqual(scenario.category.one.channelId)
  })

  scenario('updates a category', async (scenario: StandardScenario) => {
    await mockCurrentUser(scenario.user.one)

    const original = await category({ id: scenario.category.one.id })
    const result = await updateCategory({
      id: original.id,
      input: { title: '2021-07-26T03:41:22Z', imageUrl: 'image2' },
    })

    expect(result.title).toEqual('2021-07-26T03:41:22Z')
    expect(result.imageUrl).toEqual('image2')
  })

  scenario('deletes a category', async (scenario: StandardScenario) => {
    await mockCurrentUser(scenario.user.one)

    const original = await deleteCategory({ id: scenario.category.one.id })
    const result = await category({ id: original.id })

    expect(result).toEqual(null)
  })
})
