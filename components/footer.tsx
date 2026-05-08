import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="ScopeGuard" width={32} height={32} className="rounded-lg" />
              <span className="font-semibold text-white/90 text-sm">ScopeGuard</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">
              AI-powered scope management for dev agencies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white/80 text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Changelog</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white/80 text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white/80 text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.06] pt-6 text-center">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} ScopeGuard AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
