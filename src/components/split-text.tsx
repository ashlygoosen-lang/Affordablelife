import { Fragment } from 'react'

/**
 * Renders a heading's words in clipped spans so CSS can raise them one by one.
 * Server-rendered, so the full text is in the HTML and readable without JavaScript.
 */
export function SplitText({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span className="split">
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w" style={{ ['--w' as string]: i }}>
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
