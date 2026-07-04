'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Bot, Zap, Filter, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [focusedStep, setFocusedStep] = useState(0);

  // Auto-advance carousel - first step lingers 10s, others 7s
  useEffect(() => {
    const delay = focusedStep === 0 ? 10000 : 7000;
    const timeout = setTimeout(() => {
      setFocusedStep((prev) => (prev + 1) % 5);
    }, delay);
    return () => clearTimeout(timeout);
  }, [focusedStep]);

  // Refs for scroll-triggered animations
  const benefitsRef = useRef(null);
  const ctaRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // Steps data for "How It Works" section
  const steps = [
    {
      id: 'aggregation',
      icon: TrendingUp,
      title: "Multi-Source Data Aggregation",
      description: (
        <>
          Real-time monitoring of <strong className="font-bold text-gray-900 dark:text-white">X/Twitter</strong>, <strong className="font-bold text-gray-900 dark:text-white">Polymarket predictions</strong>, and <strong className="font-bold text-gray-900 dark:text-white">global news feeds</strong> for emerging market signals.
        </>
      )
    },
    {
      id: 'analysis',
      icon: Filter,
      title: "Semantic Analysis & Pattern Recognition",
      description: (
        <>
          Advanced models identify <strong className="font-bold text-gray-900 dark:text-white">patterns</strong>, <strong className="font-bold text-gray-900 dark:text-white">user pain points</strong>, and <strong className="font-bold text-gray-900 dark:text-white">market opportunities</strong> from unstructured data.
        </>
      )
    },
    {
      id: 'synthesis',
      icon: Bot,
      title: "Intelligent Idea Synthesis",
      description: (
        <>
          Structured business concepts are generated, complete with <strong className="font-bold text-gray-900 dark:text-white">market analysis</strong> and potential <strong className="font-bold text-gray-900 dark:text-white">monetization strategies</strong>.
        </>
      )
    },
    {
      id: 'scoring',
      icon: CheckCircle,
      title: "Multi-Factor Scoring Algorithm",
      description: (
        <>
          Each idea is rigorously evaluated against <strong className="font-bold text-gray-900 dark:text-white">dozens of weighted parameters</strong> to produce a <strong className="font-bold text-gray-900 dark:text-white">predictive viability score</strong>.
        </>
      )
    },
    {
      id: 'delivery',
      icon: Zap,
      title: "Curated Insight Delivery",
      description: (
        <>
          Fresh, actionable business ideas are delivered to your <strong className="font-bold text-gray-900 dark:text-white">personalized dashboard</strong> daily.
        </>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Spark
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 text-center bg-white dark:bg-gray-950">
          <motion.div
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Your Intelligent Idea Pipeline
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Wake up to new, validated business ideas every day. Spark
              continuously scans the market to bring you actionable insights.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="relative z-10">Get Started</span>
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                How It Works
              </h3>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                From raw signals to validated ideas, delivered to you daily.
              </p>
            </div>
            <div className="mt-16">
              {/* Desktop: horizontal icons + centered description */}
              <div className="hidden md:block">
                {/* Steps row - icons and titles only */}
                <div className="grid grid-cols-5 gap-8">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isFocused = index === focusedStep;

                    return (
                      <motion.div
                        key={index}
                        className="flex flex-col items-center text-center cursor-pointer"
                        onClick={() => setFocusedStep(index)}
                        animate={{
                          scale: isFocused ? 1.1 : 0.95,
                          opacity: isFocused ? 1 : 0.4,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: [0.4, 0.0, 0.2, 1],
                        }}
                        whileHover={{ scale: isFocused ? 1.1 : 0.98 }}
                        style={{ willChange: 'transform, opacity' }}
                      >
                        <motion.div
                          className="relative flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden"
                          animate={{
                            boxShadow: isFocused
                              ? "0 10px 30px rgba(59, 130, 246, 0.5)"
                              : "0 0 0 rgba(59, 130, 246, 0)"
                          }}
                          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                        >
                          {/* Phase-specific animations */}
                          {isFocused && (
                            <>
                              {/* Data Aggregation: Flowing particles */}
                              {step.id === 'aggregation' && (
                                <div className="absolute inset-0">
                                  {[...Array(6)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
                                      initial={{
                                        x: Math.cos(i * 60 * Math.PI / 180) * 40,
                                        y: Math.sin(i * 60 * Math.PI / 180) * 40,
                                        opacity: 0,
                                        scale: 0
                                      }}
                                      animate={{
                                        x: 0,
                                        y: 0,
                                        opacity: [0, 1, 0.8, 0],
                                        scale: [0, 1, 1, 0]
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: "easeInOut"
                                      }}
                                      style={{ left: '50%', top: '50%' }}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Pattern Recognition: Scanning effect */}
                              {step.id === 'analysis' && (
                                <div className="absolute inset-0">
                                  <motion.div
                                    className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                                    initial={{ y: 0 }}
                                    animate={{ y: 64 }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: "linear"
                                    }}
                                  />
                                  {[...Array(4)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="absolute w-3 h-3 border border-blue-400 rounded-sm"
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                      transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.4
                                      }}
                                      style={{
                                        left: `${15 + (i % 2) * 35}%`,
                                        top: `${20 + Math.floor(i / 2) * 35}%`
                                      }}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Idea Synthesis: Expanding circles */}
                              {step.id === 'synthesis' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {[...Array(3)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="absolute w-8 h-8 border border-blue-400 rounded-full"
                                      initial={{ scale: 0, opacity: 1 }}
                                      animate={{ scale: 2, opacity: 0 }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.7,
                                        ease: "easeOut"
                                      }}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Scoring: Progress bars */}
                              {step.id === 'scoring' && (
                                <div className="absolute inset-0">
                                  {[...Array(3)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="absolute h-0.5 bg-blue-400 rounded-full"
                                      initial={{ scaleX: 0 }}
                                      animate={{ scaleX: 0.6 + Math.random() * 0.4 }}
                                      transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                      }}
                                      style={{
                                        width: '70%',
                                        left: '15%',
                                        top: `${25 + i * 20}%`,
                                        transformOrigin: 'left'
                                      }}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Delivery: Cards appearing */}
                              {step.id === 'delivery' && (
                                <div className="absolute inset-0">
                                  {[...Array(3)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="absolute w-8 h-5 bg-blue-400/30 rounded-sm border border-blue-400"
                                      initial={{ x: -30, opacity: 0, scale: 0.8 }}
                                      animate={{ x: 0, opacity: 1, scale: 1 }}
                                      transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatDelay: 1.5,
                                        delay: i * 0.3,
                                        ease: "easeOut"
                                      }}
                                      style={{
                                        top: `${20 + i * 15}%`,
                                        left: '20%'
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10" />
                        </motion.div>
                        <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100 px-2 text-center">
                          {step.title}
                        </h4>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Centered description area */}
                <div className="mt-16 text-center max-w-3xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={focusedStep}
                      className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {steps[focusedStep].description}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile: single card with icon, title, description together */}
              <div className="md:hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={focusedStep}
                    className="flex flex-col items-center text-center space-y-6 px-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {(() => {
                      const step = steps[focusedStep];
                      const Icon = step.icon;
                      return (
                        <>
                          {/* Icon with animation */}
                          <div className="relative w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                            {/* Phase-specific animations (same as desktop) */}
                            {step.id === 'aggregation' && (
                              <div className="absolute inset-0">
                                {[...Array(6)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
                                    initial={{
                                      x: Math.cos(i * 60 * Math.PI / 180) * 40,
                                      y: Math.sin(i * 60 * Math.PI / 180) * 40,
                                      opacity: 0,
                                      scale: 0
                                    }}
                                    animate={{
                                      x: 0,
                                      y: 0,
                                      opacity: [0, 1, 0.8, 0],
                                      scale: [0, 1, 1, 0]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.3,
                                      ease: "easeInOut"
                                    }}
                                    style={{ left: '50%', top: '50%' }}
                                  />
                                ))}
                              </div>
                            )}

                            {step.id === 'analysis' && (
                              <div className="absolute inset-0">
                                <motion.div
                                  className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                                  initial={{ y: 0 }}
                                  animate={{ y: 80 }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                  }}
                                />
                                {[...Array(4)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-3 h-3 border border-blue-400 rounded-sm"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      delay: i * 0.4
                                    }}
                                    style={{
                                      left: `${15 + (i % 2) * 35}%`,
                                      top: `${20 + Math.floor(i / 2) * 35}%`
                                    }}
                                  />
                                ))}
                              </div>
                            )}

                            {step.id === 'synthesis' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-10 h-10 border border-blue-400 rounded-full"
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.7,
                                      ease: "easeOut"
                                    }}
                                  />
                                ))}
                              </div>
                            )}

                            {step.id === 'scoring' && (
                              <div className="absolute inset-0">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute h-0.5 bg-blue-400 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 0.6 + Math.random() * 0.4 }}
                                    transition={{
                                      duration: 1.2,
                                      repeat: Infinity,
                                      repeatType: "reverse",
                                      delay: i * 0.2,
                                      ease: "easeInOut"
                                    }}
                                    style={{
                                      width: '70%',
                                      left: '15%',
                                      top: `${25 + i * 20}%`,
                                      transformOrigin: 'left'
                                    }}
                                  />
                                ))}
                              </div>
                            )}

                            {step.id === 'delivery' && (
                              <div className="absolute inset-0">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-10 h-6 bg-blue-400/30 rounded-sm border border-blue-400"
                                    initial={{ x: -30, opacity: 0, scale: 0.8 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.8,
                                      repeat: Infinity,
                                      repeatDelay: 1.5,
                                      delay: i * 0.3,
                                      ease: "easeOut"
                                    }}
                                    style={{
                                      top: `${20 + i * 15}%`,
                                      left: '20%'
                                    }}
                                  />
                                ))}
                              </div>
                            )}

                            <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400 relative z-10" />
                          </div>

                          {/* Title */}
                          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 max-w-xs">
                            {step.title}
                          </h4>

                          {/* Description (immediately below title) */}
                          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-sm">
                            {step.description}
                          </p>
                        </>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress indicators (visible on both mobile and desktop) */}
              <div className="flex justify-center gap-2 mt-12">
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.button
                    key={index}
                    onClick={() => setFocusedStep(index)}
                    className="h-2 rounded-full bg-gray-300 dark:bg-gray-600"
                    animate={{
                      width: index === focusedStep ? 32 : 8,
                      backgroundColor: index === focusedStep
                        ? "rgb(37, 99, 235)"
                        : undefined
                    }}
                    transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section ref={benefitsRef} className="py-20 md:py-28 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Never Run Out of Ideas
              </h3>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Focus on building, not just brainstorming.
              </p>
            </motion.div>
            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={benefitsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                {
                  icon: Zap,
                  title: "Automated Generation",
                  description: "Our AI works 24/7 to find and validate new opportunities, so you don't have to.",
                  color: "green"
                },
                {
                  icon: TrendingUp,
                  title: "Daily Fresh Ideas",
                  description: "Get a continuous pipeline of ideas based on what's trending right now, not last month.",
                  color: "blue"
                },
                {
                  icon: CheckCircle,
                  title: "AI Scoring & Validation",
                  description: "Each idea is scored for potential and comes with structured, actionable data to help you start.",
                  color: "purple"
                }
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{
                      y: -8,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
                    }}
                    className="transition-shadow"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`flex items-center justify-center w-12 h-12 bg-${benefit.color}-100 dark:bg-${benefit.color}-900 rounded-md mb-4`}>
                          <Icon className={`w-6 h-6 text-${benefit.color}-600 dark:text-${benefit.color}-400`} />
                        </div>
                        <CardTitle>{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {benefit.description}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-24 md:py-32 bg-blue-600 text-white">
          <motion.div
            className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Spark Your Next Big Idea?
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-lg text-blue-100">
              Join today and start receiving high-potential business ideas tomorrow.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="secondary" className="relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="relative z-10">Sign Up Now</span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="py-8 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Spark. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
