import { useState, useEffect, version } from "react";


export default function Home() {
  const [updatedContent, setUpdatedContent] = useState("");
  const blogContent = {
    heading: "Unleashing Creativity: The Art of Building Side Projects",
    textcontent: `Embarking on the journey of building side projects is akin to opening the floodgates of creativity. These endeavors serve as a canvas for self-expression, allowing individuals to unleash their imagination and bring ideas to life. Unlike the constraints of daily work tasks, side projects provide the freedom to experiment, take risks, and explore uncharted territories. Whether you are a developer, designer, writer, or artist, these projects act as a playground for innovation, where mistakes are stepping stones and failures are lessons in disguise. Through this creative process, individuals not only hone their technical skills but also cultivate a mindset that embraces curiosity and continuous learning.
    
    In the realm of side projects, each venture is a unique chapter in your creative story. It could be a mobile app, a blog, a piece of art, or even a community initiative. The diversity of these projects adds richness to your portfolio, showcasing your versatility and passion. The art of building side projects lies not just in the final product but in the journey itself — the challenges faced, the solutions devised, and the personal growth experienced. It becomes a reflection of your evolving skill set and a testament to your commitment to pushing boundaries.
      
    As you embark on the path of building side projects, remember that there are no strict rules. It's about embracing the freedom to experiment, learning from both successes and failures, and enjoying the process of creation. These projects not only make you a better professional but also nurture the artist within, allowing you to leave your unique mark on the vast canvas of the digital landscape.`,
  };

  const generateID = () =>{
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let randomId = '';
    
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
      }
    
      return randomId;
  }

  const updateContent = (e) => {
    console.log(e.target.value);
    setUpdatedContent(e.target.value);
  };

  const handleDiscardChanges = () =>{
    setUpdatedContent("")
  }

  const handleSaveChanges = () =>{
    let blogID = generateID()
    let blogVersion = 0
    let blogInfo = {"blogID": blogID, "blogContent": blogContent, "version": blogVersion}
    console.log(blogInfo)
    localStorage.setItem("blogInfo",blogInfo)
  }

  return (
    <div className="h-screen w-full bg-[#faf7f5] ">
      <div className="flex items-center flex-col flex-grow">
        <div className="flex flex-row">
          <h2 className="text-2xl md:text-4xl font-semibold my-8 text-black text-center md:mx-auto">
            {blogContent.heading}
          </h2>
        </div>

        <div className="w-full h-full md:w-2/3 mx-auto text-black">
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
        </div>
        {updatedContent.length > 0 ? (
          <div className="flex space-x-3 my-4">
            <button onClick={() => handleDiscardChanges()} className="border border-blue-600 text-blue-600 rounded-lg py-2 px-4">
              Discard 
            </button>
            <button onClick = {() => handleSaveChanges()} className="border bg-blue-600 text-white rounded-lg py-2 px-4">
              Save
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
