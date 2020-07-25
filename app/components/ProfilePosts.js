import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Post from "./Post"
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
  }, [username])
  if (isLoading) {
    return <LoadingDotsIcon />
  }

  return (
    <div className="list-group">
      {posts.map(post => (
        <Post post={post} key={post._id} noAuthor />
      ))}
    </div>
  )
}

export default ProfilePosts
