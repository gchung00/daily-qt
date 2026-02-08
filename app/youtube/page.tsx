import { getVideoListMetadata } from '@/lib/youtube';
import { FEATURED_VIDEO_IDS } from '@/lib/videos';
import YoutubeClientPage from '@/components/YoutubeClientPage';

export const dynamic = 'force-dynamic';

export default async function YoutubePage() {
    // Fetch real metadata (title, thumbnail, author)
    const videos = await getVideoListMetadata(FEATURED_VIDEO_IDS);

    // Pass everything to the client component which handles state (random start, clicking, etc)
    return <YoutubeClientPage videos={videos} />;
}
