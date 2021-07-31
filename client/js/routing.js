// instantiate templates that are to be loaded on some sections
const templates = {
    "#home": "home.htmf",
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
            let user = await getUser({"id": getCookie("user")})
            if (user.data[0].role == "staff") {
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

    $.get(templates[page], function(data) {
        $(page).html(data);
        delete templates[page];
    })
}