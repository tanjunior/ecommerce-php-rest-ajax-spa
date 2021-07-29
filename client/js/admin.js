function displayAdminPage() {
    $("#adminCols").html(
      
    "<div class='column is-7'>"+
    "<div class='box'>"+
        "<p><span class='title is-5'>Search orders by</span>"+
        "<label class='radio'><input type='radio' name='order' value='orderid'checked><span class='subtitle is-5'> Order ID</span></label>"+
        "<label class='radio'><input type='radio' name='order' value='userid'><span class='subtitle is-5'> User ID</span></label></p>"+
        "<input id='order-search' type='text'></input>"+
        "<table class='tablec'><thead><tr><th>Order ID</th><th>User ID</th><th>Price</th><th>Date</th><th>Status</th><th>Items</th></tr></thead>"+
        "<tbody id='orders-list'></tbody></table>"+
    "</div>"+
    
    "<div class='box'>"+
        "<table><p><span class='title is-5'>Search users by</span>"+
        "<label class='radio'><input type='radio' name='user' value='name'checked><span class='subtitle is-5'> Name</span></label>"+
        "<label class='radio'><input type='radio' name='user' value='email'><span class='subtitle is-5'> Email</span></label>"+
        "<label class='radio'><input type='radio' name='user' value='id'><span class='subtitle is-5'> ID</span></label></p>"+
        "<input id='user-search' type='text'></input>"+
        "<table class='table is-striped is-fullwidth'><thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Date joined</th></tr></thead>"+
        "<tbody id='users-list'></tbody></table>"+
    "</div>"+
    
    "<div class='box'>"+
        "<table><p><span class='title is-5'>Search items by</span>"+
        "<label class='radio'><input type='radio' name='item' value='keyword'checked><span class='subtitle is-5'> Keyword</span></label>"+
        "<label class='radio'><input type='radio' name='item' value='id'><span class='subtitle is-5'> Item ID</span></label>"+
        "<label class='radio'><input type='radio' name='item' value='category'><span class='subtitle is-5'> Category</span></label></p>"+
        "<input id='item-search' type='text'></input>"+
        "<table class='table is-striped is-fullwidth'><thead><tr><th>Item ID</th><th>Name</th><th>Price</th><th>Category</th><th>-------</th></tr></thead>"+
        "<tbody id='items-list'></tbody></table>"+
    "</div>"+

    "</div>"+
    "<div class='column is-5'>"+
    "<form id='addItemForm' class='box' onsubmit='return validateAddItem();'>"+
        "<p class='title is-5'>Add new item</p>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='text' name='name' placeholder='Name'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='text' name='category' placeholder='Category'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='text' name='description' placeholder='Description'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='number' name='price' placeholder='Price' min='0'></input></div></div>"+
        "<div class='field'><div class='control is-expanded'><input class='input' type='text' name='description' placeholder='Description'></input></div></div>"+
        "<div class='field'><div id='imageInput' class='file has-name'><label class='file-label'><input class='file-input' type='file' name='image'><span class='file-cta'><span class='file-icon'>"+
        "<i class='fas fa-upload'></i></span><span class='file-label'>Choose a image…</span></span><span class='file-name'>No image selected</span></label></div></div>"+
        "<div class='field'><div class='control'><button class='button is-primary'>Add</button></div></div>"+
    "</form>"+

    "<form id='addUserForm' class='box' onsubmit='return validateRegister(" +'"addUserForm"'+ ");'>"+
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
        let orders = await getOrder(type, value, false)
        
        let html = ""
        orders.forEach(order => {
            html = html + 
            "<tr><td>" +order.orderid+ 
            "</td><td onclick='openUserModal("+order.userid+")'>" +order.userid+ 
            "</td><td>" +order.price+ "</td><td>" +order.date+ "</td><td>" +order.status+ 
            "</td><td><button class='button is-small' onclick='openOrderModal("+ order.orderid +")'>Show</button></td></tr>"
        });
        $("#orders-list").html(html)

        
    })

    const usersList = document.querySelector('#users-list');
    document.querySelector('#user-search').addEventListener("input", function(e) {
        let type = $("input[type='radio'][name='user']:checked").val();
        let value = e.target.value
        if (value === "") {
            $("#users-list").html("")
            return
        }
        let xhr = new XMLHttpRequest();
        xhr.open('GET', api_url+"user/?type="+type+"&value="+value)
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (this.status === 200) {
                    let result = JSON.parse(xhr.responseText);
                    let users = result.data
                    let html = ""
                    users.forEach(user => {
                        html = html + "<tr><td>"+user.id + "</td><td>" + user.name + "</td><td>" +user.email+ "</td><td>" +user.role+ "</td><td>" +user.created_at+ "</td></tr>"
                    });
                    $("#users-list").html(html)
                } else {
                    let result = JSON.parse(xhr.responseText);
                    $("#users-list").html(result.message)
                }
            }
        }
        xhr.send();
    })

    const itemsList = document.querySelector('#items-list');
    document.querySelector('#item-search').addEventListener("input", function(e) {
        let type = $("input[type='radio'][name='item']:checked").val();
        let value = e.target.value
        if (value === "") {
            $("#items-list").html("")
            return
        }
        let xhr = new XMLHttpRequest();
        xhr.open('GET', api_url+"item/?type="+type+"&value="+value)
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (this.status === 200) {
                    let result = JSON.parse(xhr.responseText);
                    let items = result.data
                    let html = ""
                    items.forEach(item => {
                        html = html + "<tr><td>"+item.id + "</td><td>" + item.name + "</td><td>" +item.price+ "</td><td>" +item.category+ "</td><td><button class='button is-small' onclick='openItemModal("+item.id +")'>Edit</button></td></tr>"
                    });
                    $("#items-list").html(html)
                } else {
                    let result = JSON.parse(xhr.responseText);
                    $("#items-list").html(result.message)
                }
            }
        }
        xhr.send();
    })
}

async function openOrderModal(orderid) {
    let order = await getOrder("orderid", orderid, true)
    let statuses = {"pending" : false,"processing" : false,"delivering" : false,"delivered" : false}
    statuses[order.status] = true
    let options = ""
    for (const status in statuses) {
        if (statuses[status]) {
            options = options + "<option value='"+status+"' selected>"+status+"</option>"
        } else {
            options = options + "<option value='"+status+"'>"+status+"</option>"
        }
    }
    let items = JSON.parse(order.items)
    let trs = ""
    for (const id in items) {
        let item = await getItem(id, true)
        trs = trs + "<tr><td>"+id+"</td><td>"+item.name+"</td><td>"+items[id]+"</td></tr>"
    }
    
    $("#modal-content").html(
        "<header class='modal-card-head'><p class='modal-card-title'>EDIT ORDER ID("+order.orderid+")</p><button class='delete' aria-label='close' onclick='hideModal()'></button></header>"+
        "<section class='modal-card-body'>"+
        "<form id='orderUpdateForm' class='box'>"+
            "<div class='field'><label class='label'>Name</label><div class='control is-expanded'>"+order.userid+"</div></div>"+
            "<div class='field'><label class='label'>Items</label><div class='control is-expanded'><table class='table is-striped is-fullwidth'><thead><tr><td>Item ID</td><td>Item Name</td><td>Quantity</td></tr></thead>"+
            "<tbody>"+trs+"</tbody></table></div></div>"+
            "<div class='field'><label class='label'>Price</label><div class='control is-expanded'>"+order.price+"</div></div>"+
            "<div class='field'><label class='label'>Date</label><div class='control is-expanded'>"+order.date+"</div></div>"+
            "<div class='field'><label class='label'>Status</label><div class='control is-expanded'><div class='select'>"+
            "<select name='status' form='orderUpdateForm'>"+options+"</select></div></div></div>"+
        "</form></section>"+
        "<footer class='modal-card-foot'><button class='button is-success' onclick='validateOrderUpdate("+order.orderid+")'>Save changes</button><button class='button' onclick='hideModal()'>Cancel</button></footer>"
    )
    showModal()
}

async function openItemModal(itemid) {
    let item = await getItem(itemid, true)
    $("#modal-content").html(
        "<header class='modal-card-head'><p class='modal-card-title'>EDIT ITEM ID("+item.id+")</p><button class='delete' aria-label='close' onclick='hideModal()'></button></header>"+
        "<section class='modal-card-body'>"+
        "<form id='itemUpdateForm' class='box'>"+
            "<div class='field'><label class='label'>Name</label><div class='control is-expanded'><input class='input' type='text' name='name' value='"+item.name+"'></input></div></div>"+
            "<div class='field'><label class='label'>Description</label><div class='control'><textarea class='textarea' name='description' form='itemUpdateForm'>"+item.description+"</textarea></div></div>"+
            "<div class='field'><label class='label'>Price</label><div class='control is-expanded'><input class='input' type='number' name='price' min='0' value='"+item.price+"'></input></div></div>"+
            "<div class='field'><label class='label'>Category</label><div class='control is-expanded'><input class='input' type='text' name='category' value='"+item.category+"'></input></div></div>"+
        "</form></section>"+
        "<footer class='modal-card-foot'><button class='button is-success' onclick='validateItemUpdate("+item.id+")'>Save changes</button><button class='button' onclick='hideModal()'>Cancel</button></footer>"
    )
    showModal()
}