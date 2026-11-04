import { notFound } from 'next/navigation';
import { StoryblokStory } from '@storyblok/react/rsc';
import { getPage } from '@/lib/stories';
import { storyVersion } from '@/lib/settings';

// Pagine pubbliche statiche, rigenerate al massimo ogni 60 secondi dopo una pubblicazione in Storyblok.
// Le bozze per il Visual Editor passano da /preview (vedi app/preview).
export const revalidate = 60;

export function generateStaticParams() {
	return [{ slug: [] }];
}

export default async function Page({ params }) {
	const { slug } = await params;
	const story = await getPage(slug ? slug.join('/') : 'home', storyVersion);
	if (!story) notFound();

	return <StoryblokStory story={story} />;
}
