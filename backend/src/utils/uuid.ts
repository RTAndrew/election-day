import { init } from "@paralleldrive/cuid2";

const config = init({
	// A custom random function with the same API as Math.random.
	// You can use this to pass a cryptographically secure random function.
	random: Math.random,
	// the length of the id
	length: 10,
	// A custom fingerprint for the host environment. This is used to help
	// prevent collisions when generating ids in a distributed system.
	fingerprint: "election",
});

/**
 * An util function to generate Global Unique Identifiers.
 * Currently the length is set to 10, equivalent of 50% odds of collision after ~51,386,368 ids
 */
export const generateUUID = (prefix?: string) => {
	if (!prefix) return config();

	return `${prefix}_${config()}`;
};
