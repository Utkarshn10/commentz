import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [updatedContent, setUpdatedContent] = useState("");
  const [isContentHighlighted, setIsContentHighlighted] = useState(false);
  const blogContent = {
    heading: "Unleashing Creativity: The Art of Building Side Projects",
    textcontent: `Embarking on the journey of building side projects is akin to opening the floodgates of creativity. These endeavors serve as a canvas for self-expression, allowing individuals to unleash their imagination and bring ideas to life. Unlike the constraints of daily work tasks, side projects provide the freedom to experiment, take risks, and explore uncharted territories. Whether you are a developer, designer, writer, or artist, these projects act as a playground for innovation, where mistakes are stepping stones and failures are lessons in disguise. Through this creative process, individuals not only hone their technical skills but also cultivate a mindset that embraces curiosity and continuous learning.
    
      In the realm of side projects, each venture is a unique chapter in your creative story. It could be a mobile app, a blog, a piece of art, or even a community initiative. The diversity of these projects adds richness to your portfolio, showcasing your versatility and passion. The art of building side projects lies not just in the final product but in the journey itself — the challenges faced, the solutions devised, and the personal growth experienced. It becomes a reflection of your evolving skill set and a testament to your commitment to pushing boundaries.
      
      As you embark on the path of building side projects, remember that there are no strict rules. It's about embracing the freedom to experiment, learning from both successes and failures, and enjoying the process of creation. These projects not only make you a better professional but also nurture the artist within, allowing you to leave your unique mark on the vast canvas of the digital landscape.`,
  };

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const highlightedText = selection.toString();
      if (highlightedText) {
        setIsContentHighlighted(true);
        highlightFunction(highlightedText);
      }
      else{
        setIsContentHighlighted(false)
      }
    };

    document.addEventListener("mouseup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
    };
  }, []); // Empty dependency array ensures that the effect runs once when the component mounts

  const highlightFunction = (highlightedText) => {
    console.log("Highlighted Text:", highlightedText);
  };

  const updateContent = () => {};

  return (
    <div className="h-screen w-full bg-[#faf7f5] ">
      <div className="flex items-center flex-col flex-grow">
        <div className="flex flex-row">
          <h2 className="text-2xl md:text-4xl font-semibold my-8 text-black text-center md:mx-auto">
            {blogContent.heading}
          </h2>
        </div>
        {isContentHighlighted ? <button className="border border-blue-600 text-blue-600 rounded-xl py-2 px-1">Comment</button>:null}

        <div className="w-full md:w-2/3 mx-auto text-black">
          <div className="p-6">
            <p className="text-gray-800" style={{ whiteSpace: "pre-line" }}>
              {blogContent.textcontent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
