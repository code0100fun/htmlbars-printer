import * as assert from 'assert';
import * as fs from 'fs';
import Printer from '../htmlbars-printer/printer';
import { parse } from 'handlebars/dist/cjs/handlebars/compiler/base';

describe('Printer', function(){
  var baseDir = './tests/fixtures';

  describe('it prints Handlebars AST to Handlebars template', function(){
    it('simple HTML', function(){
      var expected = fs.readFileSync(baseDir + '/simple-html.hbs').toString('utf8');
      var inputAST = parse(expected);
      var printer = new Printer();
      var actual = printer.print(inputAST);
      assert.equal(actual, expected);
    });
  });
});
