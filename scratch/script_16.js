function getCookie(cookieName) {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return false;
    }

    function setCookie(cookieName, cookieValue, expireDays) {
        var d = new Date();
        d.setTime(d.getTime() + (expireDays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }

    function checkCookie() {
        var cookie = getCookie("newsletter-popup");
        if (cookie != "1") {

            showPopup();
            setCookie("newsletter-popup", "1",14);
            
        
        }
    }
    
    function hidePopup() {
        jQuery('#popup-window-container').fadeOut(500,function(){
            jQuery('#popup-background').fadeOut(500)
        });

    }

    function showPopup() {
        jQuery('#popup-background').fadeIn(500,function(){
            jQuery('#popup-window-container').fadeIn(500)
        });

    }

    
    //desktop trigger
    
    setTimeout(() => {
        jQuery(document).on('mouseout', function(e){
            if(!e.toElement && !e.relatedTarget && e.clientY < 10){
                checkCookie();
            }
        });
    }, 5000);

    //mobile trigger
    setTimeout(() => {
        document.addEventListener("scroll", scrollSpeed);
    }, 5000);

    scrollSpeed = () => {  
        lastPosition = window.scrollY;
        setTimeout(() => {
            newPosition = window.scrollY;
        }, 100);
        currentSpeed = newPosition - lastPosition;

        if (currentSpeed > 160) {
            checkCookie();
            document.removeEventListener("scroll", scrollSpeed);
        }
    };

    jQuery('#popup-close').on('click', function(e){
        e.preventDefault();
        hidePopup();
        e.stopPropagation();

    });

    jQuery('#popup-window-container').on('click', function(){
        event.preventDefault();
        window.location.href="/learning_center/ai-readiness-assessment-for-enterprise-leaders/";

    });