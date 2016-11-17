/*
 * grumblr.js - Handle ajax retrieval of posts and comments
 */

/* Global Variables */
var wait = false;   //Flag not to call the server again, if it is still looking for a previous request
var post_template, comment_template;
// var URL = '/api/recipes?search=';
var interval;   //Store the number of the inteval
var search_word = '';
/* POSTS */
function performSearch() {
    // URL = '/api/recipes?search='+search_word;
    
    var myNode = document.getElementById("post_container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }


    load_posts(search_word);    
}
var timer;
function search(e) {
    // $("#search").val
    clearTimeout(timer);

    search_word = $("#search").val();
    sessionStorage.setItem('search', search_word);
    console.log('pathname',location.pathname)
    if (location.pathname !== '/')
        // location.pathname = '/';
    }

    //Delay for other keystrokes
    timer = setTimeout(performSearch,400);
}

$(function () {
    if (location.pathname === '/') {
        search_word = sessionStorage.getItem('search');
        if (search_word) {
            $("#search").val(search_word);
            load_posts(search_word);
        }
    }

    var e = document.getElementById('search');
    e.oninput = search;
    e.onpropertychange = e.oninput; // for IE8

});