import api from "./api";

export const userService = {
  getUsers: () => api.get("/users"),
  getUserById: (userId) => api.get(`/users/${userId}`),
  updateFaceEmbedding: (userId, faceEmbeddingJson) =>
    api.patch(
      `/users/${userId}?faceEmbeddingJson=${encodeURIComponent(
        faceEmbeddingJson
      )}`
    ),
};
