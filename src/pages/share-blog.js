import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

function TextSelectionHandler({
  blogContent,
  setCommentClicked,
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
  }, [isHighlightButtonClicked]); // Add isHighlightButtonClicked as a dependency

  const handleCommentButtonClicked = () => {
    setIsHighlightButtonClicked(false);
    setCommentClicked(true);
  };

  const handleHighlightButtonClick = () => {
    setIsHighlightButtonClicked(true);
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
          onClick={handleHighlightButtonClick}
          className="flex justify-center border border-yellow-400 text-yellow-400 rounded-lg py-2 px-3"
        >
          Highlight
        </button>
      )}

      <div className="w-4/5 mx-auto text-black">
        <div className="p-6">
          <p className="text-gray-800" style={{ whiteSpace: "pre-line" }}>
            {blogContent.textcontent}
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

    if (storedVersion === storedArticle?.version.toString()) {
      console.log("Article has not been modified since last retrieval.");
    } else {
      // Article has been updated or the user is fetching it for the first time
      console.log(
        "Article has been modified or user is fetching it for the first time."
      );
      const updatedArticle = {
        id: articleId,
        content: newArticleContent,
        version: 2,
      };
    }
  };

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

  const blogContent = {
    heading: "Unleashing Creativity: The Art of Building Side Projects",
    textcontent: `Embarking on the journey of building side projects is akin to opening the floodgates of creativity. These endeavors serve as a canvas for self-expression, allowing individuals to unleash their imagination and bring ideas to life. Unlike the constraints of daily work tasks, side projects provide the freedom to experiment, take risks, and explore uncharted territories. Whether you are a developer, designer, writer, or artist, these projects act as a playground for innovation, where mistakes are stepping stones and failures are lessons in disguise. Through this creative process, individuals not only hone their technical skills but also cultivate a mindset that embraces curiosity and continuous learning.
    
      In the realm of side projects, each venture is a unique chapter in your creative story. It could be a mobile app, a blog, a piece of art, or even a community initiative. The diversity of these projects adds richness to your portfolio, showcasing your versatility and passion. The art of building side projects lies not just in the final product but in the journey itself — the challenges faced, the solutions devised, and the personal growth experienced. It becomes a reflection of your evolving skill set and a testament to your commitment to pushing boundaries.
      
      As you embark on the path of building side projects, remember that there are no strict rules. It's about embracing the freedom to experiment, learning from both successes and failures, and enjoying the process of creation. These projects not only make you a better professional but also nurture the artist within, allowing you to leave your unique mark on the vast canvas of the digital landscape.`,
  };

  return (
    <div className="h-full md:h-screen w-full bg-[#faf7f5] flex flex-row">
      <div className="flex items-center">
        <TextSelectionHandler
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
