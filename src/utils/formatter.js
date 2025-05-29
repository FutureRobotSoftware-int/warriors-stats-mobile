/**
 * Converts player name to a slug.
 * "Stephen Curry" -> "Stephen-Curry"
 **/
export function formatToSlug(name) {
	return name.trim().replace(/\s+/g, "-");
}
