import { getSensitiveKeywords } from './msgSecCheck'

describe('msgSecCheck', () => {
  describe('getSensitiveKeywords', () => {
    it('filter out null keywords', () => {
      const details = [
        {
          strategy: 'content_model',
          errcode: 0,
          suggest: 'risky',
          label: 20006,
          prob: 90,
        },

        {
          strategy: 'keyword',
          errcode: 0,
          suggest: 'risky',
          label: 20006,
          level: 90,
          keyword: '命中的关键词1',
        },
      ]

      expect(getSensitiveKeywords(details)).toEqual(['命中的关键词1'])
    })

    it('filter out passed keywords', () => {
      const details = [
        {
          strategy: 'keyword',
          errcode: 0,
          suggest: 'pass',
          label: 20006,
          level: 20,
          keyword: '命中的关键词1',
        },
        {
          strategy: 'keyword',
          errcode: 0,
          suggest: 'risky',
          label: 20006,
          level: 90,
          keyword: '命中的关键词2',
        },
      ]

      expect(getSensitiveKeywords(details)).toEqual(['命中的关键词2'])
    })

    it('unique keywords', () => {
      const details = [
        {
          strategy: 'keyword',
          errcode: 0,
          suggest: 'risky',
          label: 20006,
          level: 20,
          keyword: '命中的关键词1',
        },
        {
          strategy: 'keyword',
          errcode: 0,
          suggest: 'risky',
          label: 20006,
          level: 90,
          keyword: '命中的关键词1',
        },
      ]

      expect(getSensitiveKeywords(details)).toEqual(['命中的关键词1'])
    })
  })
})
