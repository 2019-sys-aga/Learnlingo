import React from 'react'

export default function JungleBackground() {
  return (
    <div className="fixed inset-0 jungle-gradient overflow-hidden pointer-events-none">
      {/* Large leaves */}
      <div className="absolute -top-20 -left-20 w-96 h-96 opacity-20">
        <svg viewBox="0 0 400 400" className="w-full h-full text-leaf-300">
          <path
            d="M200 50 C 100 50, 50 150, 100 250 C 150 300, 250 300, 300 250 C 350 150, 300 50, 200 50 Z"
            fill="currentColor"
            className="animate-pulse-slow"
          />
        </svg>
      </div>
      
      <div className="absolute -top-10 -right-10 w-80 h-80 opacity-25">
        <svg viewBox="0 0 400 400" className="w-full h-full text-leaf-400">
          <path
            d="M200 80 C 120 80, 80 160, 120 240 C 160 280, 240 280, 280 240 C 320 160, 280 80, 200 80 Z"
            fill="currentColor"
            className="animate-float"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>

      {/* Medium leaves */}
      <div className="absolute top-1/4 left-10 w-32 h-32 opacity-15">
        <svg viewBox="0 0 200 200" className="w-full h-full text-leaf-200">
          <path
            d="M100 20 C 50 20, 20 70, 50 120 C 70 140, 130 140, 150 120 C 180 70, 150 20, 100 20 Z"
            fill="currentColor"
            className="animate-float"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>

      <div className="absolute top-1/3 right-20 w-24 h-24 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full text-leaf-300">
          <path
            d="M100 30 C 60 30, 30 80, 60 130 C 80 150, 120 150, 140 130 C 170 80, 140 30, 100 30 Z"
            fill="currentColor"
            className="animate-float"
            style={{ animationDelay: '3s' }}
          />
        </svg>
      </div>

      {/* Small decorative elements */}
      <div className="absolute bottom-1/4 left-1/4 w-16 h-16 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-leaf-400">
          <circle cx="50" cy="50" r="40" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="absolute bottom-1/3 right-1/3 w-12 h-12 opacity-15">
        <svg viewBox="0 0 100 100" className="w-full h-full text-leaf-300">
          <path
            d="M50 10 C 30 10, 10 30, 10 50 C 10 70, 30 90, 50 90 C 70 90, 90 70, 90 50 C 90 30, 70 10, 50 10 Z"
            fill="currentColor"
            className="animate-pulse-slow"
          />
        </svg>
      </div>

      {/* Bottom jungle elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-30">
        <svg viewBox="0 0 1200 200" className="w-full h-full text-jungle-800">
          <path
            d="M0,150 Q 100,100 200,120 T 400,110 T 600,130 T 800,100 T 1000,120 T 1200,110 L 1200,200 L 0,200 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  )
}