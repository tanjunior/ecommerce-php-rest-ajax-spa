async function getUser(params) {
    if (params.type == null) {
        let response = await apiRequest("GET","user?id="+params.id,'application/json;charset=utf-8', null)
        return response
    } else {
        let response = await apiRequest("GET","user/?type="+params.type+"&value="+params.value,'application/json;charset=utf-8', null)
        return response
    }
}

async function getItem(params) {
    if (params.type == null) {
        let response = await apiRequest("GET","item?id="+params.id,'application/json;charset=utf-8', null)
        return response
    } else {
        let response = await apiRequest("GET","item/search.php?type="+params.type+"&value="+params.value,'application/json;charset=utf-8', null)
        return response
    }    
}

async function getAllItems() {
    let response = await apiRequest("GET","item",'application/json;charset=utf-8',null)
    return response
}

// used fetch instead of xhr to take advantage of promise.
async function apiRequest(requestType, params, contentType, toSend) {
    try {
        let options = { 
            method: requestType,
            body: toSend
        }
        if (contentType != null) options.headers = { 'Content-Type': contentType }

        const response = await fetch(`${api_url+params}`, options);

        if (!response.ok) throw new Error(`Error POSTing ${response.status} ${response.statusText}`);

        const data = await response.json();
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}

