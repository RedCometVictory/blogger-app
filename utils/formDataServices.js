export const postComment = (formData) => {
  let data = new FormData();
  formData.text && data.append("text", formData.text);
  return data;
};

export const createUserForm = (formData) => {
  let data = new FormData();

  formData.firstName && data.append("firstName", formData.firstName);
  formData.lastName && data.append("lastName", formData.lastName);
  formData.username && data.append("username", formData.username);
  formData.email && data.append("email", formData.email);
  formData.image_url && data.append("image_url", formData.image_url);
  formData.password && data.append("password", formData.password);
  formData.password2 && data.append("password2", formData.password2);

  return data;
};

export const updateUserForm = (formData) => {
  let data = new FormData();

  formData.firstName && data.append("firstName", formData.firstName);
  formData.lastName && data.append("lastName", formData.lastName);
  formData.email && data.append("email", formData.email);
  formData.username && data.append("username", formData.username);
  formData.image_url && data.append("image_url", formData.image_url);

  return data;
};

export const createUpdatePostForm = (formData) => {
  let data = new FormData();

  formData.title && data.append("title", formData.title);
  formData.text && data.append("text", formData.text);
  formData.category && data.append("category", formData.category);
  formData.tags && data.append("tags", formData.tags);
  formData.image_url && data.append("image_url", formData.image_url);

  return data;
};

export const createUpdateProfileForm = (formData) => {
  let data = new FormData();

  formData.bio && data.append("bio", formData.bio);
  formData.location && data.append("location", formData.location);
  formData.image_url && data.append("image_url", formData.image_url);
  formData.theme && data.append("theme", formData.theme);
  formData.website && data.append("website", formData.website);
  formData.youtube && data.append("youtube", formData.youtube);
  formData.facebook && data.append("facebook", formData.facebook);
  formData.twitter && data.append("twitter", formData.twitter);
  formData.linkedin && data.append("linkedin", formData.linkedin);
  formData.instagram && data.append("instagram", formData.instagram);
  formData.reddit && data.append("reddit", formData.reddit);
  formData.github && data.append("github", formData.github);

  return data;
};