
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import "./App.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Explore", href: "#explore" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const projects = [
  {
    number: "01",
    category: "WEB DEVELOPMENT",
    title: "Personal Portfolio",
    description:
      "A creative digital space to showcase my interests, experiments, and development journey.",
    status: "IN PROGRESS",
    tags: ["React", "Vite", "GSAP"],
    artClass: "project-art-portfolio",
    artWord: "PORTFOLIO",
  },
  {
    number: "02",
    category: "ELECTRONICS",
    title: "LED Flasher",
    description:
      "A practical electronics experiment exploring LED blinking, circuit design, and lighting effects.",
    status: "BUILT",
    tags: ["LEDs", "Circuits", "DIY"],
    artClass: "project-art-electronics",
    artWord: "EXPERIMENT",
  },
  {
    number: "03",
    category: "E-COMMERCE",
    title: "AxioTech BD",
    description:
      "An electronics e-commerce interface focused on product presentation and customer experience.",
    status: "IN DEVELOPMENT",
    tags: ["React", "Tailwind CSS", "UI"],
    artClass: "project-art-axiotech",
    artWord: "AXIOTECH",
  },
];

function App() {
  // Main application reference
  const appRef = useRef(null);

  // Custom cursor references
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);

  // Mobile navigation state
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // =====================================
  // CUSTOM CURSOR
  // =====================================

  useEffect(() => {
    const supportsMouse = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!supportsMouse || prefersReducedMotion) return;

    const ring = cursorRingRef.current;
    const dot = cursorDotRef.current;

    if (!ring || !dot) return;

    gsap.set([ring, dot], {
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
    });

    // The dot follows the pointer quickly.
    const dotX = gsap.quickTo(dot, "x", {
      duration: 0.1,
      ease: "power2.out",
    });

    const dotY = gsap.quickTo(dot, "y", {
      duration: 0.1,
      ease: "power2.out",
    });

    // The outer ring follows more slowly.
    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.4,
      ease: "power3.out",
    });

    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.4,
      ease: "power3.out",
    });

    let isVisible = false;
    let isHovering = false;

    const interactiveSelector =
      "a, button, [role='button'], .project-card";

    const showCursor = () => {
      if (isVisible) return;

      isVisible = true;

      gsap.to([ring, dot], {
        autoAlpha: 1,
        duration: 0.2,
        overwrite: "auto",
      });
    };

    const hideCursor = () => {
      isVisible = false;
      isHovering = false;

      ring.classList.remove("is-hovering");

      gsap.to([ring, dot], {
        autoAlpha: 0,
        duration: 0.2,
        overwrite: "auto",
      });

      gsap.to(ring, {
        scale: 1,
        duration: 0.2,
        overwrite: "auto",
      });
    };

    const handlePointerMove = (event) => {
      const target = event.target;

      // Keep the native text cursor in editable fields.
      if (
        target instanceof Element &&
        target.closest(
          "input, textarea, select, [contenteditable='true']"
        )
      ) {
        hideCursor();
        return;
      }

      showCursor();

      dotX(event.clientX);
      dotY(event.clientY);

      ringX(event.clientX);
      ringY(event.clientY);
    };

    const setHover = (active) => {
      if (isHovering === active) return;

      isHovering = active;

      ring.classList.toggle("is-hovering", active);

      gsap.to(ring, {
        scale: active ? 1.5 : 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handlePointerOver = (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest(interactiveSelector)
      ) {
        setHover(true);
      }
    };

    const handlePointerOut = (event) => {
      const nextTarget = event.relatedTarget;

      if (
        nextTarget instanceof Element &&
        nextTarget.closest(interactiveSelector)
      ) {
        return;
      }

      setHover(false);
    };

    const handlePointerDown = () => {
      gsap.to(ring, {
        scale: 0.8,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handlePointerUp = () => {
      gsap.to(ring, {
        scale: isHovering ? 1.5 : 1,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", hideCursor);

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("mouseleave", hideCursor);

    // Remove event listeners and animations when the component unmounts.
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", hideCursor);

      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", hideCursor);

      gsap.killTweensOf([ring, dot]);
    };
  }, []);

  // =====================================
  // GSAP PAGE ANIMATIONS
  // =====================================

  useGSAP(
    () => {
      const root = appRef.current;

      if (!root) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      // Hero entrance timeline
      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .from(".eyebrow", {
          opacity: 0,
          y: 20,
          duration: 0.6,
        })
        .from(
          ".hero h1",
          {
            opacity: 0,
            y: 45,
            duration: 0.9,
          },
          "-=0.25"
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".hero-actions > *",
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.35"
        )
        .from(
          ".hero-caption",
          {
            opacity: 0,
            duration: 0.6,
          },
          "-=0.25"
        );

      // Portrait entrance
      const portrait = root.querySelector(".portrait-frame");

      if (portrait) {
        intro.from(
          portrait,
          {
            opacity: 0,
            scale: 0.94,
            y: 35,
            duration: 1,
          },
          "-=0.8"
        );
      }

      // Floating labels
      const decorations = root.querySelectorAll(".portrait-stamp");

      if (decorations.length) {
        intro.from(
          decorations,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.4"
        );
      }

      // Reveal content while scrolling
      const revealElements = gsap.utils.toArray(
        [
          ".section-heading",
          ".interest-card",
          ".projects-heading",
          ".project-card",
          ".about-section > div",
          ".about-description",
          ".contact-section > *",
        ].join(","),
        root
      );

      revealElements.forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: appRef }
  );

  // =====================================
  // WEBSITE
  // =====================================

  return (
    <>
      <div className="site-shell" ref={appRef}>
        {/* Background decoration */}
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        {/* Navigation */}
        <header className="site-header">
          <a href="#home" className="logo" onClick={closeMenu}>
            <span className="logo-mark">S</span>
            <span>
              SIAM<span className="logo-dot">.</span>
            </span>
          </a>

          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>

          <nav className={`site-nav ${menuOpen ? "is-open" : ""}`}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a className="header-cta" href="#contact">
            Let's talk <span>↗</span>
          </a>
        </header>

        <main>
          {/* Hero */}
          <section className="hero section-wrap" id="home">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="status-dot" />
                WEB · ELECTRONICS · ROBOTICS
              </div>

              <h1>
                Curious mind.
                <br />
                Creative <span>builder.</span>
              </h1>

              <p className="hero-description">
                Hey, I'm Siam. I enjoy exploring web development,
                creating digital experiences, and experimenting
                with electronics and robotics.
              </p>

              <div className="hero-actions">
                <a href="#projects" className="button-primary">
                  Explore my work <span>↗</span>
                </a>

                <a href="#about" className="button-secondary">
                  More about me <span>↓</span>
                </a>
              </div>

              <div className="hero-caption">
                <span>01 / 04</span>
                <span>DESIGNING · BUILDING · LEARNING</span>
              </div>
            </div>

            {/* Cinematic portrait */}
            <div className="hero-visual portrait-visual">
              <div className="portrait-glow" />

              <div className="portrait-frame">
                <img
                  src={`${import.meta.env.BASE_URL}images/siam-portrait.jpg`}
                  alt="Portrait of Siam"
                  className="portrait-image"
                />

                <div className="portrait-shade" />

                <div className="portrait-caption">
                  <span>ASIFUR RAHMAN SIAM</span>
                  <p>CREATIVE MIND · TECH ENTHUSIAST</p>
                </div>
              </div>

              <div className="portrait-stamp">
                <span>✳</span>
                ALWAYS EXPLORING
              </div>
            </div>
          </section>

          {/* Areas of interest */}
          <section
            className="explore-section section-wrap"
            id="explore"
          >
            <div className="section-heading">
              <span className="section-label">
                01 — WHAT I EXPLORE
              </span>

              <h2>
                Different interests.
                <br />
                One <span>curious mind.</span>
              </h2>
            </div>

            <div className="interest-grid">
              <article className="interest-card">
                <span className="card-number">01 / 03</span>
                <div className="card-icon">⌘</div>
                <h3>Web Development</h3>
                <p>
                  Exploring frontend development and building
                  responsive, interactive digital experiences.
                </p>
                <span className="card-arrow">↗</span>
              </article>

              <article className="interest-card">
                <span className="card-number">02 / 03</span>
                <div className="card-icon">ϟ</div>
                <h3>Electronics</h3>
                <p>
                  Experimenting with electronic circuits,
                  components, and practical DIY projects.
                </p>
                <span className="card-arrow">↗</span>
              </article>

              <article className="interest-card">
                <span className="card-number">03 / 03</span>
                <div className="card-icon">⌬</div>
                <h3>Robotics</h3>
                <p>
                  Learning about microcontrollers, automation,
                  and creating intelligent machines.
                </p>
                <span className="card-arrow">↗</span>
              </article>
            </div>
          </section>

          {/* Project showcase */}
          <section
            className="projects-section section-wrap"
            id="projects"
          >
            <div className="projects-heading">
              <div>
                <span className="section-label">
                  02 — SELECTED WORK
                </span>

                <h2>
                  Ideas into <span>reality.</span>
                </h2>
              </div>

              <p>
                A collection of things I'm building,
                experimenting with, and learning from.
              </p>
            </div>

            <div className="project-grid">
              {projects.map((project) => (
                <a
                  href="#contact"
                  key={project.number}
                  className="project-card"
                  aria-label={`Discuss ${project.title} with Siam`}
                >
                  <div className={`project-art ${project.artClass}`}>
                    <div className="project-art-top">
                      <span>SIAM / SELECTED WORK</span>
                      <span>{project.number}</span>
                    </div>

                    <div className="project-art-center">
                      <div className="project-art-orb" />
                      <span className="project-art-word">
                        {project.artWord}
                      </span>
                    </div>

                    <div className="project-hover-label">
                      DISCUSS THIS PROJECT <span>↗</span>
                    </div>
                  </div>

                  <div className="project-info">
                    <div className="project-meta">
                      <span>{project.category}</span>
                      <span className="project-status">
                        {project.status}
                      </span>
                    </div>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* About */}
          <section
            className="about-section section-wrap"
            id="about"
          >
            <div>
              <span className="section-label">
                03 — A LITTLE ABOUT ME
              </span>

              <h2>
                Building ideas,
                <br />
                one experiment at a time<span>.</span>
              </h2>
            </div>

            <p className="about-description">
              I believe creativity and technology belong together.
              From writing code to connecting electronic components,
              I enjoy learning how things work and turning ideas
              into something real.
            </p>
          </section>

          {/* Contact */}
          <section
            className="contact-section section-wrap"
            id="contact"
          >
            <span className="section-label">
              04 — GET IN TOUCH
            </span>

            <h2>
              Have an idea?
              <br />
              Let's make it <span>happen.</span>
            </h2>

            <a
              href="mailto:your-email@example.com"
              className="button-primary"
            >
              Say hello <span>↗</span>
            </a>

            <p className="contact-note">
              Replace this email address with your own before publishing.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="site-footer section-wrap">
          <a href="#home" className="logo">
            SIAM<span className="logo-dot">.</span>
          </a>

          <p>Designed with curiosity. Built with code.</p>

          <span>© 2026 SIAM</span>
        </footer>
      </div>

      {/* Custom cursor - outside site-shell to avoid clipping */}
      <div
        className="custom-cursor-ring"
        ref={cursorRingRef}
        aria-hidden="true"
      />

      <div
        className="custom-cursor-dot"
        ref={cursorDotRef}
        aria-hidden="true"
      />
    </>
  );
}

export default App;
