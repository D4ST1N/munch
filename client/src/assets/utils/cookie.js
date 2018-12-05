export default {
  get(name) {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  },

  set(name, value, { expiresDate, domain, secure = false } = {}) {
    if (typeof expiresDate == "number" && expiresDate) {
      const d = new Date();
      d.setTime(d.getTime() + expiresDate * 1000);
      expiresDate = d;
    }

    if (expiresDate && expiresDate.toUTCString) {
      expiresDate = expiresDate.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = `${name}=${value}`;

    console.log(`${updatedCookie}${expiresDate ? `expires=${expiresDate}` : ''}${domain ? `;domain=${domain}` : ''}${secure ? 'secure=true' : ''}`);
    document.cookie = `${updatedCookie}${expiresDate ? `expires=${expiresDate}` : ''}${domain ? `;domain=${domain}` : ''}${secure ? 'secure=true' : ''}`;
  }
}
