const refsModal = {
    openModalBtn: document.querySelector("[data-modal-open]"),
    backdrop: document.querySelector("[data-modal]"),
    form: document.getElementById("registrationForm"),
    emailInput: document.querySelector("input[name='email']"),
    passwordInput: document.querySelector("input[name='password']"),
    checkbox: document.querySelector("input[name='terms']"),
    submitBtn: document.querySelector(".modal button[type='submit']")
};
let startY;
refsModal.openModalBtn.addEventListener("click", handleOpenModal);
refsModal.emailInput.addEventListener("input", validateForm);
refsModal.passwordInput.addEventListener("input", validateForm);
refsModal.checkbox.addEventListener("change", validateForm);
refsModal.form.addEventListener("touchstart", handleTouchStart);
refsModal.form.addEventListener("touchmove", handleTouchMove);
refsModal.form.addEventListener("submit", submitRegistration);
window.addEventListener("popstate", handleBackButton);
disableButton();
function handleOpenModal() {
    refsModal.backdrop.classList.remove("is-hidden");
    document.addEventListener("keydown", handleEscCloseModal);
    document.addEventListener("click", handleEscCloseModal);
    document.body.style.overflow = "hidden";
    window.history.pushState({
        modalOpen: true
    }, "");
}
function handleCloseModal() {
    document.body.style.overflow = "";
    refsModal.backdrop.classList.add("is-hidden");
    document.removeEventListener("keydown", handleEscCloseModal);
    document.removeEventListener("click", handleEscCloseModal);
    clearForm();
    if (window.history.state && window.history.state.modalOpen) window.history.back();
}
function handleEscCloseModal(event) {
    if (event.target === refsModal.backdrop || event.type === "keydown" && event.key === "Escape") handleCloseModal();
}
function handleTouchStart(event) {
    startY = event.touches[0].clientY;
}
function handleTouchMove(event) {
    let deltaY = event.touches[0].clientY - startY;
    if (deltaY > 100) handleCloseModal();
}
function handleBackButton() {
    if (!refsModal.backdrop.classList.contains("is-hidden")) handleCloseModal();
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePassword(password) {
    return password.length >= 6;
}
function validateField(input, validationFn) {
    const isValid = validationFn(input.value.trim());
    if (input.value.trim() === "") input.classList.remove("valid", "invalid");
    else {
        input.classList.toggle("valid", isValid);
        input.classList.toggle("invalid", !isValid);
    }
    return isValid;
}
function validateForm() {
    const emailValid = validateField(refsModal.emailInput, validateEmail);
    const passwordValid = validateField(refsModal.passwordInput, validatePassword);
    const isChecked = refsModal.checkbox.checked;
    // Замість перевірки токена:
    const captchaResponse = document.querySelector("textarea[name='g-recaptcha-response']");
    const captchaReady = captchaResponse && captchaResponse.value.trim() !== "";
    if (emailValid && passwordValid && isChecked && captchaReady) enableButton();
    else disableButton();
}
function clearForm() {
    refsModal.emailInput.value = "";
    refsModal.passwordInput.value = "";
    refsModal.emailInput.classList.remove("valid", "invalid");
    refsModal.passwordInput.classList.remove("valid", "invalid");
    refsModal.checkbox.checked = false;
    disableButton();
}
function disableButton() {
    refsModal.submitBtn.disabled = true;
    refsModal.submitBtn.style.cursor = "not-allowed";
    refsModal.submitBtn.style.background = "rgba(99, 82, 255, 1)";
    refsModal.submitBtn.style.color = "rgba(198, 195, 205, 1)";
}
function enableButton() {
    refsModal.submitBtn.disabled = false;
    refsModal.submitBtn.style.cursor = "pointer";
    refsModal.submitBtn.style.background = "rgba(79, 65, 202, 1)";
    refsModal.submitBtn.style.color = "rgba(255, 255, 255, 1)";
}
async function submitRegistration(event) {
    event.preventDefault();
    if (refsModal.submitBtn.disabled) return;
    const email = refsModal.emailInput.value.trim();
    const password = refsModal.passwordInput.value.trim();
    const captchaResponseEl = document.querySelector("textarea[name='g-recaptcha-response']");
    const captchaResponse = captchaResponseEl ? captchaResponseEl.value.trim() : "";
    if (!email || !password || !captchaResponse) {
        alert("\u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u0437\u0430\u043F\u043E\u0432\u043D\u0456\u0442\u044C \u0443\u0441\u0456 \u043F\u043E\u043B\u044F \u0442\u0430 \u043F\u0440\u043E\u0439\u0434\u0456\u0442\u044C \u043A\u0430\u043F\u0447\u0443.");
        return;
    }
    const data = {
        email,
        password,
        language: "ru",
        partnerId: null,
        trackId: null,
        param1: null,
        param2: null,
        param3: null,
        param4: null
    };
    try {
        const response = await fetch(`https://weiss.bet/api/v3/auth/register/partners?captcha-response=${captchaResponse}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if ("playerToken" in responseData) {
            clearForm();
            window.location.href = `https://weiss.bet/api/v3/auth/partners-player-entry?playerToken=${responseData.playerToken}&deeplink=%2F`;
        } else if ("errors" in responseData) {
            console.error("\u041F\u043E\u043C\u0438\u043B\u043A\u0438 \u043F\u0440\u0438 \u0440\u0435\u0454\u0441\u0442\u0440\u0430\u0446\u0456\u0457:", responseData.errors);
            alert("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0440\u0435\u0454\u0441\u0442\u0440\u0430\u0446\u0456\u0457. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.");
        } else throw new Error("\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0430 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C \u0432\u0456\u0434 \u0441\u0435\u0440\u0432\u0435\u0440\u0430.");
    } catch (error) {
        console.error("\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u043F\u0438\u0442\u0456:", error);
        alert("\u0429\u043E\u0441\u044C \u043F\u0456\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A! \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.");
    }
}
window.onCaptchaCompleted = function() {
    validateForm();
};

//# sourceMappingURL=calculator.26d773dc.js.map
