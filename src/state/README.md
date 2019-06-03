# State

Panther uses redux store to store data. Internally, the state is organized by data type into *"stores"*, each dealing with all logic pertaining to that particular sub-state.

* [Working with state](#working-with-state)
* [Structure](#structure)
  * [State & reducers](#state-&-reducers)
    * [Basic state structure for data types](#basic-state-structure-for-data-types)
    * [Reducers](#reducers)
  * [Selectors](#selectors)
  * [Actions](#actions)
* [Stores](#stores)
  * [Application state](#application-state)
  * [Standard metadata types](#standard-metadata-types)
  * [Data & relational stores](#data-&-relational-stores)
  * [Special data types](#special-data-types)
  * [Other](#other)
  * [Deprecated](#deprecated)


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

#### Basic state structure for data types

If a store deals with more independent data types, it should be split into nested stores.

```js
STATE = {
  activeKey: 1548,
  activeKeys: null,
  byKey: {
    1548: {
      key: 1548,
      data: {
        name: 'Current name on server',
        property: 'value',
        boolean: true
      },
      fetchedOn: '2018-09-17T13:45:03Z'
    }
  },
  count: 59,
  editedByKey: {
    1548: {
      key: 1548,
      data: {
        name: 'Unsaved new name'
      }
    },
    'a7e0a6d6-3dd5-a6ff-23ca-ef00e5843e22': {
      key: "a7e0a6d6-3dd5-a6ff-23ca-ef00e5843e22",
      data: {
        name: 'Unsaved locally created object',
        property: 'something',
        boolean: false
      }
    }
  },
  lastChangedOn: '2018-09-17T13:45:03Z',
  loading: false,
  loadingKeys: [2563, 2564, 2568, 2980, 6354, 6355, 6358, 6399, 6667, 7008],
  indexes: [
    {
      order: [['date','descending'], ['name', 'ascending']], // object?
      filter: {
        scope: 1,
        date: {
            start: '2018-09-17T13:45:03Z',
            end: '2018-09-17T13:45:04Z'
        },
        continent: {
            in: ['Asia', 'Africa']
        },
        country: {
            search: 'Gh'
        }
      },
      index: {1: 2588, 2: 3214, 3: 4587, 4: 1548, 5: 5689, 6: 7412, 7: 7451, 8: 4589, 9: 7411, 10: 1564, 16: 9874, 17: 7415, 18: 8989, 19: 1532, 20: 2589},
      count: 59
    }
  ]
};
```

##### activeKey / activeKeys

If an object is selected application-wide, its key is saved to *activeKey*. If more objects **can** be selected (but not neccessarily are), *activeKeys* is used.

##### byKey

The main data store

##### count

Total number of existing objects (given by server).

##### editedByKey

Unsaved changes (objects with key present in *byKey*) and newly created objects.

##### lastChangedOn

Timestamp of last change of this data type on server. It is used to invalidate indexes.

##### loading / loadingKeys

Indicators of running fetching process.
<!-- todo should we use standard 'isFetching'?  -->

##### indexes

```js
indexes: [
  {
    order: [['date','descending'], ['name', 'ascending']],
    filter: null,
    index: {
      1: 2588, 
      2: 3214, 
      3: 4587,
      4: 1548, 
      5: 5689, 
      6: 7412, 
      7: 7451, 
      8: 4589, 
      9: 7411, 
      10: 1564, 
      16: 9874, 
      17: 7415, 
      18: 8989, 
      19: 1532, 
      20: 2589
    }
    // = index: [undefined, 2588, 3214, 4587, 1548, 5689, 7412, 7451, 4589, 7411, 1564, undefined, undefined, undefined, undefined, undefined, 9874, 7415, 8989, 1532, 2589]
  }
]
```

Indexes for sorting data.
The ordering is done on server, the local index contains keys for positions that were already loaded. Can be seen as object with position as key and object key as value.

In the example above, pages with 5 objects each were used, and the first, second and fourth page were loaded from server.
<!-- todo placing local objects in order - in selectors? -->
<!-- todo do we need more complicated sorting functions? -->

#### Reducers

Common reducers are in [_common/reducers.js](./_common/reducers.js).

Reducers are just atomic operations.

### Selectors
Data in stores is accessed by selectors only.
- For accessing part of the store as is, simple arrow functions are used.
- For most simple transforms, we use [reselect] selectors (single last call memoization).
- For selectors routinely called with alternating parameters, where there is need for memoization based on the alternating values, [re-reselect] selectors are used.

Common selectors are in [_common/selectors.js](./_common/selectors.js).

### Actions

Common actions are in [_common/actions.js](./_common/actions.js).

## Stores

### Application state

#### Components

#### Maps

#### Messages

### Standard Metadata types

#### Attributes & attribute sets

#### Areas & area selections

#### Layer templates

#### Periods

#### Places

#### Scenarios & scenario cases

#### Scopes

#### Styles

#### Users & groups

#### Views

### Data & relational stores

#### Spatial data sources

#### Spatial relations

#### Attribute data sources

#### Attribute relations

### Special data types

#### LPIS Cases

### Other
<!--- todo better name -->

#### Layer periods

### Deprecated

#### WMS layers

Until implemented in spatial data sources and converted


