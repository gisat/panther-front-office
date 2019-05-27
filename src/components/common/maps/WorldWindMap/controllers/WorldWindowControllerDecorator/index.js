import WorldWind from 'webworldwind-esa';

const {
    Angle,
    WWMath
} = WorldWind;

/**
 * 
 * @param {WorldWindController} basicController 
 */
export default function(basicController) {
    //Customized applyLimits function that call onNavigatorChanged on every execution
    const applyLimits = () => {
        var navigator = basicController.wwd.navigator;

        // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.
        navigator.lookAtLocation.latitude = WWMath.clamp(navigator.lookAtLocation.latitude, -90, 90);
        navigator.lookAtLocation.longitude = Angle.normalizedDegreesLongitude(navigator.lookAtLocation.longitude);

        // Clamp range to values greater than 1 in order to prevent degenerating to a first-person navigator when
        // range is zero.
        navigator.range = WWMath.clamp(navigator.range, 1, Number.MAX_VALUE);

        // Normalize heading to between -180 and +180.
        navigator.heading = Angle.normalizedDegrees(navigator.heading);

        // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.
        navigator.tilt = WWMath.clamp(navigator.tilt, 0, 90);

        // Normalize heading to between -180 and +180.
        navigator.roll = Angle.normalizedDegrees(navigator.roll);

        // Apply 2D limits when the globe is 2D.
        if (basicController.wwd.globe.is2D() && navigator.enable2DLimits) {
            // Clamp range to prevent more than 360 degrees of visible longitude. Assumes a 45 degree horizontal
            // field of view.
            var maxRange = 2 * Math.PI * basicController.wwd.globe.equatorialRadius;
            navigator.range = WWMath.clamp(navigator.range, 1, maxRange);

            // Force tilt to 0 when in 2D mode to keep the viewer looking straight down.
            navigator.tilt = 0;
        }

        //event map changed
        if(typeof basicController.onNavigatorChanged === 'function') {
            basicController.onNavigatorChanged(navigator);
        }
    };

    basicController.applyLimits = applyLimits;
    basicController.onNavigatorChanged = null;
};
