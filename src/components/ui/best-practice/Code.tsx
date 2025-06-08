import { RawCode, Pre, highlight } from "codehike/code";
import { tokenTransitions } from '../annotations/token-transitions';
import { wordWrap } from '../annotations/word-wrap';

// Client-side Code Component
export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "dark-plus")
  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions, wordWrap]}
      className="min-h-[40rem]"
    />
  )
} 