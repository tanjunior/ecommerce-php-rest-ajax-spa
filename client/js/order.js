async function getOrder(type, value, one) {
    let order = await apiRequest("GET", "order?type="+type+"&value="+value)
    if (one) {
        return order.data[0]
    }
    return order.data
}