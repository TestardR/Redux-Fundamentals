var defaultAppleState = 0;

function apple(state = defaultAppleState, action) {
  if (action.type === 'INCREMENT') {
    return state + 1;
  }

  return state;
}

var store = createStore(apple);

var unsub = store.subscribe(function() {
  console.log('STATE UPDATED', store.getState());
});

console.log('state:before', store.getState());
store.dispatch({ type: 'INCREMENT' });
console.log('state:after', store.getState());

unsub();
store.dispatch({ type: 'INCREMENT' });

function createStore(reducer) {
  var state;
  var subscriptions = [];
  var obj = {
    getState: function() {
      return state;
    },
    dispatch: function(action) {
      // call the reducer
      state = reducer(state, action);
      // call the subscribed fns
      subscriptions.forEach(function(fn) {
        fn();
      });
    },
    subscribe: function(fn) {
      // call functions when dispatch is called
      subscritions.push(fn);
      // returns an unsubscribe function
      return function unsubscribe() {
        // find listener fn in sub array and remove it
        var index = subscriptions.indexOf(fn);
        subscriptions.splice(index, 1);
      };
    }
  };

  // we return an object to set our undefined state, then it forces the reducer to use the default state and assign it to the state variable
  obj.dispatch({ type: 'REDUX_INIT' });
  return obj;
}
