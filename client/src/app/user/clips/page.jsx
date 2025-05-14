"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Notes = () => {

    const [notes, setNotes] = useState([]);

    const fetchNotes = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clips/getall`)
            
            
            // getbyuser/${localStorage.getItem('userId')}`);
        setNotes(res.data);
        console.log(res.data);

    };

    useEffect(() => {
        fetchNotes();
    }, [])



    return (
        <div>
            <h1>My Notes</h1>
            {notes.length === 0 ? (
                <p>No notes found.</p>
            ) : (
                notes.map(clip => (
                    <div key={clip._id}>
                        <h2>{clip.note}</h2>
                        <p>Video Title: {clip.title}</p>
                        <p>Video ID: {clip.videoID}</p>
                        <p>Start Time: {clip.startTime}s</p>
                        <p>End Time: {clip.endTime}s</p>
                        <a href={`https://www.youtube.com/watch?v=${clip.videoID}&t=${clip.startTime}s`} target="_blank">Watch</a>
                    </div>
                ))
            )}
        </div>
    )
}

export default Notes;