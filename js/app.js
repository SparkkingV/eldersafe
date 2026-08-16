/* =========================================================
   ELDERSAFE
   SINGLE APPLICATION JAVASCRIPT
   VERSION 3.0
   ========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://scalzhnlzeusufgqqdxc.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYWx6aG5semV1c3VmZ3FxZHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4Nzg1MDcsImV4cCI6MjEwMjQ1NDUwN30.LPIHX1g60Pvx4JWyaXHowXfeuToGCSDXwbmC2mItSPs"
        .replace(/\s/g, "");


/* =========================================================
   2. CREATE SUPABASE CLIENT
   ========================================================= */

let supabaseClient = null;

if (!window.supabase) {

    console.error(
        "ELDERSAFE: Supabase JavaScript library was not loaded."
    );

} else {

    try {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        console.log(
            "ELDERSAFE: Supabase client created."
        );

    } catch (error) {

        console.error(
            "ELDERSAFE: Failed to create Supabase client:",
            error
        );

    }

}


/* =========================================================
   3. GLOBAL STATE
   ========================================================= */

let currentUser = null;

let currentProfile = null;

let realtimeChannel = null;

let authListener = null;

let authenticationInitialized = false;


/* =========================================================
   4. PAGE DETECTION
   ========================================================= */

const pathname =
    window.location.pathname
        .toLowerCase();

const normalizedPath =
    pathname.replace(/\/+$/, "");

const currentPage =
    normalizedPath
        .split("/")
        .filter(Boolean)
        .pop() || "index.html";


const activePage =
    currentPage.includes(".html")
        ? currentPage
        : "index.html";


/* =========================================================
   5. PAGE TYPE HELPERS
   ========================================================= */

function isHomePage() {

    return (
        activePage === "index.html"
    );

}


function isLoginPage() {

    return (
        activePage === "login.html"
    );

}


function isRegisterPage() {

    return (
        activePage === "register.html" ||
        activePage === "signup.html"
    );

}


function isDashboardPage() {

    return (
        activePage === "dashboard.html"
    );

}


function isResetPasswordPage() {

    return (
        activePage === "reset-password.html"
    );

}


/* =========================================================
   6. PATH HELPERS
   ========================================================= */

function rootPath(file) {

    if (
        pathname.includes("/auth/")
    ) {

        return "../" + file;

    }

    return file;

}


function authPath(file) {

    if (
        pathname.includes("/auth/")
    ) {

        return file;

    }

    return "auth/" + file;

}


/* =========================================================
   7. REDIRECT HELPERS
   ========================================================= */

function redirectToDashboard() {

    window.location.href =
        rootPath("dashboard.html");

}


function redirectToLogin() {

    window.location.href =
        authPath("login.html");

}


function redirectToHome() {

    window.location.href =
        rootPath("index.html");

}


/* =========================================================
   8. DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);


async function initializeApplication() {

    console.log(
        "======================================"
    );

    console.log(
        "ELDERSAFE INITIALIZING"
    );

    console.log(
        "Page:",
        activePage
    );

    console.log(
        "======================================"
    );


    /*
        Initialize normal website UI.
    */

    initializeCommonUI();


    /*
        Authentication.
    */

    if (supabaseClient) {

        await initializeAuthentication();

    }


    console.log(
        "ELDERSAFE READY"
    );

}


/* =========================================================
   9. COMMON UI
   ========================================================= */

function initializeCommonUI() {

    initializeNavbar();

    initializeMobileMenu();

    initializeScrollReveal();

    initializePasswordToggle();

    initializeSmoothScrolling();

}


/* =========================================================
   10. NAVBAR
   ========================================================= */

function initializeNavbar() {

    const navbar =
        document.querySelector(
            ".navbar"
        );

    if (!navbar) {

        return;

    }


    function updateNavbar() {

        if (
            window.scrollY > 20
        ) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );


    updateNavbar();

}


/* =========================================================
   11. MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.querySelector(
            ".mobile-menu-btn"
        );

    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );


    if (
        !menuButton ||
        !mobileMenu
    ) {

        return;

    }


    if (
        menuButton.dataset.initialized ===
        "true"
    ) {

        return;

    }


    menuButton.dataset.initialized =
        "true";


    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );


    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu.classList.toggle(
                    "active"
                );


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            const icon =
                menuButton.querySelector(
                    "i"
                );


            if (icon) {

                icon.classList.toggle(
                    "fa-bars",
                    !isOpen
                );

                icon.classList.toggle(
                    "fa-xmark",
                    isOpen
                );

            }

        }
    );


    mobileMenu
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );

            }
        );


    function closeMobileMenu() {

        mobileMenu.classList.remove(
            "active"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        const icon =
            menuButton.querySelector(
                "i"
            );


        if (icon) {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );

        }

    }

}


/* =========================================================
   12. SMOOTH SCROLLING
   ========================================================= */

function initializeSmoothScrolling() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                if (
                    link.dataset.smoothInitialized ===
                    "true"
                ) {

                    return;

                }


                link.dataset.smoothInitialized =
                    "true";


                link.addEventListener(
                    "click",
                    event => {

                        const targetID =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !targetID ||
                            targetID === "#"
                        ) {

                            return;

                        }


                        let target = null;


                        try {

                            target =
                                document.querySelector(
                                    targetID
                                );

                        } catch {

                            return;

                        }


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }
                );

            }
        );

}


/* =========================================================
   13. SCROLL REVEAL
   ========================================================= */

function initializeScrollReveal() {

    const elements =
        document.querySelectorAll(
            [
                ".feature-card",
                ".step",
                ".technology-text",
                ".network-visual",
                ".about-card",
                ".stat-card",
                ".hero-content",
                ".hero-visual"
            ].join(",")
        );


    if (!elements.length) {

        return;

    }


    elements.forEach(
        element => {

            element.classList.add(
                "reveal"
            );

        }
    );


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        element =>
            observer.observe(element)
    );

}


/* =========================================================
   14. PASSWORD TOGGLE
   ========================================================= */

function initializePasswordToggle() {

    const buttons =
        document.querySelectorAll(
            ".password-toggle"
        );


    if (!buttons.length) {

        return;

    }


    buttons.forEach(
        button => {

            if (
                button.dataset.initialized ===
                "true"
            ) {

                return;

            }


            button.dataset.initialized =
                "true";


            button.addEventListener(
                "click",
                () => {

                    let input = null;


                    const targetID =
                        button.getAttribute(
                            "data-target"
                        );


                    if (targetID) {

                        input =
                            document.getElementById(
                                targetID
                            );

                    }


                    if (!input) {

                        const wrapper =
                            button.closest(
                                ".password-wrapper"
                            );


                        if (wrapper) {

                            input =
                                wrapper.querySelector(
                                    "input"
                                );

                        }

                    }


                    if (!input) {

                        return;

                    }


                    const icon =
                        button.querySelector(
                            "i"
                        );


                    const isPassword =
                        input.type ===
                        "password";


                    input.type =
                        isPassword
                            ? "text"
                            : "password";


                    if (icon) {

                        icon.classList.toggle(
                            "fa-eye",
                            !isPassword
                        );

                        icon.classList.toggle(
                            "fa-eye-slash",
                            isPassword
                        );

                    }


                    button.setAttribute(
                        "aria-label",
                        isPassword
                            ? "Hide password"
                            : "Show password"
                    );

                }
            );

        }
    );

}


/* =========================================================
   15. AUTHENTICATION
   ========================================================= */

async function initializeAuthentication() {

    if (!supabaseClient) {

        console.error(
            "ELDERSAFE: Supabase unavailable."
        );

        return;

    }


    if (authenticationInitialized) {

        return;

    }


    authenticationInitialized =
        true;


    try {

        /*
            Get current session.
        */

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

        }


        currentUser =
            data?.session?.user ||
            null;


        console.log(
            "Current user:",
            currentUser
                ? currentUser.email
                : "Not authenticated"
        );


        /*
            Handle current page.
        */

        if (isLoginPage()) {

            await initializeLoginPage();

        }

        else if (isRegisterPage()) {

            await initializeRegisterPage();

        }

        else if (isDashboardPage()) {

            await initializeDashboardPage();

        }

        else if (isResetPasswordPage()) {

            initializeResetPasswordPage();

        }


        /*
            Auth listener.
        */

        if (!authListener) {

            authListener =
                supabaseClient
                    .auth
                    .onAuthStateChange(
                        handleAuthStateChange
                    );

        }


    } catch (error) {

        console.error(
            "Authentication initialization failed:",
            error
        );

    }

}


/* =========================================================
   16. AUTH STATE CHANGE
   ========================================================= */

async function handleAuthStateChange(
    event,
    session
) {

    console.log(
        "Auth event:",
        event
    );


    currentUser =
        session?.user ||
        null;


    if (
        event === "SIGNED_OUT"
    ) {

        currentProfile =
            null;


        await removeRealtimeChannel();

        return;

    }


    if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED"
    ) {

        if (currentUser) {

            /*
                Do not immediately redirect here.
                Page initialization handles redirects.
            */

            console.log(
                "Authenticated:",
                currentUser.email
            );

        }

    }

}


/* =========================================================
   17. LOGIN PAGE
   ========================================================= */

async function initializeLoginPage() {

    if (currentUser) {

        redirectToDashboard();

        return;

    }


    const loginForm =
        document.getElementById(
            "loginForm"
        ) ||
        document.getElementById(
            "signinForm"
        ) ||
        document.querySelector(
            'form[data-form="login"]'
        );


    if (!loginForm) {

        console.warn(
            "Login form not found."
        );

        return;

    }


    if (
        loginForm.dataset.initialized !==
        "true"
    ) {

        loginForm.dataset.initialized =
            "true";


        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }


    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        ) ||
        document.querySelector(
            '[data-action="forgot-password"]'
        );


    if (
        forgotPassword &&
        forgotPassword.dataset.initialized !==
        "true"
    ) {

        forgotPassword.dataset.initialized =
            "true";


        forgotPassword.addEventListener(
            "click",
            event => {

                event.preventDefault();

                handleForgotPassword();

            }
        );

    }

}


/* =========================================================
   18. LOGIN
   ========================================================= */

async function handleLogin(event) {

    event.preventDefault();


    if (!supabaseClient) {

        showAuthError(
            "Authentication service is unavailable."
        );

        return;

    }


    const emailInput =
        findInput([
            "email",
            "loginEmail",
            "signinEmail"
        ]);


    const passwordInput =
        findInput([
            "password",
            "loginPassword",
            "signinPassword"
        ]);


    if (
        !emailInput ||
        !passwordInput
    ) {

        showAuthError(
            "Login form fields could not be found."
        );

        return;

    }


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    clearAuthMessages();


    if (!email) {

        showAuthError(
            "Please enter your email address."
        );

        emailInput.focus();

        return;

    }


    if (!isValidEmail(email)) {

        showAuthError(
            "Please enter a valid email address."
        );

        emailInput.focus();

        return;

    }


    if (!password) {

        showAuthError(
            "Please enter your password."
        );

        passwordInput.focus();

        return;

    }


    setAuthLoading(
        true,
        "login"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email,
                    password
                });


        if (error) {

            console.error(
                "Login failed:",
                error
            );


            showAuthError(
                getAuthErrorMessage(error)
            );


            setAuthLoading(
                false,
                "login"
            );

            return;

        }


        currentUser =
            data?.user ||
            null;


        if (!currentUser) {

            showAuthError(
                "Login failed. Please try again."
            );


            setAuthLoading(
                false,
                "login"
            );

            return;

        }


        /*
            Load/create profile.
        */

        await ensureUserProfile(
            currentUser
        );


        showAuthSuccess(
            "Login successful. Opening ELDERSAFE..."
        );


        setTimeout(
            redirectToDashboard,
            500
        );


    } catch (error) {

        console.error(
            "Unexpected login error:",
            error
        );


        showAuthError(
            "Something went wrong. Please try again."
        );


        setAuthLoading(
            false,
            "login"
        );

    }

}


/* =========================================================
   19. REGISTER PAGE
   ========================================================= */

async function initializeRegisterPage() {

    if (currentUser) {

        redirectToDashboard();

        return;

    }


    const registerForm =
        document.getElementById(
            "registerForm"
        ) ||
        document.getElementById(
            "signupForm"
        ) ||
        document.querySelector(
            'form[data-form="register"]'
        ) ||
        document.querySelector(
            'form[data-form="signup"]'
        );


    if (!registerForm) {

        console.warn(
            "Registration form not found."
        );

        return;

    }


    if (
        registerForm.dataset.initialized !==
        "true"
    ) {

        registerForm.dataset.initialized =
            "true";


        registerForm.addEventListener(
            "submit",
            handleSignup
        );

    }


    initializeSignupRoleSelector();

}


/* =========================================================
   20. ROLE SELECTOR
   ========================================================= */

function initializeSignupRoleSelector() {

    const roleInputs =
        document.querySelectorAll(
            'input[name="role"]'
        );


    if (!roleInputs.length) {

        return;

    }


    roleInputs.forEach(
        input => {

            if (input.checked) {

                updateRoleVisualState(
                    input
                );

            }


            if (
                input.dataset.initialized ===
                "true"
            ) {

                return;

            }


            input.dataset.initialized =
                "true";


            input.addEventListener(
                "change",
                () => {

                    updateRoleVisualState(
                        input
                    );

                }
            );

        }
    );

}


/* =========================================================
   21. ROLE VISUAL STATE
   ========================================================= */

function updateRoleVisualState(
    selectedInput
) {

    document
        .querySelectorAll(
            ".role-option, .role-card, .account-type"
        )
        .forEach(
            option => {

                option.classList.remove(
                    "selected",
                    "active"
                );

            }
        );


    const parent =
        selectedInput.closest(
            ".role-option, .role-card, .account-type"
        );


    if (parent) {

        parent.classList.add(
            "selected"
        );

        parent.classList.add(
            "active"
        );

    }

}


/* =========================================================
   22. REGISTER
   ========================================================= */

async function handleSignup(event) {

    event.preventDefault();


    if (!supabaseClient) {

        showAuthError(
            "Authentication service is unavailable."
        );

        return;

    }


    const emailInput =
        findInput([
            "email",
            "registerEmail",
            "signupEmail"
        ]);


    const passwordInput =
        findInput([
            "password",
            "registerPassword",
            "signupPassword"
        ]);


    const confirmPasswordInput =
        findInput([
            "confirmPassword",
            "confirm_password",
            "registerConfirmPassword",
            "signupConfirmPassword"
        ]);


    const nameInput =
        findInput([
            "fullName",
            "full_name",
            "name",
            "registerName",
            "signupName"
        ]);


    if (
        !emailInput ||
        !passwordInput
    ) {

        showAuthError(
            "Registration form fields could not be found."
        );

        return;

    }


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput
            ? confirmPasswordInput.value
            : password;

    const fullName =
        nameInput
            ? nameInput.value.trim()
            : "";


    const selectedRole =
        document.querySelector(
            'input[name="role"]:checked'
        );


    const role =
        selectedRole
            ? selectedRole.value
            : "patient";


    clearAuthMessages();


    /*
        Validation.
    */

    if (!fullName) {

        showAuthError(
            "Please enter your full name."
        );

        if (nameInput) {

            nameInput.focus();

        }

        return;

    }


    if (!email) {

        showAuthError(
            "Please enter your email address."
        );

        emailInput.focus();

        return;

    }


    if (!isValidEmail(email)) {

        showAuthError(
            "Please enter a valid email address."
        );

        emailInput.focus();

        return;

    }


    if (password.length < 6) {

        showAuthError(
            "Password must contain at least 6 characters."
        );

        passwordInput.focus();

        return;

    }


    if (
        password !==
        confirmPassword
    ) {

        showAuthError(
            "Passwords do not match."
        );

        if (confirmPasswordInput) {

            confirmPasswordInput.focus();

        }

        return;

    }


    if (
        role !== "patient" &&
        role !== "ambulance"
    ) {

        showAuthError(
            "Please select a valid account type."
        );

        return;

    }


    setAuthLoading(
        true,
        "register"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signUp({
                    email,
                    password,

                    options: {
                        data: {
                            full_name:
                                fullName,

                            role:
                                role
                        }
                    }
                });


        if (error) {

            console.error(
                "Signup failed:",
                error
            );


            showAuthError(
                getAuthErrorMessage(error)
            );


            setAuthLoading(
                false,
                "register"
            );

            return;

        }


        if (!data?.user) {

            showAuthError(
                "Unable to create your account. Please try again."
            );


            setAuthLoading(
                false,
                "register"
            );

            return;

        }


        currentUser =
            data.user;


        /*
            Email confirmation disabled.
        */

        if (data.session) {

            currentProfile =
                await ensureUserProfile(
                    data.user
                );


            showAuthSuccess(
                "Account created successfully."
            );


            setTimeout(
                redirectToDashboard,
                700
            );


            return;

        }


        /*
            Email confirmation enabled.
        */

        showAuthSuccess(
            "Account created. Please check your email to verify your account."
        );


        setAuthLoading(
            false,
            "register"
        );


    } catch (error) {

        console.error(
            "Unexpected signup error:",
            error
        );


        showAuthError(
            "Unable to create your account. Please try again."
        );


        setAuthLoading(
            false,
            "register"
        );

    }

}


/* =========================================================
   23. FIND INPUT
   ========================================================= */

function findInput(ids) {

    for (
        const id of ids
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            return element;

        }

    }


    return null;

}


/* =========================================================
   24. EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   25. ENSURE USER PROFILE
   ========================================================= */

async function ensureUserProfile(user) {

    if (
        !user ||
        !supabaseClient
    ) {

        return null;

    }


    try {

        /*
            Check existing profile.
        */

        const {
            data: existingProfile,
            error: selectError
        } =
            await supabaseClient
                .from("profiles")
                .select("*")
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();


        if (selectError) {

            console.error(
                "Profile lookup failed:",
                selectError
            );


            return null;

        }


        /*
            Existing profile.
        */

        if (existingProfile) {

            currentProfile =
                existingProfile;


            return existingProfile;

        }


        /*
            Create new profile.
        */

        const metadata =
            user.user_metadata ||
            {};


        const requestedRole =
            metadata.role;


        const role =
            requestedRole === "ambulance"
                ? "ambulance"
                : "patient";


        const profileData = {

            id:
                user.id,

            email:
                user.email ||
                null,

            full_name:
                metadata.full_name ||
                "",

            role:
                role

        };


        const {
            data: newProfile,
            error: insertError
        } =
            await supabaseClient
                .from("profiles")
                .insert(
                    profileData
                )
                .select()
                .single();


        if (insertError) {

            console.warn(
                "Profile creation failed:",
                insertError
            );


            /*
                Retry lookup.
            */

            const {
                data: retryProfile
            } =
                await supabaseClient
                    .from("profiles")
                    .select("*")
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


            if (retryProfile) {

                currentProfile =
                    retryProfile;


                return retryProfile;

            }


            return null;

        }


        currentProfile =
            newProfile;


        return newProfile;


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );


        return null;

    }

}


/* =========================================================
   26. GET CURRENT PROFILE
   ========================================================= */

async function getCurrentProfile() {

    if (
        !currentUser ||
        !supabaseClient
    ) {

        return null;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select("*")
                .eq(
                    "id",
                    currentUser.id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Profile fetch error:",
                error
            );


            return null;

        }


        if (data) {

            currentProfile =
                data;

        }


        return data;


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );


        return null;

    }

}


/* =========================================================
   27. DASHBOARD
   ========================================================= */

async function initializeDashboardPage() {

    /*
        User must be authenticated.
    */

    if (!currentUser) {

        redirectToLogin();

        return;

    }


    /*
        Get profile.
    */

    currentProfile =
        await getCurrentProfile();


    /*
        Profile missing.
    */

    if (!currentProfile) {

        currentProfile =
            await ensureUserProfile(
                currentUser
            );

    }


    if (!currentProfile) {

        showDashboardError(
            "Unable to load your account information."
        );

        return;

    }


    /*
        Initialize role-based dashboard.
    */

    initializeRoleDashboard(
        currentProfile
    );


    /*
        Populate user information.
    */

    populateUserInformation(
        currentProfile
    );


    /*
        Start realtime.
    */

    initializeRealtime();

}


/* =========================================================
   28. ROLE DASHBOARD
   ========================================================= */

function initializeRoleDashboard(
    profile
) {

    if (!profile) {

        return;

    }


    const role =
        profile.role === "ambulance"
            ? "ambulance"
            : "patient";


    /*
        Body role.
    */

    document.body.dataset.role =
        role;


    /*
        Patient elements.
    */

    document
        .querySelectorAll(
            ".patient-only"
        )
        .forEach(
            element => {

                element.style.display =
                    role === "patient"
                        ? ""
                        : "none";

            }
        );


    /*
        Ambulance elements.
    */

    document
        .querySelectorAll(
            ".ambulance-only"
        )
        .forEach(
            element => {

                element.style.display =
                    role === "ambulance"
                        ? ""
                        : "none";

            }
        );


    /*
        Generic role elements.
    */

    document
        .querySelectorAll(
            "[data-role-only]"
        )
        .forEach(
            element => {

                const requiredRole =
                    element.getAttribute(
                        "data-role-only"
                    );


                element.style.display =
                    requiredRole === role
                        ? ""
                        : "none";

            }
        );


    /*
        Dashboard class.
    */

    const dashboard =
        document.querySelector(
            ".dashboard"
        );


    if (dashboard) {

        dashboard.classList.remove(
            "role-patient",
            "role-ambulance"
        );


        dashboard.classList.add(
            `role-${role}`
        );

    }

}


/* =========================================================
   29. USER INFORMATION
   ========================================================= */

function populateUserInformation(
    profile
) {

    if (!profile) {

        return;

    }


    const name =
        profile.full_name ||
        currentUser?.email ||
        "User";


    const email =
        profile.email ||
        currentUser?.email ||
        "";


    const role =
        formatRole(
            profile.role
        );


    /*
        Name.
    */

    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(
            element => {

                element.textContent =
                    name;

            }
        );


    /*
        Email.
    */

    document
        .querySelectorAll(
            "[data-user-email]"
        )
        .forEach(
            element => {

                element.textContent =
                    email;

            }
        );


    /*
        Role.
    */

    document
        .querySelectorAll(
            "[data-user-role]"
        )
        .forEach(
            element => {

                element.textContent =
                    role;

            }
        );


    /*
        Avatar initials.
    */

    document
        .querySelectorAll(
            "[data-user-initials]"
        )
        .forEach(
            element => {

                element.textContent =
                    getInitials(name);

            }
        );

}


/* =========================================================
   30. USER INITIALS
   ========================================================= */

function getInitials(name) {

    if (!name) {

        return "U";

    }


    const parts =
        name
            .trim()
            .split(/\s+/);


    if (
        parts.length === 1
    ) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


/* =========================================================
   31. ROLE FORMAT
   ========================================================= */

function formatRole(role) {

    if (
        role === "ambulance"
    ) {

        return "Emergency Responder";

    }


    if (
        role === "patient"
    ) {

        return "Patient";

    }


    return "User";

}


/* =========================================================
   32. LOGOUT
   ========================================================= */

async function logout() {

    if (!supabaseClient) {

        redirectToHome();

        return;

    }


    try {

        await removeRealtimeChannel();


        const {
            error
        } =
            await supabaseClient
                .auth
                .signOut();


        if (error) {

            console.error(
                "Logout failed:",
                error
            );


            return;

        }


        currentUser =
            null;

        currentProfile =
            null;


        redirectToHome();


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


window.logout =
    logout;


/* =========================================================
   33. FORGOT PASSWORD
   ========================================================= */

async function handleForgotPassword() {

    if (!supabaseClient) {

        showAuthError(
            "Authentication service is unavailable."
        );

        return;

    }


    const emailInput =
        findInput([
            "email",
            "loginEmail",
            "signinEmail"
        ]);


    if (!emailInput) {

        showAuthError(
            "Please enter your email address."
        );

        return;

    }


    const email =
        emailInput.value.trim();


    clearAuthMessages();


    if (!email) {

        showAuthError(
            "Enter your email address first."
        );

        emailInput.focus();

        return;

    }


    if (!isValidEmail(email)) {

        showAuthError(
            "Please enter a valid email address."
        );

        emailInput.focus();

        return;

    }


    try {

        const resetURL =
            `${window.location.origin}/reset-password.html`;


        const {
            error
        } =
            await supabaseClient
                .auth
                .resetPasswordForEmail(
                    email,
                    {
                        redirectTo:
                            resetURL
                    }
                );


        if (error) {

            console.error(
                "Password reset error:",
                error
            );


            showAuthError(
                getAuthErrorMessage(error)
            );


            return;

        }


        showAuthSuccess(
            "Password reset instructions have been sent to your email."
        );


    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );


        showAuthError(
            "Unable to send password reset instructions."
        );

    }

}


/* =========================================================
   34. RESET PASSWORD PAGE
   ========================================================= */

function initializeResetPasswordPage() {

    const form =
        document.getElementById(
            "resetPasswordForm"
        ) ||
        document.querySelector(
            'form[data-form="reset-password"]'
        );


    if (!form) {

        return;

    }


    if (
        form.dataset.initialized ===
        "true"
    ) {

        return;

    }


    form.dataset.initialized =
        "true";


    form.addEventListener(
        "submit",
        handleResetPassword
    );

}


/* =========================================================
   35. HANDLE RESET PASSWORD
   ========================================================= */

async function handleResetPassword(event) {

    event.preventDefault();


    if (!supabaseClient) {

        showAuthError(
            "Authentication service is unavailable."
        );

        return;

    }


    const passwordInput =
        findInput([
            "newPassword",
            "password",
            "resetPassword"
        ]);


    const confirmInput =
        findInput([
            "confirmPassword",
            "confirm_password",
            "confirmNewPassword"
        ]);


    if (!passwordInput) {

        showAuthError(
            "Password field not found."
        );

        return;

    }


    const password =
        passwordInput.value;


    const confirmPassword =
        confirmInput
            ? confirmInput.value
            : password;


    clearAuthMessages();


    if (
        password.length < 6
    ) {

        showAuthError(
            "Password must contain at least 6 characters."
        );

        return;

    }


    if (
        password !==
        confirmPassword
    ) {

        showAuthError(
            "Passwords do not match."
        );

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .auth
                .updateUser({
                    password
                });


        if (error) {

            console.error(
                "Password update failed:",
                error
            );


            showAuthError(
                getAuthErrorMessage(error)
            );


            return;

        }


        showAuthSuccess(
            "Password updated successfully."
        );


        setTimeout(
            () => {

                redirectToLogin();

            },
            1200
        );


    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );


        showAuthError(
            "Unable to update your password."
        );

    }

}


/* =========================================================
   36. REALTIME
   ========================================================= */

function initializeRealtime() {

    if (
        !currentUser ||
        !supabaseClient
    ) {

        return;

    }


    /*
        Remove previous channel.
    */

    removeRealtimeChannel();


    const channelName =
        `eldersafe-${currentUser.id}`;


    realtimeChannel =
        supabaseClient
            .channel(channelName);


    /*
        Emergency alerts.
    */

    realtimeChannel
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "emergency_alerts"
            },
            payload => {

                console.log(
                    "Emergency realtime event:",
                    payload
                );


                handleEmergencyRealtimeEvent(
                    payload
                );

            }
        );


    /*
        Subscribe.
    */

    realtimeChannel
        .subscribe(
            status => {

                console.log(
                    "ELDERSAFE realtime:",
                    status
                );


                window.dispatchEvent(
                    new CustomEvent(
                        "eldersafe:realtime-status",
                        {
                            detail: {
                                status
                            }
                        }
                    )
                );

            }
        );

}


/* =========================================================
   37. REMOVE REALTIME CHANNEL
   ========================================================= */

async function removeRealtimeChannel() {

    if (
        !realtimeChannel ||
        !supabaseClient
    ) {

        return;

    }


    try {

        await supabaseClient
            .removeChannel(
                realtimeChannel
            );

    } catch (error) {

        console.warn(
            "Unable to remove realtime channel:",
            error
        );

    }


    realtimeChannel =
        null;

}


/* =========================================================
   38. EMERGENCY REALTIME EVENTS
   ========================================================= */

function handleEmergencyRealtimeEvent(
    payload
) {

    if (!payload) {

        return;

    }


    const eventType =
        payload.eventType;


    const emergency =
        eventType === "DELETE"
            ? payload.old
            : payload.new;


    /*
        INSERT
    */

    if (
        eventType ===
        "INSERT"
    ) {

        console.log(
            "NEW EMERGENCY:",
            emergency
        );


        window.dispatchEvent(
            new CustomEvent(
                "eldersafe:emergency",
                {
                    detail:
                        emergency
                }
            )
        );

    }


    /*
        UPDATE
    */

    else if (
        eventType ===
        "UPDATE"
    ) {

        console.log(
            "EMERGENCY UPDATED:",
            emergency
        );


        window.dispatchEvent(
            new CustomEvent(
                "eldersafe:emergency-updated",
                {
                    detail:
                        emergency
                }
            )
        );

    }


    /*
        DELETE
    */

    else if (
        eventType ===
        "DELETE"
    ) {

        console.log(
            "EMERGENCY REMOVED:",
            emergency
        );


        window.dispatchEvent(
            new CustomEvent(
                "eldersafe:emergency-deleted",
                {
                    detail:
                        emergency
                }
            )
        );

    }


    /*
        Generic emergency event.
    */

    window.dispatchEvent(
        new CustomEvent(
            "eldersafe:emergency-event",
            {
                detail: payload
            }
        )
    );

}


/* =========================================================
   39. AUTH LOADING
   ========================================================= */

function setAuthLoading(
    isLoading,
    type = "login"
) {

    const buttonIDs =
        type === "register"
            ? [
                "registerButton",
                "signupButton",
                "createAccountButton"
            ]
            : [
                "loginButton",
                "signinButton",
                "submitButton"
            ];


    let button = null;


    for (
        const id of buttonIDs
    ) {

        button =
            document.getElementById(
                id
            );


        if (button) {

            break;

        }

    }


    /*
        Fallback submit button.
    */

    if (!button) {

        const form =
            type === "register"
                ? (
                    document.getElementById(
                        "registerForm"
                    ) ||
                    document.getElementById(
                        "signupForm"
                    )
                )
                : (
                    document.getElementById(
                        "loginForm"
                    ) ||
                    document.getElementById(
                        "signinForm"
                    )
                );


        if (form) {

            button =
                form.querySelector(
                    'button[type="submit"]'
                );

        }

    }


    if (button) {

        button.disabled =
            isLoading;


        button.classList.toggle(
            "loading",
            isLoading
        );


        button.setAttribute(
            "aria-busy",
            String(isLoading)
        );

    }


    /*
        Button text.
    */

    const textIDs =
        type === "register"
            ? [
                "registerButtonText",
                "signupButtonText"
            ]
            : [
                "loginButtonText",
                "signinButtonText"
            ];


    textIDs.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.hidden =
                    isLoading;

            }

        }
    );


    /*
        Spinners.
    */

    const spinnerIDs =
        type === "register"
            ? [
                "registerSpinner",
                "signupSpinner"
            ]
            : [
                "loginSpinner",
                "signinSpinner"
            ];


    spinnerIDs.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.hidden =
                    !isLoading;

            }

        }
    );

}


/* =========================================================
   40. AUTH ERROR
   ========================================================= */

function showAuthError(
    message
) {

    const error =
        document.getElementById(
            "authError"
        ) ||
        document.querySelector(
            ".auth-error"
        ) ||
        document.querySelector(
            "[data-auth-error]"
        );


    const success =
        document.getElementById(
            "authSuccess"
        ) ||
        document.querySelector(
            ".auth-success"
        ) ||
        document.querySelector(
            "[data-auth-success]"
        );


    if (success) {

        success.hidden =
            true;

        success.style.display =
            "none";

        success.classList.remove(
            "show"
        );

    }


    if (!error) {

        console.error(
            "AUTH ERROR:",
            message
        );

        return;

    }


    error.textContent =
        message;


    error.hidden =
        false;


    error.style.display =
        "";


    error.classList.add(
        "show"
    );

}


/* =========================================================
   41. AUTH SUCCESS
   ========================================================= */

function showAuthSuccess(
    message
) {

    const error =
        document.getElementById(
            "authError"
        ) ||
        document.querySelector(
            ".auth-error"
        ) ||
        document.querySelector(
            "[data-auth-error]"
        );


    const success =
        document.getElementById(
            "authSuccess"
        ) ||
        document.querySelector(
            ".auth-success"
        ) ||
        document.querySelector(
            "[data-auth-success]"
        );


    if (error) {

        error.hidden =
            true;

        error.style.display =
            "none";

        error.classList.remove(
            "show"
        );

    }


    if (!success) {

        console.log(
            "AUTH SUCCESS:",
            message
        );

        return;

    }


    success.textContent =
        message;


    success.hidden =
        false;


    success.style.display =
        "";


    success.classList.add(
        "show"
    );

}


/* =========================================================
   42. CLEAR AUTH MESSAGES
   ========================================================= */

function clearAuthMessages() {

    const messages =
        document.querySelectorAll(
            [
                "#authError",
                "#authSuccess",
                ".auth-error",
                ".auth-success",
                "[data-auth-error]",
                "[data-auth-success]"
            ].join(",")
        );


    messages.forEach(
        element => {

            element.hidden =
                true;


            element.style.display =
                "none";


            element.classList.remove(
                "show"
            );

        }
    );

}


/* =========================================================
   43. DASHBOARD ERROR
   ========================================================= */

function showDashboardError(
    message
) {

    const element =
        document.querySelector(
            "[data-dashboard-error]"
        ) ||
        document.querySelector(
            ".dashboard-error"
        );


    if (element) {

        element.textContent =
            message;


        element.hidden =
            false;


        element.style.display =
            "";


        return;

    }


    console.error(
        "DASHBOARD ERROR:",
        message
    );

}


/* =========================================================
   44. AUTH ERROR TRANSLATOR
   ========================================================= */

function getAuthErrorMessage(
    error
) {

    const message =
        (
            error?.message ||
            ""
        )
            .toLowerCase();


    if (
        message.includes(
            "invalid login credentials"
        )
    ) {

        return (
            "Incorrect email or password."
        );

    }


    if (
        message.includes(
            "email not confirmed"
        )
    ) {

        return (
            "Please verify your email address before signing in."
        );

    }


    if (
        message.includes(
            "user already registered"
        )
    ) {

        return (
            "An account with this email already exists."
        );

    }


    if (
        message.includes(
            "password should be at least"
        )
    ) {

        return (
            "Your password is too short."
        );

    }


    if (
        message.includes(
            "password"
        ) &&
        message.includes(
            "characters"
        )
    ) {

        return (
            "Please use a stronger password."
        );

    }


    if (
        message.includes(
            "too many requests"
        )
    ) {

        return (
            "Too many attempts. Please wait and try again."
        );

    }


    if (
        message.includes(
            "network"
        )
    ) {

        return (
            "Network error. Check your internet connection."
        );

    }


    if (
        message.includes(
            "email rate limit"
        )
    ) {

        return (
            "Too many email requests. Please try again later."
        );

    }


    if (
        message.includes(
            "signup is disabled"
        )
    ) {

        return (
            "New account registration is currently disabled."
        );

    }


    if (
        message.includes(
            "rate limit"
        )
    ) {

        return (
            "Too many requests. Please wait a moment and try again."
        );

    }


    if (
        message.includes(
            "user not found"
        )
    ) {

        return (
            "No account was found with that email address."
        );

    }


    if (
        message.includes(
            "same password"
        )
    ) {

        return (
            "Please choose a different password."
        );

    }


    return (
        error?.message ||
        "Something went wrong. Please try again."
    );

}


/* =========================================================
   45. GET CURRENT USER
   ========================================================= */

async function getCurrentUser() {

    if (!supabaseClient) {

        return null;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getUser();


        if (error) {

            return null;

        }


        return (
            data?.user ||
            null
        );


    } catch {

        return null;

    }

}


window.getCurrentUser =
    getCurrentUser;


/* =========================================================
   46. GET CURRENT PROFILE GLOBAL
   ========================================================= */

async function getProfile() {

    if (!currentUser) {

        currentUser =
            await getCurrentUser();

    }


    if (!currentUser) {

        return null;

    }


    if (currentProfile) {

        return currentProfile;

    }


    currentProfile =
        await getCurrentProfile();


    return currentProfile;

}


window.getProfile =
    getProfile;


/* =========================================================
   47. REFRESH PROFILE
   ========================================================= */

async function refreshProfile() {

    if (!currentUser) {

        currentUser =
            await getCurrentUser();

    }


    if (!currentUser) {

        currentProfile =
            null;

        return null;

    }


    currentProfile =
        await getCurrentProfile();


    return currentProfile;

}


window.refreshProfile =
    refreshProfile;


/* =========================================================
   48. CHECK AUTHENTICATION
   ========================================================= */

async function isAuthenticated() {

    if (!supabaseClient) {

        return false;

    }


    const user =
        await getCurrentUser();


    return !!user;

}


window.isAuthenticated =
    isAuthenticated;


/* =========================================================
   49. GLOBAL SUPABASE ACCESS
   ========================================================= */

window.supabaseClient =
    supabaseClient;


/* =========================================================
   50. GLOBAL ELDERSAFE OBJECT
   ========================================================= */

window.ELDERSAFE = {

    get currentUser() {

        return currentUser;

    },


    get currentProfile() {

        return currentProfile;

    },


    get supabase() {

        return supabaseClient;

    },


    get realtimeChannel() {

        return realtimeChannel;

    },


    logout,

    getCurrentUser,

    getProfile,

    refreshProfile,

    isAuthenticated,

    initializeRealtime,

    removeRealtimeChannel

};


/* =========================================================
   51. GLOBAL DEBUG HELPERS
   ========================================================= */

window.ELDERSAFE_DEBUG = {

    getPage() {

        return activePage;

    },


    getUser() {

        return currentUser;

    },


    getProfile() {

        return currentProfile;

    },


    getRealtimeChannel() {

        return realtimeChannel;

    },


    getSupabase() {

        return supabaseClient;

    }

};


/* =========================================================
   52. STARTUP LOG
   ========================================================= */

console.log(
    "======================================"
);

console.log(
    "ELDERSAFE app.js loaded successfully."
);

console.log(
    "Version: 3.0"
);

console.log(
    "Current page:",
    activePage
);

console.log(
    "Supabase:",
    supabaseClient
        ? "Connected"
        : "Not available"
);

console.log(
    "======================================"
);


/* =========================================================
   END OF ELDERSAFE APP.JS
   ========================================================= */