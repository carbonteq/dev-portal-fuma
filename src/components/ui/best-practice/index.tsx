import { parseProps, Block, CodeBlock } from 'codehike/blocks';
import { Fallback } from './Fallback';
import { SelectionProvider } from './Selection';
import { Selectable } from './Selectable';
import { Header } from './Header';
import { CodeDisplay } from './CodeDisplay';
import { Code } from './Code';

// Simplified schema to avoid deep type instantiation
const BestPracticeSchema = Block.extend({
  good: Block.extend({
    example: CodeBlock,
  }),
  bad: Block.extend({
    example: CodeBlock,
  }),
});

export async function BestPractice(props: unknown) {
  // Parse props using CodeHike schema
  const { title, good, bad } = parseProps(props, BestPracticeSchema);
  
  // Early return for missing data
  if (!good && !bad) {
    return <Fallback />;
  }

  // Pre-render code blocks on server side using Promise.all for better performance
  const [goodCodeRendered, badCodeRendered] = await Promise.all([
    good?.example ? Code({ codeblock: good.example }) : null,
    bad?.example ? Code({ codeblock: bad.example }) : null
  ]);

  return (
    <SelectionProvider defaultSelected="bad">
      <div className="best-practice-container border border-gray-200 rounded-lg overflow-hidden">
        {/* Title if provided */}
        {title && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
        )}

        {/* Row 1: Side-by-side explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200">
          {/* Bad Practice Column */}
          {bad && (
            <Selectable type="bad">
              <Header type="bad" />
              <div className="prose prose-sm max-w-none text-gray-700">
                {bad.children}
              </div>
            </Selectable>
          )}

          {/* Good Practice Column */}
          {good && (
            <Selectable type="good" className={!bad ? 'border-r-0' : ''}>
              <Header type="good" />
              <div className="prose prose-sm max-w-none text-gray-700">
                {good.children}
              </div>
            </Selectable>
          )}
        </div>

        {/* Row 2: Code example */}
        <CodeDisplay 
          goodCodeRendered={goodCodeRendered}
          badCodeRendered={badCodeRendered}
        />
      </div>
    </SelectionProvider>
  );
} 