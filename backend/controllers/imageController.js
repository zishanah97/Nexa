import { fetchUnsplashImages } from '../services/unsplashApi.js';

export const getImages = async (req, res) => {
    const { query, per_page } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const images = await fetchUnsplashImages(query, per_page);
        res.json(images);
    } catch (error) {
        console.error('Error in getImages controller:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
};
