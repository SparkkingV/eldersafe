/* =========================================================
   ELDERSAFE DASHBOARD
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const DASHBOARD_CONFIG = {

    demoMode: true,

    /*
       When your Supabase integration is ready,
       set demoMode to false and connect the
       functions below to your database/realtime channels.
    */

};


/* =========================================================
   DOM
========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const mobileSidebarButton =
    document.getElementById("mobileSidebarButton");

const profileButton =
    document.getElementById("profileButton");

const profileMenu =
    document.getElementById("profileMenu");

const logoutButton =
    document.getElementById("logoutButton");

const profileLogout =
    document.getElementById("profileLogout");

const emergencyButton =
    document.getElementById("emergencyButton");

const emergencyModal =
    document.getElementById("emergencyModal");

const closeEmergencyModal =
    document.getElementById("closeEmergencyModal");

const cancelEmergency =
    document.getElementById("cancelEmergency");

const confirmEmergency =
    document.getElementById("confirmEmergency");

const safeButton =
    document.getElementById("safeButton");

const helpButton =
    document.getElementById("helpButton");

const emergencyAlert =
    document.getElementById("emergencyAlert");

const currentTime =
    document.getElementById("currentTime");

const notificationButton =
    document.getElementById("notificationButton");

const notificationDot =
    document.getElementById("notificationDot");

const alertBadge =
    document.getElementById("alertBadge");

const alertCount =
    document.getElementById("alertCount");

const emptyAlerts =
    document.getElementById("emptyAlerts");

const alertsList =
    document.getElementById("alertsList");

const refreshLocation =
    document.getElementById("refreshLocation");

const openMapButton =
    document.getElementById("openMapButton");

const activityTimeline =
    document.getElementById("activityTimeline");

const clearActivity =
    document.getElementById("clearActivity");


/* =========================================================
   USER STATE
========================================================= */

let currentUser = {

    name: "Vikash",

    email: "user@example.com",

    role: "patient"

};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);


function initializeDashboard() {

    loadUser();

    startClock();

    setupSidebar();

    setupProfileMenu();

    setupEmergencySystem();

    setupNotifications();

    setupLocation();

    setupActivity();

    setupNavigation();

    startMonitoringSimulation();

}


/* =========================================================
   LOAD USER
========================================================= */

function loadUser() {

    /*
       First try localStorage.
       Later this can be replaced by Supabase Auth.
    */

    try {

        const storedUser =
            localStorage.getItem("eldersafe_user");

        if (storedUser) {

            const parsed =
                JSON.parse(storedUser);

            currentUser = {

                ...currentUser,
                ...parsed

            };

        }

    } catch (error) {

        console.warn(
            "Unable to load stored user.",
            error
        );

    }


    updateUserUI();

}


function updateUserUI() {

    const name =
        currentUser.name ||
        currentUser.username ||
        "User";

    const email =
        currentUser.email ||
        "user@example.com";

    const role =
        currentUser.role ||
        "patient";


    const sidebarName =
        document.getElementById(
            "sidebarUserName"
        );

    const sidebarRole =
        document.getElementById(
            "sidebarUserRole"
        );

    const topUserName =
        document.getElementById(
            "topUserName"
        );

    const profileMenuName =
        document.getElementById(
            "profileMenuName"
        );

    const profileMenuEmail =
        document.getElementById(
            "profileMenuEmail"
        );


    if (sidebarName)
        sidebarName.textContent = name;


    if (sidebarRole)
        sidebarRole.textContent = role;


    if (topUserName)
        topUserName.textContent = name;


    if (profileMenuName)
        profileMenuName.textContent = name;


    if (profileMenuEmail)
        profileMenuEmail.textContent = email;

}


/* =========================================================
   CLOCK
========================================================= */

function startClock() {

    updateClock();

    setInterval(
        updateClock,
        1000
    );

}


function updateClock() {

    if (!currentTime)
        return;


    const now = new Date();


    currentTime.textContent =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =========================================================
   SIDEBAR
========================================================= */

function setupSidebar() {

    if (!mobileSidebarButton)
        return;


    mobileSidebarButton.addEventListener(
        "click",
        () => {

            sidebar.classList.add("open");

            sidebarOverlay.classList.add("active");

        }
    );


    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );


    document
        .querySelectorAll(".sidebar-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    closeSidebar();

                }
            );

        });

}


function closeSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove(
        "active"
    );

}


/* =========================================================
   PROFILE MENU
========================================================= */

function setupProfileMenu() {

    if (!profileButton)
        return;


    profileButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            profileMenu.hidden =
                !profileMenu.hidden;

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !profileMenu.contains(event.target) &&
                !profileButton.contains(event.target)
            ) {

                profileMenu.hidden = true;

            }

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".sidebar-link[data-section]"
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                links.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                link.classList.add(
                    "active"
                );

            }
        );

    });

}


/* =========================================================
   EMERGENCY SYSTEM
========================================================= */

function setupEmergencySystem() {


    emergencyButton?.addEventListener(
        "click",
        openEmergencyModal
    );


    closeEmergencyModal?.addEventListener(
        "click",
        closeEmergencyModalFunction
    );


    cancelEmergency?.addEventListener(
        "click",
        closeEmergencyModalFunction
    );


    confirmEmergency?.addEventListener(
        "click",
        requestEmergencyHelp
    );


    safeButton?.addEventListener(
        "click",
        confirmSafe
    );


    helpButton?.addEventListener(
        "click",
        requestEmergencyHelp
    );


    emergencyModal?.addEventListener(
        "click",
        event => {

            if (
                event.target === emergencyModal
            ) {

                closeEmergencyModalFunction();

            }

        }
    );

}


function openEmergencyModal() {

    emergencyModal.hidden = false;

}


function closeEmergencyModalFunction() {

    emergencyModal.hidden = true;

}


async function requestEmergencyHelp() {

    closeEmergencyModalFunction();


    /*
       This is where the real Supabase
       emergency event will be inserted.
    */


    setEmergencyState(true);


    addActivity(

        "Emergency assistance requested",

        "Emergency response team has been notified.",

        "red",

        "fa-truck-medical"

    );


    if (DASHBOARD_CONFIG.demoMode) {

        console.log(
            "DEMO: Emergency request sent."
        );

    }

}


function confirmSafe() {

    setEmergencyState(false);


    addActivity(

        "Patient confirmed safety",

        "Emergency event was manually cleared.",

        "green",

        "fa-check"

    );

}


function setEmergencyState(active) {

    if (active) {

        emergencyAlert.hidden = false;

        document.body.classList.add(
            "emergency-mode"
        );


        document.getElementById(
            "safetyStatus"
        ).textContent =
            "Emergency response active";


        document.getElementById(
            "safetyMessage"
        ).textContent =
            "Emergency assistance has been requested.";


        document.getElementById(
            "largeSafeIcon"
        ).innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i>';


        document.getElementById(
            "largeSafeIcon"
        ).style.color =
            "var(--red)";


        document.getElementById(
            "largeSafeIcon"
        ).style.background =
            "var(--red-soft)";


        updateAlertCount(1);

    } else {

        emergencyAlert.hidden = true;

        document.body.classList.remove(
            "emergency-mode"
        );


        document.getElementById(
            "safetyStatus"
        ).textContent =
            "Everything is safe";


        document.getElementById(
            "safetyMessage"
        ).textContent =
            "No emergency events detected.";


        document.getElementById(
            "largeSafeIcon"
        ).innerHTML =
            '<i class="fa-solid fa-shield-heart"></i>';


        document.getElementById(
            "largeSafeIcon"
        ).style.color =
            "var(--green)";


        document.getElementById(
            "largeSafeIcon"
        ).style.background =
            "var(--green-soft)";


        updateAlertCount(0);

    }

}


/* =========================================================
   ALERT COUNTER
========================================================= */

function updateAlertCount(count) {

    if (alertBadge)
        alertBadge.textContent = count;


    if (alertCount) {

        alertCount.textContent =
            `${count} Active`;

    }


    if (notificationDot) {

        notificationDot.style.display =
            count > 0
                ? "block"
                : "none";

    }

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function setupNotifications() {

    notificationButton?.addEventListener(
        "click",
        () => {

            document
                .getElementById("alerts")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================================================
   LOCATION
========================================================= */

function setupLocation() {

    refreshLocation?.addEventListener(
        "click",
        getLocation
    );


    openMapButton?.addEventListener(
        "click",
        openMap
    );

}


function getLocation() {

    const locationText =
        document.getElementById(
            "locationText"
        );


    if (!navigator.geolocation) {

        locationText.textContent =
            "GPS unavailable";

        return;

    }


    locationText.textContent =
        "Locating...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude
                .toFixed(5);

            const lng =
                position.coords.longitude
                .toFixed(5);


            locationText.textContent =
                `${lat}, ${lng}`;

            addActivity(

                "Location updated",

                "GPS position refreshed successfully.",

                "blue",

                "fa-location-dot"

            );

        },

        () => {

            locationText.textContent =
                "Location unavailable";

        }

    );

}


function openMap() {

    const locationText =
        document.getElementById(
            "locationText"
        );


    if (
        !locationText ||
        !locationText.textContent.includes(",")
    ) {

        getLocation();

        return;

    }


    const coordinates =
        locationText.textContent;

    const url =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   ACTIVITY
========================================================= */

function setupActivity() {

    clearActivity?.addEventListener(
        "click",
        () => {

            activityTimeline.innerHTML = `

                <div class="timeline-item">

                    <div class="timeline-icon green">

                        <i class="fa-solid fa-check"></i>

                    </div>

                    <div class="timeline-content">

                        <strong>
                            Activity history cleared
                        </strong>

                        <span>
                            New events will appear here.
                        </span>

                        <small>
                            Just now
                        </small>

                    </div>

                </div>

            `;

        }
    );

}


function addActivity(
    title,
    description,
    type = "green",
    icon = "fa-check"
) {

    if (!activityTimeline)
        return;


    const item =
        document.createElement("div");

    item.className =
        "timeline-item";


    item.innerHTML = `

        <div class="timeline-icon ${type}">

            <i class="fa-solid ${icon}"></i>

        </div>


        <div class="timeline-content">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <span>
                ${escapeHTML(description)}
            </span>

            <small>
                Just now
            </small>

        </div>

    `;


    activityTimeline.prepend(item);


    const items =
        activityTimeline.querySelectorAll(
            ".timeline-item"
        );


    if (items.length > 6) {

        items[items.length - 1].remove();

    }

}


/* =========================================================
   MONITORING SIMULATION
========================================================= */

function startMonitoringSimulation() {

    if (!DASHBOARD_CONFIG.demoMode)
        return;


    setInterval(
        () => {

            const movement =
                document.getElementById(
                    "movementStatus"
                );

            const lastCheck =
                document.getElementById(
                    "lastCheck"
                );

            const lastSignal =
                document.getElementById(
                    "lastSignal"
                );


            if (movement)
                movement.textContent =
                    "Normal";


            if (lastCheck)
                lastCheck.textContent =
                    "Just now";


            if (lastSignal)
                lastSignal.textContent =
                    "Just now";

        },
        10000
    );

}


/* =========================================================
   LOGOUT
========================================================= */

logoutButton?.addEventListener(
    "click",
    logout
);

profileLogout?.addEventListener(
    "click",
    logout
);


async function logout() {

    try {

        /*
           If your existing app.js exposes
           Supabase, you can call:

           await supabaseClient.auth.signOut();

        */


        localStorage.removeItem(
            "eldersafe_user"
        );


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }


    window.location.href =
        "../auth/login.html";

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeEmergencyModalFunction();

            profileMenu.hidden = true;

            closeSidebar();

        }

    }
);


/* =========================================================
   DEMO TEST
   Uncomment this if you want to see emergency UI.
========================================================= */

/*

setTimeout(() => {

    setEmergencyState(true);

}, 5000);

*/


console.log(
    "======================================"
);

console.log(
    "ELDERSAFE DASHBOARD LOADED"
);

console.log(
    "Dashboard version: 1.0"
);

console.log(
    "Demo mode:",
    DASHBOARD_CONFIG.demoMode
);

console.log(
    "======================================"
);