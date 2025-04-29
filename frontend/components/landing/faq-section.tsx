"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

export function FAQSection() {
  const faqs = [
    {
      question: "What is a URL shortener?",
      answer:
        "A URL shortener is a tool that converts long URLs into shorter, more manageable links. These shortened links redirect to the original URL when accessed, making them easier to share, especially on platforms with character limits.",
    },
    {
      question: "Are shortened links permanent?",
      answer:
        "Yes, our shortened links are permanent by default. However, you can set an expiration date for links if you need them to be temporary. On our free plan, links are stored for 7 days, while paid plans offer longer or unlimited retention.",
    },
    {
      question: "How do I track clicks on my links?",
      answer:
        "Every shortened link comes with analytics that track clicks, geographic location, devices, browsers, and referrers. You can access these analytics from your dashboard by clicking on any link in your list.",
    },
    {
      question: "Can I use my own domain for shortened links?",
      answer:
        "Yes, on our paid plans you can use your own custom domain for shortened links. This helps with brand recognition and trust. You'll need to verify ownership of the domain by adding a TXT record to your DNS settings.",
    },
    {
      question: "Is there an API available?",
      answer:
        "Yes, we offer a RESTful API that allows you to create, manage, and retrieve analytics for your shortened links programmatically. API access is available on our Pro and Business plans.",
    },
    {
      question: "How secure are the shortened links?",
      answer:
        "Our platform uses HTTPS for all links and offers additional security features like password protection for links. We also scan destination URLs for malware and phishing to protect your users.",
    },
    {
      question: "Can I customize the shortened URLs?",
      answer:
        "Yes, you can create custom slugs for your shortened URLs to make them more memorable and on-brand. For example, instead of link.ly/a1b2c3, you could have link.ly/summer-sale.",
    },
    {
      question: "Do you offer bulk link creation?",
      answer:
        "Yes, our Pro and Business plans support bulk link creation through our web interface or API. This is perfect for marketing campaigns or when migrating from another service.",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-400/5 dark:bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-400/5 dark:bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm text-purple-800 dark:text-purple-300"
          >
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tighter"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-[700px] mx-auto"
          >
            Find answers to common questions about our URL shortener.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <AccordionItem value={`item-${index}`} className="border-b border-purple-100 dark:border-purple-900/30">
                  <AccordionTrigger className="hover:text-purple-600 dark:hover:text-purple-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
