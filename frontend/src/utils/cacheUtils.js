// Utility functions for managing API call caching and preference comparison

/**
 * Generate a consistent key from preferences object
 */
export const generatePreferenceKey = (preferences) => {
  if (!preferences || !preferences.location) return null;
  return JSON.stringify({
    location: preferences.location,
    days: preferences.days,
    numPeople: preferences.numPeople,
    budget: preferences.budget
  });
};

/**
 * Check if preferences have changed since last API call
 */
export const hasPreferencesChanged = (preferences) => {
  if (!preferences || !preferences.location) return false;
  const currentKey = generatePreferenceKey(preferences);
  return preferences.lastFetchedKey !== currentKey;
};

/**
 * Check if data exists in cache for given preferences
 */
export const hasCachedData = (preferences, cache) => {
  if (!preferences || !preferences.location || !cache) return false;
  const key = generatePreferenceKey(preferences);
  return cache[key] !== undefined && cache[key] !== null;
};

/**
 * Check if API call is needed (preferences changed AND no cached data)
 * Returns false if preferences haven't changed OR if data already exists in cache
 */
export const shouldFetchData = (preferences, cache) => {
  // If no preferences or location, don't fetch
  if (!preferences || !preferences.location) {
    return false;
  }
  
  // If data already exists in cache, don't fetch
  if (hasCachedData(preferences, cache)) {
    return false;
  }
  
  // Only fetch if preferences have changed
  return hasPreferencesChanged(preferences);
};
