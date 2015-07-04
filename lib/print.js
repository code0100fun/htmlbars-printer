import * as Visitor from 'handlebars/dist/cjs/handlebars/compiler/visitor';

export default function(ast) {
  return new PrintVisitor().accept(ast);
}

export function PrintVisitor() {}

PrintVisitor.prototype = new Visitor();

const compact = function(array) {
  const newArray = [];
  array.forEach(function(a) {
    if(typeof(a) !== 'undefined' && a !== null && a !== '') {
      newArray.push(a);
    }
  });
  return newArray;
};

const compactJoin = function(array, delimiter) {
  return compact(array).join(delimiter || '');
};

PrintVisitor.prototype.blockParams = function(block) {
  const params = block.program.blockParams;
  if(params) {
    return ` as |${params.join(',')}|`;
  }
};

PrintVisitor.prototype.openBlock = function(block) {
  return ['{{#', this.pathParams(block), this.blockParams(block), '}}'].join('');
};

PrintVisitor.prototype.closeBlock = function(block) {
  return ['{{/', this.accept(block.path), '}}'].join('');
};

PrintVisitor.prototype.pathParams = function(node) {
  const name = this.accept(node.name);
  const path = this.accept(node.path);
  const params = this.acceptEach(node.params).join(' ');
  const hash = this.accept(node.hash);
  return compactJoin([name, path, params, hash], ' ');
};

PrintVisitor.prototype.acceptEach = function(nodes) {
  var output = [];
  nodes.forEach((node) => {
    output.push(this.accept(node));
  });
  return output;
};

PrintVisitor.prototype.Program = function(program) {
  const chainBlock = program.chained && program.body[0];
  if(chainBlock) {
    chainBlock.chained = true;
  }
  return this.acceptEach(program.body).join('');
};

PrintVisitor.prototype.MustacheStatement = function(mustache) {
  return compactJoin(['{{', this.pathParams(mustache), '}}']);
};

PrintVisitor.prototype.BlockStatement = function(block) {
  var lines = [];

  if (block.chained) {
    lines.push(['{{else ', this.pathParams(block), '}}'].join(''));
  } else {
    lines.push(this.openBlock(block));
  }

  lines.push(this.accept(block.program));

  if (block.inverse) {
    if (!block.inverse.chained) {
      lines.push('{{else}}');
    }
    lines.push(this.accept(block.inverse));
  }

  if (!block.chained) {
    lines.push(this.closeBlock(block));
  }

  return lines.join('');
};

PrintVisitor.prototype.PartialStatement = function(partial) {
  return compactJoin(['{{> ', this.pathParams(partial), '}}']);
};

PrintVisitor.prototype.ContentStatement = function(content) {
  return content.original;
};

PrintVisitor.prototype.CommentStatement = function(comment) {
  return compactJoin(['{{!', comment.value, '}}']);
};

PrintVisitor.prototype.SubExpression = function(sexpr) {
  return '(' + this.accept(sexpr.path) + ')';
};

PrintVisitor.prototype.PathExpression = function(path) {
  return path.parts.join('.');
};

PrintVisitor.prototype.StringLiteral = function(string) {
  return '"' + string.value + '"';
};

PrintVisitor.prototype.NumberLiteral = function(number) {
  return number.value;
};

PrintVisitor.prototype.BooleanLiteral = function(bool) {
  return bool.value;
};

PrintVisitor.prototype.UndefinedLiteral = function() {
  return 'undefined';
};

PrintVisitor.prototype.NullLiteral = function() {
  return 'null';
};

PrintVisitor.prototype.Hash = function(hash) {
  return this.acceptEach(hash.pairs).join(' ');
};

PrintVisitor.prototype.HashPair = function(pair) {
  return pair.key + '=' + this.accept(pair.value);
};
