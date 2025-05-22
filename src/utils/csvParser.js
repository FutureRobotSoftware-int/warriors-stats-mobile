import Papa from "papaparse";

/**
 * Parse a CSV file and return data as an array.
 * @param {File | string} csvSource - File or URL.
 * @param {Object} configExtra
 * @returns {Promise<Array<Object>>} Promise to resolve parsed data.
 */

export function parseCSV(csvSource, configExtra = {}) {
	return new Promise((resolve, reject) => {
		const config = {
			header: true,
			skipEmptyLines: true,
			complete: (result) => resolve(result.data),
			error: (err) => reject(err),
			...configExtra,
		};

		// If is a file (input)
		if (csvSource instanceof File) {
			Papa.parse(csvSource, config);
		}
		// If is a URL (string)
		else if (typeof csvSource === "string") {
			Papa.parse(csvSource, {
				...config,
				download: true,
			});
		} else {
			reject(new Error("csvSource must be a File or a URL (string)."));
		}
	});
}
