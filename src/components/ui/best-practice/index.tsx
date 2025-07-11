import { parseProps, Block, CodeBlock } from 'codehike/blocks';
import { Fallback } from './Fallback';
import { SelectionProvider } from './Selection';
import { Selectable } from './Selectable';
import { Header } from './Header';
import { CodeDisplay } from './CodeDisplay';
import { Code } from '../animated-code/Code';

// Simplified schema to avoid deep type instantiation
const BestPracticeSchema = Block.extend({
  do: Block.extend({
    example: CodeBlock,
  }),
  dont: Block.extend({
    example: CodeBlock,
  }),
});

export async function BestPractice(props: unknown) {
  // Parse props using CodeHike schema
  const { title, do: doExample, dont: dontExample } = parseProps(props, BestPracticeSchema);
  
  // Early return for missing data
  if (!doExample && !dontExample) {
    return <Fallback />;
  }

  // Pre-render code blocks on server side using Promise.all for better performance
  // Use rounded-b-md to remove top rounded corners since code display is below the explanation sections
  const [doCodeRendered, dontCodeRendered] = await Promise.all([
    doExample?.example ? Code({ 
      codeblock: doExample.example, 
      className: "min-h-[10rem] border px-3 py-3 rounded-b-md text-sm" 
    }) : null,
    dontExample?.example ? Code({ 
      codeblock: dontExample.example, 
      className: "min-h-[10rem] border px-3 py-3 rounded-b-md text-sm" 
    }) : null
  ]);

  return (
    <SelectionProvider defaultSelected="dont">
      <div className="best-practice-container border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Title if provided */}
        

        {/* Row 1: Side-by-side explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200 px-1">
          {/* Don't Practice Column */}
          {dontExample && (
            <Selectable type="dont" className={'rounded-tl-lg'}>
              <Header type="dont" />
              <div className="prose prose-sm max-w-none">
                {dontExample.children}
              </div>
            </Selectable>
          )}

          {/* Do Practice Column */}
          {doExample && (
            <Selectable type="do" className={'rounded-tr-lg'}>
              <Header type="do" />
              <div className="prose prose-sm max-w-none">
                {doExample.children}
              </div>
            </Selectable>
          )}
        </div>

        {/* Row 2: Code example */}
        <CodeDisplay 
          doCodeRendered={doCodeRendered}
          dontCodeRendered={dontCodeRendered}
        />
      </div>
    </SelectionProvider>
  );
} 