import React, {createContext} from 'react'
export const Context = createContext({
    dayWidth: null,
    maxDayWidth: null,
    period: null,
    periodLimit: null,
    mouseX: null,
    height: null,
    containerWidth: null,
    getX: null,
    centerTime: null,
    levels: null,
    overlays: null,
    periodLimitVisible: true,
    periodLimitOnCenter: false,
});

export const ContextProvider = (props) => {
    // const [state, dispatch] =  React.useReducer(reducer, initialState);
    // const value = {state, dispatch};
    const {children, ...propsWithoutChildren} = props;
    return <Context.Provider value={{...propsWithoutChildren.value}}>{children}</Context.Provider>;
}