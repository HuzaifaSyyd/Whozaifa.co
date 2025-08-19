"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useInView } from 'react-intersection-observer';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoveRight, MousePointer } from "lucide-react"
import ContactForm from "@/components/contact-form"

// Replace the WaveBackground component with AdvancedAnimation
import AdvancedAnimation from "@/components/advanced-animation"

// Replace the WaveBackground function with:
function WaveBackground() {
  return <AdvancedAnimation />
}

// Section components
const HomeSection = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })

  return (
    <section id="home" className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Wave background */}
      <WaveBackground />

      {/* Content */}
      <motion.div style={{ y: springY, opacity: springOpacity }} className="text-center z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-6xl md:text-8xl font-bold tracking-tighter enhanced-text-gradient"
        >
          Whozaifa
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-4 text-xl text-muted-foreground"
        >
          Creative Developer & Designer
        </motion.p>

        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button asChild size="lg" className="rounded-full px-8 glow button-elegant holographic">
            <Link href="#about">
              Explore <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <div className="flex justify-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-sm flex items-center gap-2"
            >
              <MousePointer className="h-4 w-4" /> Scroll to discover
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 pulse"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.5,
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  )
}

const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  })

  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative h-[400px] rounded-2xl overflow-hidden glass zoom-image"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-10 rounded-2xl"></div>
              <img src="/developer_male.jpg" alt="Profile" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <h3 className="text-2xl font-semibold mb-4">Hi, I'm Huzaifa</h3>
              <p className="text-muted-foreground mb-4">
                I'm a passionate developer and designer with over 2 years of experience creating beautiful, functional
                websites and applications.
              </p>
              <p className="text-muted-foreground mb-6">
                My approach combines technical expertise with creative problem-solving to deliver solutions that not
                only work flawlessly but also engage and delight users.
              </p>
              <div className="flex flex-wrap gap-2 stagger-fade-in">
                {["Next.js", "React", "UI/UX Design", "MongoDB", "Tailwind CSS", "Html", "Css", "Javascript", "Node.js", "Express"].map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    className="px-3 py-1 bg-primary/10 rounded-full text-sm hover-lift"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const ServicesSection = () => {
  const services = [
    {
      title: "Web Development",
      description: "Custom websites built with the latest technologies to ensure performance and scalability.",
      icon: "🖥️",
    },
    {
      title: "UI/UX Design",
      description: "User-centered design that creates intuitive and engaging experiences for your users.",
      icon: "🎨",
    },
    {
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications that work seamlessly across devices.",
      icon: "📱",
    },
    {
      title: "Digital Marketing",
      description: "Strategic marketing solutions to help your business grow and reach new audiences.",
      icon: "📊",
    },
  ]

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section id="services" className="py-20 md:py-32 bg-muted/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">Services</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            I offer a range of services to help businesses and individuals create impactful digital experiences.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                className="bg-background p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 glass modern-card"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const PortfolioSection = () => {
  const projects = [
    {
      title: "Prompt",
      category: "AI",
      image: "/whozprompt.jpg",
      link:"/",
    },
    {
      title: "Block Piston",
      category: "Mobile Development",
      image: "/placeholder.svg?height=400&width=600",
      link:"/",
    },
    {
      title: "Product Visualization",
      category: "3D Design",
      image: "/placeholder.svg?height=400&width=600",
      link:"/",
    },
    {
      title: "Corporate Website",
      category: "Web Design",
      image: "/placeholder.svg?height=400&width=600",
      link:"/",
    },
  ]

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section id="portfolio" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">Portfolio</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Check out some of my recent projects and the work I've done for clients.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                className="group relative overflow-hidden rounded-2xl zoom-image"
              >
                <div className="relative h-[300px] overflow-hidden rounded-2xl">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-center text-white p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm opacity-80 mb-4">{project.category}</p>
                    <Button asChild className="rounded">
                        <Link href={project.link}>View Project</Link>
                      </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="rounded-full px-8 button-elegant">
              <Link href="/portfolio">
                View All Projects <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Updated Contact Section with EmailJS integration
const ContactSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="md:col-span-2 glass p-8 rounded-2xl modern-card"
            >
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

              <div className="space-y-6">
                {/* Email part  */}

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-muted-foreground">whozaifa.co@gmail.com</p>
                  </div>
                </div>

                {/* Location  */}

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-muted-foreground">Pune</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium mb-4">Connect with me</h4>
                <div className="flex space-x-4">
                  
                  <a
                    href="https://x.com/HuzaifaSayyed5" target="_blank"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/huzaifa-sayyed-b04b85243/" target="_blank"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/iamwhozaifa/" target="_blank"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="md:col-span-3 glass p-8 rounded-2xl modern-card"
            >
              <h3 className="text-2xl font-semibold mb-6">Send Me a Message</h3>
              <ContactForm />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const ClientsSection = () => {
  const clients = [
    { name: "3S-Cars", logo: "/3slogo.jpg" },
    { name: "Msr Graphy", logo: "/Msrgraphy.jpg" },
    { name: "Ipo Expert", logo: "/ipologo.jpg" },
  ]

  return (
    <section id="clients" className="py-20 md:py-32 bg-muted/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Clients</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:shadow-md hover-lift transition-all duration-300"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-20 h-20 object-contain mb-4"
                />
                <h3 className="text-lg font-medium">{client.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}


export default function Home() {
  return (
    <main>
      <HomeSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <ClientsSection />
      <ContactSection />
    </main>
  )
}
