import React, { useEffect } from "react"
import { Link } from "react-router-dom"
function Post(props) {
  const post = props.post
  const date = new Date(post.createdDate)
  const formatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`
  return (
    <Link
      key={post._id}
      to={`/post/${post._id}`}
      onClick={props.closeSearch}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={post.author.avatar} />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {" "}
        {!props.noAuthor && <>by {post.author.username}</>} on {formatted}{" "}
      </span>
    </Link>
  )
}

export default Post
