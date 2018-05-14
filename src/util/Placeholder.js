function floaterOpened(placeholder) {
    if (placeholder.hasClass("open")) {
        placeholder.removeClass("open");
        hideTools(placeholder);
    }
}

function floaterClosed(placeholder) {
    placeholder.addClass("open");
    showTools(placeholder);
}

function hideTools(placeholder) {
    placeholder.find(".placeholder-tools-container").css("display", "none");
}

function showTools(placeholder) {
    placeholder.find(".placeholder-tools-container").css("display", "block");
}

export default {
    floaterOpened: floaterOpened,
    floaterClosed: floaterClosed
};