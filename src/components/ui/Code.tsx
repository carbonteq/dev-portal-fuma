import { Pre, RawCode, highlight } from "codehike/code"
import { callout } from "./annotations/callouts"

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css")
  return (
    <Pre code={highlighted} handlers={[callout]} className="border px-3 py-3 rounded-md text-sm" />
  )
}