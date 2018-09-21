olderLastPublishedTime = null;

function soundToggle(id) {
    var video = $("#id-" + id + " video")[0];
    $(video).attr('id', id);


    if (video.muted) {
        video.muted = false;
        $("#sound-" + id).addClass('on');
        $("#sound-" + id).removeClass('off');

        $("video[id!='" + id + "']").each(function () {
            this.muted = true;

            $("#sound-" + this.getAttribute('id')).addClass('off');
            $("#sound-" + this.getAttribute('id')).removeClass('on');
        });
    }
    else {
        video.muted = true;
        $("#sound-" + id).addClass('off');
        $("#sound-" + id).removeClass('on');
    }

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



// Hiển thị bài viết chi tiết Ajax
function displayAjaxDetail(json) {
    $("#ajax-detail-container").show();
    $("#ajax-loading-container").hide();

    var entry = json.entry;
    var id = entry.id.$t;
    var url = entry.link[2].href;
    var category = entry.category[0].term;

    var date = new Date(entry.published.$t);

    var afterVideoAds = "";
    var bottomAds = "";

    if (category != "video") {
        afterVideoAds = "";

        $("#mobile-ajax-detail").html("<h1 class='title' id='ajax-title'>" + entry.title.$t + " </h1> <div class='publish-date'> <div class='post-header'> <div class='published'>" + date.toLocaleString() + "</div> </div> </div> <div class='tool top'> <a class='zalo-share zalo-share-button' data-customize='true' data-href='" + url + "' data-layout='icon' data-oaid='579745863508352884' data-type='zalo' href='javascript:;' rel='nofollow'> <i class='spr spr-social-zalo'></i></a> <a class='fb-share' data-href='" + url + "' data-type='facebook' href='javascript:;'> <i class='spr spr-social-fb'></i> </a> </div> <div class='content' id='ajax-content'>" + entry.content.$t + "</div> <div class='tool bottom'> <a class='zalo-share zalo-share-button' data-customize='true' data-href='" + url + "' data-layout='icon' data-oaid='579745863508352884' data-type='zalo' href='javascript:;' rel='nofollow'> <i class='spr spr-social-zalo'></i> <span>zalo</span> </a> <a class='fb-share' data-href='" + url + "' data-type='facebook' href='javascript:;'> <i class='spr spr-social-fb'></i> <span>facebook</span> </a> </div><div id='ajax-fb-comment' ><div class='fb-comments'  data-href='" + url + "' data-numposts='2' data-order-by='social'></div></div>");
    }
    else {
        $("#mobile-ajax-detail").html("<div class='content' id='ajax-content'>" + entry.content.$t + "</div> <h1 class='video-title' id='ajax-title'>" + entry.title.$t + " </h1> <div class='publish-date'> <div class='post-header'> <div class='published'>" + date.toLocaleString() + "</div> </div> </div><div class='tool bottom'> <a class='zalo-share zalo-share-button' data-customize='true' data-href='" + url + "' data-layout='icon' data-oaid='579745863508352884' data-type='zalo' href='javascript:;' rel='nofollow'> <i class='spr spr-social-zalo'></i> <span>zalo</span> </a> <a class='fb-share' data-href='" + url + "' data-type='facebook' href='javascript:;'> <i class='spr spr-social-fb'></i> <span>facebook</span> </a> </div><div id='ajax-fb-comment' ><div class='fb-comments'  data-href='" + url + "'  data-order-by='social' data-numposts='2'></div></div>");
    }



    // Quảngg cáo chèn giữa bài viết
    $("<center class='mobile-footer-ads'><ins class='adsbygoogle' data-ad-client='ca-pub-8618945885313646' data-ad-slot='9417749014' style='display:inline-block;width:300px;height:250px'></ins></center><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>").insertAfter($($("#mobile-ajax-detail p")[Math.ceil($("#mobile-ajax-detail p").length / 2)]));


    if (typeof ZaloSocialSDK != 'undefined') {
        ZaloSocialSDK.reload();
    }

    FB.XFBML.parse(document.getElementById("ajax-fb-comment"));
}

isDetailAjaxPage = false; // Xác định đang mở xem chi tiết = ajax
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

    $("video:not([parsed='true'])").each(function () {
        assignVideoHandler(this);
    });

    getArticleStatistics();
    listLoadMore();

    // Display comments
    if (location.href.indexOf('.html') > 0) {

        if (typeof comments != 'undefined') {
            var commentHtml = "";
            for (var i = 0; i < comments.length; i++) {

                var avatarSplit = comments[i].avatar.split('/');
                var userid = avatarSplit[3];

                commentHtml += "<div class='media'><div class='media-left'><img src='" + comments[i].avatar + "'/></div><div class='media-body'><a href='https://www.facebook.com/" + userid + "' class='name' target='_blank'>" + comments[i].name + "</a><div class='message'>" + comments[i].message + "</div></div></div>";
            }

            commentHtml = "<div class='top-comments'>" + commentHtml + "</div>";
            $("#current-comment").html(commentHtml);
        }


        requestLoadMore();
    }
});



// Chia sẽ bài viết qua facebook
$(document).on('click', 'a[class*="share-facebook"]', function (e) {
    e.preventDefault();
    var button = this;
    window.FB.ui({
        method: "share",
        href: $(this).attr('href')
    }, function (e) {
        alert("Cảm ơn bạn đã chia sẽ <3");
        $(button).addClass('has-share')
    });

});


$(document).on('click', '#post-list a', function (e) {
    if (getParameterByName("m") == "1") {
        e.preventDefault();

        isDetailAjaxPage = true;

        $("#ajax-loading-container").show();
        $('#detail-modal').show();
        $.get('/feeds/posts/default/' + $(this).attr('data-id') + '?alt=json-in-script&callback=displayAjaxDetail');

        $("#pure-body").hide();

        history.pushState(null, null, $(this).attr('href') + "?m=1");
    }
});

window.onpopstate = function (event) {
    video[0].pause();

    $("#pure-body").show();
    $('#detail-modal').hide();

    $("#ajax-detail-container").hide();
    $("#ajax-loading-container").hide();

    isDetailAjaxPage = false;

    $("#mobile-ajax-detail").html("");
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
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



loadTime = 0;
function displayDesktopSuggest(json) {
    var html = "";
    for (var i = 0; i < json.feed.entry.length; i++) {
        var entry = json.feed.entry[i];
        var title = entry.title.$t;
        var url = entry.link[2].href;
        var thumbnail = extractThumbnail(entry.content.$t);

        html += "<article> <a href='" + url + "'> <img src='" + thumbnail + "' alt='" + title + "' /></a> <div> <a href='" + url + "' class='title'>" + title + "</a> </div> </article>";
    }

    document.getElementById('suggest-list').innerHTML = html;

    $("video:not([parsed='true'])").each(function () {
        assignVideoHandler(this);
    });

}


loadTime = 0;
function requestSuggest() {
    $("#loader").css('display', 'inline-block');
    var callback = (getParameterByName("m") == "1") ? "displayMobileSuggest" : "displayDesktopSuggest";

    var label = "news";
    if (location.href.indexOf("label/news") > 0) label = "media";
    $.get('/feeds/posts/default/-/' + label + '?alt=json-in-script&max-results=10&callback=' + callback);
}



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


//Load more trang danh sách
function listLoadMore() {
    allowLoadMore = true;

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 2000 && allowLoadMore) {
            requestLoadMore();
        }
    });

}

function requestLoadMore() {
    $("#loader").css('display', 'inline-block');

    allowLoadMore = false;
    var nextLink = $("#next-button").attr('href');
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

function insertCommentBox(e, t) {
    $("#comment-area-" + e).html("<div class='fb-comments' data-href='" + t + "'  data-order-by='social'  data-numposts='2' data-width='100%'></div>"),
        FB.XFBML.parse(document.getElementById("comment-area-" + e));


    $.get('/feeds/posts/default/' + e + '?alt=json-in-script&callback=displayBuildinComment');
}

function displayBuildinComment(data) {
    var id = data.entry.id.$t;
    id = id.split('-', id.lastIndexOf('-') + 1)[2];

    var content = data.entry.content.$t;
    var displayComment = 3;
    var commentSlip = content.split("comments = ");
    if (commentSlip.length >= 2) {
        var thisComments = commentSlip[1];
        thisComments = thisComments.replace("</script>", "");

        thisComments = JSON.parse(thisComments);

        var commentHtml = "";


        for (var i = 0; i < thisComments.length; i++) {

            var avatarSplit = thisComments[i].avatar.split('/');
            var userid = avatarSplit[3];

            var hidden = "";
            if (i > displayComment) {
                hidden = "style='display: none;'";
            }

            commentHtml += "<div class='media comment-" + id + "' " + hidden + "><div class='media-left'><img src='" + thisComments[i].avatar + "'/></div><div class='media-body'><a href='https://www.facebook.com/" + userid + "' class='name' target='_blank'>" + thisComments[i].name + "</a><div class='message'>" + thisComments[i].message + "</div></div></div>";
        }
        var viewMore = "";
        if (thisComments.length > displayComment) {
            viewMore = "<div class='clearfix'></div><a id='show-more-comments-" + id + "' href=\"javascript:showMoreComments('" + id + "')\" class='more-comments'>Xem thêm " + (thisComments.length - displayComment) + " bình luận khác</a>";
        }

        commentHtml = "<div class='top-comments'>" + commentHtml + viewMore + "</div>";
        $("#comment-area-" + id).append(commentHtml);
    }
}

function showMoreComments(id) {
    $(".comment-" + id).show();
    $("#show-more-comments-" + id).hide();

}

function getArticleStatistics() {
    if (typeof ids == 'undefined') return;

    var currentIds = ids;

    if (typeof (currentIds) != "undefined") {
        var keyIndex = [];
        var queryGraph = "https://graph.facebook.com/?ids=";

        for (var i = 0; i < currentIds.length; i++) {
            if ($("#id-" + currentIds[i] + " h3 a").length > 0) {
                var postUrl = $("#id-" + currentIds[i] + " h3 a")[0].href;
                queryGraph += postUrl + ",";
                keyIndex.push(postUrl);
            }
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
