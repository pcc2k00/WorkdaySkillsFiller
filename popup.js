document.getElementById('openSkillsTextbox').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => {
                const event = new CustomEvent('openSkillsTextbox');
                window.dispatchEvent(event);
            }
        });
    });
});
