'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const blogPosts = [
  {
    category: 'Guides',
    title: 'How to prevent scope creep in your agency',
    description: 'A step-by-step framework for detecting, managing, and preventing scope creep before it erodes your margins.',
    date: 'Jul 7, 2025',
    readTime: '8 min read',
    image: 'bg-gradient-to-br from-[#3B82F6]/10 to-[#0C1425]/5',
  },
  {
    category: 'Case Studies',
    title: 'How Pixel & Frame recovered $47K in one month',
    description: 'This 12-person agency was losing revenue to undocumented scope changes. Here\'s how they fixed it.',
    date: 'Jul 2, 2025',
    readTime: '7 min read',
    image: 'bg-gradient-to-br from-[#0C1425]/5 to-[#3B82F6]/10',
  },
  {
    category: 'Guides',
    title: 'The change request template every agency needs',
    description: 'Stop doing free work. Use this proven template to formalize scope changes and protect your team.',
    date: 'Jul 1, 2025',
    readTime: '5 min read',
    image: 'bg-gradient-to-br from-[#6FCF76]/5 to-[#3B82F6]/10',
  },
]

const blogTabs = ['All', 'Guides', 'Case Studies']

export default function CtaSection() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <section className="py-28 px-6 relative z-10 bg-white">
      <div className="max-w-[1760px] mx-auto">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-[rgba(12,20,37,0.35)] text-xs font-semibold tracking-widest uppercase block mb-3">BLOG</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C1425] tracking-tight">
              From the blog
            </h2>
          </div>
          <a href="/blog" className="text-[rgba(12,20,37,0.4)] text-sm hover:text-[#3B82F6] transition-colors flex items-center gap-1.5 group">
            View all posts <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-12 mt-6">
          {blogTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[rgba(59,130,246,0.12)] text-[#2563EB] border border-[rgba(59,130,246,0.2)]'
                  : 'text-[rgba(12,20,37,0.4)] hover:text-[rgba(12,20,37,0.7)] hover:bg-[rgba(12,20,37,0.03)] border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <a
              key={i}
              href="/blog"
              className="group block bg-[#F5F3EE] border border-[rgba(12,20,37,0.06)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[rgba(59,130,246,0.2)] hover:shadow-[0_2px_8px_rgba(12,20,37,0.04),0_8px_32px_rgba(12,20,37,0.06)]"
            >
              {/* Card top accent */}
              <div className={`h-1.5 ${post.image}`} />
              
              <div className="p-6">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[rgba(59,130,246,0.1)] text-[#2563EB] text-[11px] font-bold mb-4 border border-[rgba(59,130,246,0.12)]">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold text-[#0C1425] mb-3 leading-snug group-hover:text-[#3B82F6] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-[rgba(12,20,37,0.45)] text-sm leading-relaxed mb-6">
                  {post.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[rgba(12,20,37,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[rgba(12,20,37,0.3)] text-xs">{post.date}</span>
                    <span className="text-[rgba(12,20,37,0.15)]">·</span>
                    <span className="text-[rgba(12,20,37,0.3)] text-xs">{post.readTime}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[rgba(12,20,37,0.15)] group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
