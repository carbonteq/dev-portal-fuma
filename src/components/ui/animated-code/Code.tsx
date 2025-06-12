import { RawCode, Pre, highlight } from "codehike/code";
import { tokenTransitions } from '../annotations/token-transitions';
import { wordWrap } from '../annotations/word-wrap';
    
export async function Code({ codeblock, className }: { codeblock: RawCode, className?: string }) {
  const highlighted = await highlight(codeblock, "github-from-css")
  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions, wordWrap]}
      className={className || "min-h-[10rem] border px-3 py-3 rounded-md text-sm"}
    />
  )
} 