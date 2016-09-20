define(['jquery'], function ($) {
    function minimise(box) {
        if (box.css("display") != "none"){
            box.hide("drop", {direction: "up"}, 400);
            box.removeClass("open");
        }
    }

    function maximise(box) {
        box.show("drop", {direction: "up"}, 400);
        box.addClass("open");
    }

    return {
        minimise: minimise,
        maximise: maximise
    };
});