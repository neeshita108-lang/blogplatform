export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  if (!content) return 0;
  const wordCount = content.split(/\s+/g).length;
  const minutes = wordCount / wordsPerMinute;
  return Math.ceil(minutes);
};
