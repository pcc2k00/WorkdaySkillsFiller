(function () {
    'use strict';

    let skills = []; // Skills will be loaded from the textbox
    let index = 0; // To track the current skill being added
    let skillInputSelector = null; // To store the dynamic input selector for skills
    const dropdownSelector = '[data-automation-id="promptOption"]'; // Selector for dropdown options

    function addSkillsTextbox() {
        if (document.getElementById('skills-textbox-container')) {
            return; // Avoid re-adding the textbox
        }

        const container = document.createElement('div');
        container.id = 'skills-textbox-container';
        container.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            z-index: 1000;
            padding: 10px;
            background-color: #f8f9fa;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
        `;

        const label = document.createElement('label');
        label.innerText = 'Enter Skills (JSON format):';
        label.style = 'display: block; margin-bottom: 5px;';
        container.appendChild(label);

        const textarea = document.createElement('textarea');
        textarea.id = 'skills-input';
        textarea.style = 'width: 100%; height: 100px; resize: none;';
        textarea.placeholder = 'Enter skills as JSON array...';
        container.appendChild(textarea);

        const button = document.createElement('button');
        button.innerText = 'Load Skills';
        button.style = 'margin-top: 10px; width: 100%; padding: 8px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;';
        button.onclick = loadSkillsAndStartProcess;
        container.appendChild(button);

        document.body.appendChild(container);
    }

    function removeSkillsTextbox() {
        const existingContainer = document.getElementById('skills-textbox-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    }

    function loadSkillsAndStartProcess() {
        const textarea = document.getElementById('skills-input');
        try {
            skills = JSON.parse(textarea.value);
            if (Array.isArray(skills) && skills.length > 0) {
                index = 0; // Reset index
                startSkillProcess();
            } else {
                alert('Please enter a valid JSON array of skills.');
            }
        } catch (error) {
            alert('Invalid JSON format. Please check your input.');
        }
    }

    function findSkillsInput() {

        const skillsSection = document.querySelector('div[data-automation-id="skillsSection"]');

        const inputField = skillsSection.querySelector('input[id^="input-"]');
        if (inputField) {
            skillInputSelector = `#${inputField.id}`;
            return true;
        }
        return false;
    }

    // Function to clean up the text by removing non-alphabet characters and optional trailing 's'
    function cleanText(text) {
        return text.replace(/[^a-zA-Z]/g, '').replace(/s$/i, '').toLowerCase();
    }

    function addSkill() {
        const inputField = document.querySelector(skillInputSelector);
        if (inputField && index < skills.length) {
            inputField.focus();
            inputField.select();

            inputField.value = skills[index];
            inputField.dispatchEvent(new Event('input', { bubbles: true }));

            const keydownEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13 });
            const keyupEvent = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13 });

            inputField.dispatchEvent(keydownEvent);
            inputField.dispatchEvent(keyupEvent);

            setTimeout(() => {
                const dropdownOptions = document.querySelectorAll(dropdownSelector);
                dropdownOptions.forEach((option) => {

                // Updated comparison
                if (cleanText(option.textContent.trim()) === cleanText(skills[index])) {
                    option.click();
                }   

                });

                index++;
                if (index < skills.length) {
                    setTimeout(addSkill, 1000);
                }
            }, 5000);
        }
    }

    function startSkillProcess() {
        if (findSkillsInput()) {
            addSkill();
        }
    }

    function checkForMyExperiencePage() {
        const myExperiencePage = document.querySelector('[data-automation-id="myExperiencePage"]');
        if (myExperiencePage) {
            addSkillsTextbox();
        } else {
            removeSkillsTextbox();
        }
    }

    function handleSaveAndContinueClick() {
        const saveButton = document.querySelector('button[data-automation-id="bottom-navigation-next-button"]');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                setTimeout(handleBackClick, 1000); // Call handleBackClick after 1 second
                setTimeout(checkForMyExperiencePage, 2000); // Check for myExperiencePage after 2 seconds
            });
        }
    }

    function handleBackClick() {
        const backButton = document.querySelector('button[data-automation-id="bottom-navigation-back-button"]');
        if (backButton) {
            backButton.addEventListener('click', () => {
                setTimeout(checkForMyExperiencePage, 2000); // Check for myExperiencePage after 2 seconds
            });
        }
    }

    window.addEventListener('load', () => {
        setTimeout(handleSaveAndContinueClick, 3000); // Set up the listener after 3 seconds
    });
})();
