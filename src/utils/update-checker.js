import md5 from 'md5';

export const checkForCommentUpdates = (blogData, updatedContent, blogInfo) => {
  let updatedComments = [];

  const commentsInfo = blogData.comments || [];

  commentsInfo.forEach((comment) => {
    const {
      lineNumber,
      characterOffset,
      lineContentHash,
      blogText,
      commentID,
    } = comment;

    // Check if the line number is still valid in the updated content
    const lines = updatedContent.split(".");
    if (lineNumber < lines.length && lineNumber!=-1) {
      // Check if the character offset is within the line
      const line = lines[lineNumber];
      const updatedLineContentHash = md5(line);

      if (lineContentHash === updatedLineContentHash) {
        // If the line content hash matches, check if the position is still valid
        const updatedLineAndOffset = getLineAndOffset(
          updatedContent,
          blogText
        );

        if (
          updatedLineAndOffset.lineNumber !== -1 &&
          updatedLineAndOffset.characterOffset !== -1
        ) {
          // Update the comment's line number and character offset based on the new content
          const updatedComment = {
            ...comment,
            lineNumber: updatedLineAndOffset.lineNumber,
            characterOffset: updatedLineAndOffset.characterOffset,
          };

          updatedComments.push(updatedComment);
        }
      }
    }
    // Otherwise, the line was deleted, and we exclude the comment from the updated set
  });

  return updatedComments;
};

const getLineAndOffset = (fullText, highlightedText) => {
  const placeholder = '|';
  const lines = fullText.split('.').map(line => line.replace(/\./g, placeholder));

  let lineNumber = -1;
  let characterOffset = -1;

  for (let i = 0; i < lines.length; i++) {
    const index = lines[i].indexOf(highlightedText);
    if (index !== -1) {
      lineNumber = i;
      characterOffset = index;
      break;
    }
  }

  // Calculate the hash of the line content
  const lineContent = lines[lineNumber].replace(new RegExp(placeholder, 'g'), '.');
  const lineContentHash = md5(lineContent);

  return { lineNumber, characterOffset, lineContentHash };
};

export function checkForBlogUpdates(data, highlightedText) {
  // check that whether any comment that is added, its data exist here or not
  // if not then remove the comment
  let updatedContent = data.blogContent.textcontent;

  let blogUpdated = updatedContent.includes(highlightedText);
  return blogUpdated;
}
