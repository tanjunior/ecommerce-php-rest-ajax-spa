// instantiate templates that are to be loaded on some sections
const templates = {
    "#register":"register.htmf",
    "#login":"login.htmf"
};

let pages = [];

const init = function() {

    // Use jQuery to find all the sections that are child of main
    $("main>section").each(function() {

        // push the element's id to the pages array.
        pages.push("#"+this.id);        
    });

    window.onhashchange = onHashChange;
    onHashChange();
}

const onHashChange = function() {
    if (!pages.includes(location.hash))
        location.hash = pages[0];
    showPage(location.hash);
}

async function showPage(page) {

    document.title = "SPA/AJAX 1 - "+page;
    for (let i=0;i<pages.length;i++) {
        if (pages[i] != page) {
            $(pages[i]).hide();
        }
    }

    switch (page) {
        case "#products":
            getAllProducts()
            break;
        case "#cart":
            populateCartDetails()
            break;
        case "#profile":
            generateProfile(getCookie("user"))
            break;
        case "#admin":
            // await user info from db to determine if user have staff priviledges
            let user = await getUser(getCookie("user"), true)
            if (user.role == "staff") {
                // is staff, write admin contents into admin section using AJAX
                displayAdminPage();
            } else {
                // not staff, return to home
                window.location.hash = "home";
                return
            }

            break;
        default:
            break;
    }


    $(page).show();
    //$("nav>a").off().removeClass("current");
    //$("a[href='"+page+"']").addClass("current").on("click",(ev)=>ev.preventDefault());

    
    // If we haven't yet loaded the data for this page...
    if (templates[page])

        // ...load it.
        loadData(page);
}

const loadData = function(page) {

    //console.log("Loading "+templates[page]+" into page "+page+".");

    //use JQuery to make a GET request for...
    $.get(

        //...the file specified by templates for this page...
        templates[page],

        //...and when done, call onDataLoaded.
        (data)=>onDataLoaded(page, data)
    );

    
}

const onDataLoaded = function(page, data) {

    //Just load the data directly into the page...
    $(page).html(data);

    //...and remove the page from templates so it will not load again.
    delete templates[page];
}

// Using jQuery, bind the init function to the document's ready event
// so that it will run when the document is ready.
$(document).ready(init);

/*
//The following code shows how to use pure JS to make and respond to an AJAX call.
//It is presented for your interest and study, but is not actually used in this page.

const loadDataPureJS = function(page) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = ()=>{ onStateChange(request, page); }
    request.open("GET",template [page]);
    request.send(null);
}

const onStateChange = function(req, page) {
    if ((req.readyState != 4) || (req.status != 200)) return;
    document.getElementById(page.substring(1)).innerHTML = req.responseText;    
    delete template [page];
}
*/