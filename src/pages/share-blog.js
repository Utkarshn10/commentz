import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { generateID, generateLineIdentifier } from "./../utils/id-generator";
import checkForUpdates, {
  checkForBlogUpdates,
  getLineAndOffset,
} from "@/utils/update-checker";
import { CommentCard } from "@/components/commentCard";
import md5 from "md5";
import { uuid } from "uuidv4";

const inter = Inter({ subsets: ["latin"] });

function TextSelectionHandler({
  commentsInfo,
  blogContent,
  setCommentClicked,
  highlightedText,
  setHighlightedText,
}) {
  const [isContentHighlighted, setIsContentHighlighted] = useState(false);
  const [isHighlightButtonClicked, setIsHighlightButtonClicked] =
    useState(false);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString();

      if (text && isHighlightButtonClicked) {
        setIsContentHighlighted(true);
        setHighlightedText(text);
      } else {
        setIsContentHighlighted(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
    };
  }, [isHighlightButtonClicked]);

  const handleCommentButtonClicked = () => {
    setIsHighlightButtonClicked(false);
    setCommentClicked(true);
  };

  const handleHighlightButtonClick = () => {
    setIsHighlightButtonClicked(true);
  };

  const getHighlightedText = () => {
    let highlightedText = blogContent.textcontent;

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
    <div className="flex flex-col flex-grow px-6">
      <div className="flex flex-row">
        <h2 className="text-2xl md:text-4xl font-semibold my-8 text-black text-center md:mx-auto">
          {blogContent.title}
        </h2>
      </div>
      <div className="flex justify-center">
        {highlightedText.length > 0 ? (
          <button
            onClick={() => handleCommentButtonClicked()}
            className="flex justify-center border border-blue-600 text-blue-600 rounded-lg py-2 px-3 w-1/3"
          >
            Comment
          </button>
        ) : isHighlightButtonClicked ? (
          <div
          className={`flex justify-center border border-yellow-400 text-yellow-400 bg-white rounded-lg py-2 px-3 w-1/3`}
        >
          Select Text to Add Comment
        </div>
        ) : (
          <button
            onClick={() => handleHighlightButtonClick()}
            className={`flex justify-center border bg-yellow-400 text-white rounded-lg py-2 px-3 w-1/3`}
          >
            Highlight
          </button>
        )}
      </div>
      <div className="w-4/5 mx-auto text-black">
        <div className="p-6">
          <div
            className="text-gray-800 w-full h-3/4  rounded p-2"
            style={{ whiteSpace: "pre-line", height: "60vh" }}
            dangerouslySetInnerHTML={getHighlightedText()}
          />
        </div>
      </div>
    </div>
  );
}

function NewCommentCard({
  commentsInfo,
  setCommentsInfo,
  userID,
  blogID,
  setCommentClicked,
  highlightedText,
  setHighlightedText,
}) {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (highlightedText.includes(".")) {
      alert("Please avoid highlighting text that includes a period (.)");
      return;
    }
    let data = JSON.parse(localStorage.getItem("blogInfo"));
    if (data && data[userID] && data[userID][blogID]) {
      let storedBlog = data[userID][blogID];
      if (checkForBlogUpdates(storedBlog, highlightedText)) {
        let storedVersion = storedBlog.version;
        let blogContent = storedBlog.blogContent;
        let comments = storedBlog?.comments ? storedBlog.comments : [];

        const commentID = uuid();
        let commentatorID = generateID();

        // Use a hash of the highlighted text as the identifier
        const { lineNumber, characterOffset, lineContentHash } =
          getLineAndOffset(blogContent.textcontent, highlightedText);

        let commentObj = {
          commentatorID: commentatorID,
          commentID: commentID,
          blogText: highlightedText,
          commentDesc: comment,
          lineContentHash: lineContentHash, // Use content hash as the identifier
          lineNumber: lineNumber,
          characterOffset: characterOffset,
        };

        comments.push(commentObj);

        const updatedBlogInfo = {
          [userID]: {
            [blogID]: {
              comments: comments,
              blogContent: blogContent,
              version: storedVersion + 1,
            },
          },
        };
        localStorage.setItem("blogInfo", JSON.stringify(updatedBlogInfo));
        setCommentsInfo(comments);
        setHighlightedText("");
        setCommentClicked(false);
        setComment("");
        alert("Comment Added !");
      } else {
        alert(
          "Lines on which the comment is being added are updated. Comment can't be added. Refresh Page to View."
        );
      }
    }
  };

  const getLineAndOffset = (fullText, highlightedText) => {
    const lines = fullText.split(".");
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

  function handleDiscardClicked() {
    setHighlightedText("");
    setCommentClicked(false);
    setComment("");
  }

  return (
    <div className="bg-white w-full text-black">
      <p className="p-2">{highlightedText}</p>
      <textarea
        type="text"
        className="p-2 border border-gray-400 rounded-sm m-2"
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex justify-end space-x-3 m-1">
        <button
          onClick={() => handleDiscardClicked()}
          className="border border-blue-600 text-blue-600 rounded-lg py-1 px-2"
        >
          Discard
        </button>
        <button
          onClick={() => handleAddComment()}
          className="border bg-blue-600 text-white rounded-lg py-1 px-2"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default function Blog() {
  const [commentClicked, setCommentClicked] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [blogInfo, setBlogInfo] = useState(null);
  const [blogContent, setBlogContent] = useState("");
  const [commentsInfo, setCommentsInfo] = useState([]);
  let userID = "user1234";
  let blogID = "blog_1";

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("blogInfo"));
    if (data && data[userID] && data[userID][blogID]) {
      let blogData = data[userID][blogID];
      setBlogInfo(blogData);
      setBlogContent(blogData.blogContent);
      if (blogData?.comments) setCommentsInfo(blogData.comments);
    }
  }, []);

  return (
    <div className="h-full  md:min-h-screen w-full bg-[#faf7f5] flex flex-row">
      <div className="flex items-center flex-col flex-grow">
        {!blogContent && blogContent.length === 0 ? (
          <div className="text-black flex items-center  w-full justify-center">
            Blog Draft no longer exists
          </div>
        ) : (
          <div className="flex items-center">
            <TextSelectionHandler
              commentsInfo={commentsInfo}
              highlightedText={highlightedText}
              blogContent={blogContent}
              setCommentClicked={setCommentClicked}
              setHighlightedText={setHighlightedText}
            />
            <div className="flex items-center mx-10">
              {commentClicked && (
                <NewCommentCard
                  commentsInfo={commentsInfo}
                  setCommentsInfo={setCommentsInfo}
                  userID={userID}
                  blogID={blogID}
                  setHighlightedText={setHighlightedText}
                  setCommentClicked={setCommentClicked}
                  highlightedText={highlightedText}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col my-5 space-y-3 items-center mx-10">
        {commentsInfo.length > 0 &&
          commentsInfo.map((commentData, index) => {
            return (
              <CommentCard
                key={index}
                userID={userID}
                commentsInfo={commentsInfo}
                commentData={commentData}
              />
            );
          })}
      </div>
    </div>
  );
}
