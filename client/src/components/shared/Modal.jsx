import { useEffect } from 'react'

const Modal = ({ open, onClose, title, children, maxWidth=520 }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:1000,
      background:'rgba(0,0,0,.5)',backdropFilter:'blur(4px)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:16
    }} onClick={onClose}>
      <div style={{
        background:'#fff',borderRadius:20,padding:32,width:'100%',maxWidth,
        boxShadow:'0 24px 60px rgba(0,0,0,.2)',animation:'modalIn .2s ease',maxHeight:'90vh',overflowY:'auto'
      }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif",fontSize:'1.25rem',fontWeight:700,color:'#1F2937' }}>{title}</h2>
          <button onClick={onClose} style={{ 
            width:32,height:32,borderRadius:'50%',background:'#f3f4f6',border:'none',
            cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'1.1rem',color:'#6b7280',fontWeight:700
          }}>✕</button>
        </div>
        {children}
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

export default Modal
