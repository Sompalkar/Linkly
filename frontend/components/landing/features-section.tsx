"use client"

import type React from "react"
import { BarChart3, Globe, LinkIcon, Shield, Zap, Smartphone, Target, Users, Layers } from "lucide-react"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <section id="features" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />

      {/* Animated shapes */}
      <motion.div
        className="absolute top-20 right-20 w-20 h-20 bg-purple-500/10 rounded-full"
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute bottom-20 left-20 w-16 h-16 bg-violet-500/10 rounded-full"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block rounded-lg bg-purple-500/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-400"
          >
            Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tighter"
          >
            Everything You Need in a URL Shortener
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-[700px] mx-auto"
          >
            Our platform provides all the tools you need to create, manage, and analyze your short links.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<LinkIcon className="h-10 w-10 text-purple-500" />}
            title="Custom Short Links"
            description="Create memorable, branded short links that reflect your brand and are easy to share."
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10 text-purple-500" />}
            title="Detailed Analytics"
            description="Track clicks, geographic data, referrers, devices, and more with our powerful analytics."
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10 text-purple-500" />}
            title="Custom Domains"
            description="Use your own domain for short links to strengthen your brand identity and trust."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-purple-500" />}
            title="Link Privacy"
            description="Password protect your links or set expiration dates for temporary access."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-purple-500" />}
            title="Fast Redirects"
            description="Our infrastructure ensures lightning-fast redirects for the best user experience."
          />
          <FeatureCard
            icon={<Smartphone className="h-10 w-10 text-purple-500" />}
            title="Mobile Friendly"
            description="Create and manage links on the go with our fully responsive design."
          />
          <FeatureCard
            icon={<Target className="h-10 w-10 text-purple-500" />}
            title="UTM Parameters"
            description="Add UTM parameters to your links for better campaign tracking and analytics."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-purple-500" />}
            title="Team Collaboration"
            description="Invite team members to collaborate on link management and analytics."
          />
          <FeatureCard
            icon={<Layers className="h-10 w-10 text-purple-500" />}
            title="API Access"
            description="Integrate our powerful API into your workflow for automated link creation and management."
          />
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="bg-background rounded-xl border p-6 shadow-sm transition-all hover-card gradient-border"
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    >
      <motion.div
        className="mb-4 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg inline-block"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}
