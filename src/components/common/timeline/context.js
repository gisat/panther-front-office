import React, {createContext} from 'react'
export const Context = createContext({
    updateContext: null,
    width: null,
    height: null,
    getX: null,
    getTime: null,
    centerTime: null,
    centerTimeUtc: null,
    getActiveLevel: null,
    dayWidth: null,
    maxDayWidth: null,
    minDayWidth: null,
    periodLimit: null,
    period: null,
    mouseX: null,
    activeLevel: null,
    periodLimitVisible: null,
    onClick: null,
    onHover: null,
    vertical: null,
    periodLimitOnCenter: null,
    selectMode: null,
    moving: null,
});

export const ContextProvider = (props) => {
    // const [state, dispatch] =  React.useReducer(reducer, initialState);
    // const value = {state, dispatch};
    const {children, ...propsWithoutChildren} = props;
    return <Context.Provider value={{...propsWithoutChildren.value}}>{children}</Context.Provider>;
}