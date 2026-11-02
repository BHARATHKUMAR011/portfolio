// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen')?.classList.add('hidden');
    }, 1500);
});

document.addEventListener('DOMContentLoaded', () => {
    // Typing Animation
    const titles = ["Software Developer", "Full Stack Developer", "CS Undergraduate", "React & Java Specialist"];
    const typingText = document.getElementById('typing-text');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!typingText) return;
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // Particle / Constellation Background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 80;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 
                    ? `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.3})`
                    : `rgba(6, 182, 212, ${Math.random() * 0.5 + 0.3})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 * (1 - distance/120)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // Scroll Reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // Stats Counter Animation
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * target);
            element.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => {
        statsObserver.observe(el);
    });

    // Skill Bar Animation
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-bar-fill').forEach(el => {
        skillObserver.observe(el);
    });

    // Project Category Filter
    window.filterProjects = function(category) {
        const cards = document.querySelectorAll('.project-card');
        const btns = document.querySelectorAll('.filter-btn');
        
        btns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === category);
        });
        
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'flex';
                card.dataset.hidden = 'false';
            } else {
                card.style.display = 'none';
                card.dataset.hidden = 'true';
            }
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
    });

    // Project Detail Modal
    const projectData = {
        habit: {
            title: "Habit Tracker Application",
            stack: "React.js, Node.js, Express.js, MongoDB, Mongoose, REST APIs, JWT, bcrypt, Vite",
            github: "https://github.com/BHARATHKUMAR011/Habit-Tracker",
            live: "https://habit-tracker-smoky-theta.vercel.app/",
            bullets: [
                "Built a full-stack application for users to create, update, delete and monitor daily habits.",
                "Implemented JWT authentication, bcrypt password hashing, protected routes, and user-specific data access.",
                "Added daily completion toggling, consecutive streak calculation, validation, and responsive UI updates."
            ]
        },
        inox: {
            title: "INOX Theatre Movie Booking System",
            stack: "React.js, Node.js, Express, MySQL, REST APIs, HTML/CSS",
            github: "https://github.com/BHARATHKUMAR011/INOX-Theatre-Movie-Booking-System",
            bullets: [
                "Engineered a full-stack movie ticketing Single Page Application (SPA).",
                "Designed an interactive UI featuring dynamic seat-selection and automated e-ticket generation.",
                "Implemented JWT authentication with bcrypt password hashing to ensure secure, private user data."
            ]
        },
        threat: {
            title: "Insider Threat Detection System",
            stack: "Python, Pandas, NumPy, Scikit-learn, SQL, Streamlit, SHAP",
            github: "https://github.com/BHARATHKUMAR011/AI-Powered-Insider-Threat-Detection-System",
            bullets: [
                "Developed an ML-based insider threat detection system.",
                "Performed data preprocessing and feature engineering on complex system metrics.",
                "Implemented Isolation Forest and One-Class SVM algorithms with Streamlit interface and SHAP model explainability."
            ]
        }
    };

    window.openProjectModal = function(key) {
        const data = projectData[key];
        if (!data) return;
        const content = document.getElementById('modal-body');
        if (content) {
            let actionsHtml = '';
            if (data.live) {
                actionsHtml += `<a href="${data.live}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669);"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Application</a> `;
            }
            if (data.github) {
                actionsHtml += `<a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-primary"><i class="fa-brands fa-github"></i> GitHub Repo</a>`;
            }
            content.innerHTML = `
                <h3>${data.title}</h3>
                <div class="modal-tech">Tech Stack: ${data.stack}</div>
                <ul>
                    ${data.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
                <div class="modal-actions">
                    ${actionsHtml}
                </div>
            `;
        }
        document.getElementById('project-modal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.closeProjectModal = function() {
        document.getElementById('project-modal')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    const modal = document.getElementById('project-modal');
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            window.closeProjectModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            window.closeProjectModal();
        }
    });

    // Testimonial Carousel
    let currentSlide = 0;
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    const totalSlides = document.querySelectorAll('.testimonial-slide').length;

    function goToSlide(index) {
        currentSlide = index;
        if (track) track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    if (totalSlides > 0) {
        let autoPlay = setInterval(() => {
            goToSlide((currentSlide + 1) % totalSlides);
        }, 5000);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
                clearInterval(autoPlay);
                autoPlay = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000);
            });
        });
    }

    // Back-to-Top Button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    });
    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileBtn?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        icon?.classList.toggle('fa-bars');
        icon?.classList.toggle('fa-xmark');
    });
    
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu?.classList.remove('active');
            const icon = mobileBtn?.querySelector('i');
            icon?.classList.remove('fa-xmark');
            icon?.classList.add('fa-bars');
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });
});
