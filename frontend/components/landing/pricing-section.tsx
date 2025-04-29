"use client"

import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-400/5 dark:bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-400/5 dark:bg-violet-600/5 rounded-full blur-3xl" />
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
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tighter"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-[700px] mx-auto"
          >
            Choose the plan that's right for you, from free to premium.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-muted/50 p-1 rounded-full flex items-center mt-6"
          >
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly <span className="text-xs text-purple-600 dark:text-purple-400">Save 20%</span>
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            title="Free"
            price={billingCycle === "monthly" ? "$0" : "$0"}
            description="Perfect for personal use and trying out the platform."
            features={["Up to 50 links", "Basic analytics", "Default domain only", "7-day link history"]}
            buttonText="Get Started"
            buttonVariant="outline"
          />
          <PricingCard
            title="Pro"
            price={billingCycle === "monthly" ? "$12" : "$115"}
            description="For professionals who need more power and customization."
            features={[
              "Unlimited links",
              "Advanced analytics",
              "1 custom domain",
              "Password protection",
              "30-day link history",
              "API access",
            ]}
            buttonText="Start Free Trial"
            buttonVariant="default"
            popular
          />
          <PricingCard
            title="Business"
            price={billingCycle === "monthly" ? "$29" : "$278"}
            description="For teams and businesses with advanced needs."
            features={[
              "Unlimited links",
              "Comprehensive analytics",
              "5 custom domains",
              "Team management",
              "Password protection",
              "Unlimited link history",
              "Priority support",
              "Advanced API access",
            ]}
            buttonText="Contact Sales"
            buttonVariant="outline"
          />
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  buttonVariant = "default",
  popular = false,
}: {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant?: "default" | "outline"
  popular?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`relative bg-background rounded-xl border p-6 shadow-sm flex flex-col ${
        popular ? "border-purple-500 shadow-lg shadow-purple-500/10" : ""
      }`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-medium px-4 py-1 rounded-full flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1">/month</span>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-3 mb-6 flex-1">
        {features.map((feature, i) => (
          <motion.li
            key={i}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
            viewport={{ once: true }}
          >
            <div className="mr-2 h-5 w-5 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
            </div>
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
      <Button
        variant={buttonVariant}
        className={`w-full mt-auto ${
          buttonVariant === "default"
            ? "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            : ""
        }`}
      >
        {buttonText}
      </Button>
    </motion.div>
  )
}
