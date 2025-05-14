'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const UserProfile = () => {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    bio: ''
  });

  const token = localStorage.getItem('token');
  if(!token) {
    router.push('/login'); 
  }// Redirect to login if no token
  const decodedToken = jwtDecode(token); // Decode the token to get user ID
  const userId = decodedToken._id; // Assuming the token contains the user ID

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // In a real app, you would get the user ID from auth context/state

      // Fetch user profile data
      const userResponse = async () => {

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/getbyid/${userId}`);
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          username: res.data.username,
          bio: res.data.bio || ''
        });
      }

      await userResponse();

      // Fetch user stats
      const statsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/stats`);
      setStats(statsResponse.data);

      // Fetch user playlists
      const playlistsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/playlists`);
      setPlaylists(playlistsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // For demo purposes, set mock data
      setMockData();
      setLoading(false);
    }
    
  };

  // Fetch user data from backend
  useEffect(() => {
    fetchUserData();
  }, []);

  // Set mock data for demonstration
  const setMockData = () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      bio: 'Music enthusiast and playlist creator',
      profileImage: 'https://via.placeholder.com/150',
      createdAt: '2023-01-15T00:00:00.000Z',
      followers: 245,
      following: 132
    };

    const mockStats = {
      totalListeningTime: 1245, // in hours
      favoriteTracks: 78,
      totalPlaylists: 14,
      monthlyActivity: [
        { month: 'Jan', hours: 85 },
        { month: 'Feb', hours: 92 },
        { month: 'Mar', hours: 78 },
        { month: 'Apr', hours: 110 },
        { month: 'May', hours: 95 },
        { month: 'Jun', hours: 120 }
      ],
      genreDistribution: [
        { name: 'Rock', value: 35 },
        { name: 'Pop', value: 25 },
        { name: 'Hip Hop', value: 20 },
        { name: 'Electronic', value: 15 },
        { name: 'Classical', value: 5 }
      ]
    };

    const mockPlaylists = [
      {
        _id: 'pl1',
        name: 'Workout Mix',
        tracks: 24,
        duration: '1:42:30',
        coverImage: 'https://via.placeholder.com/80',
        isPublic: true,
        plays: 1245
      },
      {
        _id: 'pl2',
        name: 'Chill Vibes',
        tracks: 18,
        duration: '1:12:15',
        coverImage: 'https://via.placeholder.com/80',
        isPublic: true,
        plays: 892
      },
      {
        _id: 'pl3',
        name: 'Focus Time',
        tracks: 32,
        duration: '2:24:45',
        coverImage: 'https://via.placeholder.com/80',
        isPublic: false,
        plays: 456
      },
      {
        _id: 'pl4',
        name: 'Road Trip',
        tracks: 45,
        duration: '3:10:20',
        coverImage: 'https://via.placeholder.com/80',
        isPublic: true,
        plays: 678
      },
    ];

    setUser(mockUser);
    setStats(mockStats);
    setPlaylists(mockPlaylists);
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      username: mockUser.username,
      bio: mockUser.bio
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would send the updated data to the backend
      // const response = await axios.put(`/api/users/${user._id}`, formData);
      // setUser(response.data);

      // For demo, just update the local state
      setUser({
        ...user,
        ...formData
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCreatePlaylist = () => {
    // This would navigate to playlist creation page in a real app
    alert('Navigate to create playlist page');
  };

  const handleDeletePlaylist = (playlistId) => {
    // In a real app, this would call an API to delete the playlist
    setPlaylists(playlists.filter(playlist => playlist._id !== playlistId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">User not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header section */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Profile</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile and stats overview */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar with user info */}
          <div className="md:w-1/3">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center mb-6">
                <img
                  src={user.profileImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                </div>
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="mr-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{user.followers}</div>
                      <div className="text-gray-600 dark:text-gray-400">Followers</div>
                    </div>
                    <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{user.following}</div>
                      <div className="text-gray-600 dark:text-gray-400">Following</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p>Email: {user.email}</p>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right content area */}
          <div className="md:w-2/3">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-4 text-sm font-medium ${activeTab === 'overview'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('playlists')}
                    className={`px-6 py-4 text-sm font-medium ${activeTab === 'playlists'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    Playlists
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-6 py-4 text-sm font-medium ${activeTab === 'activity'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    Activity
                  </button>
                </nav>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Stats Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Listening Time</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.totalListeningTime} hours</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Favorite Tracks</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.favoriteTracks}</p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Playlists</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.totalPlaylists}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Monthly Activity</h3>
                    <div className="h-64 mb-6 bg-white dark:bg-gray-800 p-2 rounded-lg">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.monthlyActivity}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              borderColor: '#E5E7EB',
                              color: '#1F2937'
                            }}
                          />
                          <Bar dataKey="hours" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Genre Distribution</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {stats.genreDistribution.map((genre) => (
                        <div key={genre.name} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                          <div className="font-bold text-gray-800 dark:text-gray-200">{genre.value}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{genre.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'playlists' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Playlists</h3>
                      <button
                        onClick={handleCreatePlaylist}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition duration-200"
                      >
                        Create New
                      </button>
                    </div>

                    <div className="space-y-4">
                      {playlists.map((playlist) => (
                        <div
                          key={playlist._id}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center">
                            <img
                              src={playlist.coverImage}
                              alt={playlist.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="ml-4">
                              <h4 className="font-medium text-gray-800 dark:text-gray-200">{playlist.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {playlist.tracks} tracks · {playlist.duration}
                              </p>
                              <div className="flex items-center text-xs mt-1">
                                <span className={`px-2 py-1 rounded-full ${playlist.isPublic
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                                  }`}>
                                  {playlist.isPublic ? 'Public' : 'Private'}
                                </span>
                                <span className="ml-2 text-gray-500 dark:text-gray-400">
                                  {playlist.plays} plays
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              Edit
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              onClick={() => handleDeletePlaylist(playlist._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-gray-800 dark:text-gray-200">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Yesterday</p>
                        <p>You listened to 45 songs (3.5 hours)</p>
                      </div>
                      <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/30 text-gray-800 dark:text-gray-200">
                        <p className="text-sm text-gray-600 dark:text-gray-400">3 days ago</p>
                        <p>You created a new playlist "Summer Hits"</p>
                      </div>
                      <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Last week</p>
                        <p>You followed 5 new artists</p>
                      </div>
                      <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-gray-800 dark:text-gray-200">
                        <p className="text-sm text-gray-600 dark:text-gray-400">2 weeks ago</p>
                        <p>You reached 1000 hours of total listening time</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;