const api_url = "../server/api/" // api address, to be called globally

var burger = document.querySelector('.burger');
var menu = document.querySelector('#'+burger.dataset.target);
burger.addEventListener('click', function() {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
});

async function validateSearch(e) {
    e.preventDefault()
    let form = document.getElementById("searchForm")
    let formData = new FormData(form);
    let value = formData.get("keyword")
    if (value.length === 0) {
        return
    }
    
    let items = await getItem({"type":"keyword", "value": value})
    let html = ""
    items.data.forEach(item => {
        html = html + "<tr class='columns' onclick='generateItemPage("+item.itemid+")'>"+
        "<td class='column is-1'><img src='../server/images/"+item.imagename+ "' alt='" +item.name+ "'></td>"+
        "<td class='column is-3'>"+item.name+ "</td>"+
        "<td class='column is-6'>"+item.description+ "</td>"+
        "<td class='column is-2'>"+item.price+ "</td></tr>"
            
    });
    $("#searchResults").html(html)
    window.location.hash = "search";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* compare name with the trimmed cookie name  */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}

function checkCookie() {
    let user = getCookie("user");
    if (user > 0) {
        swapButtonGroup(true)
    } else {
        swapButtonGroup(false)
    }
}

function swapButtonGroup(isLogin) {
    if (isLogin) {
        $("#btn-group").html(
        '<p class="control"><a class="button is-small is-info is-inverted" href="#profile"><span class="icon"><i class="fa fa-user"></i></span><span>Profile</span></a></p>'+
        '<p class="control"><a class="button is-small is-white is-outlined" href="#logout" onclick="logout()"><span class="icon"><i class="fa fa-sign-out"></i></span><span>Logout</span></a></p>'
        );
    } else {
        $("#btn-group").html(
        '<p class="control"><a class="button is-small" href="#register"><span class="icon"><i class="fa fa-user-plus"></i></span><span>Register</span></a></p>'+
        '<p class="control"><a class="button is-small is-info is-inverted" href="#login"><span class="icon"><i class="fa fa-user-plus"></i></span><span>Login</span></a></p>'
        );
    }
}
function showModal() {
    $("#modal").addClass("is-active")
}

function clearModal() {
    $("#modal-content").html("")
}

function hideModal() {
    clearModal()
    $("#modal").removeClass("is-active")
}



function logout() {
    setCookie("user", "", 365);
    swapButtonGroup(false)
    window.location.hash = "home";
    $("#profileCols").html(""); //remove innerhtml of profile section to prevent naughty people from doing bad things
    $("#adminCols").html(""); //remove innerhtml of admin section to prevent naughty people from doing bad things
}

