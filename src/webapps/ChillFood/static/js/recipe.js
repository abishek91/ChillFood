/*
 * grumblr.js - Handle ajax retrieval of posts and comments
 */

/* Global Variables */
var wait = false;   //Flag not to call the server again, if it is still looking for a previous request
var post_template, comment_template;
var URL = '/api/recipes';
var interval;   //Store the number of the inteval
/* POSTS */

// Look for posts
function load_posts(query) {
    if (wait) return;
    wait = true;
    if (query)
        URL = '/api/recipes?search='+search_word;
    
    $.get(URL, append_posts);
}

// Callback function to append post to DOM
function append_posts(response) {
    URL = response.next
    new_posts = response.data
    
    console.log(URL)

    if (URL) {
        $("#next").attr('href', next );
        $("#next").removeClass("hidden");
    } else {
        $("#next").addClass("hidden");
    }

    var stream = $("#post_container");
    console.log(new_posts,stream)
    if (new_posts && new_posts.length) {
        for (var i in new_posts) {
            var new_post = post_to_html(new_posts[i]);
            new_post.appendTo(stream);
        }
    }
    $(".progress").addClass("hidden");
    wait = false;
}

// Convert the JSON into HTML
function post_to_html(post) {
    var node = post_template.clone();
    node = node.removeClass('hidden');
    node = node.attr('id',"post"+post.id);
    node.find("#post_pic").attr('src', '/recipe/' + post.id + '/pic');
    node.find(".post_detail").attr('href', '/recipe/' + post.id );
    node.find("#post_title").html(post.title);
    node.find("#post_rating").html(post.rating);
    node.find("#post_time").html(post.time);
    return node;
}

$(function () {
    //Initialize global variables
    post_template = $('#post_template');
    console.log("Global",search_word)
    //Do a initial load of the posts
    if (!search_word) {
        console.log('here')
        load_posts();
    }
});