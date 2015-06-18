import * as assert from 'assert';
import * as fs from 'fs';
import print from '../htmlbars-printer/print';
import { parse } from 'handlebars/dist/cjs/handlebars/compiler/base';

describe('print(ast)', function(){
  var baseDir = './tests/fixtures';

  function loadFromFixture(name) {
    const template = fs.readFileSync(`${baseDir}/${name}.hbs`).toString('utf8');
    return loadFromString(template);
  }

  function loadFromString(template) {
    const ast = parse(template);
    const actual = print(ast);
    return { actual, expected: template };
  }

  describe('prints Handlebars AST to Handlebars template', function(){
    it('simple HTML', function(){
      const { actual, expected } = loadFromString('<h1>Test</h1>');
      assert.equal(actual, expected);
    });

    it('mustache', function(){
      const { actual, expected } = loadFromString('{{name}}');
      assert.equal(actual, expected);
    });

    it('indented HTML', function(){
      const { actual, expected } = loadFromFixture('indented-html');
      assert.equal(actual, expected);
    });

    it('indented with mustaches', function(){
      const { actual, expected } = loadFromFixture('indented-with-mustaches');
      assert.equal(actual, expected);
    });

    it('subexpressions', function(){
      const { actual, expected } = loadFromString('{{name (false)}}');
      assert.equal(actual, expected);
    });

    it('block statement', function(){
      const { actual, expected } = loadFromFixture('old-each');
      assert.equal(actual, expected);
    });

    it('partial statement', function(){
      const { actual, expected } = loadFromString('{{> foo}}');
      assert.equal(actual, expected);
    });
  });
});
