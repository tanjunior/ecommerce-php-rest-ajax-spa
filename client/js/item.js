const getAllProducts = async function() {
    let items = await getItem(null, false)
    html = ""
    items.forEach(item => {
        html = html + "<div class='column'>"+
        "<figure class='box image' onclick='generateItemPage("+item.id+")'>"+
        "<p class='title is-3'>"+item.name+" "+item.capacity+"</p>"+
        "<img src=../server/images/"+item.imagename+" alt='"+item.name+"'>"+
        "<p class='subtitle is-3'>$"+item.price+"</p></figure></div>"
    });
    $("#productCols").html(html)
}

async function getItem(value, one) {
    if (one) {
        let item = await apiRequest("GET","item?type=itemid&value="+value,null)
        return item.data[0]
    } else {
        let item = await apiRequest("GET","item",null)
        return item.data
    }    
}

async function generateItemPage(itemid) {
    let item = await getItem(itemid, true)
    $("#itemCols").html(
        "<div class='column'><div class='columns is-vcentered'><div class='box column is-8 is-offset-2'>"+
            "<figure class='image'><img src='../server/images/"+item.imagename+"' alt='name'></figure>"+
            "<p class='title is-1'>"+item.name+"<span class='subtitle is-6'>"+item.capacity+"</span></p>"+
            "<p class='subtitle is-3'>"+item.color+"</p>"+
            "<p class='subtitle is-2'>"+item.price+"</p>"+
            "<div class='content'><blockquote>"+item.description+"</blockquote></div>"+
            "<button class='button is-large is-fullwidth' data-id='" +item.id+ "' onclick='addItemToCart("+item.id+ ");'>Add to cart</button>"+
        "</div></div></div>"
    )
    showDelete(itemid)
    window.location.hash = "item";
}

function showDelete(itemid) {
    let id = getCookie("user")
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        let result = JSON.parse(xhr.responseText);
        let user = result.data[0]
        
        
        if (user.role == "staff") {
            $("#itemCols div .box").append(
                "<button id='btn-delete-item' class='button is-danger is-small is-fullwidth'>DELETE</button>"
            )
        }

        let btn = document.getElementById('btn-delete-item');
        btn.addEventListener('click', (evt) => { 
            deleteItem(itemid);
        });
    }
    xhr.open("GET", api_url+"user?id="+id, true)
    xhr.send()
}

function addItemToCart(value) {
    let item = {}
    item[value] = 1
    let cart = getCookie("cart")
    if (cart == "") {
        cart = item
    } else {
        cart = JSON.parse(cart);
        if (Object.hasOwnProperty.call(cart, value)) {
            cart[value]++
        } else {
            cart[value] = 1
        }
    }
    setCookie("cart", JSON.stringify(cart), 365)
}

async function deleteItem(id) {
    let json = JSON.stringify({ "id": id })
    let req = await apiRequest("DELETE","item/delete.php/",json)
    window.location.hash = "products";
}



function validateAddItem() {
    let form = document.getElementById("addItemForm")
    let formData = new FormData(form);

    let data = Object.fromEntries(formData.entries())

    if (data.name == null || data.name.length == 0) {
        alert("empty name")
        return false
    } else if (data.category == null || data.category.length == 0) {
        alert("empty email")
        return false
    } else if (data.description == null || data.description.length == 0) {
        alert("empty description")
        return false
    } else if (data.price == null || data.price < 0) {
        alert("empty price")
        return false
    } else if (data.image.size === 0 || data.image.name === "") {
        alert("empty image")
        return false
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url+"item/add.php/")
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.status)
            let result = JSON.parse(xhr.responseText);
            console.log(result.message)
            form.reset()
        }
    }
    xhr.send(formData);
    return false; //prevent form default action
}

function validateItemUpdate(id) {
    let form = document.getElementById("itemUpdateForm")
    let formData = new FormData(form);
    formData.append("itemid", id)
    let data = Object.fromEntries(formData.entries())

    if (data.itemid == null || data.itemid.length == 0) {
        alert("empty id")
        return
    } else if (data.name == null || data.name.length == 0) {
        alert("empty name")
        return
    } else if (data.description == null || data.description.length == 0) {
        alert("empty description")
        return
    } else if (data.category == null || data.category.length == 0) {
        alert("empty category")
        return
    } else if (data.price == null || data.price.length == 0) {
        alert("empty price")
        return
    }

    
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('PATCH', api_url+"item/", true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let result = JSON.parse(this.responseText);
                console.log(result.message)
                hideModal()
                clearModal()
            }
        }
    }
    xhr.send(JSON.stringify(data));
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
            let items = result.data
            let html = ""
            items.forEach(item => {
                html = html +
                "<tr class='box columns is-mobile is-vcentered tableRow' data-id='" +item.id+"'>"+
                "<td class='column is-2'><img src=../server/images/"+item.imagename+ " alt='" +item.name+ "'></td>"+
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

function makeOrder() {
    let data = JSON.parse(getCookie("cart"))
    if (Object.values(data).length == 0) {
        return
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', api_url+"order/")
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.status)
            let result = JSON.parse(xhr.responseText);
            console.log(result.message)
            setCookie("cart", "", 365);
            window.location.hash = "home"
        }
    }
    xhr.send(JSON.stringify({"user": JSON.parse(getCookie("user")), "cart":data}));
    return false; //prevent form default action
}

