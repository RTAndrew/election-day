interface HttpResponse<T> extends Response {
	parsedBody?: T;
}

export const buildAPIQueries = (
	endpoint: string,
	queryParams: Record<string, string | undefined | null>,
) => {
	if (!queryParams || Object.keys(queryParams).length === 0) return endpoint;

	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(queryParams)) {
		if (!value) continue;
		params.set(key, value);
	}
	return `${endpoint}?${params.toString()}`;
};

export interface IApiResponse<T> {
	data: T | null;
	error: unknown | null;
	statusCode: number;
	message: string;
	/** The raw HTTP Response */
	raw: Response;
}

const DEFAULT_API_URL = "http://localhost:8080/";

function getApiBase(): string {
	// Runtime override (e.g. injected in index.html or set before app loads)
	if (typeof window !== "undefined" && (window as unknown as { __API_URL__?: string }).__API_URL__) {
		const base = (window as unknown as { __API_URL__: string }).__API_URL__;
		return base.endsWith("/") ? base : `${base}/`;
	}
	// Build-time env (for deployments where API is on another host)
	const env = import.meta.env.VITE_API_URL;
	if (typeof env === "string" && env.trim() !== "") return env.endsWith("/") ? env : `${env}/`;
	// In browser: same host, port 8080 — works for Docker and when opening via hostname or IP
	if (typeof window !== "undefined" && window.location?.hostname) {
		const { protocol, hostname } = window.location;
		return `${protocol}//${hostname}:8080/`;
	}
	return DEFAULT_API_URL;
}

export const API_URL = getApiBase();

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
	const response: HttpResponse<T> = await fetch(request);

	try {
		response.parsedBody = await response.json();

		return response;
	} catch (error: any) {
		console.log(error);
		throw new Error(error);
	}
}

type THttp<T> = Omit<IApiResponse<T>, "httpResponse">;
export async function api<T>(
	path: string,
	args: RequestInit,
): Promise<IApiResponse<T>> {
	try {
		const base = API_URL.replace(/\/$/, "");
		const normalizedPath = path.replace(/^\//, "");
		const { parsedBody, ...rest } = await http<THttp<T>>(
			new Request(`${base}/${normalizedPath}`, {
				...args,
				headers: args.headers
					? args.headers
					: {
							credentials: "include",
							Accept: "application/json",
							"Content-Type": "application/json",
						},
			}),
		);

		if (!parsedBody)
			return {
				statusCode: 500,
				data: null,
				raw: rest,
				message: "A client error happened while processing the server request",
				error: null,
			};

		return {
			...parsedBody,
			data: parsedBody?.data ?? null,
			raw: rest,
		};
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "Unknown error");
	}
}

export async function getRequest<T>(
	path: string,
	args: RequestInit = {
		method: "GET",
	},
): Promise<IApiResponse<T>> {
	return await api<T>(path, {
		...args,
		method: "GET",
	});
}

// interface IPostRequestArgs extends RequestInit {}

export async function postRequest<T>(
	path: string,
	args: RequestInit,
): Promise<IApiResponse<T>> {
	return await api<T>(path, {
		...args,
		body: args.body ? args.body : JSON.stringify(args.body),
		method: "POST",
	});
}
