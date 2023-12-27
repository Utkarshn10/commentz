export function CommentCard({ key, commentsInfo, commentData }) {
  console.log(commentsInfo)
  const handleDelete = () => {};

  return (
    <div className="bg-white w-full text-black">
      <div className="flex flex-col">
        <p className="p-2">{commentData.blogText}</p>
        <span type="text" className="p-2 border border-gray-400 rounded-sm m-2">
          {commentData.commentDesc}
        </span>
      </div>
      {/* <div className="flex justify-end m-2 ">
        <button
          onClick={() => handleDelete()}
          className="flex items-center  border bg-blue-600 text-white rounded-lg py-1 px-2"
        >
          Delete
        </button>
      </div> */}
    </div>
  );
}
