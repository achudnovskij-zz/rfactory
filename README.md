rfactory
=======

A tiny and synchronous mock injector plugin for requirejs

Highlights
=======
* Synchonous and fast test execution. 
  * Doesn't require reloading modules
  * Declare rfactory!moduleUnderTest in top level define/require call and inject mocks synchronously
* No configuration required. Just load rinject! before any module under test.
* Minimal and straightforward implementation - Update it for your project need.

Usage
=======

####1. Load rfactory! plugin BEFORE any module-under-test

```javascript
require(['domready!', 'rfactory', 'spec/yourSpec'], function(){
  mocha.run();  
});
```

####2. Implement your test as AMD module or wrap into require call. Reference your module-under-test using rfactory plugin
  Use [testr](https://github.com/mattfysh/testr.js/tree/master) if you don't plan to use require/define within tests
  
```javascript
define(['sinon', 'rfactory!yourModule'], function (sinon, yourModuleFactory) {
  describe('Your module')
```

####3. Create Mock dependencies

```javascript
var mockDependency = {
  doAction: sinon.stub()
};
```

####4. Get 'instance' of your module with replaced dependencies

```javascript
var moduleUnderTest = yourModuleFactory({
  'path/to/dependency' : mockDependency
});
```

####5. Test!

```javascript
moduleUnderTest.doOperation();    
expect(mockDependency.doAction.calledOnce).to.be.equal(true);
```


How it works
=======
Use the same basic idea as [testr](https://github.com/mattfysh/testr.js/tree/master):

1. Patch 'define'. When any module is loaded it registers: 
  * Module name
  * Module factory
  * Original dependencies

2. When module with mocked dependencies is requested:
  * Get module factory with original dependencies from internal registry
  * Builds factory arguments array using provided dependency overrides and original dependencies when no override provided
  * Calls module factory and returns module 'instance'

**And nothing more!**
You can easily adjust it to your specific project.
Because the implementation is bare minimum it's unlikely to conflict with your specifics.
