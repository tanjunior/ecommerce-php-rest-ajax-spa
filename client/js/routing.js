// built upon Lecturer's SPA example at http://ceto.murdoch.edu.au/~20180682/ict286/guides/index.html

// instantiate templates that are to be loaded on some sections
// templates are a good way to cut a single html file in to sections to improve readability
const templates = {
    "#home": "home.htmf",
    "#about": "about.htmf",
    "#support": "support.htmf",
    "#register":"register.htmf",
    "#login":"login.htmf"
};

let pages = [];

function init() {
    // find all <section> which is child of <main> and add it into pages array
    $("main>section").each(function() {
        pages.push("#"+this.id);        
    });

    window.onhashchange = onHashChange;

    // call onhashchange on init to default to home page
    onHashChange();
}

const onHashChange = function() {
    if (!pages.includes(location.hash)) location.hash = pages[0]; //if no hash, set to home page
    showPage(location.hash); // display the page
}

async function showPage(page) {

    // change page title acording to the page
    document.title = "Assignment 2 - "+page;
    for (let i=0;i<pages.length;i++) {
        if (pages[i] != page) {
            $(pages[i]).hide();
        }
    }

    switch (page) {
        case "#products":
            // dynamically load product page everytime it enters
            getAllProducts()
            break;
        case "#cart":
            // dynamically load cart page everytime it enters
            populateCartDetails()
            break;
        case "#profile":
            // dynamically load profile page everytime it enters
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
    if (templates[page]) loadData(page);
}

const loadData = function(page) {
    $.get(templates[page], function(data) {
        $(page).html(data);
        // delete templates from array once loaded, no point loading it twice
        delete templates[page];
    })
}