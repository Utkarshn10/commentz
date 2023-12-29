import md5 from 'md5';

export const checkForCommentUpdates = (blogData, updatedContent, blogInfo) => {
  let updatedComments = [];

  const commentsInfo = blogData.comments || [];
  const commentIdentifierToLineMap = {}; // Map to store comment identifiers and their associated line numbers

  // Build the comment identifier to line mapping
  commentsInfo.forEach((comment) => {
    const { lineNumber, commentID } = comment;
    const lineIdentifier = lineNumber + "_" + commentID;
    commentIdentifierToLineMap[lineIdentifier] = lineNumber;
  });

  // Check for updates in the updated content
  const updatedLines = updatedContent.split("\n");
  updatedLines.forEach((line, lineNumber) => {
    // Iterate through each line and find the comment using the unique identifier
    Object.keys(commentIdentifierToLineMap).forEach((commentIdentifier) => {
      const storedLineNumber = commentIdentifierToLineMap[commentIdentifier];
      if (lineNumber === storedLineNumber) {
        // Line found, update the corresponding comment
        const commentToUpdate = commentsInfo.find((comment) => {
          return (
            comment.lineNumber === storedLineNumber &&
            comment.commentID === commentIdentifier.split("_")[1]
          );
        });

        if (commentToUpdate) {
          // Update the comment's line number and character offset based on the new content
          const updatedLineAndOffset = getLineAndOffset(
            updatedContent,
            commentToUpdate.blogText
          );
          commentToUpdate.lineNumber = updatedLineAndOffset.lineNumber;
          commentToUpdate.characterOffset =
            updatedLineAndOffset.characterOffset;

          updatedComments.push(commentToUpdate);
        }
      }
    });
  });

  return updatedComments;
};

export const getLineAndOffset = (fullText, highlightedText) => {
  const lines = fullText.split("\n");
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
  const lineContent = lines[lineNumber];
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
