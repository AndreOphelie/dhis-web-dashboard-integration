/**
 * Created by Julien on 11/11/2016.
 */

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1409544869075027',
        xfbml      : true,
        version    : 'v2.8'
    });



};
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
