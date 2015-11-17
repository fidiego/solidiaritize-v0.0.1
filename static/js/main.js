var IMAGE_CONTENT;
var IMG;
var FILE;
$(document).ready(function() {
    function checkFBLogin() {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                return true;
            } else if (response.status === 'not_authorized') {
                FB.login()
            } else {
                return false
            }
        });
    }

    // IMAGE STUFF

    var profileImageInput = document.getElementById('profileImageInput');
    profileImageInput.addEventListener('change', handleImage, false);
    var CANVAS = document.getElementById("avatarCanvas");
    CANVAS.width = 300;
    CANVAS.height = 300;
    var CONTEXT = document.getElementById("avatarCanvas").getContext("2d");

    function setContext(imageFile, context) {
        var img = new Image();
            img.onload = function() {
                var w = img.width;
                var h = img.height;
                var crop_x = 0;
                var crop_y = 0;
                var crop_w = 0;
                var crop_h = 0;
                if (w < h){                 // image is tall
                    console.log('image is tall')
                    crop_y = (h - w) / 2;
                    crop_h = h - (h - w);
                    crop_w = w;
                } else if (h < w) {         // image is wide
                    console.log('image is wide')
                    crop_x = (w - h) / 2;
                    crop_w = w - (w - h);
                    crop_h = h
                } else {
                    crop_w = w;
                    crop_h = h;
                }
                console.log('NEW DIMENSIONS (w, h):', crop_w, crop_h)
                console.log(w, h, crop_x, crop_y, crop_w, crop_h)
                context.drawImage(img, crop_x, crop_y, crop_w, crop_h, 0, 0,  CANVAS.width, CANVAS.height);
            }
            img.src = imageFile;
            img.setAttribute('crossOrigin', 'anonymous');
            IMAGE_CONTENT = imageFile;
            IMG = img;
    }
    // ON IMAGE INPUT FILE CHANGE
    function handleImage(e) {
        var reader = new FileReader();
        reader.onloadend = function(event) {
            setContext(event.target.result, CONTEXT)
        }
        FILE = e.target.files[0];
        reader.readAsDataURL(FILE);
        $('select').fadeIn('slow');
        $('.upload-prompt').fadeOut('fast');
    };

    // ON FETCHING IMAGE FROM FACEBOOK
    function paintWithURL(url) {
        var img = new Image();
        img.src = url;
        img.setAttribute('crossOrigin', 'anonymous');
        // $('canvas.avatar')
        //     .css('background-image', 'url(' + url + ')')
        //     .css('background-position', 'center center')
        //     .css('background-size', 'cover')
        CONTEXT.drawImage(img, 0, 0, CANVAS.width, CANVAS.height);
        IMAGE_CONTENT = url;
        $('select').fadeIn('slow');
        $('.upload-prompt').fadeOut('fast');
    };

    // APPLY FILTER
    function applyFilter(name) {
        if (name === null || name === undefined || name === "null") {
            console.log('no name')
            return
        }
        $(CANVAS).fadeOut('fast', function() {
            console.log('removing old content');
            CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
            setContext(IMAGE_CONTENT, CONTEXT)

            var filterImage = new Image();
            filterImage.src = "/static/img/filters/" + name + "/" + name + "-h300.png";
            filterImage.setAttribute('crossOrigin', 'anonymous');
            filterImage.onload = function() {
                CONTEXT.globalCompositeOperation = "soft-light";
                CONTEXT.drawImage(filterImage, 0, 0, CANVAS.width, CANVAS.height);
            };
        })

        $(CANVAS).fadeIn()
        $('.download-button').fadeIn();
        $('.download-instructions').fadeIn();
    };

    $('#filter-select').change(function() {
        var selectedValue = $(this).find(':selected')[0].value;
        applyFilter(selectedValue)
    });

    // FACEBOOK
    function getFaceBookImage() {
        FB.api(
            '/me/picture/?width=9999',
            function(response) {
                if (response && !response.error) {
                    paintWithURL(response.data.url)
                } else {
                    console.log('error')
                }
            }
        );
    };

    // ON FACEBOOK CLICK
    $('div.src.src-fb').click(function() {
        console.log('facebook clicked')
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                getFaceBookImage();
            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
                FB.login()
            } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                alert('You must be logged into facebook to use this feature.')
            }
        });
    });

    // ON UPLOAD CLICK
    $('div.avatar-container').click(function() {
        $('input#profileImageInput').click()
    });
    $('div.src.src-ul').click(function() {
        $('input#profileImageInput').click()
    });

    var button = document.getElementById('download-button');
    button.addEventListener('click', function(e) {
        var dataURL = CANVAS.toDataURL('image/png');
        button.href = dataURL;

    });

    // ON HOVER
    // $('.avatar').hover(
    //     function() {
    //         if (IMAGE_CONTENTS) {
    //             $('i#clear-avatar').fadeIn().removeClass('hidden')
    //         }
    //     },
    //     function() {
    //         $('i#clear-avatar').fadeOut().addClass('hidden')
    //     }
    // );
    // $('i#clear-avatar').click(function() {
    //     console.log(IMAGE_CONTENTS)
    //     IMAGE_CONTENTS = null;
    //     $('div.avatar').removeAttr('style');
    //     console.log(IMAGE_CONTENTS)
    // })

});
