# State

Panther uses redux store to store data. Internally, the state is organized by data type into *"stores"*, each dealing with all logic pertaining to that particular sub-state.

* [Working with state](#working-with-state)
* [Structure](#structure)
  * [State & reducers](#state-&-reducers)
  * [Selectors](#selectors)
  * [Actions](#actions)
* [Stores](#stores)
  * [Application data](#application-data)
  * [Metadata](#metadata)


## Working with state

The state is accessed using selectors. Selectors are defined in each store and exposed in **Select.js** under the same keys under which the data is stored in state.

The state is modified using action creators. Action creators are  defined in each store and exposed in **Action.js**, again under the same keys under which the data is stored in state.

Usage in container component:
```js
import Select from '../../../../state/Select';
import Action from '../../../../state/Action';

const mapStateToProps = state => {
  return {
    maps: Select.maps.getMaps(state),
    period: Select.periods.getActivePeriod(state),
    scope: Select.scopes.getActiveScopeData(state),
    layers: Select.wmsLayers.getLayersWithAoiPeriods(state)
  }
};

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

## Structure

### State & reducers

In Store.js, individiual stores are combined into redux store, using the following middleware:
- [redux-thunk](https://github.com/reduxjs/redux-thunk#motivation)
- [redux-logger](https://github.com/evgenyrodionov/redux-logger)

Store.js also intializes [subscribers](../subscribers/README.md) - connecting new redux state with old code

#### Initial state for metadata

```js
const INITIAL_STATE = {
  activeKey: null,
  activeKeys: null, //Array
  data: null, //Main data collection
  editedData: null, //Collection with changes in data or new objects
  loading: false,
  loadingKeys: null //Array of keys currently being loaded
};
```

If metadata store contains more independent data types it should be split into nested stores.

#### Reducers

Common reducers are in [_common/reducers](./_common/reducers).

Reducers are just atomic operations.

### Selectors
Data in stores is accessed by selectors only.

Reselect and re-reselect are used for memoization.

### Actions


## Stores

### Application data

### Metadata


