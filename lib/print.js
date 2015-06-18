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
  return output.join('');
}

const build = function(ast) {
  if(!ast) {
    return '';
  }
  const output = [];
  switch(ast.type) {
    case 'ContentStatement':
      output.push(ast.value);
    break;
    case 'MustacheStatement': {
      const params = buildEach(ast.params);
      const path = build(ast.path);
      output.push(compact(['{{', path, params, '}}']).join(' '));
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
  }
  if(ast.body) {
    output.push(buildEach(ast.body));
  }
  return output.join('');
}

export default function(ast) {
  return build(ast);
}
