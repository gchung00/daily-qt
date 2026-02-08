
export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail_url: string;
    author_name: string;
    // oEmbed doesn't give date / view count unfortunately, 
    // but this is better than hardcoded stuff.
}

export async function getVideoMetadata(videoId: string): Promise<YouTubeVideo | null> {
    try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) return null;

        const data = await res.json();

        return {
            id: videoId,
            title: data.title,
            thumbnail_url: data.thumbnail_url,
            author_name: data.author_name
        };
    } catch (error) {
        console.error(`Failed to fetch metadata for ${videoId}`, error);
        return null; // Handle gracefully
    }
}

export async function getVideoListMetadata(videoIds: string[]): Promise<YouTubeVideo[]> {
    const promises = videoIds.map(id => getVideoMetadata(id));
    const results = await Promise.all(promises);
    return results.filter((v): v is YouTubeVideo => v !== null);
}
