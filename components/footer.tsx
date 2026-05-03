import { Twitter, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground/5 border-t border-border/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                SG
              </div>
              <span className="font-semibold text-foreground">ScopeGuard</span>
            </div>
            <p className="text-xs text-foreground/60">
              AI-powered scope protection for dev agencies
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <a href="#" className="hover:text-foreground transition">Features</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">Roadmap</a>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Developers</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <a href="#" className="hover:text-foreground transition">API Docs</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">Integrations</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">Status</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <a href="#" className="hover:text-foreground transition">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">Contact</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <a href="#" className="hover:text-foreground transition">Privacy</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">Terms</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">Cookies</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/60">
              © {currentYear} ScopeGuard AI. Built for dev agencies.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition p-2"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition p-2"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition p-2"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
