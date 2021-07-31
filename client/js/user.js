async function generateProfile(id) {
    let user = await getUser({"id": id})
    if (user.success) {
        if (user.data[0].role == "staff") {
            $("#profileBanner").html(
                "<section class='hero is-small is-info'><div class='hero-body'><div class='container has-text-centered'>"+
                    "<p class='title'>You are a Staff! Go to the <a class='button is-info is-medium is-outlined is-inverted' href='#admin'>admin panel</a></p>"+
				"</div></div></section>"
            )
        }
    }

    
    $("#profileCols").append(       
        "<div class='column is-6'><form id='userUpdateForm' class='box' onsubmit='validateUserUpdate(event);'>"+
            "<div class='field'><label class='label'>Name</label><div class='control is-expanded'><input class='input' type='text' name='name' value='"+user.data[0].name+"'></input></div></div>"+
            "<div class='field'><label class='label'>Email</label><div class='control is-expanded'><input class='input' type='email' name='email' value='"+user.data[0].email+"'></input></div></div>"+
            "<div class='field'><div class='control'><button class='button is-primary'>save</button></div></div>"+
        "</form>"+
        "<form id='changePasswordForm' class='box' onsubmit='validateChangePassword(event);'>"+
            "<div class='field'><label class='label'>Current Password</label><div class='control is-expanded'><input class='input' type='password' name='current'></input></div></div>"+
            "<div class='field'><label class='label'>New Password</label><div class='control is-expanded'><input class='input' type='password' name='password'></input></div></div>"+
            "<div class='field'><label class='label'>Confirm New Password</label><div class='control is-expanded'><input class='input' type='password' name='password2'></input></div></div>"+
            "<div class='field'><div class='control'><button class='button is-primary'>save</button></div></div>"+
        "</form></div>"
    )
    
    let orders = await getOrder({"type": "userid", "value": id})
    if (orders.success) {
        $("#profileCols").prepend("<div class='column is-6'><table class='table is-striped is-fullwidth'><thead><tr><th>Order ID</th><th>Date</th><th>Price</th><th>Status</th><th>Items</th></tr></thead>"+
        "<tbody id='my-orders'></tbody></table></div>")
        orders.data.forEach(order => {
            $("#my-orders").append(
                "<tr><td>"+order.orderid+"</td><td>"+order.date+"</td><td>"+order.price+"</td><td>"+order.status+"</td><td><button class='button is-small is-info' onclick='openOrderModal("+ order.orderid +")'>Show</button></td></tr>"
            )
        });
    }

}

async function validateRegister(e) {
    e.preventDefault();
    let formid = e.target.id
    let form = document.getElementById(formid)
    let formData = new FormData(form);

    if (formid == "addUserForm") {
        formData.append("role", "staff")
    }
    let data = Object.fromEntries(formData.entries())

    if (data.name == null || data.name.length == 0) {
        alert("empty name")
        return
    } else if (data.email == null || data.email.length == 0) {
        alert("empty email")
        return
    } else if (data.password == null || data.password.length == 0) {
        alert("empty password")
        return
    } else if (data.password2 == null || data.password2.length == 0) {
        alert("empty password2")
        return
    } else if (data.password != data.password2) {
        alert("password not match")
        return
    } // TODO: check if email exist

    let response = await apiRequest("POST", "user/registerNoPasswordEncryption.php", 'application/json;charset=utf-8', JSON.stringify(data))
    if (response.success) {
        form.reset()
        if (formid == "registerForm") {
            window.location.hash = "login";
        }
    }
}

async function validateLogin(e) {
    e.preventDefault()
    let form = document.getElementById("loginForm")
    let formData = new FormData(form);

    let data = Object.fromEntries(formData.entries())

    if (data.email == null || data.email.length == 0) {
        alert("empty email")
        return
    } else if (data.password == null || data.password.length == 0) {
        alert("empty password")
        return
    }

    let response = await apiRequest("POST", "user/loginNoPasswordEncryption.php", "application/json;charset=UTF-8", JSON.stringify(data))
    if (response.success) {
        setCookie("user", response.data.message, 365);
        window.location.hash = "home";
        swapButtonGroup(true)
    }
}

async function validateUserUpdate(e) {
    e.preventDefault()
    let form = document.getElementById("userUpdateForm")
    let formData = new FormData(form);
    formData.append("id", parseInt(getCookie("user")))
    let data = Object.fromEntries(formData.entries())

    if (data.id == null || data.id.length == 0) {
        alert("Please relogin")
        return
    } else if (data.name == null || data.name.length == 0) {
        alert("empty name")
        return
    } else if (data.email == null || data.email.length == 0) {
        alert("empty email")
        return
    }

    req = await apiRequest("PATCH", "user/update.php", 'application/json;charset=utf-8', JSON.stringify(data))
}

async function validateChangePassword(e) {
    e.preventDefault()
    let form = document.getElementById("changePasswordForm")
    let formData = new FormData(form);
    formData.append("id", parseInt(getCookie("user")))
    let data = Object.fromEntries(formData.entries())

    if (data.id == null || data.id.length == 0) {
        alert("Please relogin")
        return
    } else if (data.current == null || data.current.length == 0) {
        alert("current password empty")
        return
    } else if (data.password == null || data.password.length == 0) {
        alert("password empty")
        return
    } else if (data.password2 == null || data.password2.length == 0) {
        alert("confirm password empty")
        return
    } else if (data.password != data.password2) {
        alert("password not match")
        return
    }

    delete data.password2;

    let response = await apiRequest("PATCH", "user/changepassword.php", "application/json;charset=UTF-8", JSON.stringify(data))
    if (response.success) {
        form.reset()
    }
}

async function adminUpdateUser(id) {
    let form = document.getElementById("adminUpdateUserForm")
    let formData = new FormData(form);
    formData.append("id", id)
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
    } else if (data.role == null || data.role.length == 0) {
        alert("empty role")
        return false
    }


    req = await apiRequest("PATCH", "user/update.php", "application/json;charset=UTF-8", JSON.stringify(data))
    if (req.success) {
        hideModal()
        clearModal()
    }
}