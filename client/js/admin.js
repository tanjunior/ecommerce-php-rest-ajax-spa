function displayAdminPage() {
    $("#adminCols").html(
      
    "<div class='column is-8'>"+
    "<div class='box'>"+
        "<p><span class='title is-5'>Search orders by</span>"+
        "<label class='radio'><input type='radio' name='order' value='orderid'checked><span class='subtitle is-5'> Order ID</span></label>"+
        "<label class='radio'><input type='radio' name='order' value='userid'><span class='subtitle is-5'> User ID</span></label></p>"+
        "<input id='order-search' type='text'></input>"+
        "<table class='table is-striped is-fullwidth'><thead><tr><th>Order ID</th><th>User ID</th><th>Price</th><th>Date</th><th>Status</th><th>Items</th></tr></thead>"+
        "<tbody id='orders-list'></tbody></table>"+
    "</div>"+
    
    "<div class='box'>"+
        "<table><p><span class='title is-5'>Search users by</span>"+
        "<label class='radio'><input type='radio' name='user' value='name'checked><span class='subtitle is-5'> Name</span></label>"+
        "<label class='radio'><input type='radio' name='user' value='email'><span class='subtitle is-5'> Email</span></label>"+
        "<label class='radio'><input type='radio' name='user' value='id'><span class='subtitle is-5'> ID</span></label></p>"+
        "<input id='user-search' type='text'></input>"+
        "<table class='table is-striped is-fullwidth'><thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Date joined</th><th></th></tr></thead>"+
        "<tbody id='users-list'></tbody></table>"+
    "</div>"+
    
    "<div class='box'>"+
        "<table><p><span class='title is-5'>Search items by</span>"+
        "<label class='radio'><input type='radio' name='item' value='keyword'checked><span class='subtitle is-5'> Keyword</span></label>"+
        "<label class='radio'><input type='radio' name='item' value='itemid'><span class='subtitle is-5'> Item ID</span></label>"+
        "<label class='radio'><input type='radio' name='item' value='category'><span class='subtitle is-5'> Category</span></label></p>"+
        "<input id='item-search' type='text'></input>"+
        "<table class='table is-striped is-fullwidth'><thead><tr><th>Item ID</th><th>Name</th><th>Price</th><th>Category</th><th></th></tr></thead>"+
        "<tbody id='items-list'></tbody></table>"+
    "</div>"+

    "</div>"+
    "<div class='column is-4'>"+
    "<form id='addItemForm' class='box' onsubmit='validateAddItem(event)'>"+
        "<p class='title is-5'>Add new item</p>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='text' name='name' placeholder='Name'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><div class='select'><select name='category' form='addItemForm'>"+
            "<option value='Fruits'>Fruits</option>"+
            "<option value='Vegetables'>Vegetables</option>"+
            "<option value='Mushrooms'>Mushrooms</option>"+
            "<option value='Herbs'>Herbs</option>"+
            "<option value='Legumes'>Legumes</option>"+
        "</select></div></div></div>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='number' name='price' placeholder='Price' min='0'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><textarea class='textarea' name='description' form='addItemForm' placeholder='Description'></textarea></div></div>"+
        "<div class='field'><div id='imageInput' class='file has-name'><label class='file-label'><input class='file-input' type='file' accept='image/jpeg' name='image'><span class='file-cta'><span class='file-icon'>"+
        "<i class='fas fa-upload'></i></span><span class='file-label'>Choose a image…</span></span><span class='file-name'>No image selected</span></label></div></div>"+
        "<div class='field'><div class='control'><button class='button is-primary'>Add</button></div></div>"+
    "</form>"+

    "<form id='addUserForm' class='box' onsubmit='validateRegister(event)'>"+
        "<p class='title is-5'>Add new staff</p>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='text' name='name' placeholder='Name'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='email' name='email' placeholder='Email'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='password' name='password' placeholder='Password'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='password' name='password2' placeholder='Confirm Password'></input></div></div>"+
        "<div class='field'><div class='control'><button class='button is-primary'>Add</button></div></div>"+
    "</form>"+

    "</div>"
    )

    const fileInput = document.querySelector('#imageInput input[type=file]');
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
        const fileName = document.querySelector('#imageInput .file-name');
        fileName.textContent = fileInput.files[0].name;
        }
    }

    const ordersList = document.querySelector('#orders-list');
    document.querySelector('#order-search').addEventListener("input", async function(e) {
        let type = $("input[type='radio'][name='order']:checked").val();
        let value = e.target.value
        if (value === "") {
            $("#orders-list").html("")
            return
        }
        let orders = await getOrder({"type":type, "value":value})
        
        if (orders.success) {
            let html = ""
            orders.data.forEach(order => {
                html = html + 
                "<tr><td>" +order.orderid+ 
                "</td><td onclick='openUserModal("+order.userid+")'>" +order.userid+ 
                "</td><td>" +order.price+ "</td><td>" +order.date+ "</td><td>" +order.status+ 
                "</td><td><button class='button is-small is-info' onclick='adminOpenOrderModal("+ order.orderid +")'>Show</button></td></tr>"
            });
            $("#orders-list").html(html)
        } else {
            $("#orders-list").html("No matching order found")
        }

        
    })

    const usersList = document.querySelector('#users-list');
    document.querySelector('#user-search').addEventListener("input", async function(e) {
        let type = $("input[type='radio'][name='user']:checked").val();
        let value = e.target.value
        if (value === "") {
            $("#users-list").html("")
            return
        }
        let users = await getUser({"type": type, "value": value});
        if (users.success) {
            let html = ""
            users.data.forEach(user => {
                html = html + "<tr><td>"+user.id + "</td><td>" + user.name + "</td><td>" +user.email+ "</td><td>" +user.role+ 
                "</td><td>" +user.created_at+ "</td><td><button class='button is-small is-info' onclick='openUserModal("+user.id +")'>Edit</button></td></tr>"
            });
            $("#users-list").html(html)
        } else {
            $("#users-list").html("No matching user found")
        }
    })

    const itemsList = document.querySelector('#items-list');
    document.querySelector('#item-search').addEventListener("input", async function(e) {
        let type = $("input[type='radio'][name='item']:checked").val();
        let value = e.target.value
        if (value === "") {
            $("#items-list").html("")
            return
        }


        let items = await getItem({"type":type, "value":value})
        let html = ""
        if(items.success) {
            items.data.forEach(item => {
                html = html + "<tr><td>"+item.itemid + "</td><td>" + item.name + "</td><td>" +item.price+ "</td><td>" +item.category+ 
                "</td><td><button class='button is-small is-info' onclick='openItemModal("+item.itemid +")'>Edit</button></td></tr>"
            });
            $("#items-list").html(html)
        } else {
            $("#items-list").html("No matching item found")
        }
    })
}

async function adminOpenOrderModal(orderid) {
    let order = await getOrder({"id":orderid})
    let statuses = {"pending" : false,"processing" : false,"delivering" : false,"delivered" : false}
    statuses[order.data[0].status] = true
    let options = ""
    for (const status in statuses) {
        if (statuses[status]) {
            options = options + "<option value='"+status+"' selected>"+status+"</option>"
        } else {
            options = options + "<option value='"+status+"'>"+status+"</option>"
        }
    }

    let items = JSON.parse(order.data[0].items)
    let trs = ""
    for (const id in items) {
        let item = await getItem({"id":id})
        if (item.success) {
            trs = trs + "<tr><td>"+id+"</td><td>"+item.data[0].name+"</td><td>"+item.data[0].price+"</td><td>"+items[id]+"</td></tr>"
        } else {
            trs = trs + "<tr><td colspan='3'>item was removed</td></tr>"
        }
    }
    
    $("#modal-content").html(
        "<header class='modal-card-head'><p class='modal-card-title'>EDIT ORDER ID("+orderid+")</p><button class='delete' aria-label='close' onclick='hideModal()'></button></header>"+
        "<section class='modal-card-body'>"+
        "<form id='orderUpdateForm' class='box'>"+
            "<div class='field'><label class='label'>Name</label><div class='control is-expanded'>"+order.data[0].userid+"</div></div>"+
            "<div class='field'><label class='label'>Items</label><div class='control is-expanded'><table class='table is-striped is-fullwidth'><thead><tr><td>ID</td><td>Name</td><td>Price</td><td>Quantity</td></tr></thead>"+
            "<tbody>"+trs+"</tbody></table></div></div>"+
            "<div class='field'><label class='label'>Price</label><div class='control is-expanded'>"+order.data[0].price+"</div></div>"+
            "<div class='field'><label class='label'>Date</label><div class='control is-expanded'>"+order.data[0].date+"</div></div>"+
            "<div class='field'><label class='label'>Status</label><div class='control is-expanded'><div class='select'>"+
            "<select name='status' form='orderUpdateForm'>"+options+"</select></div></div></div>"+
        "</form></section>"+
        "<footer class='modal-card-foot'><button class='button is-success' onclick='validateOrderUpdate("+orderid+")'>Save changes</button><button class='button' onclick='hideModal()'>Cancel</button></footer>"
    )
    showModal()
}

async function openUserModal(userid) {
    let roles = {"staff" : false, "member" : false}
    let user = await getUser({"id": userid})
    roles[user.data[0].role] = true
    let options = ""
    for (const role in roles) {
        if (roles[role]) {
            options = options + "<option value='"+role+"' selected>"+role+"</option>"
        } else {
            options = options + "<option value='"+role+"'>"+role+"</option>"
        }
    }
    $("#modal-content").html(
        "<header class='modal-card-head'><p class='modal-card-title'>EDIT USER ID("+userid+")</p><button class='delete' aria-label='close' onclick='hideModal()'></button></header>"+
        "<section class='modal-card-body'>"+
        "<form id='adminUpdateUserForm' class='box'>"+
            "<div class='field'><label class='label'>Name</label><div class='control is-expanded'><input class='input' type='text' name='name' value='"+user.data[0].name+"'></input></div></div>"+
            "<div class='field'><label class='label'>Email</label><div class='control is-expanded'><input class='input' type='email' name='email' value='"+user.data[0].email+"'></input></div></div>"+
            "<div class='field'><label class='label'>Role</label><div class='control is-expanded'><div class='select'>"+
            "<select name='role' form='adminUpdateUserForm'>"+options+"</select></div></div></div>"+
        "</form></section>"+
        "<footer class='modal-card-foot'><button class='button is-success' onclick='adminUpdateUser("+userid+")'>Save changes</button><button class='button' onclick='hideModal()'>Cancel</button></footer>"
    )
    showModal()
}

async function openItemModal(itemid) {
    let item = await getItem({"id": itemid})
    $("#modal-content").html(
        "<header class='modal-card-head'><p class='modal-card-title'>EDIT ITEM ID("+itemid+")</p><button class='delete' aria-label='close' onclick='hideModal()'></button></header>"+
        "<section class='modal-card-body'>"+
        "<form id='itemUpdateForm' class='box'>"+
            "<div class='field'><label class='label'>Name</label><div class='control is-expanded'><input class='input' type='text' name='name' value='"+item.data[0].name+"'></input></div></div>"+
            "<div class='field'><label class='label'>Description</label><div class='control'><textarea class='textarea' name='description' form='itemUpdateForm'>"+item.data[0].description+"</textarea></div></div>"+
            "<div class='field'><label class='label'>Price</label><div class='control is-expanded'><input class='input' type='number' name='price' min='0' value='"+item.data[0].price+"'></input></div></div>"+
            "<div class='field'><label class='label'>Category</label><div class='control is-expanded'><input class='input' type='text' name='category' value='"+item.data[0].category+"'></input></div></div>"+
        "</form></section>"+
        "<footer class='modal-card-foot'><button class='button is-success' onclick='validateItemUpdate("+itemid+")'>Save changes</button>"+
        "<button class='button is-danger' onclick='deleteItem("+itemid+")'>Delete</button><button class='button' onclick='hideModal()'>Cancel</button></footer>"
    )
    showModal()
}