import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';
import { storyVersion } from '@/lib/settings';

export const revalidate = 60;

export default async function Page({ params, searchParams }) {
	const { slug } = await params;
	const query = await searchParams;

	let fullSlug = slug ? slug.join('/') : 'home';

	// Il Visual Editor di Storyblok apre il sito con il parametro _storyblok: in quel caso mostriamo le bozze.
	let sbParams = {
		version: query?._storyblok ? 'draft' : storyVersion,
	};

	const storyblokApi = getStoryblokApi();
	let { data } = await storyblokApi.get(`cdn/stories/${fullSlug}`, sbParams);

	return <StoryblokStory story={data.story} />;
}
