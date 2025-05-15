// Configuration
const CONFIG = {
    API_URL: 'http://localhost:5000',
    ENDPOINTS: {
        ADD_CLIP: '/clips/add',  // Changed back to '/clips/add' to match server route
        GET_USER_CLIPS: '/clips/user',
        DELETE_CLIP: '/clips/delete',
        MOVE_CLIP: '/clips/move',
        LOGIN: '/users/authenticate',
        VERIFY_TOKEN: '/users/verify-token',
        GET_USER_PROFILE: '/users/profile'
    }
};

function injectStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('styles/modal.css');
    document.head.appendChild(link);
}

function createClipModal() {
    const modal = document.createElement('div');
    modal.id = 'clipnote-modal';
    modal.innerHTML = `
        <div class="clipnote-modal-content">
            <div id="login-required-view" style="display: none;">
                <h2>Login Required</h2>
                <p style="margin-bottom: 20px; text-align: center;">Please log in from the ClipNote extension popup to save video clips.</p>
                <div class="modal-buttons">
                    <button id="close-login-message">Close</button>
                </div>
            </div>
            <div id="clip-form-view" style="display: none;">
                <h2>Save Video Clip</h2>
                <input type="text" id="clip-title" placeholder="Title">
                <textarea id="clip-note" placeholder="Add notes..."></textarea>
                <div class="time-inputs">
                    <input type="text" id="start-time" placeholder="Start Time (HH:MM:SS)">
                    <input type="text" id="end-time" placeholder="End Time (HH:MM:SS)">
                </div>
                <div class="modal-buttons">
                    <button id="save-clip">Save</button>
                    <button id="cancel-clip">Cancel</button>
                </div>
            </div>
            <div id="clip-error" class="error-message"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('save-clip').addEventListener('click', saveClip);
    document.getElementById('cancel-clip').addEventListener('click', closeModal);
    document.getElementById('close-login-message').addEventListener('click', closeModal);
}

async function saveClip() {
    try {
        const title = document.getElementById('clip-title').value;
        const note = document.getElementById('clip-note').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        
        if (!title) {
            throw new Error('Title is required');
        }

        if (!startTime || !endTime) {
            throw new Error('Start and end times are required');
        }

        // Get video ID from URL
        const videoID = new URLSearchParams(window.location.search).get('v');
        if (!videoID) {
            throw new Error('Could not find video ID');
        }

        // Get user token from storage
        const { token, userId } = await chrome.storage.local.get(['token', 'userId']);
        console.log('Auth data:', { hasToken: !!token, hasUserId: !!userId });
        
        if (!token || !userId) {
            throw new Error('Please log in to save clips');
        }

        console.log('Sending clip data:', {
            title,
            note,
            startTime,
            endTime,
            videoID,
            userId
        });

        const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.ADD_CLIP}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                title,
                note,
                startTime,
                endTime,
                videoID,
                userId
            })
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (!response.ok) {
            throw new Error(responseData.message || responseData.error || 'Failed to save clip');
        }

        showSuccess('Clip saved successfully!');
        closeModal();
        
        // Notify background script to update badge
        chrome.runtime.sendMessage({ type: 'CLIP_SAVED', clip: responseData });

    } catch (error) {
        console.error('Save clip error:', error);
        console.error('Error stack:', error.stack);
        showError(error.message || 'Error saving clip');
    }
}

async function showModal(isAuthenticated) {
    const modal = document.getElementById('clipnote-modal');
    const loginView = document.getElementById('login-required-view');
    const clipFormView = document.getElementById('clip-form-view');
    
    if (!modal) return;

    if (isAuthenticated) {
        loginView.style.display = 'none';
        clipFormView.style.display = 'block';
        
        // Set up clip form with video details
        const video = document.querySelector('video');
        if (video) {
            const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim() || '';
            document.getElementById('clip-title').value = videoTitle;
            document.getElementById('start-time').value = formatTime(Math.floor(video.currentTime));
            document.getElementById('end-time').value = formatTime(Math.floor(video.currentTime + 30)); // Default 30 sec clip
        }
    } else {
        loginView.style.display = 'block';
        clipFormView.style.display = 'none';
    }
    
    modal.style.display = 'flex';
}

function showError(message) {
    const errorElement = document.getElementById('clip-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.classList.remove('success');
    }
}

function showSuccess(message) {
    const errorElement = document.getElementById('clip-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.classList.add('success');
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

function closeModal() {
    const modal = document.getElementById('clipnote-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Format timestamp to HH:MM:SS
function formatTime(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

// Initialize when on YouTube
if (window.location.hostname.includes('youtube.com')) {
    // Wait for YouTube to be ready
    const init = () => {
        injectStyles();
        createClipModal();
        
        // Add floating clip button
        function addFloatingButton() {
            if (!document.querySelector('#clipnote-floating-button')) {
                const clipButton = document.createElement('button');
                clipButton.id = 'clipnote-floating-button';
                clipButton.title = 'Save Clip';
                clipButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM15 12l-4 4h3v4h2v-4h3l-4-4zm-8-4V4h2v4h3l-4 4-4-4h3z"/></svg>';
                
                clipButton.addEventListener('click', async () => {
                    try {
                        const { token, userId } = await chrome.storage.local.get(['token', 'userId']);
                        await showModal(!!token && !!userId);
                    } catch (error) {
                        showError(error.message);
                    }
                });
                document.body.appendChild(clipButton);
            }
        }

        // Add the floating button immediately
        addFloatingButton();
    };

    // Check if we're on a video page
    if (window.location.pathname === '/watch') {
        init();
    }

    // Also listen for navigation changes
    const handleURLChange = () => {
        if (window.location.pathname === '/watch') {
            init();
        } else {
            // Remove the floating button when not on a video page
            const floatingButton = document.querySelector('#clipnote-floating-button');
            if (floatingButton) {
                floatingButton.remove();
            }
        }
    };

    // Listen for YouTube's navigation events
    window.addEventListener('yt-navigate-finish', handleURLChange);
}