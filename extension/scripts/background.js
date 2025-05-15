import CONFIG from '../config.js';

// Handle initial installation or update
chrome.runtime.onInstalled.addListener(() => {
    checkAuthStatus().then(() => {
        updateBadgeCount();
    });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'LOGIN_SUCCESS':
            handleLogin(message.userData)
                .then((success) => {
                    sendResponse({ success });
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true; // Keep channel open for async response

        case 'LOGOUT':
            handleLogout()
                .then((success) => {
                    sendResponse({ success });
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true;

        case 'CLIP_SAVED':
            handleClipSaved(message.clip)
                .then((success) => {
                    sendResponse({ success });
                })
                .catch((error) => {
                    console.error('Clip save error:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true;

        case 'GET_AUTH_STATUS':
            checkAuthStatus()
                .then((status) => {
                    sendResponse(status);
                })
                .catch((error) => {
                    console.error('Auth status check error:', error);
                    sendResponse({ isAuthenticated: false, error: error.message });
                });
            return true;
    }
});

// Handle successful login
async function handleLogin(userData) {
    try {
        if (!userData || !userData.token || !userData._id) {
            throw new Error('Invalid user data received');
        }

        await chrome.storage.local.set({
            token: userData.token,
            userId: userData._id,
            username: userData.username || userData.email.split('@')[0],
            email: userData.email,
            role: userData.role,
            name: userData.name,
            loginTime: Date.now()
        });

        startAuthCheck();
        await updateBadgeCount();
        return true;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Handle logout
async function handleLogout() {
    try {
        await chrome.storage.local.remove([
            'token', 
            'userId', 
            'username', 
            'email', 
            'role', 
            'name',
            'loginTime'
        ]);
        chrome.action.setBadgeText({ text: '' });
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// Handle newly saved clip
async function handleClipSaved(clip) {
    try {
        await updateBadgeCount();
        return true;
    } catch (error) {
        console.error('Clip save error:', error);
        throw error;
    }
}

// Update badge with clip count
async function updateBadgeCount() {
    try {
        const { token, userId } = await chrome.storage.local.get(['token', 'userId']);
        
        if (!token || !userId) {
            chrome.action.setBadgeText({ text: '' });
            return;
        }

        const response = await fetch(`${CONFIG.API_URL}/clips/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch clips');
        }

        const clips = await response.json();
        chrome.action.setBadgeText({ text: clips.length.toString() });
        chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });

    } catch (error) {
        console.error('Badge update error:', error);
        chrome.action.setBadgeText({ text: '!' });
        chrome.action.setBadgeBackgroundColor({ color: '#F44336' });

        // If authentication error, clear auth state
        if (error.message.includes('unauthorized') || error.message.includes('invalid token')) {
            await handleLogout();
        }
        throw error;
    }
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const data = await chrome.storage.local.get([
            'token', 
            'userId', 
            'username', 
            'email', 
            'role',
            'name',
            'loginTime'
        ]);

        // Check if we have all required auth data
        if (!data.token || !data.userId) {
            return { isAuthenticated: false };
        }

        // Verify token with server
        const response = await fetch(`${CONFIG.API_URL}/users/verify-token`, {
            headers: {
                'Authorization': `Bearer ${data.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Invalid token');
        }

        const verifyResult = await response.json();
        
        if (!verifyResult.valid) {
            throw new Error('Token verification failed');
        }

        return {
            isAuthenticated: true,
            userId: data.userId,
            username: data.username,
            email: data.email,
            role: data.role,
            name: data.name
        };

    } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth data
        await handleLogout();
        return { isAuthenticated: false };
    }
}

// Start periodic auth check
function startAuthCheck() {
    // Check auth every 5 minutes
    chrome.alarms.create('authCheck', { periodInMinutes: 5 });
}

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'authCheck') {
        checkAuthStatus();
    }
});