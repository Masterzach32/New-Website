"use strict";
$(document).ready(function() {

    var onLoaderHidden = function() {
        $("#title").addClass("shift");
        $("#nav").addClass("visible");
    };

    var hideLoader = function() {
        var loader = $("#loader");
        loader.addClass("done");
        $("#wrapper").addClass("visible");
        window.setTimeout(function() {
            loader.css("display", "none");
            $("#page-content").addClass("visible");
            window.setTimeout(onLoaderHidden, 1600);
        }, 1500);
        if (!!document.location.hash) {
            switch (document.location.hash.substring(1).toLowerCase()) {
                case "about":
                case "aboutme":
                    aboutBox.showBox();
                    break;
                case "experience":
                    orgBox.showBox();
                    break;
                case "projects":
                    projBox.showBox();
                    break;
                case "contact":
                case "contactme":
                    contactBox.showBox();
                    break;
            }
        }
    };

    var boxScreen = $("#mb-screen");
    var bsTaskId = null;

    var showBoxScreen = function() {
        if (bsTaskId !== null)
            window.clearTimeout(bsTaskId);
        boxScreen.css("display", "block");
        bsTaskId = window.setTimeout(function() {
            boxScreen.addClass("visible")
        }, 1);
    };

    var hideBoxScreen = function() {
        if (bsTaskId !== null)
            window.clearTimeout(bsTaskId);
        boxScreen.removeClass("visible");
        bsTaskId = window.setTimeout(function() {
            boxScreen.css("display", "none");
        }, 400);
    };

    var allBoxes = $(".mb");
    var aboutBox = $("#mb-about");
    var orgBox = $("#mb-org");
    var projBox = $("#mb-proj");
    var contactBox = $("#mb-contact");
    var repoSearch = $("#repo-searchbox");
    var searchLabel;

    var showBoxFunc = function(box) {
        return function() {
            showBoxScreen();
            box.addClass("visible");
        };
    };

    var hideBox = function() {
        hideBoxScreen();
        allBoxes.removeClass("visible");
    };

    var initActionButtons = function() {
        searchLabel = repoSearch.children("label");
        boxScreen.click(hideBox);
        $(".action-x").click(hideBox);
        $(window).keydown(function(e) {
            if (e.keyCode === 27)
                hideBox();
        });
        $("#action-about").click(aboutBox.showBox = showBoxFunc(aboutBox));
        $("#action-org").click(orgBox.showBox = showBoxFunc(orgBox));
        $("#action-proj").click(projBox.showBox = showBoxFunc(projBox));
        $("#action-con").click(contactBox.showBox = showBoxFunc(contactBox));
    };

    initActionButtons();
    hideLoader();

    var bg = $('#bg-container');

    var backgrounds = new Array(
      'bg-0.jpg',
      'bg-2.jpg',
      'bg-3.jpg',
      'bg-4.jpg'
    );

    var current = 0;

    var transition = function() {
        bg.css('background-image', 'url("static/img/' + backgrounds[current] + '")');
        current++;
        current = current % backgrounds.length;
    };

    var run = function() {
        transition();
        bg.fadeIn('slow', function() {
            setTimeout(function() {
                bg.fadeOut('slow', run);
            }, 8000);
        });
    }

    transition();
});
