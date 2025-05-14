class YouTubeNotesSaver {
  constructor() {
    this.API_URL = 'http://localhost:5000/notes/add';
    if (window.location.hostname === 'www.youtube.com' && new URLSearchParams(window.location.search).get('v')) {
      this.initialize();
    }
  }

  initialize() {
    this.createFloatingIcon();
    this.createModal();
    this.setupEventListeners();
  }

  createFloatingIcon() {
    const icon = document.createElement('div');
    icon.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #ff0000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;
      z-index: 9999;
    `;
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/></svg>';
    this.setupDraggable(icon, true);
    document.body.appendChild(icon);
  }

  createModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
    `;

    modal.innerHTML = `
      <div style="cursor: move; margin-bottom: 15px;">
        <h2 style="margin: 0;">Save Video Portion</h2>
      </div>
      <div id="videoInfo" style="margin-bottom: 15px;"></div>
      <div style="margin-bottom: 10px;">
        <label>Start Time:</label>
        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="text" id="startTime" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;" readonly>
          <button id="setCurrentStart" style="padding: 8px; background: #f5f5f5; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">Set Current</button>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <label>End Time:</label>
        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="text" id="endTime" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
          <button id="setCurrentEnd" style="padding: 8px; background: #f5f5f5; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">Set Current</button>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <label>Notes:</label>
        <textarea id="notes" style="width: 100%; height: 80px; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Add your notes here..."></textarea>
      </div>
      <div style="margin-bottom: 15px;">
        <label>Collection:</label>
        <div style="display: flex; gap: 10px; margin-top: 5px;">
          <select id="playlist" style="width: 70%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="">Select Collection</option>
            <option value="watch-later">Watch Later</option>
            <option value="favorites">Favorites</option>
            <option value="study">Study</option>
          </select>
          <button id="newCollection" style="width: 30%; padding: 8px; background: #f5f5f5; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">New</button>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button id="cancelBtn" style="padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button id="saveBtn" style="padding: 8px 16px; background: #ff0000; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
      </div>
    `;

    this.setupDraggable(modal, false);
    document.body.appendChild(modal);
  }

  setupDraggable(element, isIcon) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    const dragHandle = isIcon ? element : element.querySelector('h2').parentElement;

    dragHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = element.getBoundingClientRect();
      initialX = e.clientX - rect.left;
      initialY = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      if (isIcon) {
        currentX = currentX < window.innerWidth / 2 ? 20 : window.innerWidth - 70;
        currentY = Math.max(50, Math.min(window.innerHeight - 100, currentY));
      } else {
        currentX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, currentX));
        currentY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, currentY));
      }

      element.style.left = `${currentX}px`;
      element.style.top = `${currentY}px`;
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.transform = 'none';

      const positionKey = isIcon ? 'iconPosition' : 'modalPosition';
      localStorage.setItem(positionKey, JSON.stringify({ x: currentX, y: currentY }));
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    const savedPosition = JSON.parse(localStorage.getItem(isIcon ? 'iconPosition' : 'modalPosition'));
    if (savedPosition) {
      element.style.left = `${savedPosition.x}px`;
      element.style.top = `${savedPosition.y}px`;
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.transform = 'none';
    }
  }

  setupEventListeners() {
    const icon = document.querySelector('div[style*="position: fixed"]');
    const modal = document.querySelector('div[style*="width: 400px"]');
    
    icon.addEventListener('click', () => this.openModal());
    modal.querySelector('#cancelBtn').addEventListener('click', () => this.closeModal());
    modal.querySelector('#saveBtn').addEventListener('click', () => this.saveNote());
    modal.querySelector('#setCurrentStart').addEventListener('click', () => this.setCurrentTime('start'));
    modal.querySelector('#setCurrentEnd').addEventListener('click', () => this.setCurrentTime('end'));
    modal.querySelector('#newCollection').addEventListener('click', () => this.createNewCollection());

    // Add video timeline drag listener
    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('timeupdate', () => {
        if (modal.style.display === 'block') {
          const currentTime = this.formatTime(video.currentTime);
          document.querySelector('#endTime').value = currentTime;
        }
      });
    }
  }

  getVideoInfo() {
    return {
      title: document.title.replace(' - YouTube', ''),
      videoId: new URLSearchParams(window.location.search).get('v'),
      currentTime: document.querySelector('video')?.currentTime || 0
    };
  }

  formatTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  openModal() {
    const modal = document.querySelector('div[style*="width: 400px"]');
    const videoInfo = this.getVideoInfo();
    const currentTime = this.formatTime(videoInfo.currentTime);

    modal.querySelector('#videoInfo').innerHTML = `
      <p><strong>Title:</strong> ${videoInfo.title}</p>
      <p><strong>Current Time:</strong> ${currentTime}</p>
    `;

    modal.querySelector('#startTime').value = currentTime;
    modal.querySelector('#endTime').value = this.formatTime(videoInfo.currentTime + 30);
    modal.style.display = 'block';
  }

  setCurrentTime(type) {
    const video = document.querySelector('video');
    if (video) {
      const currentTime = this.formatTime(video.currentTime);
      document.querySelector(`#${type}Time`).value = currentTime;
    }
  }

  createNewCollection() {
    const collectionName = prompt('Enter new collection name:');
    if (collectionName) {
      const playlistSelect = document.querySelector('#playlist');
      const option = document.createElement('option');
      option.value = collectionName.toLowerCase().replace(/\s+/g, '-');
      option.textContent = collectionName;
      playlistSelect.appendChild(option);
      playlistSelect.value = option.value;
    }
  }

  closeModal() {
    const modal = document.querySelector('div[style*="width: 400px"]');
    modal.style.display = 'none';
    modal.querySelector('#notes').value = '';
    modal.querySelector('#playlist').value = '';
  }

  async saveNote() {
    const videoInfo = this.getVideoInfo();
    const noteData = {
      videoID: videoInfo.videoId,
      title: videoInfo.title,
      note: document.querySelector('#notes').value,
      startTime: document.querySelector('#startTime').value,
      endTime: document.querySelector('#endTime').value,
      playlist: document.querySelector('#playlist').value,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });

      if (response.ok) {
        alert('Video portion saved successfully!');
        this.closeModal();
      } else {
        alert('Failed to save video portion');
      }
    } catch (error) {
      alert('Error saving video portion');
    }
  }
}

if (document.readyState === 'complete') {
  new YouTubeNotesSaver();
} else {
  window.addEventListener('load', () => new YouTubeNotesSaver());
}