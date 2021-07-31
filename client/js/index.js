//my api does not work on ceto, something seems to be restricting it. 
//api_request.js:34 POST http://ceto.murdoch.edu.au/~34309148/assignment2/server/api/user/login.php net::ERR_ABORTED 500 (Internal Server Error)

const api_url = "../server/api/"

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
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
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
    if (user != "" || user == null) {
        swapButtonGroup(true)
    } else {
        swapButtonGroup(false)
    }
}

function swapButtonGroup(isLogin) {
    if (isLogin) {
        $("#btn-group").html(
        '<p class="control"><a class="button is-small" href="#profile"><span class="icon"><i class="fa fa-user"></i></span><span>Profile</span></a></p>'+
        '<p class="control"><a class="button is-small is-info is-outlined" href="#logout" onclick="logout()"><span class="icon"><i class="fa fa-sign-out"></i></span><span>Logout</span></a></p>'
        );
    } else {
        $("#btn-group").html(
        '<p class="control"><a class="button is-small" href="#register"><span class="icon"><i class="fa fa-user-plus"></i></span><span>Register</span></a></p>'+
        '<p class="control"><a class="button is-small is-info is-outlined" href="#login"><span class="icon"><i class="fa fa-user-plus"></i></span><span>Login</span></a></p>'
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

