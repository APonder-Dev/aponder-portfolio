'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Music, Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, X,
} from 'lucide-react'

interface Track {
  id:     number
  title:  string
  artist: string
  url:    string
}

const STORAGE_KEY = 'music-widget'

interface Prefs {
  volume:  number
  muted:   boolean
  open:    boolean
  trackId: number | null
  paused:  boolean
}

const DEFAULT_PREFS: Prefs = { volume: 0.05, muted: false, open: false, trackId: null, paused: false }

function loadPrefs(defaultVolume: number): Prefs {
  const base = { ...DEFAULT_PREFS, volume: defaultVolume }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    return { ...base, ...(JSON.parse(raw) as Partial<Prefs>) }
  } catch {
    return base
  }
}

function fmtTime(s: number) {
  if (!isFinite(s) || s < 0) return '0:00'
  const m   = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function MusicWidget() {
  const pathname = usePathname()
  const [tracks,   setTracks]   = useState<Track[]>([])
  const [index,    setIndex]    = useState(0)
  const [playing,  setPlaying]  = useState(false)
  const [volume,   setVolume]   = useState(DEFAULT_PREFS.volume)
  const [muted,    setMuted]    = useState(DEFAULT_PREFS.muted)
  const [open,     setOpen]     = useState(DEFAULT_PREFS.open)
  const [ready,    setReady]    = useState(false)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [autoplayOn, setAutoplayOn] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Load tracks, admin settings, and saved per-visitor prefs once.
  useEffect(() => {
    let cancelled = false
    fetch('/api/music')
      .then(res => res.json())
      .then((data: { enabled?: boolean; autoplay?: boolean; defaultVolume?: number; tracks?: Track[] }) => {
        if (cancelled || !data || data.enabled === false || !Array.isArray(data.tracks)) return
        setTracks(data.tracks)
        setAutoplayOn(data.autoplay !== false)
        const prefs = loadPrefs(typeof data.defaultVolume === 'number' ? data.defaultVolume : DEFAULT_PREFS.volume)
        setVolume(prefs.volume)
        setMuted(prefs.muted)
        setOpen(prefs.open)
        setUserPaused(prefs.paused)
        const saved = data.tracks.findIndex(t => t.id === prefs.trackId)
        if (saved >= 0) setIndex(saved)
        setReady(true)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // Persist prefs whenever they change.
  useEffect(() => {
    if (!ready) return
    const prefs: Prefs = { volume, muted, open, trackId: tracks[index]?.id ?? null, paused: userPaused }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)) } catch {}
  }, [ready, volume, muted, open, index, tracks, userPaused])

  // Keep the audio element in sync with volume/mute.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted  = muted
  }, [volume, muted, tracks.length])

  const play = useCallback(() => {
    setUserPaused(false)
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [])

  const pause = useCallback(() => {
    setUserPaused(true)
    audioRef.current?.pause()
    setPlaying(false)
  }, [])

  // Autoplay once tracks are loaded, unless this visitor previously paused.
  // Browsers block audio before the first user gesture, so if the immediate
  // attempt is rejected, start on the visitor's first click/keypress instead.
  useEffect(() => {
    if (!ready || !autoplayOn || userPaused || tracks.length === 0) return

    let disposed = false
    const tryPlay = () => {
      audioRef.current?.play()
        .then(() => { if (!disposed) setPlaying(true); cleanup() })
        .catch(() => {})
    }
    const onGesture = () => tryPlay()
    const cleanup = () => {
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('keydown', onGesture)
    }

    window.addEventListener('pointerdown', onGesture)
    window.addEventListener('keydown', onGesture)
    tryPlay()

    return () => { disposed = true; cleanup() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const skip = useCallback((dir: -1 | 1) => {
    if (tracks.length === 0) return
    setIndex(prev => (prev + dir + tracks.length) % tracks.length)
  }, [tracks.length])

  // When the track changes, reset progress and keep playing if we were playing.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrent(0)
    setDuration(0)
    audio.load()
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio || !isFinite(audio.duration)) return
    audio.currentTime = value
    setCurrent(value)
  }

  // Hide on admin pages and when there's nothing to play.
  if (pathname.startsWith('/admin') || tracks.length === 0) return null

  const track = tracks[index]

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

  return (
    <>
      <audio
        ref={audioRef}
        src={track.url}
        preload="none"
        onEnded={() => skip(1)}
        onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onDurationChange={e => setDuration(e.currentTarget.duration)}
      />

      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10, transition: { duration: 0.12 } }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-[calc(100vw-3rem)] max-w-[19rem] rounded-2xl bg-dark-800/95 backdrop-blur-md border border-white/[0.08] shadow-2xl p-4"
              role="region"
              aria-label="Music player"
            >
              {/* Track info + minimize */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(59,130,246,0.35)]">
                    <Music size={15} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate" title={track.title}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {track.artist || `Track ${index + 1} of ${tracks.length}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className={`p-2 -mr-2 -mt-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer ${focusRing}`}
                  aria-label="Minimize player"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Seek bar */}
              <div className="mb-3">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(current, duration || 0)}
                  onChange={e => seek(parseFloat(e.target.value))}
                  disabled={!duration}
                  className={`mw-range w-full ${focusRing}`}
                  style={{ ['--mw-fill' as string]: `${duration ? (current / duration) * 100 : 0}%` }}
                  aria-label="Seek"
                />
                <div className="flex justify-between mt-1 text-[10px] font-mono text-slate-500 tabular-nums select-none">
                  <span>{fmtTime(current)}</span>
                  <span>{fmtTime(duration)}</span>
                </div>
              </div>

              {/* Transport controls */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  onClick={() => skip(-1)}
                  className={`w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all active:scale-95 cursor-pointer ${focusRing}`}
                  aria-label="Previous track"
                >
                  <SkipBack size={17} />
                </button>
                <button
                  onClick={playing ? pause : play}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer ${focusRing}`}
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                <button
                  onClick={() => skip(1)}
                  className={`w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all active:scale-95 cursor-pointer ${focusRing}`}
                  aria-label="Next track"
                >
                  <SkipForward size={17} />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted(m => !m)}
                  className={`w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors flex-shrink-0 cursor-pointer ${focusRing}`}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={e => {
                    setVolume(parseFloat(e.target.value))
                    setMuted(false)
                  }}
                  className={`mw-range flex-1 ${focusRing}`}
                  style={{ ['--mw-fill' as string]: `${(muted ? 0 : volume) * 100}%` }}
                  aria-label="Volume"
                />
                <span className="text-[10px] font-mono text-slate-500 tabular-nums w-8 text-right flex-shrink-0 select-none">
                  {Math.round((muted ? 0 : volume) * 100)}%
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="bubble"
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8, transition: { duration: 0.12 } }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={() => setOpen(true)}
              className={`relative w-12 h-12 flex items-center justify-center rounded-xl bg-dark-800/90 backdrop-blur-sm border border-white/[0.08] hover:border-blue-500/30 hover:bg-blue-500/[0.08] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-200 shadow-xl active:scale-95 cursor-pointer ${focusRing} ${
                playing ? 'text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Open music player"
            >
              <Music size={17} className={playing ? 'animate-pulse motion-reduce:animate-none' : ''} />
              {playing && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse motion-reduce:animate-none" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
