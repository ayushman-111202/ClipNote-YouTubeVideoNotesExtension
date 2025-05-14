// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function PlaylistsPage({ userId }) {
//   const [playlists, setPlaylists] = useState([]);

//   useEffect(() => {
//     axios.get(`https://your-backend.com/api/playlists/user/${userId}`)
//       .then(res => setPlaylists(res.data))
//       .catch(err => console.error(err));
//   }, [userId]);

//   return (
//     <div>
//       <h1>My Playlists</h1>
//       {playlists.map(pl => (
//         <div key={pl._id}>
//           <h2>{pl.name}</h2>
//           <ul>
//             {pl.clips.map(clip => (
//               <li key={clip._id}>
//                 {clip.note} - Watch from {clip.startTime}s to {clip.endTime}s
//                 <a href={`https://www.youtube.com/watch?v=${clip.videoId}&t=${clip.startTime}s`} target="_blank"> Watch </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaylistsPage = ({ userId }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axios.get(`https://your-backend.com/api/playlists/user/${userId}`)
      .then(res => setPlaylists(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div>
      <h1>My Playlists</h1>
      {playlists.length === 0 ? (
        <p>No playlists found.</p>
      ) : (
        playlists.map(pl => (
          <div key={pl._id}>
            <h2>{pl.name}</h2>
            <ul>
              {pl.clips.length === 0 ? (
                <li>No clips in this playlist.</li>
              ) : (
                pl.clips.map(clip => (
                  <li key={clip._id}>
                    {clip.note} - Watch from {clip.startTime}s to {clip.endTime}s
                    {' '}
                    <a
                      href={`https://www.youtube.com/watch?v=${clip.videoId}&t=${clip.startTime}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default PlaylistsPage;