document.addEventListener("DOMContentLoaded", function () {
    setupSubmitButton();
    setupRepeaterButtons(); // Repeater buttons ko initialize karta hai
});
function setupSubmitButton() {
    var submitButton = document.querySelector(".submit-button");
    submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Generate button clicked");
        var formData = collectFormData();
        console.log("Form Data Collected:", formData);
        displayResumeData(formData);
    });
}
function setupRepeaterButtons() {
    // Add Event Listener for Add Buttons
    document.querySelectorAll(".repeater-add-btn").forEach(function (addButton) {
        addButton.addEventListener("click", function () {
            var _a, _b;
            var repeaterList = (_a = addButton.closest(".repeater")) === null || _a === void 0 ? void 0 : _a.querySelector('[data-repeater-list]');
            if (repeaterList) {
                var item = (_b = repeaterList.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
                if (item) {
                    item.querySelectorAll("input").forEach(function (input) { return input.value = ""; }); // Naye item ke inputs clear karta hai
                    repeaterList.appendChild(item);
                    setupRemoveButtons(); // Naye item par remove button ko activate karta hai
                }
            }
        });
    });
    setupRemoveButtons(); // Page load par remove buttons initialize karta hai
}
function setupRemoveButtons() {
    // Remove Event Listener for Remove Buttons
    document.querySelectorAll(".repeater-remove-btn").forEach(function (removeButton) {
        removeButton.addEventListener("click", function () {
            var _a;
            var item = removeButton.closest("[data-repeater-item]");
            (_a = item === null || item === void 0 ? void 0 : item.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(item);
        });
    });
}
function collectFormData() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var data = {};
    data.firstname = ((_a = document.querySelector(".firstname")) === null || _a === void 0 ? void 0 : _a.value) || '';
    data.middlename = ((_b = document.querySelector(".middlename")) === null || _b === void 0 ? void 0 : _b.value) || '';
    data.lastname = ((_c = document.querySelector(".lastname")) === null || _c === void 0 ? void 0 : _c.value) || '';
    data.designation = ((_d = document.querySelector(".designation")) === null || _d === void 0 ? void 0 : _d.value) || '';
    data.email = ((_e = document.querySelector(".email")) === null || _e === void 0 ? void 0 : _e.value) || '';
    data.phone = ((_f = document.querySelector(".phoneno")) === null || _f === void 0 ? void 0 : _f.value) || '';
    data.address = ((_g = document.querySelector(".address")) === null || _g === void 0 ? void 0 : _g.value) || '';
    data.summary = ((_h = document.querySelector(".summary")) === null || _h === void 0 ? void 0 : _h.value) || '';
    var imageInput = document.querySelector(".image");
    if ((_j = imageInput === null || imageInput === void 0 ? void 0 : imageInput.files) === null || _j === void 0 ? void 0 : _j[0]) {
        data.imageUrl = URL.createObjectURL(imageInput.files[0]);
    }
    // Collect repeated section data
    data.achievements = collectRepeatedData(".achieve_title", ".achieve_description");
    data.experience = collectRepeatedData(".exp_title", ".exp_organization", ".exp_location", ".exp_start_date", ".exp_end_date", ".exp_description");
    data.education = collectRepeatedData(".edu_school", ".edu_degree", ".edu_city", ".edu_start_date", ".edu_graduation_date", ".edu_description");
    data.projects = collectRepeatedData(".proj_title", ".proj_link", ".proj_description");
    data.skills = Array.from(document.querySelectorAll(".skill")).map(function (input) { return input.value || ''; });
    return data;
}
function collectRepeatedData() {
    var selectors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        selectors[_i] = arguments[_i];
    }
    var dataItems = []; // Type specify kar diya gaya hai
    var elements = document.querySelectorAll(selectors[0]);
    elements.forEach(function (_, index) {
        var item = {}; // Item ko bhi same type assign kiya gaya hai
        selectors.forEach(function (selector) {
            var _a;
            item[selector.slice(1)] = ((_a = document.querySelectorAll(selector)[index]) === null || _a === void 0 ? void 0 : _a.value) || '';
        });
        dataItems.push(item);
    });
    return dataItems;
}
function displayResumeData(data) {
    document.getElementById("fullname_dsp").textContent = " ".concat(data.firstname, " ").concat(data.middlename, " ").concat(data.lastname);
    document.getElementById("designation_dsp").textContent = data.designation;
    document.getElementById("email_dsp").textContent = data.email;
    document.getElementById("phoneno_dsp").textContent = data.phone;
    document.getElementById("address_dsp").textContent = data.address;
    document.getElementById("summary_dsp").textContent = data.summary;
    if (data.imageUrl) {
        document.getElementById("image_dsp").src = data.imageUrl;
    }
    // Populate repeated sections
    displayRepeatedData("achievements_dsp", data.achievements, ["achieve_title", "achieve_description"]);
    displayRepeatedData("experiences_dsp", data.experience, ["exp_title", "exp_organization", "exp_location", "exp_start_date", "exp_end_date", "exp_description"]);
    displayRepeatedData("educations_dsp", data.education, ["edu_school", "edu_degree", "edu_city", "edu_start_date", "edu_graduation_date", "edu_description"]);
    displayRepeatedData("projects_dsp", data.projects, ["proj_title", "proj_link", "proj_description"]);
    // Display skills
    var skillsDisplay = document.getElementById("skills_dsp");
    skillsDisplay.innerHTML = data.skills.map(function (skill) { return "<div>".concat(skill, "</div>"); }).join('');
}
function displayRepeatedData(elementId, dataArray, fields) {
    var container = document.getElementById(elementId);
    container.innerHTML = dataArray.map(function (item) {
        return "<div>".concat(fields.map(function (field) { return item[field] ? "<p>".concat(item[field], "</p>") : ''; }).join(''), "</div>");
    }).join('');
}
function printCV() {
    window.print();
}
