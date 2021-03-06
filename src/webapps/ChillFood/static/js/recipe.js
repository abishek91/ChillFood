/*
 * grumblr.js - Handle ajax retrieval of posts and comments
 */

/* Global Variables */
var wait = false;   //Flag not to call the server again, if it is still looking for a previous request
var post_template, comment_template;
var URL = '/api/recipes';
var interval;   //Store the number of the inteval
/* POSTS */

function load_posts(query,userId) {
    if (wait) return;
    wait = true;
    
    
    if (query)
        URL = '/api/recipes';
    
    $.get(URL,{search: query, user_id: userId}, append_posts);
}

// Look for posts
// function load_posts() {
//     if (wait) return;
//     wait = true;
//     if(typeof userId !== 'undefined')
//         URL += "?userId=" + userId; 
//     $.get(URL, append_posts);
// }

// Callback function to append post to DOM
function append_posts(response) {
    new_posts = response.data
    
    

    if (response.next) {
        URL = response.next;
        $("#next").attr('href', next );
        $("#next").removeClass("hidden");
    } else {
        URL = '/api/recipes';
        $("#next").addClass("hidden");
    }

    var stream = $("#post_container");
    
    if (new_posts && new_posts.length) {
        for (var i in new_posts) {
            var new_post = post_to_html(new_posts[i]);
            new_post.appendTo(stream);
        }
    }
    $(".progress").addClass("hidden");
    wait = false;
}

star = '<i class="material-icons">star</i>'
star_empty = '<i class="material-icons">star_border</i>'
star_half = '<i class="material-icons">star_half</i>'
// Convert the JSON into HTML
function post_to_html(post) {
    var node = post_template.clone();
    node = node.removeClass('hidden');
    node = node.attr('id',"post"+post.id);
    node.find("#post_pic").attr('src', '/recipe/' + post.id + '/pic');
    node.find(".post_detail").attr('href', '/recipe/' + post.id );
    node.find("#post_title").html(post.title);
    
    // if (for )
    stars = ''
    for (var i = 1; i < post.tastiness; i++) {
        stars += star;
    }

    if ((i - post.tastiness) == 0.5) {
        stars += star_half
        i+=1;
    }

    for (; i < 6; i++) {
        stars += star_empty;
    }

    node.find("#post_rating").html(stars);
    node.find("#post_time").html(post.time);
    
    // node.find("#post_date").html(new Date(post.date).toLocaleString());
    // node.find("#post_user_photo").attr('src', '/user_photo/' + post.user.id);
    // node.find("#profile_link").attr('href', '/profile/' + post.user.id);
    // node.find("#comment_link").click(function () {
    //     show_comments(post.id)
    // });
    // if (post.comments_qty)
    //     node.find("#comments_qty").html(post.comments_qty);

    return node;
}


function setUrl(url) {
    last_id = 0;
    clearInterval(interval)
    URL = '/api/'+url+'?id=';

    var stream = $("#post_container")[0];
    
    while (stream.firstChild) {
        stream.removeChild(stream.firstChild);
    }
    
    load_posts();
    interval = setInterval(load_posts, 5000);
}

$(function () {


    //Initialize global variables
    post_template = $('#post_template');

    if (location.pathname === '/') {
        search_word = sessionStorage.getItem('search');
        if (search_word) {
            $("#search").val(search_word);
            load_posts(search_word);
        } else {
            load_posts();
        }
    }
    // //Do a initial load of the posts
    // load_posts();
});