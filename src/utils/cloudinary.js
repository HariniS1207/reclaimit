export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "reclaimit_upload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dc2hsf2en/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};
