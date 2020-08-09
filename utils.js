function getTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true },
            (tabs) => {
                resolve(tabs[0])
            }
        )
    })
}

async function execute(code) {
    const tab = await getTab()
    chrome.tabs.executeScript(tab.ib, {
        code: code
    })
}