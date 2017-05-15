"use strict";
$(document).ready(function() {

    //var images = ['bg-0.jpg', 'bg-1.png', 'bg-2.jpg', 'bg-3.jpg', 'bg-4.jpg'];
    //html').css({'background-image': 'url(../img/' + images[Math.floor(Math.random() * images.length)] + ')'});

    var getInput = function(ipt) {
        return ipt.children("input").val();
    };

    var initInputBoxes = function() {
        $(".input-text").each(function(i, e) {
            var o = $(e);
            o.append($("<input>", {type: "text", required: "", spellcheck: "false"}));
            o.append($("<label>").text(o.attr("data-name")));
            o.append($("<span>"));
        });
    };

    var repoList = $("#repo-list");
    var orgList = $("#org-list");

    var appendRepo = function(repo) {
        repoList.append(
            $("<div>", {"class": "repo"}).append(
                $("<div>", {"class": "repo-title"}).append(
                    $("<div>", {"class": "repo-name"}).append(
                        $("<a>", {target: "__BLANK", href: repo.html_url}).append(
                            $("<h2>").text(repo.name)
                        )
                    )
                ).append(
                    $("<div>", {"class": "repo-stars"}).append(
                        $("<i>", {"class": "mdi mdi-star"})
                    ).append(
                        $("<span>").text(repo.stargazers_count)
                    )
                )
            ).append(
                $("<p>", {"class": "repo-desc"}).text(repo.description || "No description...")
            ).attr("data-name", repo.name).attr("data-desc", repo.description)
        );
    };

    var appendOrg = function(org) {
        orgList.append(
            $("<div>", {"class": "org"}).append(
                $("<div>", {"class": "org-img"}).append(
                    $("<img>", {src: org.avatar_url})
                )
            ).append(
                $("<div>", {"class": "org-details"}).append(
                    $("<div>", {"class": "org-name"}).append(
                        $("<a>", {target: "__BLANK", href: "https://github.com/" + org.login}).append(
                            $("<h2>").text(org.login)
                        )
                    )
                ).append(
                    $("<div>", {"class": "org-desc"}).append(
                        $("<p>").text(org.description || "No description...")
                    )
                )
            )
        );
    };

    var repoUrl = "http://api.github.com/users/masterzach32/repos?sort=updated&per_page=100&page=";

    var getRepos = function(pageNum, cb, prev) {
        var repos = prev || [];
        $.getJSON(repoUrl + pageNum, function(dto) {
            repos = repos.concat(dto);
            if (dto.length < 100)
                cb(repos);
            else
                getRepos(pageNum + 1, cb, repos);
        });
    };

    var loadGithubData = function() {
        getRepos(1, function(dto) {
            $.each(dto, function(i, repo) {
                appendRepo(repo);
            });
        });
        $.getJSON("https://api.github.com/users/masterzach32/orgs", function(dto) {
            $.each(dto, function(i, org) {
                appendOrg(org);
            });
        });
    };

    var repoSearchUpdate = function() {
        var s = getInput(repoSearch);
        if (!s) {
            repoList.children().removeClass("hidden");
            searchLabel.text("Search");
            repoSearch.removeClass("invalid");
        } else {
            var p;
            try {
                p = new RegExp(s, "i");
            } catch (e) {
                searchLabel.text("Search (Invalid Regex!)");
                repoSearch.addClass("invalid");
                return;
            }
            searchLabel.text("Search");
            repoSearch.removeClass("invalid");
            repoList.children().each(function (i, e) {
                var o = $(e);
                if ((!!o.attr("data-name") && p.test(o.attr("data-name"))) ||
                    (!!o.attr("data-desc") && p.test(o.attr("data-desc")))) {
                    o.removeClass("hidden");
                } else {
                    o.addClass("hidden");
                }
            });
        }
    };

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
        }, 2100);
        if (!!document.location.hash) {
            switch (document.location.hash.substring(1).toLowerCase()) {
                case "repos":
                case "repo":
                case "repositories":
                case "repository":
                case "projs":
                case "proj":
                case "projects":
                case "project":
                    repoBox.showBox();
                    break;
                case "orgs":
                case "org":
                case "organizations":
                case "organization":
                    orgBox.showBox();
                    break;
                case "con":
                case "contact":
                case "contactme":
                    conBox.showBox();
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
    var conBox = $("#mb-con");
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
        $("#action-con").click(conBox.showBox = showBoxFunc(conBox));
    };

    initInputBoxes();
    initActionButtons();
    loadGithubData();
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

    run();

    /*function nextBackground() {
      current++;
      current = current % backgrounds.length;
      bg.css('background-image', 'url("static/img/' + backgrounds[current] + '")');
    }
    setInterval(nextBackground, 5000);

    bg.css('background-image', backgrounds[0]);*/
});
