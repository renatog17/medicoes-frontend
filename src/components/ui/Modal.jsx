import { useEffect, useRef } from 'react'

export default function Modal({ children, onClose, locked = false, titleId }) {
  const dialog = useRef(null)

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal()
  }, [])

  function handleCancel(event) {
    event.preventDefault()
    if (!locked) onClose()
  }

  return (
    <dialog ref={dialog} onCancel={handleCancel} aria-labelledby={titleId}>
      {children}
    </dialog>
  )
}
