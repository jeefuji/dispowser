# Dispowser

## What is that ?
Dispowser is a tool which facilitate resource disposing management. Easy to use, aimed to support more and more use cases to automate disposing.

## Current framework supported
* AngularJS
* RxJS

## Examples
### Manual disposing
```javascript
  function WebsocketWrapper() {
    this.ws = new Websocket("ws://localhost:4573");
    this.ws.onclose = () => console.log("closed");
    
    this.dispose = () => {
      this.ws.close();
    };
  }

  let disposer = Dispowser.createDisposer();
  let disposableObject = new WebsocketWrapper();
  
  disposer.register = disposableObject;
  
  /*** [...] ***/
  
  disposer.dispose();
  // Console: "closed"
  
```

### Manual disposing with RxJS
```javascript
  let subject = new Rx.Subject();

  let disposer = Dispowser.createDisposer();
  let disposableObject = subject.subscribe((event) => console.log(event));
  
  disposer.register = disposableObject;
  
  subject.next("hello!");
  // Console : hello!
  
  /*** [...] ***/
  
  disposer.dispose();
  
  subject.next("hello again ?!");
  // Console : Nothing will happen
  
```

### Automatic disposing with AngularJs
```javascript

  function WebsocketWrapper() {
    this.ws = new Websocket("ws://localhost:4573"); // rxjs subject
    this.ws.onclose = () => console.log("closed");
    
    this.dispose = () => {
      this.ws.close();
    };
  }

  angular.module("module").controller("controller", ["$scope", function($scope) {
    let disposer = Dispowser.createDisposer($scope);
    let disposableObject = new WebsocketWrapper();
    
    disposer.register = disposableObject;
  }]);
  
  // If controller is destroyed
  // Console : closed

  
```
