import 'replayer'
import { parseLink } from './parseLink'

describe('parseLink function', () => {
  it('缺失 url', async () => {
    await expect(
      async () => await parseLink({ input: { url: '' } })
    ).rejects.toThrow('url is required')
  })

  it('解析 bilibili', async () => {
    const args = {
      input: {
        url: 'https://www.bilibili.com/video/BV1P54y1G7EW?p=14',
      },
    }

    const response = await parseLink(args)

    expect(response).toEqual(
      expect.objectContaining({
        image: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        url: expect.any(String),
        oEmbed: {
          type: 'video',
          html: expect.any(String),
        },
      })
    )
  })

  it('解析网易云音乐', async () => {
    const args = {
      input: {
        url: 'https://music.163.com/#/song?id=1881982933',
      },
    }

    const response = await parseLink(args)

    expect(response).toEqual(
      expect.objectContaining({
        image: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        url: expect.any(String),
        oEmbed: {
          type: 'rich',
          html: expect.any(String),
        },
      })
    )
  })
})
