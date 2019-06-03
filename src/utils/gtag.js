const register = (GA_MEASUREMENT_ID) => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
};

const addScript = (GA_MEASUREMENT_ID, cb) => {
    const newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.setAttribute("async", "true");
    newScript.setAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);

    newScript.onload = () => cb(GA_MEASUREMENT_ID);

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(newScript, firstScript);

    document.documentElement.firstChild.appendChild(newScript);
}

export const initialize = (GA_MEASUREMENT_ID) => {
    addScript(GA_MEASUREMENT_ID, register)
}