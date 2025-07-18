import AsyncStorage from '@react-native-async-storage/async-storage';

// User preferences storage
export const saveUserPreferences = async (preferences) => {
  try {
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem('@user_preferences', jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving preferences:', e);
    return false;
  }
};

export const getUserPreferences = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_preferences');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting preferences:', e);
    return null;
  }
};

// Filter settings storage
export const saveFilterSettings = async (filters) => {
  try {
    const jsonValue = JSON.stringify(filters);
    await AsyncStorage.setItem('@filter_settings', jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving filters:', e);
    return false;
  }
};

export const getFilterSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@filter_settings');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting filters:', e);
    return null;
  }
};

// Liked profiles storage
export const saveLikedProfiles = async (profiles) => {
  try {
    const jsonValue = JSON.stringify(profiles);
    await AsyncStorage.setItem('@liked_profiles', jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving liked profiles:', e);
    return false;
  }
};

export const getLikedProfiles = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@liked_profiles');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting liked profiles:', e);
    return [];
  }
};

// Add a liked profile
export const addLikedProfile = async (profile) => {
  try {
    const likedProfiles = await getLikedProfiles();
    // Check if profile already exists by some unique ID
    const exists = likedProfiles.some(p => p.id === profile.id);
    if (!exists) {
      likedProfiles.push(profile);
      await saveLikedProfiles(likedProfiles);
    }
    return true;
  } catch (e) {
    console.error('Error adding liked profile:', e);
    return false;
  }
};

// Remove a liked profile
export const removeLikedProfile = async (profileId) => {
  try {
    const likedProfiles = await getLikedProfiles();
    const filteredProfiles = likedProfiles.filter(p => p.id !== profileId);
    await saveLikedProfiles(filteredProfiles);
    return true;
  } catch (e) {
    console.error('Error removing liked profile:', e);
    return false;
  }
};

// Authentication token storage
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem('@auth_token', token);
    return true;
  } catch (e) {
    console.error('Error saving auth token:', e);
    return false;
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch (e) {
    console.error('Error getting auth token:', e);
    return null;
  }
};

// Clear all app data (for logout)
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing app data:', e);
    return false;
  }
};

// Export both named exports and a default export for compatibility
export default {
  saveUserPreferences,
  getUserPreferences,
  saveFilterSettings,
  getFilterSettings,
  saveLikedProfiles,
  getLikedProfiles,
  addLikedProfile,
  removeLikedProfile,
  saveAuthToken,
  getAuthToken,
  clearAllData
};
