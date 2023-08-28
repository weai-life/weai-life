import { signatureUrl, previewdocUrl } from './signedUrl'

const path = 's/document.docx'

describe('signedUrl', () => {
  it('signatureUrl', () => {
    const url = signatureUrl(path)
    expect(url).toContain('OSSAccessKeyId')
    expect(url).toContain('Expires')
    expect(url).toContain('Signature')
  })

  it('previewdocUrl', () => {
    const url = previewdocUrl(path)
    expect(url).toContain('OSSAccessKeyId')
    expect(url).toContain('Expires')
    expect(url).toContain('Signature')
    expect(url).toContain('x-oss-process=imm%2Fpreviewdoc')
  })
})
