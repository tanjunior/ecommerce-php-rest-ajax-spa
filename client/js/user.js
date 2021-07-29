async function generateProfile(id) {
    let user = await getUser(id, true)
    if (user.role == "staff") {
        $("#profileCols").html(
            "<p class='column is-half is-offset-one-quarter'>You are a Staff! Go to the <a class='button is-small is-info is-outlined' href='#admin'>admin panel</a></p>"
        )
    }

    
    $("#profileCols").append("<div class='column is-half is-offset-one-quarter'><form id='userUpdateForm' class='box' onsubmit='return validateUserUpdate();'>"+
            "<div class='field'><label class='label'>Name</label><div class='control is-expanded'><input class='input' type='text' name='name' value='"+user.name+"'></input></div></div>"+
            "<div class='field'><label class='label'>Email</label><div class='control is-expanded'><input class='input' type='email' name='email' value='"+user.email+"'></input></div></div>"+
            "<div class='field'><div class='control'><button class='button is-primary'>save</button></div></div>"+
        "</form>"+
        "<form id='changePasswordForm' class='box' onsubmit='return validateChangePassword();'>"+
            "<div class='field'><label class='label'>Current Password</label><div class='control is-expanded'><input class='input' type='password' name='current'></input></div></div>"+
            "<div class='field'><label class='label'>New Password</label><div class='control is-expanded'><input class='input' type='password' name='password'></input></div></div>"+
            "<div class='field'><label class='label'>Confirm New Password</label><div class='control is-expanded'><input class='input' type='password' name='password2'></input></div></div>"+
            "<div class='field'><div class='control'><button class='button is-primary'>save</button></div></div>"+
        "</form></div>"
    )
}

function validateRegister(formid) {
    let form = document.getElementById(formid)
    let formData = new FormData(form);

    if (formid == "addUserForm") {
        formData.append("role", "staff")
    }
    let data = Object.fromEntries(formData.entries())

    if (data.name == null || data.name.length == 0) {
        alert("empty name")
        return false
    } else if (data.email == null || data.email.length == 0) {
        alert("empty email")
        return false
    } else if (data.password == null || data.password.length == 0) {
        alert("empty password")
        return false
    } else if (data.password2 == null || data.password2.length == 0) {
        alert("empty password2")
        return false
    } else if (data.password != data.password2) {
        alert("password not match")
        return false
    } // TODO: check if email exist

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', api_url+"user/register.php", true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 201) {
                let result = JSON.parse(this.responseText);
                form.reset()
                if (formid == "registerForm") {
                    window.location.hash = "login";
                }
            }
        }
    }
    xhr.send(JSON.stringify(data));
    return false; //prevent form default action
}

function validateLogin() {
    let form = document.getElementById("loginForm")
    let formData = new FormData(form);

    let data = Object.fromEntries(formData.entries())

    if (data.email == null || data.email.length == 0) {
        alert("empty email")
        return false
    } else if (data.password == null || data.password.length == 0) {
        alert("empty password")
        return false
    }

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', api_url+"user/login.php", true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let result = JSON.parse(this.responseText);
                setCookie("user", result.message, 365);
                window.location.hash = "home";
                swapButtonGroup(true)
            }
        }
    }
    xhr.send(JSON.stringify(data));
    return false; //prevent form default action
}

function validateUserUpdate() {
    let form = document.getElementById("userUpdateForm")
    let formData = new FormData(form);
    formData.append("id", parseInt(getCookie("user")))
    let data = Object.fromEntries(formData.entries())

    if (data.id == null || data.id.length == 0) {
        alert("Please relogin")
        return false
    } else if (data.name == null || data.name.length == 0) {
        alert("empty name")
        return false
    } else if (data.email == null || data.email.length == 0) {
        alert("empty email")
        return false
    }

    
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('PATCH', api_url+"user/update.php", true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let result = JSON.parse(this.responseText);
                console.log(result)
            }
        }
    }
    xhr.send(JSON.stringify(data));
    return false; //prevent form default action
}

function validateChangePassword() {
    let form = document.getElementById("changePasswordForm")
    let formData = new FormData(form);
    formData.append("id", parseInt(getCookie("user")))
    let data = Object.fromEntries(formData.entries())

    if (data.id == null || data.id.length == 0) {
        alert("Please relogin")
        return false
    } else if (data.current == null || data.current.length == 0) {
        alert("current password empty")
        return false
    } else if (data.password == null || data.password.length == 0) {
        alert("password empty")
        return false
    } else if (data.password2 == null || data.password2.length == 0) {
        alert("confirm password empty")
        return false
    } else if (data.password != data.password2) {
        alert("password not match")
        return false
    }

    delete data.password2;

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('PATCH', api_url+"user/changepassword.php", true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let result = JSON.parse(this.responseText);
                form.reset()
            }
        }
    }
    xhr.send(JSON.stringify(data));
    return false; //prevent form default action
}

async function getUser(id, one) {
    let user = await apiRequest("GET","user?id="+id,null)
    let data = user.data[0]
    if (one) return user.data[0]
    return user.data
}