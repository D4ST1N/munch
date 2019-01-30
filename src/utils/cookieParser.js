const cookieParser = (cookie, name) => {
    const cookieArray = cookie.split('; ');
    const filteredArray = cookieArray.filter((item) => {
        return item.includes(name);
    });
    let requiredCookie = '';

    if (filteredArray.length > 0) {
        requiredCookie = filteredArray[0].split('=')[1]
    }

    return requiredCookie;
};

export default cookieParser;