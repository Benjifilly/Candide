// popup.js
document.addEventListener('DOMContentLoaded', () => {
    // Hidden Checkboxes & Primary Controls
    const inspectorToggle = document.getElementById('inspectorToggle');
    const solveToggle = document.getElementById('solveToggle');
    const manualToggle = document.getElementById('manualToggle');
    const delayMinInput = document.getElementById('delayMin');
    const delayMaxInput = document.getElementById('delayMax');
    const errorRateInput = document.getElementById('errorRate');
    const errorRateValue = document.getElementById('errorRateValue');
    const logDiv = document.getElementById('log');

    // Segmented Mode Tabs
    const tabManual = document.getElementById('tabManual');
    const tabSolve = document.getElementById('tabSolve');
    const tabInactive = document.getElementById('tabInactive');

    // Status Badge Elements
    const globalStatusBadge = document.getElementById('globalStatusBadge');
    const globalStatusText = document.getElementById('globalStatusText');

    // Settings UI Elements
    const openSettingsBtn = document.getElementById('openSettings');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const currentVersionSpan = document.getElementById('currentVersion');
    const checkUpdateBtn = document.getElementById('checkUpdate');
    const updateStatusDiv = document.getElementById('updateStatus');
    const settingsBadge = document.getElementById('settingsBadge');

    // New Advanced Settings Toggles
    const autoSkipToggle = document.getElementById('autoSkipToggle');
    const autoMuteToggle = document.getElementById('autoMuteToggle');

    // Dual Range Slider DOM elements
    const sliderTrack = document.getElementById('sliderTrack');
    const delayDisplayValue = document.getElementById('delayDisplayValue');
    const delayWarning = document.getElementById('delayWarning');

    const MIN_DELAY = 1000;

    // Helper to update dual slider styling in real-time
    function updateDualSliderVisuals(e) {
        let minVal = parseInt(delayMinInput.value, 10) || MIN_DELAY;
        let maxVal = parseInt(delayMaxInput.value, 10) || 2000;

        // Prevent handles from crossing
        if (minVal > maxVal) {
            if (e && e.target === delayMinInput) {
                delayMaxInput.value = minVal;
                maxVal = minVal;
            } else {
                delayMinInput.value = maxVal;
                minVal = maxVal;
            }
        }

        // Calculate track coordinates
        const minPercent = ((minVal - delayMinInput.min) / (delayMinInput.max - delayMinInput.min)) * 100;
        const maxPercent = ((maxVal - delayMaxInput.min) / (delayMaxInput.max - delayMaxInput.min)) * 100;

        // Visual coloring of track (active part gets Voltaire Amber gold, inactive gets Slate grey)
        const isDarkMode = document.body.classList.contains('dark-mode');
        const activeColor = isDarkMode ? '#fbbf24' : '#d97706';
        const inactiveColor = isDarkMode ? '#334155' : '#cbd5e1';
        sliderTrack.style.background = `linear-gradient(to right, ${inactiveColor} ${minPercent}%, ${activeColor} ${minPercent}%, ${activeColor} ${maxPercent}%, ${inactiveColor} ${maxPercent}%)`;

        // Update display text
        delayDisplayValue.textContent = `${minVal}ms - ${maxVal}ms`;

        // Warnings for low delays
        let warning = '';
        if (minVal < 2000) {
            warning = 'Délai court : augmente le risque de détection.';
        }

        if (warning) {
            delayWarning.textContent = warning;
            delayWarning.style.display = 'block';
        } else {
            delayWarning.style.display = 'none';
        }
    }

    function saveAndDispatchDelay() {
        const min = parseInt(delayMinInput.value, 10) || MIN_DELAY;
        const max = parseInt(delayMaxInput.value, 10) || 2000;

        chrome.storage.local.set({ delayMin: min, delayMax: max }, () => {
            if (chrome.runtime.lastError) {
                console.error("Storage error:", chrome.runtime.lastError);
            }
        });
        sendMessageToContent({ action: 'updateDelay', min: min, max: max });
    }

    // Update the segmented tab buttons and the pulsing status badge based on checkbox states
    function updateModesUI() {
        const isManual = manualToggle.checked;
        const isSolve = solveToggle.checked;

        // Clear active classes from tabs
        tabManual.classList.remove('active');
        tabSolve.classList.remove('active');
        tabInactive.classList.remove('active');

        // Reset badge classes
        globalStatusBadge.classList.remove('active-manual', 'active-solve', 'inactive');

        if (isManual) {
            tabManual.classList.add('active');
            globalStatusBadge.classList.add('active-manual');
            globalStatusText.textContent = "Discret";
        } else if (isSolve) {
            tabSolve.classList.add('active');
            globalStatusBadge.classList.add('active-solve');
            globalStatusText.textContent = "Auto";
        } else {
            tabInactive.classList.add('active');
            globalStatusBadge.classList.add('inactive');
            globalStatusText.textContent = "Inactif";
        }
    }

    // Segmented tab controls listener mappings
    tabManual.addEventListener('click', () => {
        manualToggle.checked = true;
        solveToggle.checked = false;
        manualToggle.dispatchEvent(new Event('change'));
        solveToggle.dispatchEvent(new Event('change'));
        updateModesUI();
    });

    tabSolve.addEventListener('click', () => {
        solveToggle.checked = true;
        manualToggle.checked = false;
        solveToggle.dispatchEvent(new Event('change'));
        manualToggle.dispatchEvent(new Event('change'));
        updateModesUI();
    });

    tabInactive.addEventListener('click', () => {
        solveToggle.checked = false;
        manualToggle.checked = false;
        solveToggle.dispatchEvent(new Event('change'));
        manualToggle.dispatchEvent(new Event('change'));
        updateModesUI();
    });

    // Bind Dual Slider events
    delayMinInput.addEventListener('input', (e) => {
        updateDualSliderVisuals(e);
        saveAndDispatchDelay();
    });
    delayMaxInput.addEventListener('input', (e) => {
        updateDualSliderVisuals(e);
        saveAndDispatchDelay();
    });

    // Load saved states from storage
    chrome.storage.local.get([
        'inspectorEnabled', 'solveEnabled', 'manualEnabled', 
        'delayMin', 'delayMax', 'darkMode', 'errorRate',
        'autoSkipEnabled', 'autoMuteEnabled'
    ], (result) => {
        if (chrome.runtime.lastError) return;

        inspectorToggle.checked = result.inspectorEnabled || false;
        solveToggle.checked = result.solveEnabled || false;
        manualToggle.checked = result.manualEnabled || false;

        // Sync new settings toggles
        autoSkipToggle.checked = result.autoSkipEnabled !== false; // Default true
        autoMuteToggle.checked = result.autoMuteEnabled !== false; // Default true

        if (result.darkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }

        if (result.delayMin !== undefined) delayMinInput.value = result.delayMin;
        if (result.delayMax !== undefined) delayMaxInput.value = result.delayMax;
        
        // Refresh tab & slider states
        updateModesUI();
        updateDualSliderVisuals();

        if (result.errorRate !== undefined) {
            errorRateInput.value = result.errorRate;
            errorRateValue.textContent = result.errorRate;
        }

        // Auto-check for updates on load
        checkForUpdates(true);
    });

    // Load and display stats with percentage
    function updateStats() {
        chrome.storage.local.get(['statsCorrect', 'statsWrong'], (result) => {
            if (chrome.runtime.lastError) return;
            const correct = result.statsCorrect || 0;
            const wrong = result.statsWrong || 0;
            const total = correct + wrong;

            document.getElementById('statCorrect').textContent = correct;
            document.getElementById('statWrong').textContent = wrong;
            
            // Calculate accuracy percentage
            const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
            document.getElementById('statAccuracy').textContent = `${accuracy}%`;
        });
    }

    updateStats();
    // Refresh stats dashboard every 2 seconds
    setInterval(updateStats, 2000);

    // Settings Menu Logic
    openSettingsBtn.addEventListener('click', () => {
        settingsOverlay.classList.remove('hidden');
        try {
            const manifest = chrome.runtime.getManifest();
            currentVersionSpan.textContent = manifest.version;
        } catch(e) {}
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsOverlay.classList.add('hidden');
        updateStatusDiv.textContent = ''; // Clear status on close
    });

    // Dark Mode Toggle
    themeToggle.addEventListener('change', () => {
        const isDark = themeToggle.checked;
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        chrome.storage.local.set({ darkMode: isDark });
        updateDualSliderVisuals(); // Update track color on theme change
    });

    // Advanced features toggles listeners
    autoSkipToggle.addEventListener('change', () => {
        const enabled = autoSkipToggle.checked;
        chrome.storage.local.set({ autoSkipEnabled: enabled });
        sendMessageToContent({ action: 'updateAutoSkip', enabled: enabled });
    });

    autoMuteToggle.addEventListener('change', () => {
        const enabled = autoMuteToggle.checked;
        chrome.storage.local.set({ autoMuteEnabled: enabled });
        sendMessageToContent({ action: 'updateAutoMute', enabled: enabled });
    });

    // Update Checker
    checkUpdateBtn.addEventListener('click', () => checkForUpdates(false));

    async function checkForUpdates(silent = false) {
        if (!silent) {
            updateStatusDiv.textContent = 'Vérification...';
            updateStatusDiv.style.color = 'var(--text-secondary)';
        }

        try {
            const currentVersion = chrome.runtime.getManifest().version;
            const response = await fetch('https://raw.githubusercontent.com/quelquun667/Projet-Voltaire-Solver/refs/heads/main/ProjetVoltaireExtension/manifest.json');

            if (!response.ok) throw new Error('Erreur réseau');

            const remoteManifest = await response.json();
            const remoteVersion = remoteManifest.version;

            if (compareVersions(remoteVersion, currentVersion) > 0) {
                // Update available
                settingsBadge.classList.add('visible');
                updateStatusDiv.innerHTML = `Mise à jour dispo : <b>${remoteVersion}</b><br><a href="https://github.com/quelquun667/Projet-Voltaire-Solver/releases/latest" target="_blank" style="color: var(--accent); text-decoration: underline;">Télécharger</a>`;
                updateStatusDiv.style.color = '#ef4444';
            } else {
                // No update
                if (!silent) {
                    updateStatusDiv.textContent = 'À jour !';
                    updateStatusDiv.style.color = '#10b981';
                }
            }
        } catch (error) {
            console.error(error);
            if (!silent) {
                updateStatusDiv.textContent = 'Erreur réseau.';
                updateStatusDiv.style.color = '#ef4444';
            }
        }
    }

    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
        }
        return 0;
    }

    // Inspector Toggle
    inspectorToggle.addEventListener('change', () => {
        const enabled = inspectorToggle.checked;
        chrome.storage.local.set({ inspectorEnabled: enabled });
        sendMessageToContent({ action: 'toggleInspector', enabled: enabled });
    });

    // Solve Toggle (Mutual exclusive with Manual)
    solveToggle.addEventListener('change', () => {
        const enabled = solveToggle.checked;
        if (enabled && manualToggle.checked) {
            manualToggle.checked = false;
            chrome.storage.local.set({ manualEnabled: false });
            sendMessageToContent({ action: 'toggleManual', enabled: false });
        }
        chrome.storage.local.set({ solveEnabled: enabled });
        sendMessageToContent({ action: 'toggleSolve', enabled: enabled });
    });

    // Manual Toggle (Mutual exclusive with Solve)
    manualToggle.addEventListener('change', () => {
        const enabled = manualToggle.checked;
        if (enabled && solveToggle.checked) {
            solveToggle.checked = false;
            chrome.storage.local.set({ solveEnabled: false });
            sendMessageToContent({ action: 'toggleSolve', enabled: false });
        }
        chrome.storage.local.set({ manualEnabled: enabled });
        sendMessageToContent({ action: 'toggleManual', enabled: enabled });
    });

    // Error Rate Slider Event Listeners
    errorRateInput.addEventListener('input', () => {
        errorRateValue.textContent = errorRateInput.value;
    });
    errorRateInput.addEventListener('change', () => {
        const rate = parseInt(errorRateInput.value, 10);
        chrome.storage.local.set({ errorRate: rate });
        sendMessageToContent({ action: 'updateErrorRate', rate: rate });
    });

    // Listen for messages from content script or other extension contexts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'logSelector') {
            const p = document.createElement('p');
            p.textContent = `Sél: ${request.selector}`;
            logDiv.prepend(p);
        } else if (request.action === 'stateToggledExternally') {
            // Immediate sync if keyboard shortcut Alt+S was hit in webpage
            solveToggle.checked = request.solveEnabled || false;
            manualToggle.checked = request.manualEnabled || false;
            updateModesUI();
        } else if (request.action === 'delayToggledExternally') {
            // Immediate sync if keyboard shortcut Alt+D was hit in webpage
            delayMinInput.value = request.min;
            delayMaxInput.value = request.max;
            updateDualSliderVisuals();
        }
    });

    function sendMessageToContent(message) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, message, () => {
                    if (chrome.runtime.lastError) {
                        console.debug("Tab is not ready or extension refreshed:", chrome.runtime.lastError.message);
                    }
                });
            }
        });
    }
});
