import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface GeoJSONFeature {
	type: string;
	properties?: { NOME?: string };
}

interface GeoJSON {
	type: string;
	features?: GeoJSONFeature[];
}

/**
 * Load Lisbon constituency names from the GeoJSON file.
 * Returns an array of NOME values in feature order.
 */
export function loadLisbonConstituencies(): string[] {
	const geojsonPath = path.join(__dirname, "../../lisbon-constituency-limit.geojson");
	const content = fs.readFileSync(geojsonPath, "utf-8");
	const geojson = JSON.parse(content) as GeoJSON;

	if (!geojson.features?.length) {
		return [];
	}

	return geojson.features
		.map((f) => f.properties?.NOME)
		.filter((name): name is string => typeof name === "string");
}
