async function getAllProducts() {
    let items = await getAllItems()
    html = ""
    if (items.success) {
        items.data.forEach(item => {
            html += "<div class='column is-3-fullhd is-4-widescreen is-6-desktop is-12-tablet is-12-mobile'>"+
            "<figure class='box image' onclick='generateItemPage("+item.id+")'>"+
            "<p class='title is-3'>"+item.name+"</p>"+
            "<img src='../server/images/"+item.imagename+"' alt='"+item.name+"'>"+
            "<p class='subtitle is-3'>$"+item.price+"</p></figure></div>"
        });
        $("#productCols").html(html)
    }
}

async function generateItemPage(itemid) {
    let item = await getItem({"id":itemid})
    $("#itemCols").html(
        "<div class='column'><div class='columns is-vcentered'><div class='box content column is-8 is-offset-2'>"+
            "<figure class='image'><img src='../server/images/"+item.data[0].imagename+"' alt='name'></figure>"+
            "<p class='title is-1'>"+item.data[0].name+"</p>"+
            "<p class='subtitle is-3'>$"+item.data[0].price+"</p>"+
            "<div class='content'><blockquote>"+item.data[0].description+"</blockquote></div>"+
            "<button class='button is-large is-fullwidth' data-id='" +itemid+ "' onclick='addItemToCart("+itemid+ ");'>Add to cart</button>"+
        "</div></div></div>"
    )
    window.location.hash = "item";
}

function addItemToCart(value) {
    let item = {}
    item[value] = 1
    let cart = getCookie("cart")
    if (cart === "" || cart == null) {
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
    let req = await apiRequest("DELETE","item/delete.php/",'application/json;charset=utf-8',json)
    if (req.success) {
        hideModal()
        clearModal()
    }
}



async function validateAddItem(e) {
    e.preventDefault()
    let form = document.getElementById("addItemForm")
    let formData = new FormData(form);

    let data = Object.fromEntries(formData.entries())

    if (data.name == null || data.name.length == 0) {
        alert("empty name")
        return
    } else if (data.category == null || data.category.length == 0) {
        alert("empty category")
        return
    } else if (data.description == null || data.description.length == 0) {
        alert("empty description")
        return
    } else if (data.price == null || data.price < 0) {
        alert("empty price")
        return
    } else if (data.image.size === 0 || data.image.name === "") {
        alert("empty image")
        return
    }

    let image = new File([data.image], data.name+".jpeg", {
        type: data.image.type,
        lastModified: data.image.lastModified
    })

    formData.delete("image")
    formData.append("image", image)
    let response = await apiRequest("POST", "item/add.php/", null, formData)
    if (response.success) {
        form.reset()
    }
}

async function validateItemUpdate(id) {
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

    let response = await apiRequest("PATCH", "item/",'application/json;charset=utf-8', JSON.stringify(data))
    if (response.success) {
        hideModal()
        clearModal()
    }
}

async function generateCategory(e) {
    let category = e.target.textContent
    window.location.hash = "category"

    let items = await getItem({"type":"category", "value":category})
    if (items.success) {
        html = ""
        items.data.forEach(item => {
            html += "<div class='column is-3-fullhd is-4-widescreen is-6-desktop is-12-tablet is-12-mobile'>"+
            "<figure class='box image' onclick='generateItemPage("+item.itemid+")'>"+
            "<p class='title is-3'>"+item.name+"</p>"+
            "<img src='../server/images/"+item.imagename+"' alt='"+item.name+"'>"+
            "<p class='subtitle is-3'>$"+item.price+"</p></figure></div>"
        });
        $("#categoryCols").html(html)
    } else {
        $("#categoryCols").html(`<h1>Sorry! No ${category} available now, please come back again!</h1>`)
    }
}