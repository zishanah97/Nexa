
import axios from 'axios';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_URL = 'https://pixabay.com/api/';

export async function fetchPixabayImages(query, perPage = 10) {
  const { data } = await axios.get(PIXABAY_URL, {
    params: {
      key: PIXABAY_API_KEY,
      q: query,
      image_type: 'photo',
      per_page: perPage,
      safesearch: true,
    }
  });

  return data.hits.map(img => {
    // Encode the Pixabay URL
    const encodedWebUrl = encodeURIComponent(img.webformatURL);
    const encodedLargeUrl = encodeURIComponent(img.largeImageURL);
    
    return {
      id: img.id,
      imageUrl: `https://images.weserv.nl/?url=${encodedWebUrl}`,
      largeImageUrl: `https://images.weserv.nl/?url=${encodedLargeUrl}`,
      description: img.tags,
      photographer: img.user,
      photographerProfile: `https://pixabay.com/users/${img.user}-${img.user_id}/`
    };
  });
}
