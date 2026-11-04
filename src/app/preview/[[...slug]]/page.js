import { notFound } from 'next/navigation';
import { StoryblokStory } from '@storyblok/react/rsc';
import { getPage } from '@/lib/stories';

// Anteprima delle bozze per il Visual Editor di Storyblok (indirizzo: https://<dominio>/preview/).
// Sempre generata al momento e mai indicizzata.
export const dynamic = 'force-dynamic';

export const metadata = {
	robots: { index: false, follow: false },
};

export default async function Preview({ params }) {
	const { slug } = await params;
	const story = await getPage(slug ? slug.join('/') : 'home', 'draft');
	if (!story) notFound();

	return <StoryblokStory story={story} />;
}
