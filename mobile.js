
$.fn.videoPlayer = function () {
    return this.each(function () {
        new GifPlayer(this);
    })
};

function GifPlayer(element) {
    this.videoLink = null;
    this.element = element;

    this.loadVideo = function () {
        var videoLink = $(this.element).attr('data-mp4');

        if (videoLink == undefined) {
            var postId = $(this.element).attr('data-PostId');
            var me = this;
            $.get("https://graph.facebook.com/v2.6/" + postId + "?fields=source&access_token=992872310825515|53t0QsTdyGFiIavgoJMac9qEkIA", function (response) {
                me.videoLink = response.source;
                me.playVideo();
            });
        }
        else {
            this.videoLink = videoLink;
            this.playVideo();
        }
    }

    this.playVideo = function () {
        var video = $('<video controls="" loop="loop"  controlslist="nodownload" poster="' + $(this.element).attr('src') + '"><source type="video/mp4" src="' + this.videoLink + '"  ></video>');

        $(this.element).replaceWith(video);
    }

    this.loadVideo();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function extractThumbnail(content) {
    var thumbnail = "";

    var findUrl = false;
    for (var i = 0; i < 500; i++) {
        if (!findUrl) {
            if (content[i] == "'") {
                findUrl = true;
            }

        } else {

            if (content[i] == "'" && findUrl) {
                break;
            }

            thumbnail += content[i];
        }
    }

    return thumbnail;
}

//Load more trang danh sách
displayNumber = 8;
loadTimes = 0
postMaxPublished = "";

readDetaiTimes = 0;
// #region Xem chi tiết bài viết

isDetailAjaxPage = false; // Xác định đang mở xem chi tiết = ajax
currentState = "index";

// #region Chia sẽ vào mạng xã hội
function getMetaContent(e) {
    for (var t = document.getElementsByTagName("meta"), n = 0; n < t.length; n++)if (t[n].getAttribute("property") === e) return t[n].getAttribute("content"); return "";
}

$(document).on("click touch", ".fb-share, .zalo-share", function () {

    var e = getMetaContent("og:title"),
        n = getMetaContent("og:description"),
        i = getMetaContent("og:url");


    var r = $(this).attr("data-type"), o = $(this).attr("data-href");
    var title = getMetaContent("og:title");

    switch (window.ga && window.ga("send", {
        hitType: "event",
        eventCategory: "mobile_" + r,
        eventAction: "share",
        eventLabel: getMetaContent("og:title")
    }), r) {
        case "facebook":
            if ("undefined" !== window.FB) {
                var a = window.FB;

                a.ui({
                    method: "share",
                    href: o
                }, function (e) { })
            }
            break;
        default:
    }
})
// #endregion
blurDate = new Date();


$(document).ready(function () {

    $("video").on('play', function () {
        var poster = this.getAttribute('poster');

        $("video[poster!='" + poster + "']").each(function () {
            $(this).get(0).pause();
        });
    });

    $("video").each(function () {
        this.setAttribute('preload', 'metadata');
    });


   

    $("video:not([parsed='true'])").each(function () {
        assignVideoHandler(this);
    });

    listLoadMore();

    getArticleStatistics();


    window.onfocus = function () {
        var differentSeconds = (new Date().getTime() - blurDate.getTime()) / 1000;
        // User focus sau 30 phút thì thông báo có bài mới
        if (differentSeconds > (60 * 30)) {
            $("body").append("<a class='new-notification' href='http://www.7mau.vn/?m=1'><div>Có hơn 10+ bài viết mới <span class='highlight-text'>Xem</span></div></a>");
        }
    };

    window.onblur = function () {
        blurDate = new Date();
    };
    if (location.href.indexOf(".html") >= 0) {
        $(".gifplayer").videoPlayer(); // play video nếu có
    }
});

//Load more trang danh sách
function listLoadMore() {
    if (location.href.indexOf("/label/news") < 0) {

        allowLoadMore = true;

        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 1500 && allowLoadMore) {
                requestLoadMore();
            }
        });
    }
}

function requestLoadMore() {
    $("#loader").css('display', 'inline-block');

    allowLoadMore = false;
    var nextLink = $("#next-button").attr('href');
    nextLink += "&m=1";
    $.get(nextLink, function (response) {
        var responseDOM = $(response);

        $("#post-list").append(responseDOM.find("#post-list").html());
        nextPage = responseDOM.find("#next-button").attr('href');
        $("#next-button").attr('href', nextPage);

        $("#loader").css('display', 'none');

        allowLoadMore = true;

        $("video:not([parsed='true'])").each(function () {
            assignVideoHandler(this);
        });


        eval(responseDOM.find("#ids").html());

        getArticleStatistics();
    });
}

function assignVideoHandler(element) {
    $(element).attr('parsed', true);
    $(element).attr('loop', true);

    $(element).on('inview', function (event, isInView) {

        var postId = $(this).attr('id');

        if (isInView) {
            // element is now visible in the viewport
            if (this.paused == true && this.muted == false) {
                this.muted = true;

                // Chuyển nút điều khiển âm lượng về chế độ tắt
                if (postId != "") {
                    $("#sound-" + postId).addClass('off');
                    $("#sound-" + postId).removeClass('on');
                }
            }

            if ($(this).attr('data-autoplay') == "true") {
                this.muted = false;

                // Chuyển nút điều khiển âm lượng về chế độ mở
                if (postId != "") {
                    $("#sound-" + id).addClass('on');
                    $("#sound-" + id).removeClass('off');
                }
            }

            this.play();
        } else {
            this.pause()
        }
    });
}

function toggleSearchBar() {
    var x = document.getElementById("search-bar");
    if (x.style.display === "none" || x.style.display == "") {
        x.style.display = "block";

        document.getElementById("search-box").focus();
    } else {
        x.style.display = "none";
    }
}

function closeShareMenu() {
    previousState = "";
    $('#share-action-menu').removeClass('visible');
}

function openShareMenu(url) {
    previousState = 'share-dialog';
    history.pushState({ event: 'share-dialog', url: url }, null, "#share");

    $("#share-action-menu").addClass('visible');
    $("#facebook-share-anchor").attr('data-href', url);
    $("#zalo-share-anchor").attr('data-href', url);
    $("#zalo-share-anchor").attr('data-shareurl', url);
    $("#direct-link-anchor").attr('href', url);
}

function openCommentDialog(url, id) {
    $("#close-popup").show();

    previousState = "view-comment";
    history.pushState({ event: 'view-comment', url: url }, null, "#comment");

    if (typeof commentDialog == 'undefined') {
        commentDialog = $("<div class='modal comments-dialog' tabindex='-1' role='dialog'> <div class='modal-dialog' role='document'> <div class='modal-content'> <div class='modal-header'>  <a href='javascript:history.go(-1)' class='back-button'><i class='spr-close'></i></a> </div> <div class='modal-body'> <p>One fine body&hellip;</p> </div> </div> </div> </div>");
        $("body").append(commentDialog);
    }

    $(commentDialog).find("div[class='modal-body']").html("<div id='ajax-fb-comment' ><div class='fb-comments' data-order-by='social' data-href='" + url + "' data-numposts='7'></div></div>")

    commentDialog.modal('show');
    FB.XFBML.parse(document.getElementById("ajax-fb-comment"));


    if ($("video[playing='true']").length > 0)
        $("video[playing='true']")[0].pause();

    $.get('/feeds/posts/default/' + id + '?alt=json-in-script&callback=displayBuildinComment');
}

function displayBuildinComment(data) {
    var id = data.entry.id.$t;
    id = id.split('-', id.lastIndexOf('-') + 1)[2];

    var content = data.entry.content.$t;

    var commentSlip = content.split("comments = ");
    if (commentSlip.length >= 2) {
        var thisComments = commentSlip[1];
        thisComments = thisComments.replace("</script>", "");

        thisComments = JSON.parse(thisComments);

        var commentHtml = "";
        for (var i = 0; i < thisComments.length; i++) {

            var avatarSplit = thisComments[i].avatar.split('/');
            var userid = avatarSplit[3];


            commentHtml += "<div class='media'><div class='media-left'><img src='" + thisComments[i].avatar + "'/></div><div class='media-body'><a href='https://www.facebook.com/" + userid + "' class='name' target='_blank'>" + thisComments[i].name + "</a><div class='message'>" + thisComments[i].message + "</div></div></div>";
        }

        commentHtml = "<div class='top-comments'>" + commentHtml + "</div>";
        $("#ajax-fb-comment").append(commentHtml);
    }
}

function getArticleStatistics() {

    if (typeof ids == 'undefined') return;

    var currentIds = ids;


    if (typeof (currentIds) != "undefined") {
        var keyIndex = [];
        var queryGraph = "https://graph.facebook.com/?ids=";

        for (var i = 0; i < currentIds.length; i++) {
            var postUrl = $("#id-" + currentIds[i] + " a")[0].href;
            queryGraph += postUrl + ",";
            keyIndex.push(postUrl);
        }

        queryGraph = queryGraph.substring(0, queryGraph.length - 1)
        $.ajax({
            url: queryGraph,
            type: "GET",
            success: function (data) {
                for (var i = 0; i <= keyIndex.length - 1; i++) {

                    var record = data[keyIndex[i]];
                    if (typeof (record.share) != "undefined") {
                        if (document.getElementById('total-share-' + currentIds[i]) != null) {
                            var likeContent = (record.share.share_count == 0) ? "" : (record.share.share_count + " Chia sẽ");
                            if (likeContent != "") {
                                $('#s-c-' + currentIds[i]).show();
                                document.getElementById('total-share-' + currentIds[i]).innerHTML = "<a href='" + keyIndex[i] + "'>" + likeContent + "</a>";
                                $('#total-share-' + currentIds[i]).addClass('has-share');
                            }
                        }

                        if (document.getElementById('total-comments-' + currentIds[i]) != null && record.share.comment_count > 0) {
                            $('#total-comments-' + currentIds[i]).addClass('has-comment');

                            if (eval("typeof article" + currentIds[i] + " != 'undefined'")) {
                                if (eval("article" + currentIds[i] + ".totalComments") > 0) {
                                    $('#total-comments-' + currentIds[i]).addClass('has-comment');

                                    var totalComments = (record.share.comment_count + eval("article" + currentIds[i] + ".totalComments"));
                                    document.getElementById('total-comments-' + currentIds[i]).innerHTML = totalComments + " Bình luận";
                                }
                            }
                        }
                        else {
                            if (eval("typeof article" + currentIds[i] + " != 'undefined'")) {

                                if (eval("article" + currentIds[i] + ".totalComments") > 0) {
                                    $('#total-comments-' + currentIds[i]).addClass('has-comment');

                                    document.getElementById('total-comments-' + currentIds[i]).innerHTML = (eval("article" + currentIds[i] + ".totalComments") + " Bình luận");
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}


$(document).ready(function () {
    // construct an instance of Headroom, passing the element
    var headroom = new Headroom(document.getElementById("sticker"), {
        "offset": 45,
        "tolerance": 5,
        "classes": {
            "initial": "animated",
            "pinned": "slideDown",
            "unpinned": "slideUp"
        }
    });
    // initialise
    headroom.init();

    // Mở action menu chia sẽ bài viết
    $(document).on('click', 'a[class*="button-share"]', function (e) {
        e.preventDefault();
        openShareMenu(this.getAttribute('href'));
    });

    // Mở action menu chia sẽ bài viết
    $(document).on('click', 'a[class*="comment-button"]', function (e) {
        e.preventDefault();
        openCommentDialog(this.getAttribute('href'), this.getAttribute('data-id'));
    });

    $(document).on('click', "a[class='post-link']", function (e) {
        e.preventDefault();
    });


    // Overlay đóng action menu
    $(".shade").on('click', function () { closeShareMenu() });


    // Display comments
    if (location.href.indexOf('.html') > 0) {
        if (typeof comments != 'undefined') {
            var commentHtml = "";
            for (var i = 0; i < comments.length; i++) {

                var avatarSplit = thisComments[i].avatar.split('/');
                var userid = avatarSplit[3];

                commentHtml += "<div class='media'><div class='media-left'><img src='" + comments[i].avatar + "'/></div><div class='media-body'><a href='https://www.facebook.com/" + userid + "' class='name' target='_blank'>" + comments[i].name + "</a><div class='message'>" + comments[i].message + "</div></div></div>";
            }

            commentHtml = "<div class='top-comments'>" + commentHtml + "</div>";
            $("#current-comment").html(commentHtml);
        }
    }
});


window.onpopstate = function (event) {
    if (previousState == 'share-dialog') {
        closeShareMenu();
    }
    // Đóng bình luận
    else if (previousState == "view-comment") {
        previousState = "";
        if ($("video[playing='true']").length > 0)
            $("video[playing='true']")[0].play();

        commentDialog.modal('hide');

        $("#close-popup").hide();
    }
    else if (event.state != null && event.state.event == 'share-dialog') {
        openShareMenu(event.state.url);
    }
    else if (event.state != null && event.state.event == 'view-comment') {
        openCommentDialog(event.state.url);
    }
};

function parseAlbum(id) {

    var max = 500;
    var parentWith = $("#id-" + id + " .content").width();
    if (parentWith > max) {
        parentWith = max;
    }
    html = "<div class='album-container' style='height: " + parentWith + "px;width: " + parentWith + "px;'>";
    var albumPosts = eval("album" + id);

    $.each(albumPosts, function (i, item) {

        if (item.hasOwnProperty('container')) {

            var containerTop = (parentWith * item["container"]["top"]) / max;
            var containerLeft = (parentWith * item["container"]["left"]) / max;
            var containerWidth = (parentWith * item["container"]["width"]) / max;
            var containerHeight = (parentWith * item["container"]["height"]) / max;

            var imgTop = (parentWith * item["img"]["top"]) / max;
            var imgLeft = (parentWith * item["img"]["left"]) / max;
            var imgWidth = (parentWith * item["img"]["width"]) / max;
            var imgHeight = (parentWith * item["img"]["height"]) / max;

            html += "<div class='album-item'  style='top: " + containerTop + "px;left: " + containerLeft + "px;width: " + containerWidth + "px;height: " + containerHeight + "px;'><img  style='top: " + imgTop + "px;left: " + imgLeft + "px;height: " + imgHeight + "px;'  width='" + imgWidth + "px' height='" + imgHeight + "px;' src=' " + item["src"] + " 'class=' " + item["imgClass"] + "'/></div>";
        }
    });
    html += "</div>";
    document.getElementById("album" + id).innerHTML = html;
}