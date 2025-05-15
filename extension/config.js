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

export default CONFIG;