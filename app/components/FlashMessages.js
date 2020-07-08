import React, { useContext } from "react"
import { ExampleContext } from "./ExampleContext"

function FlashMessages() {
  const FlashMessages = useContext(ExampleContext).FlashMessage

  return (
    <div className="floating-alerts">
      {FlashMessages.map((msg, index) => {
        return (
          <div
            key={index}
            className="alert alert-success text-center floating-alert shadow-sm"
          >
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default FlashMessages
