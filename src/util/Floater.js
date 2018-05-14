let $ = window.$;

function minimise(box) {
    if (box.css("display") !== "none") {
        box.hide("drop", {direction: "up"}, 400);
        box.removeClass("open");
    }
}

function maximise(box) {
    box.show("drop", {direction: "up"}, 400);
    box.addClass("open");
}

/**
 * Get floater position on screen
 * @param box {Object} Floater JQuery selector
 * @returns {Object} CSS position values
 */
function getPosition(box) {
    let position = {
        top: null,
        bottom: null,
        left: null,
        right: null
    };
    let screenWidth = $(window).width();
    let screenHeight = $(window).height();
    let floaterLeft = box.offset().left;
    let floaterTop = box.offset().top;
    let floaterWidth = box.width();
    let floaterHeight = box.height();

    if ((floaterLeft > screenWidth / 2)) {
        position.right = (screenWidth - (floaterLeft + floaterWidth));
    } else {
        position.left = floaterLeft;
    }

    if (floaterTop > screenHeight / 2) {
        position.bottom = (screenHeight - (floaterTop + floaterHeight));
    } else {
        position.top = floaterTop;
    }

    return position;
}

/**
 * Set location of the floater according to position parameter
 * @param box {Object} JQuerz selector of floater
 * @param position {Object}
 */
function setPosition(box, position) {
    let location = {
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        top: 'auto'
    };
    let screenWidth = $(window).width();
    let screenHeight = $(window).height();

    if (position.left) {
        location.left = adaptSize(position.left, screenWidth / 2);
    } else {
        location.right = adaptSize(position.right, screenWidth / 2);
    }

    if (position.top) {
        location.top = adaptSize(position.top, screenHeight / 2);
    } else {
        location.bottom = adaptSize(position.bottom, screenHeight / 2);
    }

    box.css(location);
}

/**
 * @param position {number}
 * @param size {number}
 * @returns {number}
 */
function adaptSize(position, size) {
    if (position > size) {
        return size;
    } else {
        return position;
    }
}

export default {
    setPosition: setPosition,
    getPosition: getPosition,
    minimise: minimise,
    maximise: maximise
};