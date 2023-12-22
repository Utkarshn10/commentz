import { comment } from "postcss";

export default function checkForCommentUpdates(data,updatedContent, blogInfo) {

  if (!data) return [];

  // check that whether any comment that is added, its data exist here or not
  // if not then remove the comment
  let updatedComments = data?.comments ? data.comments : [];
  if (updatedComments.length > 0) {
    updatedComments = updatedComments.filter((comment) => {
      const blogtext = comment.blogText;

      // Check if the blogtext exists in the updatedContent
      const blogtextExists = updatedContent.includes(blogtext);

      // Keep the comment if blogtext exists in updatedContent
      return blogtextExists;
    });
  }
  console.log("after  =", updatedComments);
  return updatedComments;
}

export function checkForBlogUpdates(data,highlightedText) {
  // check that whether any comment that is added, its data exist here or not
  // if not then remove the comment
  let updatedContent = data.blogContent.textcontent

  let blogUpdated = updatedContent.includes(highlightedText)
    return blogUpdated
}
