export const generateID = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
};

// Function to generate a line identifier based on the content of the line
export const generateLineIdentifier = ({ lineNumber, characterOffset }) => {
  // Assuming you want to use colon as a separator
  return `${lineNumber}:${characterOffset}`;
};
