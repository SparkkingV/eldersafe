/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId, button) {

    // Hide every page
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    // Remove active state
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });


    // Add active state
    if (button) {
        button.classList.add("active");
    }


    // Update title
    const titles = {
        dashboard: "Dashboard",
        emergency: "Emergency",
        device: "Device Status",
        history: "History",
        settings: "Settings"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageId] || "Dashboard";
}


/* =========================
   SOS
========================= */

function triggerSOS() {

    const modal = document.getElementById("sosModal");

    modal.classList.add("show");
}


function closeSOS() {

    const modal = document.getElementById("sosModal");

    modal.classList.remove("show");
}


function confirmSOS() {

    closeSOS();

    alert(
        "🚨 EMERGENCY SENT\n\n" +
        "The emergency response team has been notified."
    );

    console.log("Emergency request sent.");

    /*
        LATER:

        This will become:

        Supabase
        ↓
        Create emergency
        ↓
        Notify ambulance
        ↓
        Track response
    */
}


/* =========================
   CLOSE MODAL
========================= */

document.getElementById("sosModal").addEventListener(
    "click",
    function(event) {

        if (event.target === this) {
            closeSOS();
        }

    }
);