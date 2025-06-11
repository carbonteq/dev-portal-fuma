// @ts-nocheck
import { z } from "zod";
import { Selection, Selectable, SelectionProvider } from "codehike/utils/selection";
import { Block, CodeBlock, parseProps } from "codehike/blocks";
import { Pre, RawCode, highlight } from "codehike/code";
import { tokenTransitions } from "./annotations/token-transitions";
import { wordWrap } from "./annotations/word-wrap";
import { callout, warning, error, info } from "./annotations/callouts";
import { mark } from "./annotations/mark";
import { collapsable, collapseTrigger, collapseContent } from "./annotations/collapsable";


// @ts-expect-error - Codehike types are not compatible with Zod
const Schema = Block.extend({
  steps: z.array(Block.extend({ code: CodeBlock })),
});

export function ScrollyCoding(props: unknown) {
  const { steps } = parseProps(props, Schema);

  return (
    <SelectionProvider>
      <div className="scrolly-coding-container border border-gray-200 rounded-lg bg-white">
        {/* Content and Code Layout */}
        <div className="flex">

          {/* Left Side - Steps Content */}
          <div className="basis-[45%] grid grid-cols-1 gap-y-24 border-r border-gray-200 mb-[60vh]">
            {steps.map((step, i) => (
              <Selectable
                key={i}
                index={i}
                selectOn={["click", "scroll"]}
                className="block border-l-4 border-transparent data-[selected=true]:bg-gray-50 data-[selected=true]:border-black transition-all duration-300 cursor-pointer"
              >
                <div className="p-4 border-b border-gray-100 last:border-b-0">
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <h4 className="flex-1 font-semibold text-gray-900 not-prose">{step.title}</h4>
                  </div>

                  {/* Step content */}
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {step.children}
                  </div>
                </div>
              </Selectable>
            ))}
          </div>

          {/* Right Side - Code Display */}
          <div className="basis-[55%] min-w-[400px] xl:w-[500px] max-w-xl bg-gray-50">
            <div className="top-10 sticky overflow-auto">
              <Selection
                from={steps.map((step, i) => (
                  <Code codeblock={step.code} />
                ))}
              />
            </div>
          </div>
        </div>
      </div>
    </SelectionProvider>
  );
}

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css")
  return (
    <Pre
      code={highlighted}
      handlers={[
        tokenTransitions, wordWrap, callout, warning, error, info, mark, collapsable, collapseTrigger, collapseContent]}
      className="min-h-[40rem] border px-4 py-3 rounded-md rounded-l-none text-sm"
    />
  )
}