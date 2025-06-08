import { RawCode, Pre, highlight } from "codehike/code";
import { tokenTransitions } from '../annotations/token-transitions';
import { wordWrap } from '../annotations/word-wrap';
    
export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css")
  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions, wordWrap]}
      className="min-h-[10rem] border px-3 py-3 rounded-md text-sm"
    />
  )
} 