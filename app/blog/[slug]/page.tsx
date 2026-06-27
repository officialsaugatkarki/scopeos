'use client';

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ArrowLeft } from 'lucide-react'
import { blogPosts } from '@/lib/blog'

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="w-full landing-page pt-32">
      <Header />
      
      <article className="max-w-3xl mx-auto px-6 mb-24 relative z-10">
        
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="mb-12">
          <div className="text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-4">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.2]">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/60 text-sm border-b border-white/10 pb-8">
            <span className="font-medium text-white">{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>

        <div 
          className="max-w-none text-white/70 text-lg leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content) }}
        />
        
      </article>
      
      <Footer />
    </main>
  )
}

// Simple markdown formatter since we don't have a library installed
function formatMarkdown(content: string) {
  let html = content;
  // Headers
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\d+\.\s(.*$)/gim, '<ol class="list-decimal pl-5 mb-6"><li class="mb-2 text-white/70">$1</li></ol>');
  
  // Paragraphs
  html = html.replace(/^(?!<h|<ol)(.*$)/gim, '<p class="mb-6">$1</p>');
  
  return html;
}
