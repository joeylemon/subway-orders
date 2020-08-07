function getTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true },
            (tabs) => {
                resolve(tabs[0])
            }
        )
    })
}