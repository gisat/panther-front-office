// 
// Chrome 73 breaks wheel events.
// url: https://github.com/facebook/react/issues/14856
// 
export function forceSetPassiveEvents() {
    const PASSIVE_EVENTS = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel'];

    const checkType = (type, options) => {
        if (!PASSIVE_EVENTS.includes(type)) return null;
    
        const modOptions = {
            boolean: {
                capture: options,
                passive: false,
            },
            object: {
                ...options,
                passive: false,
            },
        };
    
        return modOptions[typeof options];
    };
    
    const addEventListener = document.addEventListener.bind();
    document.addEventListener = (type, listener, options, wantsUntrusted) => (
        addEventListener(type, listener, checkType(type, options) || options, wantsUntrusted)
    );
    
    const removeEventListener = document.removeEventListener.bind();
    document.removeEventListener = (type, listener, options) => (
        removeEventListener(type, listener, checkType(type, options) || options)
    );
}