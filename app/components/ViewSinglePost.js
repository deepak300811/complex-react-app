import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { useParams, Link, withRouter } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
  const appState = useContext(StateContext)
  const appDisptch = useContext(DispatchContext)
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { id } = useParams()
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        .then(response => {
          console.log("SinglePost=", response.data)
          setPost(response.data)
          setIsLoading(false)
        })
        .catch(error => {
          console.log("error=", error)
        })
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title={"..."}>
        <LoadingDotsIcon />
      </Page>
    )
  const date = new Date(post.createdDate)
  const formatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username
    } else {
      return false
    }
  }

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      await Axios.delete(`/post/${id}`, {
        data: { token: appState.user.token }
      })
        .then(response => {
          if (response.data === "Success") {
            appDisptch({
              type: "FLASH_MESSAGES",
              value: "Post deleted Successfully!"
            })
            props.history.push(`/profile/${appState.user.username}`)
          }
        })
        .catch(error => {
          console.log("error while deleting=", error)
        })
    }
  }
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              className="delete-post-button text-danger"
              data-tip="Delete"
              data-for="delete"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {formatted}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)
