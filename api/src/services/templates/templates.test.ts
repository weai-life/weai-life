import {
  templates,
  template,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from './templates'
import type { StandardScenario } from './templates.scenarios'

describe('templates', () => {
  scenario('returns all templates', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.admin)
    const result = await templates()

    expect(result.data.length).toEqual(Object.keys(scenario.template).length)
  })

  scenario('returns a single template', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await template({ id: scenario.template.one.id })

    expect(result).toEqual(scenario.template.one)
  })

  scenario('creates a template', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await createTemplate({
      input: {
        name: 'String2173964',
        title: 'String',
      },
    })

    expect(result.name).toEqual('String2173964')
    expect(result.title).toEqual('String')
  })

  scenario(
    'failed to create a template when name is invalid',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const fn = () =>
        createTemplate({
          input: {
            name: '-String2173964',
            title: 'String',
          },
        })

      await expect(fn).rejects.toThrowErrorMatchingInlineSnapshot(
        `"name(名称)必须使用英文字母开头且只能使用英文、数字、-、_字符，长度4~30"`
      )
    }
  )

  scenario('updates a template', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const original = await template({ id: scenario.template.one.id })
    const result = await updateTemplate({
      id: original.id,
      input: { title: 'String2173965' },
    })

    expect(result.title).toEqual('String2173965')
  })

  scenario('deletes a template', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const original = await deleteTemplate({ id: scenario.template.one.id })
    const result = await template({ id: original.id })

    expect(result).toEqual(null)
  })
})
