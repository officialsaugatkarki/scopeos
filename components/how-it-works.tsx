'use client'

import { ArrowRight } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  const steps = [
    { number: '1', title: 'Upload Scope Doc', description: 'Define your baseline scope and rates' },
    { number: '2', title: 'Share Client Portal', description: 'Give clients an easy way to submit requests' },
    { number: '3', title: 'AI Analyzes Requests', description: 'Get instant scope determination' },
    { number: '4', title: 'Approve & Send', description: 'Review and send change requests' },
  ]

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
            Four simple steps to eliminate scope creep and protect your margins
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-4 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step Circle */}
                  <div
                    className={`w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 transition-all duration-500 ${
                      isVisible ? 'scale-100' : 'scale-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {step.number}
                  </div>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-8 left-[60%] right-0 h-1 bg-gradient-to-r from-primary to-primary/30 transition-all duration-700 ${
                        isVisible ? 'w-full' : 'w-0'
                      }`}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="grid grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-foreground/70">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex gap-4 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-1 h-12 bg-primary/30 mt-2"></div>
                  )}
                </div>
                <div className="pb-6 pt-1">
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-foreground/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
