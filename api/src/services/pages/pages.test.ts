import {
  pages,
  page,
  activePage,
  createPage,
  updatePage,
  deletePage,
} from './pages'
import type { StandardScenario } from './pages.scenarios'

describe('pages', () => {
  scenario('returns all pages', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.admin)
    const result = await pages()

    expect(result.data.length).toEqual(Object.keys(scenario.page).length)
  })

  scenario('returns a single page', async (scenario: StandardScenario) => {
    const result = await page({ id: scenario.page.one.id })

    expect(result?.slug).toEqual(scenario.page.one.slug)
  })

  describe('activePage', () => {
    scenario('return null if page is not active', async () => {
      const result = await activePage({ slug: 'String6423084' })

      expect(result).toEqual(null)
    })

    scenario(
      'returns a active single page by slug',
      async (scenario: StandardScenario) => {
        await updatePage({ id: scenario.page.one.id, input: { active: true } })
        const result = await activePage({ slug: 'String6423084' })

        expect(result?.slug).toEqual(scenario.page.one.slug)
      }
    )
  })

  describe('creates a page', () => {
    scenario('successfully', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.two)
      const result = await createPage({
        input: { slug: 'String1017849', channelId: scenario.channel.two.id },
      })

      expect(result.slug).toEqual('String1017849')
    })

    scenario(
      'failed when slug format is invalid',
      async (scenario: StandardScenario) => {
        mockCurrentUser(scenario.user.two)
        const fn = () =>
          createPage({
            input: {
              slug: '-tring1017849',
              channelId: scenario.channel.two.id,
            },
          })

        await expect(fn).rejects.toThrowErrorMatchingInlineSnapshot(
          `"频道号(slug)必须使用英文字母开头且只能使用英文、数字、-、_字符，长度4~30"`
        )
      }
    )

    scenario(
      'failed when slug is taken',
      async (scenario: StandardScenario) => {
        mockCurrentUser(scenario.user.two)
        const fn = () =>
          createPage({
            input: {
              slug: 'taken',
              channelId: scenario.channel.two.id,
            },
          })

        await expect(fn).rejects.toThrowErrorMatchingInlineSnapshot(
          `"频道号(slug)已经被占用"`
        )
      }
    )

    scenario('check slug insensitively', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.two)
      const fn = () =>
        createPage({
          input: {
            slug: 'Taken',
            channelId: scenario.channel.two.id,
          },
        })

      await expect(fn).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道号(slug)已经被占用"`
      )
    })
  })

  describe('updates a page', () => {
    scenario('successfully', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const original = await page({ id: scenario.page.one.id })
      const result = await updatePage({
        id: original.id,
        input: { slug: 'test-slug' },
      })

      expect(result.slug).toEqual('test-slug')
    })

    scenario('failed when slug exists', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const original = await page({ id: scenario.page.one.id })
      const fn = () =>
        updatePage({
          id: original.id,
          input: { slug: 'taken' },
        })

      await expect(fn).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道号(slug)已经被占用"`
      )
    })
  })

  describe('deletes a page', () => {
    scenario('successfully', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const original = await deletePage({ id: scenario.page.one.id })
      const result = await page({ id: original.id })

      expect(result).toEqual(null)
    })
  })
})
