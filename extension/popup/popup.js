import CONFIG from '../config.js';

// Track authentication state
let isAuthenticated = false;
let currentUser = null;

// DOM Elements
const loginForm = document.getElementById('login-form');
const clipsContainer = document.getElementById('clips-container');
const authContainer = document.getElementById('auth-container');
const welcomeMessage = document.getElementById('welcome-message');
const logoutButton = document.getElementById('logout-btn');
const errorMessage = document.getElementById('error-message');

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    setupEventListeners();
});

// Check authentication status
async function checkAuthStatus() {
    try {
        const authStatus = await chrome.runtime.sendMessage({ type: 'GET_AUTH_STATUS' });
        isAuthenticated = authStatus.isAuthenticated;
        currentUser = authStatus.username || authStatus.email?.split('@')[0];
        updateUI();
        
        if (isAuthenticated) {
            await fetchUserClips();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        isAuthenticated = false;
        currentUser = null;
        updateUI();
    }
}

// Set up event listeners
function setupEventListeners() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
}

// Handle login submission
async function handleLogin(e) {
    e.preventDefault();
    
    try {
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Clear previous errors and disable form
        showError('');
        setFormEnabled(false);

        if (!email || !password) {
            throw new Error('Please enter both email and password');
        }

        const response = await fetch(`${CONFIG.API_URL}/users/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email,
                password,
                role: 'user' // Always use user role for extension login
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid credentials');
        }

        const userData = await response.json();
        
        // Check if user role is correct
        if (userData.role !== 'user') {
            throw new Error('Invalid login attempt. Please use the web portal for admin access.');
        }

        // Send login success to background script and wait for completion
        const result = await new Promise((resolve) => {
            chrome.runtime.sendMessage({ 
                type: 'LOGIN_SUCCESS', 
                userData 
            }, (response) => {
                resolve(response);
            });
        });

        if (!result || !result.success) {
            throw new Error('Failed to save authentication state');
        }
        
        // Update local state only after background script confirms success
        isAuthenticated = true;
        currentUser = userData.username || userData.email.split('@')[0];
        
        // Clear form
        loginForm.reset();
        
        // Update UI and fetch clips
        updateUI();
        await fetchUserClips();
        
    } catch (error) {
        console.error('Login failed:', error);
        showError(error.message || 'Login failed');
    } finally {
        setFormEnabled(true);
    }
}

// Handle logout
async function handleLogout() {
    try {
        const result = await new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'LOGOUT' }, (response) => {
                resolve(response);
            });
        });

        if (!result || !result.success) {
            throw new Error('Logout failed');
        }

        isAuthenticated = false;
        currentUser = null;
        updateUI();
        if (loginForm) {
            loginForm.reset();
        }
        showError('');
    } catch (error) {
        console.error('Logout failed:', error);
        showError('Error during logout');
    }
}

// Fetch user's clips
async function fetchUserClips() {
    try {
        const { token, userId } = await chrome.storage.local.get(['token', 'userId']);
        if (!token || !userId) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${CONFIG.API_URL}/clips/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch clips');
        }

        const clips = await response.json();
        displayClips(clips);
    } catch (error) {
        console.error('Error fetching clips:', error);
        showError(error.message);
        
        // If authentication error, reset state
        if (error.message.includes('Authentication required') || error.message.includes('Invalid token')) {
            await handleLogout();
        }
    }
}

// Display clips in popup
function displayClips(clips) {
    if (!clipsContainer) return;

    if (!clips || clips.length === 0) {
        clipsContainer.innerHTML = '<p class="no-clips">No clips saved yet</p>';
        return;
    }

    const clipsList = clips.map(clip => `
        <div class="clip-item">
            <div class="clip-title">${clip.title}</div>
            <div class="clip-time">
                ${formatTime(clip.startTime)} - ${formatTime(clip.endTime)}
            </div>
            <div class="clip-actions">
                <button onclick="openYouTubeVideo('${clip.videoID}', '${clip.startTime}')">
                    Watch
                </button>
                <button onclick="deleteClip('${clip._id}')" class="delete">
                    Delete
                </button>
            </div>
        </div>
    `).join('');

    clipsContainer.innerHTML = clipsList;
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    if (hours === '00') {
        return `${minutes}:${seconds}`;
    }
    return timeString;
}

// Enable/disable form inputs
function setFormEnabled(enabled) {
    if (loginForm) {
        const inputs = loginForm.querySelectorAll('input, button');
        inputs.forEach(input => {
            input.disabled = !enabled;
        });
    }
}

// Update UI based on authentication state
function updateUI() {
    if (authContainer) {
        authContainer.style.display = isAuthenticated ? 'none' : 'block';
    }
    
    if (clipsContainer) {
        clipsContainer.style.display = isAuthenticated ? 'block' : 'none';
        if (!isAuthenticated) {
            clipsContainer.innerHTML = '';
        }
    }
    
    if (welcomeMessage) {
        welcomeMessage.textContent = isAuthenticated 
            ? `Welcome, ${currentUser}!` 
            : 'Please log in to manage your clips';
    }
    
    if (logoutButton) {
        logoutButton.style.display = isAuthenticated ? 'block' : 'none';
    }
}

// Show error message
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = message ? 'block' : 'none';
    }
}

// Open YouTube video at specific timestamp
function openYouTubeVideo(videoId, startTime) {
    // Convert HH:MM:SS to seconds for the URL parameter
    const [hours, minutes, seconds] = startTime.split(':').map(Number);
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    // Create and open the YouTube URL with timestamp
    const url = `https://www.youtube.com/watch?v=${videoId}&t=${totalSeconds}s`;
    chrome.tabs.create({ url });
}

// Make functions available to inline event handlers
window.openYouTubeVideo = openYouTubeVideo;
window.deleteClip = deleteClip;

// Delete a clip
async function deleteClip(clipId) {
    try {
        const { token } = await chrome.storage.local.get(['token']);
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${CONFIG.API_URL}/clips/${clipId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete clip');
        }

        // Refresh clips list
        await fetchUserClips();
    } catch (error) {
        showError(error.message);
    }
}