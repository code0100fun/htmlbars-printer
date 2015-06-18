# HTMLBars Printer
Print Handlebars/HTMLBars AST back to template form with normalized indentation.

## API (WIP)

```javascript
import print from 'htmlbars-printer';
import { parse } from 'handlebars/dist/cjs/handlebars/compiler/base';

const ast = parse('{{link-to "Account" "account" class="action"}}');
const template = print(ast);
// template is {{link-to "Account" "account" class="action"}}
```

## Development

```
npm install
```

## Testing

```
npm test
```
