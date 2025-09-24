import React from 'react'

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-gray-800">
      {/* Barrel Wood Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(/barrel-bg.jpeg)'
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Community</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-[#FFE500] transition-colors duration-200">
                Farcaster
              </a>
              <a href="#" className="block text-gray-400 hover:text-[#FFE500] transition-colors duration-200">
                X
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Docs</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-[#FFE500] transition-colors duration-200">
                Getting Started
              </a>
              <a href="#" className="block text-gray-400 hover:text-[#FFE500] transition-colors duration-200">
                API Reference
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-[#FFE500] transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="block text-gray-400 hover:text-[#FFE500] transition-colors duration-200">
                Privacy Policy
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Partners</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-[#FFE500] transition-colors duration-200">
                Base Network
              </a>
              <a href="#" className="block text-gray-400 hover:text-[#FFE500] transition-colors duration-200">
                Ecosystem
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img
                src="/wtf-logo-trans.png"
                alt="WTF Logo"
                className="w-6 h-6 opacity-90"
              />
              <span className="text-gray-300 text-sm">
                © 2024 What The Firkin. All rights reserved.
              </span>
            </div>
            <div className="text-gray-400 text-xs">
              Built on <span className="text-blue-400 font-medium">Base</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}