
function test_prop_acsr(){
  this.prop_a = 'This is prop_a!'
  alert(this.prop_a == this['prop_a']);
}
