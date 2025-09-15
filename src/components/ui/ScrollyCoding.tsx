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
import { ScrollArea } from "./scroll-area";


// @ts-expect-error - Codehike types are not compatible with Zod
const Schema = Block.extend({
  steps: z.array(Block.extend({ code: CodeBlock })),
});

export function ScrollyCoding(props: unknown) {
  const { steps } = parseProps(props, Schema);

  return (
    <SelectionProvider>
      <div className="scrolly-coding-container border border-gray-200 rounded-lg bg-white lg:-mr-4">
        {/* Content and Code Layout */}
        <div className="flex">

          {/* Left Side - Steps Content */}
          <div className="basis-[45%] grid grid-cols-1 gap-y-40 border-r border-gray-200 mb-[60vh]">
            {steps.map((step, i) => {
              // Apply border radius to first element to match container's rounded-lg
              const borderRadiusClass = i === 0 ? 'rounded-tl-lg' : '';
              
              return (
                <Selectable
                  key={`${i}-${step.title ?? 'step'}`}
                  index={i}
                  selectOn={["click", "scroll"]}
                  className={`block border-l-4 border-transparent data-[selected=true]:bg-gray-50 data-[selected=true]:border-black transition-all duration-300 cursor-pointer ${borderRadiusClass}`}
                >
                <div className="p-4 border-b border-gray-100 last:border-b-0">
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                      <span className="text-xs leading-none text-center mt-[1px]">{i + 1}</span>
                    </div>
                    <span className="flex-1 text-xl leading-none font-bold text-gray-900 not-prose box-border pt-[5px]">{step.title}</span>
                  </div>

                  {/* Step content */}
                  <div className="prose prose-sm max-w-none text-gray-700 [&_a]:text-[var(--color-fd-primary)] [&_a:hover]:opacity-80 [&_a]:underline">
                    {step.children}
                  </div>
                </div>
                </Selectable>
              );
            })}
          </div>

          {/* Right Side - Code Display */}
          <div className="basis-[60%] min-w-[400px] xl:w-[500px] max-w-xl bg-gray-50 rounded-r-lg">
            <div className="top-10 xl:top-0 sticky h-[calc(100vh-2.5rem)] xl:h-[100vh] rounded-r-lg">
              <ScrollArea className="h-full rounded-r-lg">
                <Selection
                  from={steps.map((step, i) => (
                    <Code key={`${i}-${step.title ?? 'step'}`} codeblock={step.code} className="min-h-full border px-4 py-3 rounded-md rounded-l-none text-sm" />
                  ))}
                />
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </SelectionProvider>
  );
}

export async function Code({ codeblock, className }: { codeblock: RawCode, className?: string }) {
  const highlighted = await highlight(codeblock, "github-from-css")
  return (
    <Pre
      code={highlighted}
      handlers={[
        tokenTransitions, wordWrap, callout, warning, error, info, mark, collapsable, collapseTrigger, collapseContent]}
      className={className || "min-h-[40rem] border px-4 py-3 rounded-md rounded-l-none text-sm"}
    />
  )
}