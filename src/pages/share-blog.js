import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";

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
    // setIsHighlightButtonClicked(false);
    // setHighlightedText(highlightedText);
    // setCommentClicked(true);
    console.log("here");
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
      {isContentHighlighted ? (
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

function NewCommentCard({ setCommentClicked, highlightedText }) {
  const [comment, setComment] = useState("");
  const handleAddComment = () => {
    // let storedArticle = JSON.parse(localStorage.getItem('article'));
    // let storedVersion = localStorage.getItem('version');
    // let articleId = localStorage.getItem('article-id');
    // let blogContent =

    if (storedVersion === storedBlog?.version.toString()) {
      console.log("Blog has not been modified since last retrieval.");
    } else {
      // Blog has been updated or the user is fetching it for the first time
      console.log(
        "Blog has been modified or user is fetching it for the first time."
      );
      const updatedBlog = {
        userId: userID,
        blogId: blogId,
        content: newBlogContent,
        version: 2,
      };
    }
  };
  console.log(highlightedText);
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
          onClick={() => setCommentClicked(false)}
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

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("blogInfo"));
    setBlogContent(data.blogContent);
    console.log(data);
  }, []);
  console.log(commentClicked);

  return (
    <div className="h-full md:h-screen w-full bg-[#faf7f5] flex flex-row">
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
              setCommentClicked={setCommentClicked}
              highlightedText={highlightedText}
            />
          )}
        </div>
      </div>
    </div>
  );
}