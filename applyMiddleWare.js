// logger middleware

function logger(store) {
  var getState = store.getState;

  return function(next) {
    return function(action) {
      console.log('will dispatch', action);

      // Call the next dispatch method in the middleware chain.
      var returnValue = next(action);
      console.log('state after dispatch', getState());

      // This will likely be the action itself, unless a middleware further in chain changed it.
      return returnValue;
    };
  };
}

var defaultAppleState = 0;

function apple(state = defaultAppleState, action) {
  if (action.type === 'INCREMENT') {
    return state + 1;
  }

  return state;
}

var defaultOrangeState = 10;

function orange(state = defaultOrangeState, action) {
  if (action.type === 'EAT_ORANGE') {
    return state - 1;
  }

  return state;
}

var rootReducer = combineReducers({
  apple: apple,
  orange: orange
});

var store = createStore(rootReducer, applyMiddleware(logger));

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

function combineReducers(stateTree) {
  var keys = Object.keys(stateTree);
  return function rootReducer(state = {}, action) {
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var reducer = stateTree[key];
      var subState = state[key];

      state[key] = reducer(subState, action);
    }
    return state;
  };
}
