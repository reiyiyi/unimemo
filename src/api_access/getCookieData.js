const GetCookieData = () => {
    var cookie_data = {};
    if (document.cookie != '') {
        var cookies = document.cookie.split('; ');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].split('=');
            cookie_data[cookie[0]] = cookie[1];
        }
    }
    return cookie_data;
};

export default GetCookieData;