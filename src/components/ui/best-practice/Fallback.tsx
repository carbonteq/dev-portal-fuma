export function Fallback() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 text-gray-600">
      <p>No practices available. Make sure to use !good and !bad decorators in your markdown.</p>
      <div className="mt-2 text-sm text-gray-500">
        <p>Expected syntax:</p>
        <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
{`<BestPractice title="Variable Declarations">

## !good const-benefits
Using \`const\` provides better scope...

\`\`\`js !example
const userName = "john";
\`\`\`

## !bad var-problems  
Using \`var\` allows redeclaration...

\`\`\`js !example
var userName = "john";
var userName = "jane";
\`\`\`

</BestPractice>`}
        </pre>
      </div>
    </div>
  );
} 