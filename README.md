xunlei.lixian
=============

Xunlei Lixian API in js.


Feature
-----------
+ Login

+ Add task from URL(magnet, ed2k...)

Usage
-----

    xunleiLixian.login(username,password, successCallback);
    xunleiLixian.addTask(url, successCallback); //Only support direct link, e.g. magnet/ed2k


Note
-----
+ See it in action in showsMatter chrome extension https://github.com/weishi/showsMatter

+ For Chrome extension use only due to the cookie reading mechanism `chrome.cookies.get()`.

