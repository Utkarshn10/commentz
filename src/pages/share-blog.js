import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { generateID } from "./../utils/id-generator";
import checkForUpdates, { checkForBlogUpdates } from "@/utils/update-checker";

const inter = Inter({ subsets: ["latin"] });

function TextSelectionHandler({
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

  const highlightTextContent = () => {
    const textContent = blogContent.textcontent;
    if (highlightedText.length > 0) {
      const highlightedIndex = textContent.indexOf(highlightedText);
      if (highlightedIndex !== -1) {
        return (
          <>
            {textContent.substring(0, highlightedIndex)}
            <span className="bg-green-200">
              {textContent.substring(
                highlightedIndex,
                highlightedIndex + highlightedText.length
              )}
            </span>
            {textContent.substring(highlightedIndex + highlightedText.length)}
          </>
        );
      }
    }
    return textContent;
  };

  return (
    <div className="flex flex-col flex-grow px-6">
      <div className="flex flex-row">
        <h2 className="text-2xl md:text-4xl font-semibold my-8 text-black text-center md:mx-auto">
          {blogContent.heading}
        </h2>
      </div>
      {highlightedText.length > 0 ? (
        <button
          onClick={() => handleCommentButtonClicked()}
          className="flex justify-center border border-blue-600 text-blue-600 rounded-lg py-2 px-3"
        >
          Comment
        </button>
      ) : (
        <button
          onClick={() => handleHighlightButtonClick()}
          className={`flex justify-center border bg-yellow-400 text-white rounded-lg py-2 px-3`}
        >
          Highlight
        </button>
      )}

      <div className="w-4/5 mx-auto text-black">
        <div className="p-6">
          <p className="text-gray-800" style={{ whiteSpace: "pre-line" }}>
            {highlightTextContent()}
          </p>
        </div>
      </div>
    </div>
  );
}

function NewCommentCard({
  blogInfo,
  userID,
  blogID,
  setCommentClicked,
  highlightedText,
  setHighlightedText,
}) {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    let storedBlog = JSON.parse(localStorage.getItem("blogInfo"));
    let blogData = {};
    if (storedBlog && storedBlog[userID] && storedBlog[userID][blogID]) {
      blogData = storedBlog[userID][blogID];
      if (checkForBlogUpdates(blogData, highlightedText)) {
        let storedVersion = storedBlog.version;
        let blogContent = storedBlog.blogContent;
        let comments = storedBlog?.comments ? storedBlog.comments : [];

        let commentID = generateID();
        let commentatorID = generateID();

        let commentObj = {
          commentatorID: commentatorID,
          commentID: commentID,
          blogText: highlightedText,
          commentDesc: comment,
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

        setHighlightedText("");
        setCommentClicked(false);
        setComment("");
        alert("Comment Added !");
      } else {
        alert("Lines on which comment is being added are updated");
      }
    }
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
  let userID = "user1234";
  let blogID = "blog_1";

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("blogInfo"));
    if (data && data[userID] && data[userID][blogID]) {
      let blogData = data[userID][blogID];
      setBlogInfo(blogData);
      setBlogContent(blogData.blogContent);
    }
    console.log(data);
  }, []);

  return (
    <div className="h-full md:h-screen w-full bg-[#faf7f5] flex flex-row">
      {blogContent.length === 0 ? (
        <div className="text-black flex items-center justify-center">
          Blog Draft no longer exists
        </div>
      ) : (
        <div className="flex items-center">
          <TextSelectionHandler
            highlightedText={highlightedText}
            blogContent={blogContent}
            setCommentClicked={setCommentClicked}
            setHighlightedText={setHighlightedText}
          />
          <div className="flex items-center mx-10">
            {commentClicked && (
              <NewCommentCard
                blogInfo={blogInfo}
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
  );
}
