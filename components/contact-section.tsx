'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const socialLinks = [
  {
    label: 'GitHub',
    url: 'https://github.com/rakibulhasan',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/rakibul-hasan-514649130/',
  },
  {
    label: 'Download Resume',
    url: '/resume.pdf',
    download: true,
  },
]

export function ContactSection() {
  const ref = useRef(null)
  const ghostRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  const { scrollYProgress } = useScroll({
    target: ghostRef,
    offset: ['start end', 'end start'],
  })
  const ghostY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          message: data.message,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 border-b border-stroke"
    >
      {/* Left — Headline + Links */}
      <div className="px-6 lg:px-14 py-12 lg:py-20 bg-paper2 border-b lg:border-b-0 lg:border-r border-stroke">
        <motion.span
          ref={ghostRef}
          style={{ y: ghostY }}
          className="font-serif text-[80px] lg:text-[120px] font-black text-stroke leading-none mb-[-20px] block will-change-transform"
        >
          06
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-[clamp(36px,5vw,60px)] font-black leading-[0.95] tracking-tighter mb-4"
        >
          Let&apos;s build
          <br />
          <span className="text-accent">something</span>
          <br />
          great.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[14px] text-muted font-light leading-relaxed mb-9 max-w-[320px]"
        >
          Open to senior frontend roles and select consulting engagements.
          Based in Dhaka&mdash;available globally.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          href="mailto:rakib251193@gmail.com"
          className="font-mono text-[13px] text-accent tracking-[0.04em] block mb-8 hover:opacity-70 transition-opacity"
        >
          rakib251193@gmail.com
        </motion.a>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.download ? undefined : '_blank'}
              rel={link.download ? undefined : 'noopener noreferrer'}
              download={link.download ? 'Rakibul_Hasan_Resume.pdf' : undefined}
              className="group flex justify-between items-center py-5 border-b border-stroke first:border-t cursor-pointer"
            >
              <span className="font-mono text-[12px] tracking-[0.1em] uppercase group-hover:text-accent transition-colors">
                {link.label}
              </span>
              <span className="text-[16px] text-faint group-hover:text-accent group-hover:translate-x-[5px] group-hover:-translate-y-[5px] transition-all inline-block">
                &#8599;
              </span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="px-6 lg:px-14 py-12 lg:py-20 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-8">
            Send a message
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="font-mono text-[10px] text-muted tracking-[0.12em] uppercase block mb-2">
                Name *
              </label>
              <input
                {...register('name')}
                className={`w-full px-4 py-3 bg-transparent border text-ink font-sans placeholder:text-faint focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-accent bg-accent/5'
                    : 'border-stroke focus:border-accent'
                }`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-[12px] text-accent font-mono">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-mono text-[10px] text-muted tracking-[0.12em] uppercase block mb-2">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className={`w-full px-4 py-3 bg-transparent border text-ink font-sans placeholder:text-faint focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-accent bg-accent/5'
                    : 'border-stroke focus:border-accent'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-[12px] text-accent font-mono">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-mono text-[10px] text-muted tracking-[0.12em] uppercase block mb-2">
                Phone{' '}
                <span className="text-faint normal-case">(optional)</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 bg-transparent border border-stroke text-ink font-sans placeholder:text-faint focus:border-accent focus:outline-none transition-colors"
                placeholder="+880 1234567890"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-muted tracking-[0.12em] uppercase block mb-2">
                Message *
              </label>
              <textarea
                {...register('message')}
                rows={5}
                className={`w-full px-4 py-3 bg-transparent border text-ink font-sans placeholder:text-faint focus:outline-none transition-colors resize-none ${
                  errors.message
                    ? 'border-accent bg-accent/5'
                    : 'border-stroke focus:border-accent'
                }`}
                placeholder="Tell me about your project..."
              />
              {errors.message && (
                <p className="mt-1 text-[12px] text-accent font-mono">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-mono text-[11px] tracking-[0.07em] uppercase bg-ink text-paper py-4 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : submitStatus === 'success' ? (
                'Message Sent!'
              ) : (
                'Send Message \u2192'
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="p-4 border border-stroke bg-paper2">
                <p className="text-[13px] text-muted font-mono">
                  Thanks for reaching out! I&apos;ll get back to you soon.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 border border-accent/30 bg-accent/5">
                <p className="text-[13px] text-accent font-mono">
                  Something went wrong. Please try again or email me directly.
                </p>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
