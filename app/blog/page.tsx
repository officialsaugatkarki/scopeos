'use client';

import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { blogPosts } from '@/lib/blog'

export default function BlogPage() {
  return (
    <main className="w-full landing-page pt-32">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 mb-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            The ScopeOS Blog
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Insights on agency operations, managing scope creep, and leveraging AI to protect your profit margins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col p-6 rounded-[2rem] transition-transform duration-300 hover:-translate-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-4">
                {post.category}
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-white text-xs font-medium">{post.author}</span>
                  <span className="text-white/40 text-[10px]">{post.date}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all">
                  <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-blue-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
