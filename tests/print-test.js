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
      const { actual, expected } = loadFromString('{{name (foo)}}');
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

    it('comment statement', function(){
      const { actual, expected } = loadFromString('{{! Some Comment }}');
      assert.equal(actual, expected);
    });

    it('string literal', function(){
      const { actual, expected } = loadFromString('{{link-to "foo"}}');
      assert.equal(actual, expected);
    });

    it('boolean literal', function(){
      const { actual, expected } = loadFromString('{{false}}');
      assert.equal(actual, expected);
    });

    it('number literal', function(){
      const { actual, expected } = loadFromString('{{123}}');
      assert.equal(actual, expected);
    });

    it('undefined literal', function(){
      const { actual, expected } = loadFromString('{{undefined}}');
      assert.equal(actual, expected);
    });

    it('null literal', function(){
      const { actual, expected } = loadFromString('{{null}}');
      assert.equal(actual, expected);
    });

    it('hash', function(){
      const { actual, expected } = loadFromString('{{foo "hash" bar=(bax) baz="qux"}}');
      assert.equal(actual, expected);
    });

    it('nested path', function(){
      const { actual, expected } = loadFromString('{{foo.bar.baz}}');
      assert.equal(actual, expected);
    });

    it('if/else statement', function(){
      const { actual, expected } = loadFromFixture('if-else');
      assert.equal(actual, expected);
    });

    it('if/else nested if statement', function(){
      const { actual, expected } = loadFromFixture('if-else-nested-if');
      assert.equal(actual, expected);
    });

    it('each as', function(){
      const { actual, expected } = loadFromFixture('each-as');
      assert.equal(actual, expected);
    });

    it('complex template', function(){
      const { actual, expected } = loadFromFixture('complex-template');
      assert.equal(actual, expected);
    });

  });
});
