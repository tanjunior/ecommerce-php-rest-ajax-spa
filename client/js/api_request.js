function apiRequest(requestType,params, toSend) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(requestType, api_url+params, true)
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                let response = JSON.parse(xhr.responseText);
                let data = response.data
                resolve({data:data})               
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                })
            }
        }
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(toSend)
    })
}