const build = function(ast) {
  const output = [];
  switch(ast.type) {
    case 'ContentStatement':
      output.push(ast.value);
    break;
    case 'MustacheStatement':
      output.push(`{{ ${ast.path.parts.join(' ')} }}`);
    break;
  }
  if(ast.body) {
    ast.body.forEach(function(node) {
      output.push(build(node));
    });
  }
  return output.join('');
}

export default function(ast) {
  return build(ast);
}
