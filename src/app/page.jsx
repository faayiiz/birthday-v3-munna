"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import LoaderScreen from "@/components/screens/LoaderScreen"
import IntroScreen from "@/components/screens/IntroScreen"
import CakeScreen from "@/components/screens/CakeScreen"
import PhotosScreen from "@/components/screens/PhotosScreen"
import MessageScreen from "@/components/screens/MessageScreen"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [started, setStarted] = useState(false) // whether audio has been started (for mobile)
  const audioRef = useRef(null)

  const screens = [
    <LoaderScreen key="loader" onDone={() => setCurrentScreen(1)} />,
    <IntroScreen key="intro" onNext={() => setCurrentScreen(2)} />,
    <CakeScreen key="cake" onNext={() => setCurrentScreen(3)} />,
    <PhotosScreen key="photos" onNext={() => setCurrentScreen(4)} />,
    <MessageScreen key="message" onNext={() => setCurrentScreen(5)} />,
  ]

  // Try to autoplay on mount (desktop browsers may allow it)
  useEffect(() => {
    if (!audioRef.current) return
    const tryPlay = async () => {
      try {
        // attempt to play; if blocked, we'll show the tap overlay
        await audioRef.current.play()
        setStarted(true)
      } catch (err) {
        // autoplay blocked — user must tap
        setStarted(false)
      }
    }
    tryPlay()
    // no cleanup needed for audio
  }, [])

  const handleStart = async () => {
    if (!audioRef.current) return
    try {
      await audioRef.current.play()
      setStarted(true)
    } catch (err) {
      console.warn("Play blocked:", err)
      setStarted(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-rose-950/40 via-black to-rose-950/40 overflow-hidden relative">
      {/* Background audio (hidden). File path: /public/audio/birthday.mp3 */}
      <audio
        ref={audioRef}
        id="bgm-audio"
        src="/audio/birthday.mp3"
        loop
        // muted initially prevents immediate loud autoplay; we immediately try to play unmuted, so keep muted false.
        style={{ display: "none" }}
        preload="auto"
      />

      {/* Tap-to-start overlay (shows only when audio hasn't started) */}
      {!started && (
        <div
          onClick={handleStart}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
        >
          <button
            className="px-6 py-3 rounded-full bg-white text-black text-lg font-semibold shadow-lg"
            onClick={(e) => {
              e.stopPropagation() // avoid double handling
              handleStart()
            }}
          >
            Tap to Start 🎵
          </button>
        </div>
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8 }}
            className={`w-full ${currentScreen === 4 ? "max-w-7xl" : "max-w-3xl md:max-w-4xl"}`}
          >
            {screens[currentScreen]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
        }}
        className="fixed bottom-4 right-4 text-sm text-white/40 pointer-events-none z-50 font-light"
      >
        @faay.iiz
      </motion.div>
    </main>
  )
}
