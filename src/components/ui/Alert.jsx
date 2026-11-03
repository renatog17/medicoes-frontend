export default function Alert({ children, variant = 'error', onDismiss }) {
  if (!children) return null
  return (
    <div className={'alert ' + variant} role={variant === 'error' ? 'alert' : 'status'}>
      {children}
      {onDismiss && (
        <button type="button" className="icon-button" aria-label="Dispensar mensagem" onClick={onDismiss}>×</button>
      )}
    </div>
  )
}
