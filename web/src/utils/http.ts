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

export const API_URL = "http://localhost:8080/";

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
		const { parsedBody, ...rest } = await http<THttp<T>>(
			new Request(API_URL + path, {
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
		console.log("error weird one", error);
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
