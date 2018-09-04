# State

* [Structure](#structure)
  * [Root](#root)
  * [Single store](#single-store)


## Structure

The state is organized by data type into *"stores"*, each dealing with all logic pertaining to that particular sub-state.

### Root
Stores are combined in root folder files:
##### Store.js
Combines reducers into redux store and applies middleware
- [redux-thunk](https://github.com/reduxjs/redux-thunk#motivation)
- [redux-logger](https://github.com/evgenyrodionov/redux-logger)

Also intializes [subscribers](../subscribers/README.md) - connecting new redux state with old code
##### Select.js
Combines selectors for easy and readable access under the same keys as the corresponding data in redux store.

Usage in container component:
```js
import Select from '../../../../state/Select';

const mapStateToProps = state => {
  return {
    maps: Select.maps.getMaps(state),
    period: Select.periods.getActivePeriod(state),
    scope: Select.scopes.getActiveScopeData(state),
    layers: Select.wmsLayers.getLayersWithAoiPeriods(state)
  }
};
```
##### Action.js
Combines action creators, again under the same keys.

Usage in container component:
```js
import Action from '../../../../state/Action';

const mapDispatchToProps = dispatch => {
  return {
    setActiveMap: (key) => {
      dispatch(Action.maps.setActive(key));
    },
    selectLayerPeriod: (layerKey, period, mapKey) => {
      dispatch(Action.maps.selectLayerPeriod(layerKey, period, mapKey));
    },
    setActiveScope: (key) => {
      dispatch(Action.scopes.setActive(key));
    },
  }
};
```

### Single store

##### reducers.js

##### selectors.js

##### actions.js
