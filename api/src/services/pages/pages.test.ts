import type { Page } from '@prisma/client'

import { pages, page, createPage, updatePage, deletePage } from './pages'
import type { StandardScenario } from './pages.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('pages', () => {
  scenario('returns all pages', async (scenario: StandardScenario) => {
    const result = await pages()

    expect(result.length).toEqual(Object.keys(scenario.page).length)
  })

  scenario('returns a single page', async (scenario: StandardScenario) => {
    const result = await page({ id: scenario.page.one.id })

    expect(result).toEqual(scenario.page.one)
  })

  scenario('creates a page', async (scenario: StandardScenario) => {
    const result = await createPage({
      input: { title: 'String', ownerId: scenario.page.two.ownerId },
    })

    expect(result.title).toEqual('String')
    expect(result.ownerId).toEqual(scenario.page.two.ownerId)
  })

  scenario('updates a page', async (scenario: StandardScenario) => {
    const original = (await page({ id: scenario.page.one.id })) as Page
    const result = await updatePage({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a page', async (scenario: StandardScenario) => {
    const original = (await deletePage({ id: scenario.page.one.id })) as Page
    const result = await page({ id: original.id })

    expect(result).toEqual(null)
  })
})
