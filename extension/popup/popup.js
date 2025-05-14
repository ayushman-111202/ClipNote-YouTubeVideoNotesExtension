// // Enable/disable playlist inputs based on selection
// document.querySelectorAll('input[name="saveOption"]').forEach(radio => {
//     radio.addEventListener('change', () => {
//         const playlistSelect = document.getElementById('playlistSelect');
//         const newPlaylistName = document.getElementById('newPlaylistName');
//         playlistSelect.disabled = radio.value !== 'existing';
//         newPlaylistName.disabled = radio.value !== 'new';
//     });
// });

// // Populate existing playlists
// const userId = 'REPLACE_WITH_LOGGEDIN_USER_ID'; // you can pass it from storage/token/etc.

// axios.get(`http://localhost:5000/playlist/getbyuser/${userId}`)
//     .then(res => {
//         const playlistSelect = document.getElementById('playlistSelect');
//         res.data.forEach(playlist => {
//             const option = document.createElement('option');
//             option.value = playlist._id;
//             option.textContent = playlist.name;
//             playlistSelect.appendChild(option);
//         });
//     })
//     .catch(err => {
//         console.error('Error fetching playlists:', err);
//     });

// // Save button handler
// document.getElementById('saveClipBtn').addEventListener('click', function () {
//     const videoId = document.getElementById('videoId').value;
//     const startTime = parseFloat(document.getElementById('startTime').value);
//     const endTime = parseFloat(document.getElementById('endTime').value);
//     const note = document.getElementById('note').value;

//     const saveOption = document.querySelector('input[name="saveOption"]:checked').value;

//     if (saveOption === 'none') {
//         // Save without playlist (maybe to notes)
//         axios.post(`http://localhost:5000/note/`, {
//             userId,
//             videoId,
//             startTime,
//             endTime,
//             note
//         })
//         .then(res => {
//             alert('Clip saved without playlist!');
//             console.log(res.data);
//         })
//         .catch(err => {
//             alert('Error saving clip without playlist');
//             console.error(err);
//         });

//     } else if (saveOption === 'existing') {
//         const playlistId = document.getElementById('playlistSelect').value;
//         axios.post(`http://localhost:5000/playlist/addclip/${playlistId}`, {
//             videoId,
//             startTime,
//             endTime,
//             note
//         })
//         .then(res => {
//             alert('Clip saved to existing playlist!');
//             console.log(res.data);
//         })
//         .catch(err => {
//             alert('Error saving clip to playlist');
//             console.error(err);
//         });

//     } else if (saveOption === 'new') {
//         const newPlaylistName = document.getElementById('newPlaylistName').value.trim();
//         if (!newPlaylistName) {
//             alert('Please enter a new playlist name');
//             return;
//         }

//         // First create new playlist
//         axios.post(`http://localhost:5000/playlist/`, {
//             userId,
//             name: newPlaylistName,
//             description: ''
//         })
//         .then(res => {
//             const newPlaylistId = res.data._id;
//             // Now add clip to the new playlist
//             return axios.post(`http://localhost:5000/playlist/addclip/${newPlaylistId}`, {
//                 videoId,
//                 startTime,
//                 endTime,
//                 note
//             });
//         })
//         .then(res => {
//             alert('New playlist created and clip added!');
//             console.log(res.data);
//         })
//         .catch(err => {
//             alert('Error creating playlist or saving clip');
//             console.error(err);
//         });
//     }
// });



document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("playlistContainer");
    
    // Assume token saved in chrome.storage or somewhere
    // Replace with actual userId logic in real use
    const userId = "YOUR_USER_ID";  // 🟢 Replace with dynamic user id if needed

    axios.get(`http://localhost:5000/playlist/user/${userId}`)
        .then(res => {
            const playlists = res.data;
            if (playlists.length === 0) {
                container.innerHTML = "<p>No playlists found.</p>";
                return;
            }
            
            container.innerHTML = "";
            playlists.forEach(playlist => {
                const div = document.createElement("div");
                div.classList.add("playlist");

                let html = `<div class="playlist-title">${playlist.name}</div>`;
                if (playlist.clips.length === 0) {
                    html += `<p>No clips yet.</p>`;
                } else {
                    playlist.clips.forEach(clip => {
                        const videoUrl = `https://www.youtube.com/watch?v=${clip.videoId}&t=${clip.startTime}s`;
                        html += `<div class="clip">
                                    <div><strong>Note:</strong> ${clip.note || "—"}</div>
                                    <a href="${videoUrl}" target="_blank">Watch from ${clip.startTime}s → ${clip.endTime}s</a>
                                 </div>`;
                    });
                }

                div.innerHTML = html;
                container.appendChild(div);
            });
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = "<p>Error fetching playlists.</p>";
        });
});

