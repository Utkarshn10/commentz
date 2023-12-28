export const generateID = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
};

const hashString = (str) => {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

// Function to generate a line identifier based on the content of the line
export const generateLineIdentifier = (lineContent) => {
  // You may customize this function based on your requirements
  return hashString(lineContent);
};
