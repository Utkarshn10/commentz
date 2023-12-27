export function CommentCard({ commentData }) {
    return (
      <div className="bg-white w-full text-black">
        <p className="p-2">{commentData.blogText}</p>
        <span type="text" className="p-2 border border-gray-400 rounded-sm m-2">
          {commentData.commentDesc}
        </span>
      </div>
    );
  }