export default class Printer {
  print(ast){
    let output = ast.body.map(function(node){
      return node.value;
    });
    return output;
  }
}
