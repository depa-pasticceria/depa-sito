import { getStoryblokApi } from '@/lib/storyblok';

// Legge una pagina da Storyblok. Restituisce null se non esiste o se non è una pagina del sito
// (es. la story "impostazioni"), così la route può rispondere con un 404 vero.
export async function getPage(slug, version) {
	try {
		const { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, { version });
		return data.story?.content?.component === 'page' ? data.story : null;
	} catch (error) {
		if (error?.status === 404) return null;
		throw error;
	}
}
