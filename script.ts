document.addEventListener("DOMContentLoaded", () => {
    setupSubmitButton();
    setupRepeaterButtons(); // Repeater buttons ko initialize karta hai
});

function setupSubmitButton() {
    const submitButton = document.querySelector(".submit-button");
    submitButton?.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Generate button clicked");
        const formData = collectFormData();
        console.log("Form Data Collected:", formData);
        displayResumeData(formData);
    });
}

function setupRepeaterButtons() {
    // Add Event Listener for Add Buttons
    document.querySelectorAll(".repeater-add-btn").forEach(addButton => {
        addButton.addEventListener("click", () => {
            const repeaterList = addButton.closest(".repeater")?.querySelector('[data-repeater-list]');
            if (repeaterList) {
                const item = repeaterList.firstElementChild?.cloneNode(true) as HTMLElement;
                if (item) {
                    item.querySelectorAll("input").forEach(input => (input as HTMLInputElement).value = ""); // Naye item ke inputs clear karta hai
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
    document.querySelectorAll(".repeater-remove-btn").forEach(removeButton => {
        removeButton.addEventListener("click", () => {
            const item = removeButton.closest("[data-repeater-item]");
            item?.parentNode?.removeChild(item);
        });
    });
}

function collectFormData() {
    const data: any = {};
    data.firstname = (document.querySelector(".firstname") as HTMLInputElement)?.value || '';
    data.middlename = (document.querySelector(".middlename") as HTMLInputElement)?.value || '';
    data.lastname = (document.querySelector(".lastname") as HTMLInputElement)?.value || '';
    data.designation = (document.querySelector(".designation") as HTMLInputElement)?.value || '';
    data.email = (document.querySelector(".email") as HTMLInputElement)?.value || '';
    data.phone = (document.querySelector(".phoneno") as HTMLInputElement)?.value || '';
    data.address = (document.querySelector(".address") as HTMLInputElement)?.value || '';
    data.summary = (document.querySelector(".summary") as HTMLInputElement)?.value || '';
    
    const imageInput = document.querySelector(".image") as HTMLInputElement;
    if (imageInput?.files?.[0]) {
        data.imageUrl = URL.createObjectURL(imageInput.files[0]);
    }
    
    // Collect repeated section data
    data.achievements = collectRepeatedData(".achieve_title", ".achieve_description");
    data.experience = collectRepeatedData(".exp_title", ".exp_organization", ".exp_location", ".exp_start_date", ".exp_end_date", ".exp_description");
    data.education = collectRepeatedData(".edu_school", ".edu_degree", ".edu_city", ".edu_start_date", ".edu_graduation_date", ".edu_description");
    data.projects = collectRepeatedData(".proj_title", ".proj_link", ".proj_description");
    data.skills = Array.from(document.querySelectorAll(".skill")).map(input => (input as HTMLInputElement).value || '');

    return data;
}

function collectRepeatedData(...selectors: string[]): Record<string, string>[] {
    const dataItems: Record<string, string>[] = []; // Type specify kar diya gaya hai
    const elements = document.querySelectorAll(selectors[0]);
    elements.forEach((_, index) => {
        const item: Record<string, string> = {}; // Item ko bhi same type assign kiya gaya hai
        selectors.forEach(selector => {
            item[selector.slice(1)] = (document.querySelectorAll(selector)[index] as HTMLInputElement)?.value || '';
        });
        dataItems.push(item);
    });
    return dataItems;
}

function displayResumeData(data: any) {
    document.getElementById("fullname_dsp")!.textContent =` ${data.firstname} ${data.middlename} ${data.lastname}`;
    document.getElementById("designation_dsp")!.textContent = data.designation;
    document.getElementById("email_dsp")!.textContent = data.email;
    document.getElementById("phoneno_dsp")!.textContent = data.phone;
    document.getElementById("address_dsp")!.textContent = data.address;
    document.getElementById("summary_dsp")!.textContent = data.summary;

    if (data.imageUrl) {
        (document.getElementById("image_dsp") as HTMLImageElement).src = data.imageUrl;
    }

    // Populate repeated sections
    displayRepeatedData("achievements_dsp", data.achievements, ["achieve_title", "achieve_description"]);
    displayRepeatedData("experiences_dsp", data.experience, ["exp_title", "exp_organization", "exp_location", "exp_start_date", "exp_end_date", "exp_description"]);
    displayRepeatedData("educations_dsp", data.education, ["edu_school", "edu_degree", "edu_city", "edu_start_date", "edu_graduation_date", "edu_description"]);
    displayRepeatedData("projects_dsp", data.projects, ["proj_title", "proj_link", "proj_description"]);
    
    // Display skills
    const skillsDisplay = document.getElementById("skills_dsp")!;
    skillsDisplay.innerHTML = data.skills.map((skill: string) => `<div>${skill}</div>`).join('');
}

function displayRepeatedData(elementId: string, dataArray: any[], fields: string[]) {
    const container = document.getElementById(elementId)!;
    container.innerHTML = dataArray.map(item => 
        `<div>${fields.map(field => item[field] ? `<p>${item[field]}</p>` : '').join('')}</div>`
    ).join('');
}

function printCV() {
    window.print();
}