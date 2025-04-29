"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "This URL shortener has transformed how we share links in our marketing campaigns. The analytics are incredibly detailed!",
      name: "Sarah Johnson",
      role: "Marketing Director",
      avatar: "SJ",
      company: "TechGrowth Inc.",
    },
    {
      quote:
        "I love the custom domain feature. It's helped us maintain our brand identity across all our shared links.",
      name: "Michael Chen",
      role: "Brand Manager",
      avatar: "MC",
      company: "Brandify Solutions",
    },
    {
      quote:
        "The dashboard is intuitive and the API is well-documented. As a developer, I appreciate how easy it is to integrate.",
      name: "Alex Rodriguez",
      role: "Software Engineer",
      avatar: "AR",
      company: "DevStack Labs",
    },
    {
      quote:
        "We've seen a 40% increase in click-through rates since we started using branded short links. Game changer!",
      name: "Jessica Williams",
      role: "Social Media Strategist",
      avatar: "JW",
      company: "SocialBoost Media",
    },
    {
      quote:
        "The ability to password protect links has been essential for sharing sensitive documents with clients.",
      name: "David Kim",
      role: "Financial Advisor",
      avatar: "DK",
      company: "Wealth Partners",
    },
    {
      quote:
        "Fast, reliable, and secure. Everything you need in a URL shortener for enterprise use.",
      name: "Emma Thompson",
      role: "CTO",
      avatar: "ET",
      company: "Enterprise Solutions",
    },
  ];

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-purple-400/5 dark:bg-purple-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-violet-400/5 dark:bg-violet-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
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
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tighter"
          >
            Trusted by Thousands
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-[700px] mx-auto"
          >
            See what our customers have to say about our URL shortener.
          </motion.p>
        </div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="bg-background border-purple-200 dark:border-purple-900/30 overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="relative">
                    <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-xl" />
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                      <AvatarImage
                        src={`/placeholder.svg?height=96&width=96&text=${testimonials[activeIndex].avatar}`}
                      />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                        {testimonials[activeIndex].avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <QuoteIcon className="h-10 w-10 text-purple-300 dark:text-purple-700 mb-4" />
                  <p className="text-xl md:text-2xl font-medium mb-6 italic">
                    {testimonials[activeIndex].quote}
                  </p>
                  <div>
                    <p className="font-semibold">
                      {testimonials[activeIndex].name}
                    </p>
                    <p className="text-muted-foreground">
                      {testimonials[activeIndex].role},{" "}
                      {testimonials[activeIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonial navigation */}
        <div className="flex justify-center space-x-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "w-8 bg-purple-500"
                  : "w-2 bg-purple-200 dark:bg-purple-800"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Grid of testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.avatar}
                company={testimonial.company}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  company,
}: {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  company: string;
}) {
  return (
    <Card className="bg-background h-full">
      <CardContent className="p-6">
        <QuoteIcon className="h-8 w-8 text-purple-200 dark:text-purple-800 mb-4" />
        <p className="mb-4 italic line-clamp-4">{quote}</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 border-2 border-purple-100 dark:border-purple-900">
            <AvatarImage
              src={`/placeholder.svg?height=40&width=40&text=${avatar}`}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
              {role}, {company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
