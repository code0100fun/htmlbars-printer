import * as assert from 'assert';
import * as fs from 'fs';
import print from '../htmlbars-printer/print';
import { parse } from 'handlebars/dist/cjs/handlebars/compiler/base';

describe('print', function(){
  var baseDir = './tests/fixtures';

  function parseFixture(name) {
    const expected = fs.readFileSync(`${baseDir}/${name}.hbs`).toString('utf8');
    const ast = parse(expected);
    const actual = print(ast);
    return { actual, expected };
  }

  describe('it prints Handlebars AST to Handlebars template', function(){
    it('simple HTML', function(){
      const { actual, expected } = parseFixture('simple-html');
      assert.equal(actual, expected);
    });

    it('mustache', function(){
      const { actual, expected } = parseFixture('mustache');
      assert.equal(actual, expected);
    });
  });
});
