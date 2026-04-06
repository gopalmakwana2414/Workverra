const Skeleton = ({ width='100%', height=20, radius=8, style={} }) => (
  <div style={{
    width, height, borderRadius:radius,
    background:'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
    backgroundSize:'200% 100%',
    animation:'shimmer 1.4s infinite',
    ...style
  }} />
)

export const SkeletonCard = () => (
  <div style={{ background:'#fff',borderRadius:16,padding:24,boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
    <div style={{ display:'flex',gap:16,marginBottom:16 }}>
      <Skeleton width={56} height={56} radius={28} />
      <div style={{ flex:1 }}>
        <Skeleton height={18} style={{ marginBottom:8 }} />
        <Skeleton width='60%' height={14} />
      </div>
    </div>
    <Skeleton height={14} style={{ marginBottom:8 }} />
    <Skeleton height={14} width='80%' style={{ marginBottom:16 }} />
    <Skeleton height={40} radius={8} />
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
)

export default Skeleton
