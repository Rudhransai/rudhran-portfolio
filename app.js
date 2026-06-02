// Global Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initTypewriter();
    initHeroParticles();
    initActiveNavLinks();
    initAnalyticsWidget();
    initDeepfakeScanner();
    initExamSimulator();
    initContactForm();
});

// 1. Header Scrolled Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 2. Mobile Drawer Navigation Toggle
function initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!btn || !drawer) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        drawer.classList.toggle('open');
        const icon = btn.querySelector('i');
        if (drawer.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close when clicking nav links
    links.forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('open');
            btn.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
        if (!drawer.contains(e.target) && !btn.contains(e.target)) {
            drawer.classList.remove('open');
            btn.querySelector('i').className = 'fa-solid fa-bars-staggered';
        }
    });
}

// 3. Typist Writer Effect
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const titles = [
        'Computer Science & Business Systems Student',
        'Software Engineer',
        'Data Analyst'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            element.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            element.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // normal typing
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 2000; // pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// 4. Hero Section Canvas Particles Background (Interactive)
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const particles = [];
    const maxParticles = width < 768 ? 40 : 80;
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.size = Math.random() * 2.5 + 1;
            // Palette matches CSS glowing custom colors
            const colors = ['#8b5cf6', '#6366f1', '#06b6d4'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundaries
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Interact with mouse cursor
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    // Slight repulsion force
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx / dist * force * 2;
                    this.y -= dy / dist * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }
    }

    // Populate particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    // Connection opacity gets thinner further apart
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// 5. Active Link Highlight on Scroll
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = 'hero';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

// 6. Codec Technologies Analytics Sandbox Sim
function initAnalyticsWidget() {
    const cleanBtn = document.getElementById('widget-clean-btn');
    const rawBar = document.getElementById('raw-bar');
    const cleanBar = document.getElementById('clean-bar');
    const latencyVal = document.getElementById('w-latency');
    const accuracyVal = document.getElementById('w-accuracy');

    if (!cleanBtn || !rawBar || !cleanBar) return;

    let isCleaned = false;

    cleanBtn.addEventListener('click', () => {
        if (!isCleaned) {
            cleanBtn.textContent = 'Processing...';
            cleanBtn.disabled = true;

            setTimeout(() => {
                rawBar.style.height = '15%';
                cleanBar.style.height = '95%';
                latencyVal.textContent = '12ms';
                accuracyVal.textContent = '99.4%';
                latencyVal.className = 'highlight-txt text-green';
                accuracyVal.className = 'highlight-txt text-green';
                
                cleanBtn.textContent = 'Reset Data Sim';
                cleanBtn.disabled = false;
                isCleaned = true;
            }, 1000);
        } else {
            rawBar.style.height = '90%';
            cleanBar.style.height = '30%';
            latencyVal.textContent = '480ms';
            accuracyVal.textContent = '72%';
            latencyVal.className = 'highlight-txt';
            accuracyVal.className = 'highlight-txt';
            
            cleanBtn.textContent = 'Clean Raw Data';
            isCleaned = false;
        }
    });
}

// 7. AI Deepfake Facial Scanner Mesh Mock Logger
function initDeepfakeScanner() {
    const scanner = document.getElementById('deepfake-scanner');
    const msg = document.getElementById('scan-log-msg');
    if (!scanner || !msg) return;

    const logMessages = [
        'Analyzing video stream...',
        'Face detected. Mapping key mesh coordinates...',
        'Checking eye blink ratios & pixel gradient maps...',
        'Processing Convolutional Network predictions...',
        'Scan complete. Result: 100% AUTHENTIC REAL (0.00% anomaly)'
    ];

    let interval = null;
    let activeIndex = 0;

    scanner.addEventListener('mouseenter', () => {
        activeIndex = 0;
        msg.textContent = logMessages[0];
        msg.style.color = '#8b5cf6';

        interval = setInterval(() => {
            activeIndex++;
            if (activeIndex < logMessages.length) {
                msg.textContent = logMessages[activeIndex];
                if (activeIndex === logMessages.length - 1) {
                    msg.style.color = '#10b981'; // Green on success
                    clearInterval(interval);
                }
            }
        }, 1100);
    });

    scanner.addEventListener('mouseleave', () => {
        if (interval) clearInterval(interval);
        msg.textContent = 'Hover over to analyze facial data';
        msg.style.color = '#8b5cf6';
    });
}

// 8. Server-Aware Timing System Simulator (Web Audio Tone Synthesis included!)
function initExamSimulator() {
    // Buttons & Modes
    const btnServerAware = document.getElementById('btn-mode-server-aware');
    const btnStandard = document.getElementById('btn-mode-standard');
    const submitBtn = document.getElementById('exam-submit-btn');
    const clearLogsBtn = document.getElementById('btn-clear-sim-logs');
    
    // Displays
    const portalStatus = document.getElementById('portal-status-badge');
    const timerDisplay = document.getElementById('sim-timer-display');
    const stateText = document.getElementById('sim-state-text');
    const lagSlider = document.getElementById('server-lag-slider');
    const lagVal = document.getElementById('lag-val-display');
    const logsContainer = document.getElementById('sim-logs-container');
    
    // Stats
    const statSaved = document.getElementById('stat-saved-time');
    const statLost = document.getElementById('stat-lost-time');
    const statEfficiency = document.getElementById('stat-efficiency');
    const soundCheckbox = document.getElementById('sound-checkbox');

    if (!submitBtn || !timerDisplay || !lagSlider) return;

    // State Variables
    let simMode = 'server-aware'; // 'server-aware' or 'standard'
    let secondsLeft = 120.00; // start at 2 minutes
    let timerInterval = null;
    let isBuffering = false;
    
    let totalSaved = 0.0;
    let totalLost = 0.0;

    // Web Audio Synthesizer for high-fidelity audio feedback
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playBeep(type) {
        if (!soundCheckbox.checked) return;
        
        try {
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            if (type === 'success') {
                // Dual tone sweet confirmation ding
                osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
                osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
                osc1.type = 'sine';
                osc2.type = 'sine';

                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
                
                osc1.start();
                osc2.start();
                osc1.stop(audioCtx.currentTime + 0.45);
                osc2.stop(audioCtx.currentTime + 0.45);
            } else if (type === 'buzzer') {
                // Deep electronic 3rd year exam alarm bell
                osc1.frequency.setValueAtTime(160, audioCtx.currentTime);
                osc2.frequency.setValueAtTime(165, audioCtx.currentTime); // detuned
                osc1.type = 'triangle';
                osc2.type = 'sawtooth';

                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
                
                osc1.start();
                osc2.start();
                osc1.stop(audioCtx.currentTime + 0.65);
                osc2.stop(audioCtx.currentTime + 0.65);
            }
        } catch (e) {
            console.log('Audio Context blocked or unsupported:', e);
        }
    }

    // Toggle Modes
    btnServerAware.addEventListener('click', () => {
        if (isBuffering) return;
        simMode = 'server-aware';
        btnServerAware.classList.add('active');
        btnStandard.classList.remove('active');
        logMessage('System', 'Server-Aware Timing framework enabled.', 'text-cyan');
    });

    btnStandard.addEventListener('click', () => {
        if (isBuffering) return;
        simMode = 'standard';
        btnStandard.classList.add('active');
        btnServerAware.classList.remove('active');
        logMessage('System', 'Standard continuous clock enabled (timer vulnerable to delay).', 'text-yellow');
    });

    // Lag Slider
    lagSlider.addEventListener('input', (e) => {
        lagVal.textContent = parseFloat(e.target.value).toFixed(1) + 's';
    });

    // Clear Logs
    clearLogsBtn.addEventListener('click', () => {
        logsContainer.innerHTML = '';
        logMessage('System', 'Console logs cleared.');
    });

    // Helper Logger
    function logMessage(sender, text, cssClass = '') {
        const line = document.createElement('div');
        line.className = `log-line ${cssClass}`;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        line.textContent = `[${time}] [${sender}] ${text}`;
        logsContainer.appendChild(line);
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    // Timer display utility
    function updateTimerDisplay() {
        if (secondsLeft <= 0) {
            secondsLeft = 0;
            clearInterval(timerInterval);
            timerDisplay.textContent = "00:00.00";
            stateText.textContent = "EXAM COMPLETED";
            stateText.className = "clock-state-text text-red";
            playBeep('buzzer');
            submitBtn.disabled = true;
            logMessage('System', 'Exam time elapsed. Autoposting script initiated.', 'text-red');
            return;
        }

        const mins = Math.floor(secondsLeft / 60);
        const secs = Math.floor(secondsLeft % 60);
        const centis = Math.floor((secondsLeft % 1) * 100);

        const minsStr = mins < 10 ? '0' + mins : mins;
        const secsStr = secs < 10 ? '0' + secs : secs;
        const centisStr = centis < 10 ? '0' + centis : centis;

        timerDisplay.textContent = `${minsStr}:${secsStr}.${centisStr}`;
    }

    // Run Clock Countdown
    function startCountdown() {
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            if (!isBuffering) {
                secondsLeft -= 0.01;
                updateTimerDisplay();
            } else {
                // If standard mode, countdown continues even when buffering!
                if (simMode === 'standard') {
                    secondsLeft -= 0.01;
                    updateTimerDisplay();
                }
            }
        }, 10); // 10ms intervals for centiseconds
    }

    // Initialize Simulation clock
    startCountdown();

    // Answer Submission Action
    submitBtn.addEventListener('click', () => {
        if (isBuffering || secondsLeft <= 0) return;

        // Verify option selected
        const selectedOpt = document.querySelector('input[name="exam-opt"]:checked');
        if (!selectedOpt) {
            logMessage('Client', 'Warning: Please select an answer option first!', 'text-red');
            return;
        }

        const delay = parseFloat(lagSlider.value);
        isBuffering = true;
        
        // UI updates
        submitBtn.disabled = true;
        portalStatus.textContent = 'Buffering...';
        portalStatus.className = 'badge-status-portal buffering';
        timerDisplay.classList.add('buffering');
        
        // Log Actions
        logMessage('Client', `Posted Option (${selectedOpt.value}). Syncing with database...`);
        
        if (simMode === 'server-aware') {
            timerDisplay.classList.add('paused');
            stateText.textContent = 'Timer Paused (Server Processing)';
            stateText.className = 'clock-state-text text-cyan';
            logMessage('System', `PAUSE request sent to client clock. Saved time loss.`, 'text-cyan');
        } else {
            stateText.textContent = 'Continuous Timer (Vulnerable to Lag)';
            stateText.className = 'clock-state-text text-red';
            logMessage('System', `WARNING: Countdown running continuously during active buffering.`, 'text-red');
        }

        // Simulate server steps through timeline
        let step = 0;
        const steps = [
            `Sending packet payloads (Latency: ${delay * 200}ms)`,
            'Server buffer active. Processing answer structure...',
            'Injecting transaction log inside PostgreSQL database...',
            'Validating client signature...'
        ];

        const stepInterval = setInterval(() => {
            if (step < steps.length) {
                logMessage('Server', steps[step]);
                step++;
            }
        }, (delay * 1000) / 4);

        // Complete server-side simulation
        setTimeout(() => {
            clearInterval(stepInterval);
            isBuffering = false;
            
            // Restore UI
            submitBtn.disabled = false;
            portalStatus.textContent = 'Active';
            portalStatus.className = 'badge-status-portal';
            timerDisplay.classList.remove('buffering');
            timerDisplay.classList.remove('paused');
            
            stateText.textContent = 'Timer Running';
            stateText.className = 'clock-state-text text-cyan';

            // Calculate metrics & update scoreboard
            if (simMode === 'server-aware') {
                totalSaved += delay;
                statSaved.textContent = totalSaved.toFixed(2) + 's';
                logMessage('Server', `Confirmation [OK] returned. Clock resumed successfully.`, 'text-green');
                logMessage('System', `Transaction saved ${delay.toFixed(2)} seconds of buffering loss!`, 'text-green');
            } else {
                totalLost += delay;
                statLost.textContent = totalLost.toFixed(2) + 's';
                logMessage('Server', `Confirmation [OK] returned. Client portal active.`, 'text-green');
                logMessage('System', `Student UNFAIRLY LOST ${delay.toFixed(2)} seconds due to server delay.`, 'text-red');
            }

            // Update Efficiency
            const totalElapsed = (120 - secondsLeft) + totalLost;
            const efficiency = totalElapsed > 0 
                ? (100 - (totalLost / totalElapsed) * 100) 
                : 100;
            statEfficiency.textContent = Math.max(0, Math.min(100, Math.round(efficiency))) + '%';
            if (efficiency < 80) statEfficiency.className = 'stat-highlight text-red';
            else if (efficiency < 95) statEfficiency.className = 'stat-highlight text-cyan';
            else statEfficiency.className = 'stat-highlight text-green';

            playBeep('success');
            
            // Randomize selection for recruiter convenience
            const radioButtons = document.querySelectorAll('input[name="exam-opt"]');
            radioButtons.forEach(btn => btn.checked = false);

        }, delay * 1000);
    });
}

// 9. Modern Contact Form Feedback
function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const feedback = document.getElementById('form-feedback-msg');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', () => {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Sending Message...';
        
        // Mimic real AJAX dispatch
        setTimeout(() => {
            feedback.style.color = '#10b981';
            feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message was sent successfully. (Simulated)';
            
            // Reset input values
            form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Send Message';

            // Clear notice after 5 seconds
            setTimeout(() => {
                feedback.innerHTML = '';
            }, 5000);

        }, 1500);
    });
}
