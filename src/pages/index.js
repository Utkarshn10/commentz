import { useState, useEffect, version } from "react";
import { generateID, generateLineIdentifier } from "./../utils/id-generator";
import checkForCommentUpdates from "@/utils/update-checker";
import md5 from "md5";

function CommentCard({ commentData }) {
  return (
    <div className="bg-white w-full text-black">
      <p className="p-2">{commentData.blogText}</p>
      <span type="text" className="p-2 border border-gray-400 rounded-sm m-2">
        {commentData.commentDesc}
      </span>
    </div>
  );
}

export default function Home() {
  const [updatedContent, setUpdatedContent] = useState("");
  const [commentsInfo, setCommentsInfo] = useState([]);
  const [editEnabled, setEditEnabled] = useState(false);
  const [blogInfo, setBlogInfo] = useState(null);
  const [dataExists, setDataExists] = useState(false);
  const [blogContent, setBlogContent] = useState({
    title: "Unleashing Creativity: The Art of Building Side Projects",
    textcontent: `Embarking on the journey of building side projects is akin to opening the floodgates of creativity. These endeavors serve as a canvas for self-expression, allowing individuals to unleash their imagination and bring ideas to life. Unlike the constraints of daily work tasks, side projects provide the freedom to experiment, take risks, and explore uncharted territories. Whether you are a developer, designer, writer, or artist, these projects act as a playground for innovation, where mistakes are stepping stones and failures are lessons in disguise. Through this creative process, individuals not only hone their technical skills but also cultivate a mindset that embraces curiosity and continuous learning.
    
    In the realm of side projects, each venture is a unique chapter in your creative story. It could be a mobile app, a blog, a piece of art, or even a community initiative. The diversity of these projects adds richness to your portfolio, showcasing your versatility and passion. The art of building side projects lies not just in the final product but in the journey itself — the challenges faced, the solutions devised, and the personal growth experienced. It becomes a reflection of your evolving skill set and a testament to your commitment to pushing boundaries.
      
    As you embark on the path of building side projects, remember that there are no strict rules. It's about embracing the freedom to experiment, learning from both successes and failures, and enjoying the process of creation. These projects not only make you a better professional but also nurture the artist within, allowing you to leave your unique mark on the vast canvas of the digital landscape.`,
  });
  let userID = "user1234";
  let blogID = "blog_1";

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("blogInfo"));
    if (data && data[userID] && data[userID][blogID]) {
      setDataExists(true);
      let blogData = data[userID][blogID];
      setBlogInfo(blogData);
      setBlogContent(blogData.blogContent);
      if (blogData?.comments) setCommentsInfo(blogData.comments);
    }
  }, []);

  const updateContent = (e) => {
    setUpdatedContent(e.target.value);
  };

  const handleDiscardChanges = () => {
    setUpdatedContent("");
    setEditEnabled(false);
  };

  const handleSaveChanges = () => {
    if (!dataExists) {
      setDataExists(true);

      let content = {
        title: blogContent.title,
        textcontent: blogContent.textcontent,
      };

      let updatedBlogInfo = {
        [userID]: {
          [blogID]: {
            comments: commentsInfo,
            blogContent: content,
            version: 0,
          },
        },
      };
      localStorage.setItem("blogInfo", JSON.stringify(updatedBlogInfo));
      alert("Blog Added");
    }

    if (updatedContent.length > 0) {
      let updatedComments = [];
      // Pulling the latest data from storage to check for updates
      let data = JSON.parse(localStorage.getItem("blogInfo"));
      let blogData = {};
      if (data && data[userID] && data[userID][blogID]) {
        blogData = data[userID][blogID];
        updatedComments = checkForCommentUpdates(
          blogData,
          updatedContent,
          blogInfo
        );

        // Filter out comments associated with deleted lines
        updatedComments = updatedComments.filter(
          (comment) => comment.lineIdentifier !== -1
        );

        setCommentsInfo(updatedComments);
      }
      setEditEnabled(false);

      let blogVersion = blogData.hasOwnProperty("version")
        ? parseInt(blogData.version) + 1
        : 0;

      let content = {
        title: blogContent.title,
        textcontent: updatedContent,
      };

      let updatedBlogInfo = {
        [userID]: {
          [blogID]: {
            comments:
              data && data[userID] && data[userID][blogID]
                ? updatedComments
                : commentsInfo,
            blogContent: content,
            version: blogVersion,
          },
        },
      };
      localStorage.setItem("blogInfo", JSON.stringify(updatedBlogInfo));
      alert("Blog Updated");
    }
  };

  const checkForCommentUpdates = (blogData, updatedContent, blogInfo) => {
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
      if (lineNumber < lines.length && lineNumber != -1) {
        // Check if the character offset is within the line
        const line = lines[lineNumber];
        console.log(lineNumber, " ", lines);
        const updatedLineContentHash = md5(line);
        console.log(line, " ", lineContentHash, " ", updatedLineContentHash);

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
    // Use a placeholder character not present in the text
    const placeholder = "|";
    const lines = fullText
      .split(".")
      .map((line) => line.replace(/\./g, placeholder));
    let lineNumber = -1;
    let characterOffset = -1;

    for (let i = 0; i < lines.length; i++) {
      const index = lines[i].indexOf(highlightedText);
      console.log(index);
      if (index !== -1) {
        lineNumber = i;
        characterOffset = index;
        break;
      }
    }

    if (lineNumber !== -1) {
      // Calculate the hash of the line content
      const lineContent = lines[lineNumber].replace(
        new RegExp(placeholder, "g"),
        "."
      );
      const lineContentHash = md5(lineContent);

      return { lineNumber, characterOffset, lineContentHash };
    } else {
      // Handle the case when highlightedText is not found
      console.error("Highlighted text not found in any line.");
      return { lineNumber, characterOffset, lineContentHash: null };
    }
  };

  const handleCopyLink = () => {
    const linkToCopy = "https://commentz.vercel.app/share-blog";

    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        alert("Link copied to clipboard");
      })
      .catch((err) => {
        alert("Unable to copy link to clipboard");
        console.log(err);
      });
  };

  const getHighlightedText = () => {
    let highlightedText =
      updatedContent.length > 0 ? updatedContent : blogContent.textcontent;

    commentsInfo.forEach((commentData) => {
      const blogText = commentData.blogText;
      const lineIdentifier = commentData.lineIdentifier;

      let startIndex = highlightedText.indexOf(blogText);

      const precedingText = highlightedText.substring(0, startIndex);
      const followingText = highlightedText.substring(
        startIndex + blogText.length
      );

      if (
        !precedingText.endsWith("</span>") &&
        !followingText.startsWith("<span")
      ) {
        highlightedText = `${precedingText}<span class="bg-yellow-100" data-id="${lineIdentifier}">${blogText}</span>${followingText}`;

        startIndex = highlightedText.indexOf(
          blogText,
          startIndex + blogText.length
        );
      } else {
        startIndex = highlightedText.indexOf(blogText, startIndex + 1);
      }
    });

    return { __html: highlightedText };
  };

  return (
    <div className="flex flex-grow h-screen md:min-h-screen w-full bg-[#faf7f5]">
      <div className="h-full flex flex-row">
        <div className="flex items-center flex-col flex-grow">
          <div className="flex flex-row">
            <h2 className="text-2xl md:text-4xl font-semibold my-8 text-black text-center md:mx-auto">
              {blogContent.title}
            </h2>
          </div>
          {!dataExists ? (
            <button
              onClick={() => handleSaveChanges()}
              className="border bg-blue-600 text-white rounded-lg py-2 px-4"
            >
              Save to DB
            </button>
          ) : editEnabled ? (
            <div className="flex space-x-3 my-4">
              <button
                onClick={() => handleDiscardChanges()}
                className="border border-blue-600 text-blue-600 rounded-lg py-2 px-4"
              >
                Discard
              </button>
              <button
                onClick={() => handleSaveChanges()}
                className="border bg-blue-600 text-white rounded-lg py-2 px-4"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditEnabled(true)}
              className="border bg-blue-600 text-white rounded-lg py-2 px-4"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => handleCopyLink()}
            className="border bg-blue-600 text-white rounded-lg py-2 px-4"
          >
            Share
          </button>

          <div className="w-full h-full md:w-2/3 mx-auto text-black">
            {editEnabled ? (
              <textarea
                onChange={(e) => updateContent(e)}
                value={
                  updatedContent.length > 0
                    ? updatedContent
                    : blogContent.textcontent
                }
                className="text-gray-800 w-full h-3/4 border rounded p-2"
                style={{ whiteSpace: "pre-line", height: "60vh" }}
              />
            ) : (
              <div
                className="text-gray-800 w-full h-3/4  rounded p-2"
                style={{ whiteSpace: "pre-line", height: "60vh" }}
                dangerouslySetInnerHTML={getHighlightedText()}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col my-5 space-y-3 items-center mx-10">
          {commentsInfo.length > 0 &&
            commentsInfo.map((commentData, index) => {
              return <CommentCard key={index} commentData={commentData} />;
            })}
        </div>
      </div>
    </div>
  );
}
