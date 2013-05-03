var xunleiLixian={
    /* Constants */
    CLASS_NAME: 'xunleiLixian',
	DEFAULT_USER_AGENT: 'User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.106 Safari/535.2',
    DEFAULT_REFERER: 'http://lixian.vip.xunlei.com/',
    LOGIN_URL: 'http://login.xunlei.com/sec2login/',
    CHECK_URL: 'http://login.xunlei.com/check',
    REDIRECT_URL: 'http://dynamic.lixian.vip.xunlei.com/login',
    ADD_TASK_URL: 'http://dynamic.cloud.vip.xunlei.com/interface/url_query',
    COMMIT_TASK_URL: 'http://dynamic.cloud.vip.xunlei.com/interface/bt_task_commit?callback=jsonp123456789',
    
    /* State variable */
    userid: '',
    isLoggedIn: false,
    loginCallback: function(){},
    addTaskCallback: function(){},

    /* Method */
    login: function(username, password, callback){
    	var cacheTime=Math.floor((new Date).getTime()/1000);
        xunleiLixian.loginCallback=callback;
    	$.ajax({
            url:xunleiLixian.CHECK_URL,
            type: "GET", 
            data: {
                u: username,
                cachetime: cacheTime.toString(),
            },
            success: function (output, status, xhr) {
                    chrome.cookies.get({"url": "http://login.xunlei.com", "name": "check_result"}, function(cookie) {
                        var verifyCode=cookie.value.substring(2);
                        var hashedPasswd=xunleiLixian.encryptPassword(password, verifyCode.toUpperCase());
                        xunleiLixian._loginSendCredential(username, hashedPasswd, verifyCode);
                    });
        	}
        });
    },

    _loginSendCredential: function(username, hashedPasswd, verifyCode){
        var cacheTime=Math.floor((new Date).getTime()/1000);
        $.ajax({
            url:xunleiLixian.LOGIN_URL,
            type: "POST", 
            data: {
                u: username,
                p: hashedPasswd,
                verifycode: verifyCode,
            },
            success: function (output, status, xhr) {
                    chrome.cookies.get({"url": "http://login.xunlei.com", "name": "userid"}, function(cookie) {
                        userid=cookie.value;
                        isLoggedIn=true;
                        console.log(userid);
                        xunleiLixian.loginCallback();
                        
                    });
            }
        });
    },

    addTask: function(magnet, callback){
        if(!isLoggedIn){
            return false;
        }
        xunleiLixian.addTaskCallback=callback;
        var cacheTime=Math.floor((new Date).getTime()/1000);
        $.ajax({
            url:xunleiLixian.ADD_TASK_URL,
            type: "GET", 
            data: {
                random: cacheTime.toString(),
                tcache: cacheTime.toString()+"1",
                callback: 'queryUrl',
                u: magnet
            },
            success: function (output, status, xhr) {
                    console.log(output);
                    var taskInfo=eval(xunleiLixian.CLASS_NAME+"."+output);
                    xunleiLixian.commitTask(taskInfo);
            }
        });
    },

    commitTask: function(taskInfo){
        console.log(taskInfo);
        $.ajax({
            url:xunleiLixian.COMMIT_TASK_URL,
            type: "POST", 
            data: taskInfo,
            success: function (output, status, xhr) {
                console.log(output);
                xunleiLixian.addTaskCallback();
            }
        });
    },

    queryUrl: function(flag, cid, tsize, btname, is_full, names, sizes_, sizes, is_valid, types, findexes, timestamp){
        var findex="";
        var size="";
        var isFirst=true;
        for(var i=0;i<is_valid.length;i++){
            if(is_valid[i]==1){
                if(isFirst){
                    findex=findexes[i];
                    size=sizes[i];
                }else{
                    findex=findex+"_"+findexes[i];
                    size=size+"_"+sizes[i];
                }
            }
        }
        var taskInfo={
            uid: userid,
            btname : btname,
            cid: cid,
            goldbean: "0",
            silverbean: "0",
            tsize: tsize,
            findex: findex,
            size: size,
            o_taskid: "0",
            o_page: "task",
            class_id: "0",
            from: "0"
        };
        return taskInfo;
    },

    encryptPassword: function(password, verifyCode){
        console.log(password);
        console.log(verifyCode);
        var hash = md5(md5(password));
        hash=md5(hash+verifyCode);
        return hash;
    },

}