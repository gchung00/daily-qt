import { getVideoListMetadata } from '@/lib/youtube';
import { FEATURED_VIDEO_IDS } from '@/lib/videos';
import YoutubeClientPage, { VideoItem } from '@/components/YoutubeClientPage';

export const dynamic = 'force-dynamic';

export default async function YoutubePage() {
    // Fetch real metadata (title, thumbnail, author) for existing YouTube videos
    const youtubeVideosRaw = await getVideoListMetadata(FEATURED_VIDEO_IDS);

    // Map to new VideoItem interface
    const youtubeVideos: VideoItem[] = youtubeVideosRaw.map(v => ({
        ...v,
        type: 'youtube'
    }));

    // New HLS Sermons (정병성 선교사)
    const hlsSermons: VideoItem[] = [
        {
            id: 'jbs-20250629',
            type: 'hls',
            url: 'https://fgtvvod.fgtv.com/vod/ram1/1f1/2025/1f1250629-h.mp4/playlist.m3u8',
            title: '우리가 전하는 그리스도 (고전 1:23~24)',
            author_name: '정병성 선교사',
            date: '2025.06.29',
            thumbnail_url: 'https://placehold.co/640x360/2563eb/ffffff?text=2025.06.29+Sermon'
        },
        {
            id: 'jbs-20180603',
            type: 'hls',
            url: 'https://fgtvvod.fgtv.com/vod/ram1/1f1/2018/1f1180603-h.mp4/playlist.m3u8',
            title: '기다리는 믿음 (시 40:1-2)',
            author_name: '정병성 선교사',
            date: '2018.06.03',
            thumbnail_url: 'https://placehold.co/640x360/2563eb/ffffff?text=2018.06.03+Sermon'
        },
        {
            id: 'jbs-20170604',
            type: 'hls',
            url: 'https://fgtvvod.fgtv.com/vod/ram1/1f1/2017/1f1170604-h.mp4/playlist.m3u8',
            title: '만 이년 후에 (창 40:21-41:1)',
            author_name: '정병성 선교사',
            date: '2017.06.04',
            thumbnail_url: 'https://placehold.co/640x360/2563eb/ffffff?text=2017.06.04+Sermon'
        },
        {
            id: 'jbs-20050605',
            type: 'hls',
            url: 'https://fgtvvod.fgtv.com/wvod/ram1/1f1/1f1050605m.mp4/playlist.m3u8',
            title: '우리의 거울 (고전 10:1-11)',
            author_name: '정병성 선교사',
            date: '2005.06.05',
            thumbnail_url: 'https://placehold.co/640x360/2563eb/ffffff?text=2005.06.05+Sermon'
        }
    ];

    // Combine lists - HLS sermons first as requested
    const allVideos = [...hlsSermons, ...youtubeVideos];

    // Pass everything to the client component which handles state (random start, clicking, etc)
    return <YoutubeClientPage videos={allVideos} />;
}
