// src/services/imageService.js
const imageContext = require.context('../../assets/cursos', false, /\.(png|jpe?g|gif|webp)$/);

export const getCourseImages = () => {
  return imageContext.keys().map(key => ({
    name: key.replace('./', ''),
    path: imageContext(key)
  }));
};