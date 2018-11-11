class Cookie {
    set(name,value,hours) {
        let expires = "";
        if (hours) {
            var date = new Date();
            date.setTime(date.getTime() + (hours*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    get(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        // console.log('看看cookie',document.cookie)
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    erase(name) {
        document.cookie = name+'=; Max-Age=-99999999;';
    }
}
export default new Cookie()