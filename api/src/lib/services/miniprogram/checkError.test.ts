import { checkError } from './checkError'

describe('checkError', () => {
  it('when errcode == 0', () => {
    const res = checkError(0, '')('openid')
    expect(res).toEqual('openid')
  })

  it('when errcode != 0', () => {
    const fn = () => checkError(1, 'errmsg')('openid')
    expect(fn).toThrowErrorMatchingInlineSnapshot(`"errmsg"`)
  })
})
