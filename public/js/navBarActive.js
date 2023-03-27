function activeProject(){
    setCookieNavBar("p");
}

function activeUser(){
    setCookieNavBar("u");   
}

function activeData(){
    setCookieNavBar("d");
}

const setCookieNavBar = (x)=>{
    document.cookie = "activeTab = "+x;
}

const getCookieNavBar = ()=>{
    let cookies = document.cookie;
    return cookies[10];
}

tab  = getCookieNavBar();
if (tab=="p"){
    element = document.getElementById("project");
}else if (tab=="u"){
    element = document.getElementById("user");
}else{
    element = document.getElementById("data");
}
element.className = element.className + " active";