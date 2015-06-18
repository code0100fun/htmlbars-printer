const compact = function(array) {
  const newArray = [];
  array.forEach(function(a) {
    if(typeof(a) !== 'undefined' && a !== null && a !== '') {
      newArray.push(a);
    }
  });
  return newArray;
}

const buildEach = function(asts) {
  const output = [];
  asts.forEach(function(node) {
    output.push(build(node));
  });
  return output;
}

const build = function(ast) {
  if(!ast) {
    return '';
  }
  const output = [];
  switch(ast.type) {
    case 'Program': {
      const body = buildEach(ast.body).join('');
      output.push(body);
    }
    break;
    case 'ContentStatement':
      output.push(ast.value);
    break;
    case 'MustacheStatement': {
      const params = buildEach(ast.params).join(' ');
      const path = build(ast.path);
      output.push(compact(['{{', compact([path, params]).join(' '), '}}']).join(''));
    }
    break;
    case 'PathExpression':
      output.push(ast.parts.join(' '));
    break;
    case 'SubExpression': {
      const path = build(ast.path);
      output.push(`(${path})`);
    }
    break;
    case 'BooleanLiteral':
      output.push(ast.value ? 'true' : false);
    break;
    case 'BlockStatement': {
      const path = build(ast.path);
      const params = buildEach(ast.params).join(' ');
      const open = ['{{#', compact([path, params]).join(' '), '}}', '\n'];
      const program = build(ast.program);
      const close = ['{{/', path, '}}'];
      const lines = [
        open.join(''), program, close.join(''), '\n'
      ];
      output.push(lines.join(''));
    }
    break;
    case 'PartialStatement': {
      const params = buildEach(ast.params).join(' ');
      const path = build(ast.name);
      output.push(compact(['{{> ', compact([path, params]).join(' '), '}}']).join(''));
    }
    break;
    case 'CommentStatement': {
      output.push(compact(['{{!', ast.value, '}}']).join(''));
    }
    break;
    case 'StringLiteral': {
      output.push(`"${ast.value}"`);
    }
    break;
  }
  return output.join('');
}

export default function(ast) {
  return build(ast);
}
