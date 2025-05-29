export const getResponsiveRadius = () => {
	const width = window.innerWidth;

	if (width < 480) return 20;
	if (width < 768) return 50;
	if (width < 950) return 65;
	return 130;
};
