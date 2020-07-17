import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
function ProfilePosts() {
  const [isLoading, setIsloading] = useState(true)
  const [posts, setPosts] = useState([])
  const { username } = useParams()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPosts() {
      await Axios.get(`/profile/${username}/posts`, {
        cancelToken: ourRequest.token
      })
        .then(response => {
          console.log("Posts Response=", response.data)
          setPosts(response.data)
          setIsloading(false)
        })
        .catch(error => {
          console.log("Error Posts list=", error)
        })
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [])
  if (isLoading) {
    return <LoadingDotsIcon />
  }

  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate)
        const formatted = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong>{post.title}</strong>{" "}
            <span className="text-muted small">on {formatted} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePosts
