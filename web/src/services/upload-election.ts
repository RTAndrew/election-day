import { postRequest } from "@/utils/http";

export const uploadElection = async (file: File) => {
	const formData = new FormData();
	formData.append("file", file);

  const response = await postRequest("upload-elections", {
		body: formData,
    // fix for multipart/form-data because it can't be set
    // in the request body when using Fetch API
    headers: {},
	});
	return response.data;
};
