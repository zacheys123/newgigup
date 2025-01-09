type Toast = {
  success: (url: string) => void;
  error: (msg: string) => void;
};

export const fileupload = async (
  event: React.ChangeEvent<HTMLInputElement>, // Correct type for event
  updatefileFunc: (file: string) => void, // Assuming the URL is a string
  toast: Toast,
  allowedTypes: string[], // Array of allowed MIME types
  fileUrl: string,
  setFileUrl: (file: string | undefined) => void, // URL can be string or undefined
  setIsUploading: (isUploading: boolean) => void, // Boolean to indicate uploading state
  dep: "image" | "video" // Dependent on file type, restrict to valid options
) => {
  const file = event.target.files ? event.target.files[0] : null;
  if (fileUrl) {
    URL.revokeObjectURL(fileUrl);
  }
  if (file) {
    const url = URL.createObjectURL(file);
    setFileUrl(url || "");
  } else {
    setFileUrl(undefined);
  }

  if (!file) {
    return;
  }

  // Check for file size (e.g., limit to 60MB)
  const MAX_FILE_SIZE = 60 * 1024 * 1024; // 60MB
  if (file.size > MAX_FILE_SIZE) {
    toast.error("File is too large. Maximum size is 50MB.");
    return;
  }

  // Check if the file is a ${dep}
  if (!allowedTypes.includes(file.type)) {
    toast.error(`Only ${dep} files are allowed`);
    return;
  }
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  if (!apiKey) {
    toast.error("API key is missing. Please check your environment variables.");
    return;
  }

  // Reset error
  setIsUploading(true);

  try {
    // Step 1: Get the signed upload URL from your API
    const response = await fetch("/api/posts/sign-upload", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { signature, timestamp, upload_preset, cloud_name } =
      await response.json();

    // Step 2: Upload the ${dep} file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("cloud_name", cloud_name);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/${dep}/upload/`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadResult = await uploadResponse.json();

    if (uploadResponse.ok) {
      if (dep === "video") alert("Upload successful!");
      console.log("Upload successful!");
      console.log(uploadResult); // You can process this result further (e.g., store the URL)
      updatefileFunc(uploadResult.secure_url);
      if (dep === "video") toast.success(`${dep} uploaded successfully!`);
      console.log(`${dep} uploaded successfully!`);
    } else {
      toast.error("Upload failed, please try again.");
      console.error(uploadResult);
    }
  } catch (error) {
    toast.error("An error occurred during upload.");
    console.error("An error occurred during upload.", error);
  } finally {
    setIsUploading(false);
  }
};
