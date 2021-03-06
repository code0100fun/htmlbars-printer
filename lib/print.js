const compact = function(array) {
  const newArray = [];
  array.forEach(function(a) {
    if(typeof(a) !== 'undefined' && a !== null && a !== '') {
      newArray.push(a);
    }
  });
  return newArray;
};

const buildEach = function(asts) {
  const output = [];
  asts.forEach(function(node) {
    output.push(build(node));
  });
  return output;
};

const pathParams = function(ast) {
  const name = build(ast.name);
  const path = build(ast.path);
  const params = buildEach(ast.params).join(' ');
  const hash = build(ast.hash);
  return compactJoin([name, path, params, hash], ' ');
};

const compactJoin = function(array, delimiter) {
  return compact(array).join(delimiter || '');
};

const blockParams = function(block) {
  const params = block.program.blockParams;
  if(params) {
    return ` as |${params.join(',')}|`;
  }
}

const openBlock = function(block) {
  return ['{{#', pathParams(block), blockParams(block), '}}'].join('');
}

const closeBlock = function(block) {
  return ['{{/', build(block.path), '}}'].join('');
}

const build = function(ast) {
  if(!ast) {
    return '';
  }
  const output = [];
  switch(ast.type) {
    case 'Program': {
      const chainBlock = ast.chained && ast.body[0];
      if(chainBlock) {
        chainBlock.chained = true;
      }
      const body = buildEach(ast.body).join('');
      output.push(body);
    }
    break;
    case 'ContentStatement':
      output.push(ast.original);
    break;
    case 'MustacheStatement': {
      output.push(compactJoin(['{{', pathParams(ast), '}}']));
    }
    break;
    case 'PathExpression':
      output.push(ast.parts.join('.'));
    break;
    case 'SubExpression': {
      output.push(`(${build(ast.path)})`);
    }
    break;
    case 'BooleanLiteral':
      output.push(ast.value ? 'true' : false);
    break;
    case 'BlockStatement': {
      const lines = [];

      if(ast.chained){
        lines.push(['{{else ', pathParams(ast), '}}'].join(''));
      }else{
        lines.push(openBlock(ast));
      }

      lines.push(build(ast.program));

      if(ast.inverse) {
        if(!ast.inverse.chained){
          lines.push('{{else}}');
        }
        lines.push(build(ast.inverse));
      }

      if(!ast.chained){
        lines.push(closeBlock(ast));
      }

      output.push(lines.join(''));
    }
    break;
    case 'PartialStatement': {
      output.push(compactJoin(['{{> ', pathParams(ast), '}}']));
    }
    break;
    case 'CommentStatement': {
      output.push(compactJoin(['{{!', ast.value, '}}']));
    }
    break;
    case 'StringLiteral': {
      output.push(`"${ast.value}"`);
    }
    break;
    case 'NumberLiteral': {
      output.push(ast.value);
    }
    break;
    case 'UndefinedLiteral': {
      output.push('undefined');
    }
    break;
    case 'NullLiteral': {
      output.push('null');
    }
    break;
    case 'Hash': {
      output.push(ast.pairs.map(function(pair) {
        return build(pair);
      }).join(' '));
    }
    break;
    case 'HashPair': {
      output.push(`${ast.key}=${build(ast.value)}`);
    }
    break;
  }
  return output.join('');
};

export default build;
