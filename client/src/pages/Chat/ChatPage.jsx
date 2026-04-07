import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import { io } from 'socket.io-client'
import styles from './ChatPage.module.css'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

const ChatPage = () => {
  const { userId: paramUserId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv]       = useState(null)
  const [messages, setMessages]           = useState([])
  const [input, setInput]                 = useState('')
  const [loading, setLoading]             = useState(true)
  const [sending, setSending]             = useState(false)
  const [typing, setTyping]               = useState(false)
  const [onlineUsers, setOnlineUsers]     = useState([])
  const [searchQuery, setSearchQuery]     = useState('')

  const socketRef  = useRef(null)
  const bottomRef  = useRef(null)
  const typingTimer = useRef(null)

  // ── Connect Socket.io ────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('sb_token')
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      socket.emit('join', user._id)
    })

    socket.on('new_message', (msg) => {
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev
        return [...prev, msg]
      })
      setConversations(prev => prev.map(c =>
        c.userId === msg.senderId || c.userId === msg.receiverId
          ? { ...c, lastMessage: msg.text, lastTime: msg.createdAt, unread: c.userId === msg.senderId ? (c.unread || 0) + 1 : c.unread }
          : c
      ))
    })

    socket.on('typing', ({ from }) => {
      if (from === activeConv?.userId) setTyping(true)
    })

    socket.on('stop_typing', ({ from }) => {
      if (from === activeConv?.userId) setTyping(false)
    })

    socket.on('online_users', (users) => setOnlineUsers(users))

    return () => socket.disconnect()
  }, [user._id])

  // ── Load conversations ───────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await API.get('/chat/conversations')
        setConversations(res.data || [])
        if (paramUserId) {
          const found = res.data?.find(c => c.userId === paramUserId)
          if (found) openConversation(found)
          else {
            // Start new conversation
            try {
              const uRes = await API.get(`/workers/${paramUserId}`)
              const newConv = {
                userId: paramUserId,
                name: uRes.data.name,
                role: uRes.data.role,
                avatar: uRes.data.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
              }
              setConversations(prev => [newConv, ...prev])
              setActiveConv(newConv)
              setMessages([])
            } catch (_) {}
          }
        }
      } catch (_) {
        setConversations([])
      }
      setLoading(false)
    }
    load()
  }, [paramUserId])

  // ── Load messages for active conversation ────────────────
  useEffect(() => {
    if (!activeConv) return
    const load = async () => {
      try {
        const res = await API.get(`/chat/messages/${activeConv.userId}`)
        setMessages(res.data || [])
        // Mark as read
        setConversations(prev => prev.map(c =>
          c.userId === activeConv.userId ? { ...c, unread: 0 } : c
        ))
      } catch (_) {
        setMessages([])
      }
    }
    load()
  }, [activeConv?.userId])

  // ── Auto scroll to bottom ────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openConversation = (conv) => {
    setActiveConv(conv)
    setTyping(false)
  }

  // ── Send message ─────────────────────────────────────────
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || !activeConv || sending) return
    setSending(true)
    const text = input.trim()
    setInput('')

    const optimistic = {
      _id: `temp-${Date.now()}`,
      senderId: user._id,
      receiverId: activeConv.userId,
      text,
      createdAt: new Date().toISOString(),
      pending: true,
    }
    setMessages(prev => [...prev, optimistic])

    try {
      const res = await API.post('/chat/send', {
        receiverId: activeConv.userId,
        text,
      })
      setMessages(prev => prev.map(m =>
        m._id === optimistic._id ? { ...res.data, pending: false } : m
      ))
      setConversations(prev => prev.map(c =>
        c.userId === activeConv.userId
          ? { ...c, lastMessage: text, lastTime: new Date().toISOString() }
          : c
      ))
      socketRef.current?.emit('send_message', res.data)
    } catch (_) {
      setMessages(prev => prev.filter(m => m._id !== optimistic._id))
      setInput(text)
    }
    setSending(false)
  }

  // ── Typing indicator ─────────────────────────────────────
  const handleTyping = (e) => {
    setInput(e.target.value)
    socketRef.current?.emit('typing', { to: activeConv?.userId })
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      socketRef.current?.emit('stop_typing', { to: activeConv?.userId })
    }, 1500)
  }

  const formatTime = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const today = new Date()
    const diff = Math.floor((today - d) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const isOnline = (uid) => onlineUsers.includes(uid)

  const filteredConvs = conversations.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.page}>

      {/* Sidebar: conversations */}
      <div className={`${styles.sidebar} ${activeConv ? styles.sidebarHidden : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Messages</h2>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        </div>
        <div className={styles.searchWrap}>
          <span className={styles.searchIco}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.convList}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.convSkeleton}>
                <div className={styles.skelAvatar} />
                <div className={styles.skelLines}>
                  <div className={styles.skelLine} />
                  <div className={styles.skelLineShort} />
                </div>
              </div>
            ))
          ) : filteredConvs.length === 0 ? (
            <div className={styles.emptyConvs}>
              <div className={styles.emptyIcon}>💬</div>
              <p>No conversations yet</p>
              <span>Book a worker to start chatting</span>
            </div>
          ) : (
            filteredConvs.map(conv => (
              <div
                key={conv.userId}
                className={`${styles.convItem} ${activeConv?.userId === conv.userId ? styles.convActive : ''}`}
                onClick={() => openConversation(conv)}
              >
                <div className={styles.convAvatar}>
                  <span>{conv.avatar || conv.name?.[0] || '?'}</span>
                  {isOnline(conv.userId) && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.convInfo}>
                  <div className={styles.convTop}>
                    <span className={styles.convName}>{conv.name}</span>
                    <span className={styles.convTime}>{conv.lastTime ? formatDate(conv.lastTime) : ''}</span>
                  </div>
                  <div className={styles.convBottom}>
                    <span className={styles.convLast}>{conv.lastMessage || 'Start a conversation'}</span>
                    {conv.unread > 0 && <span className={styles.unreadBadge}>{conv.unread}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat window */}
      <div className={`${styles.chatWin} ${!activeConv ? styles.chatWinEmpty : ''}`}>
        {!activeConv ? (
          <div className={styles.noChat}>
            <div className={styles.noChatIcon}>💬</div>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className={styles.chatHeader}>
              <button className={styles.mobileBack} onClick={() => setActiveConv(null)}>←</button>
              <div className={styles.chatAvatar}>
                <span>{activeConv.avatar || activeConv.name?.[0]}</span>
                {isOnline(activeConv.userId) && <span className={styles.onlineDot} />}
              </div>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatName}>{activeConv.name}</div>
                <div className={styles.chatStatus}>
                  {typing ? (
                    <span className={styles.typingText}>typing...</span>
                  ) : isOnline(activeConv.userId) ? (
                    <span className={styles.onlineText}>● Online</span>
                  ) : (
                    <span className={styles.offlineText}>Offline</span>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {messages.length === 0 ? (
                <div className={styles.noMessages}>
                  <div className={styles.noMsgIcon}>👋</div>
                  <p>Say hello to {activeConv.name}!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.senderId === user._id
                  const prevMsg = messages[idx - 1]
                  const showDate = !prevMsg ||
                    formatDate(msg.createdAt) !== formatDate(prevMsg.createdAt)
                  return (
                    <div key={msg._id}>
                      {showDate && (
                        <div className={styles.dateSep}>
                          <span>{formatDate(msg.createdAt)}</span>
                        </div>
                      )}
                      <div className={`${styles.msgRow} ${isMine ? styles.msgMine : styles.msgTheirs}`}>
                        <div className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleTheirs} ${msg.pending ? styles.bubblePending : ''}`}>
                          <p className={styles.msgText}>{msg.text}</p>
                          <span className={styles.msgTime}>{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              {typing && (
                <div className={`${styles.msgRow} ${styles.msgTheirs}`}>
                  <div className={`${styles.bubble} ${styles.bubbleTheirs}`}>
                    <div className={styles.typingDots}>
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form className={styles.inputRow} onSubmit={sendMessage}>
              <input
                className={styles.msgInput}
                placeholder={`Message ${activeConv.name}...`}
                value={input}
                onChange={handleTyping}
                disabled={sending}
                autoFocus
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!input.trim() || sending}
              >
                {sending ? '...' : '➤'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ChatPage
