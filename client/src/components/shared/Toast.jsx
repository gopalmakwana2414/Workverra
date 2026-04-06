import { useState, useEffect, useCallback } from 'react'

let _setToasts = null

export const toast = {
  success: (msg) => _setToasts?.((t) => [...t, { id: Date.now(), type:'success', msg }]),
  error:   (msg) => _setToasts?.((t) => [...t, { id: Date.now(), type:'error',   msg }]),
  info:    (msg) => _setToasts?.((t) => [...t, { id: Date.now(), type:'info',    msg }]),
}

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([])
  _setToasts = setToasts

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), [])

  useEffect(() => {
    if (!toasts.length) return
    const timer = setTimeout(() => setToasts(t => t.slice(1)), 3500)
    return () => clearTimeout(timer)
  }, [toasts])

  return (
    <div style={{ position:'fixed',top:20,right:20,zIndex:9999,display:'flex',flexDirection:'column',gap:10 }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => remove(t.id)} style={{
          background: t.type==='success'?'#065F46':t.type==='error'?'#991B1B':'#1e3a5f',
          color:'#fff', padding:'12px 18px', borderRadius:10, fontSize:'0.875rem',
          fontFamily:"'DM Sans',sans-serif", fontWeight:500, boxShadow:'0 4px 20px rgba(0,0,0,.2)',
          cursor:'pointer', minWidth:260, maxWidth:360, lineHeight:1.5,
          animation:'slideIn .25s ease',
          display:'flex', gap:8, alignItems:'flex-start'
        }}>
          <span>{t.type==='success'?'✓':t.type==='error'?'✕':'ℹ'}</span>
          {t.msg}
        </div>
      ))}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
