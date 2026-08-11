import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { storage } from "./config.js";

export const uploadAvatar = async (uid, file) => {
  const fileRef = ref(storage, `avatars/${uid}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};
