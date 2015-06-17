import * as assert from 'assert';
import * as fs from 'fs';
import print from '../htmlbars-printer/print';
import { parse } from 'handlebars/dist/cjs/handlebars/compiler/base';

describe('print', function(){
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

  describe('it prints Handlebars AST to Handlebars template', function(){
    it('simple HTML', function(){
      const { actual, expected } = loadFromFixture('simple-html');
      assert.equal(actual, expected);
    });

    it('mustache', function(){
      const { actual, expected } = loadFromFixture('mustache');
      assert.equal(actual, expected);
    });
  });
});
