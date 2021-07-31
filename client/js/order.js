async function getOrder(params) {
    if (params.type == null) {
        let response = await apiRequest("GET", "order?id="+params.id,'application/json;charset=utf-8', null)
        return response
    } else {
        let response = await apiRequest("GET", "order?type="+params.type+"&value="+params.value,'application/json;charset=utf-8', null)
        return response
    }
}


async function validateOrderUpdate(id) {
    let form = document.getElementById("orderUpdateForm")
    let formData = new FormData(form);
    formData.append("orderid", id)
    let data = Object.fromEntries(formData.entries())

    if (data.orderid == null || data.orderid.length == 0) {
        alert("empty id")
        return
    } else if (data.status == null || data.status.length == 0) {
        alert("empty status")
        return
    }

    req = await apiRequest("PATCH", "order/",'application/json;charset=utf-8', JSON.stringify(data))
    if (req.success) {
        hideModal()
        clearModal()
    }
}

function populateCartDetails() {
    $('#cart-table').html("<tbody id='cartItems'></tbody>")
    if (getCookie("cart") != "") {
        let data = JSON.parse(getCookie("cart"))
        if (Object.values(data).length == 0) {
            return
        }
        
        let query = ""
        let count = 0
        for (const key in data) {
            if (count+1 == Object.values(data).length) {
                query = query + key
            } else {
                query = query + key + " OR ItemID = "
            } 
            count++
        }
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return false;
            let result = JSON.parse(xhr.responseText);
            let items = result
            let html = ""
            items.forEach(item => {
                html = html +
                "<tr class='box columns is-mobile is-vcentered tableRow' data-id='" +item.id+"'>"+
                "<td class='column is-2'><img src='../server/images/"+item.imagename+ "' alt='" +item.name+ "'></td>"+
                "<td class='column is-3'>"+item.name+ "</td>"+
                "<td class='column is-3 cart-item-price' data-id='"+item.price+"'>" +data[item.id]*item.price+ "</td>"+
                "<td class='column is-3'><input class='input is-small' type='number' min='1' value='" +data[item.id]+ "' data-id='" +item.id+ "'</input></td>"+
                "<td class='column is-1'><button class='button is-small'>X</button></td></tr>"
                
            });
            $("#cartItems").html(html)

            let userid = getCookie("user")
            if (userid != "") {
                $('#cart-table').append("<br><button class='button is-primary is-large is-fullwidth' onclick='makeOrder()'>ORDER</button>")
            } else {
                
                $('#cart-table').append(
                    "<br><div class='field'><p class='control is-expanded'><a class='button is-primary is-large is-fullwidth' href='#login'>Login to place order</a></p>"+
                    "<br><p class='control is-expanded'><a class='button is-link is-large is-fullwidth' href='#register'>Register</a></p></div>"
                )
            }

            const cartTableBody = document.getElementById('cartItems');
            cartTableBody.addEventListener('click', (evt) => {
                // if the clicked element is INPUT or BUTTON, return AKA halt
                if (evt.target.tagName === 'INPUT') return;

                const row = evt.target.closest("tr")
                const id = row.dataset.id; // says error but it work  
                // if element's parent TR doesn't have data-id, return AKA halt
                if (id === undefined)
                    return;


                if (evt.target.tagName === 'BUTTON') {
                    let cart = getCookie("cart")
                    cart = JSON.parse(cart);
                    delete cart[id]
                    setCookie("cart", JSON.stringify(cart), 365)
                    row.remove()
                    return
                }
                // call func or insert code here
                generateItemPage(id);
            });

            cartTableBody.addEventListener('change', (evt) => {
                // if the clicked element is INPUT or BUTTON, return AKA halt
                if (evt.target.tagName !== 'INPUT')
                    return;

                const id = evt.target.dataset.id; // says error but it works
                const value = evt.target.value
                // if element doesn't have data-id, return AKA halt
                if (id === undefined)
                    return;

                const price = evt.target.closest("tr").querySelector(".cart-item-price").dataset.id
                evt.target.closest("tr").querySelector(".cart-item-price").innerHTML = price * value

                let cart = getCookie("cart")
                cart = JSON.parse(cart);
                if (value == 0) {
                    delete cart[id]
                } else {
                    cart[id] = value
                }
                setCookie("cart", JSON.stringify(cart), 365)
            });
        }
        xhr.open("GET", api_url+"item?id="+query, true)
        xhr.send()

    }
}

async function makeOrder() {
    let data = JSON.parse(getCookie("cart"))
    if (Object.values(data).length == 0) {
        return
    }

    console.log(data)
    let response = await apiRequest("POST", "order/", 'application/json;charset=utf-8', JSON.stringify({"user": JSON.parse(getCookie("user")), "cart":data}))
    if (response.success) {
        setCookie("cart", "", 365);
        window.location.hash = "home"
    } else {
        return
    }
}

async function openOrderModal(orderid) {
    let order = await getOrder({"id":orderid})
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
        "<header class='modal-card-head'><p class='modal-card-title'>ORDER ID("+orderid+")</p><button class='delete' aria-label='close' onclick='hideModal()'></button></header>"+
        "<section class='modal-card-body'>"+
        "<form id='orderUpdateForm' class='box'>"+
            "<div class='field'><label class='label'>Items</label><div class='control is-expanded'><table class='table is-striped is-fullwidth'><thead><tr><td>ID</td><td>Name</td><td>Price</td><td>Quantity</td></tr></thead>"+
            "<tbody>"+trs+"</tbody></table></div></div>"+
            "<div class='field'><label class='label'>Price</label><div class='control is-expanded'>"+order.data[0].price+"</div></div>"+
            "<div class='field'><label class='label'>Date</label><div class='control is-expanded'>"+order.data[0].date+"</div></div>"+
            "<div class='field'><label class='label'>Status</label><div class='control is-expanded'>"+order.data[0].status+"</div></div>"+
        "</form></section>"
    )
    showModal()
}