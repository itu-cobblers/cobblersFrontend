import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it, expect } from 'vitest'
import { renderBoldText } from './renderBoldText'

function renderToHtml(text: string): string {
  return renderToStaticMarkup(createElement('div', null, ...renderBoldText(text)))
}

describe('renderBoldText', () => {
  it('passes plain text through unchanged', () => {
    expect(renderToHtml('no markers here')).toBe('<div>no markers here</div>')
  })

  it('renders a single bold span', () => {
    expect(renderToHtml('this is **important**')).toBe('<div>this is <strong>important</strong></div>')
  })

  it('renders multiple bold spans', () => {
    expect(renderToHtml('**one** and **two**')).toBe('<div><strong>one</strong> and <strong>two</strong></div>')
  })

  it('leaves an unmatched odd marker as literal text', () => {
    expect(renderToHtml('this **is broken')).toBe('<div>this **is broken</div>')
  })
})
