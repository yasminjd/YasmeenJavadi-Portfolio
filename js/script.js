// Modern portfolio functionality
document.addEventListener('DOMContentLoaded', function() {

    // Add animation delays to elements for staggered loading
    const animatedElements = document.querySelectorAll('.content-card, .timeline-item, .project-card, .certificate-card');
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });

    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const observeElements = document.querySelectorAll('.content-card, .timeline-item, .project-card, .certificate-card');
    
    observeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Smooth entrance animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }

    // Add hover effects to profile photo
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02) rotate(2deg)';
        });
        
        profilePhoto.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Simple Email Copy Handler
    const getInTouchBtn = document.getElementById('getInTouchBtn');
    if (getInTouchBtn) {
        getInTouchBtn.addEventListener('click', function() {
            const email = 'javadiyasmeen@gmail.com';
            
            // Copy email to clipboard
            navigator.clipboard.writeText(email).then(() => {
                // Show success feedback
                const originalText = this.textContent;
                this.textContent = '📋 Email Copied!';
                this.style.background = '#10a37f';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show success feedback
                const originalText = this.textContent;
                this.textContent = '📋 Email Copied!';
                this.style.background = '#10a37f';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            });
        });
    }

    // Experience page functionality
    const companyItems = document.querySelectorAll('.company-item');
    const experienceDetails = document.querySelectorAll('.experience-detail');
    
    if (companyItems.length > 0) {
        companyItems.forEach(item => {
            item.addEventListener('click', function() {
                const company = this.getAttribute('data-company');
                
                // Remove active class from all items and details
                companyItems.forEach(item => item.classList.remove('active'));
                experienceDetails.forEach(detail => detail.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Show corresponding experience detail
                const targetDetail = document.getElementById(`experience-${company}`);
                if (targetDetail) {
                    targetDetail.classList.add('active');
                }
            });
        });
    }

    // Projects page functionality
    const projectItems = document.querySelectorAll('.project-item');
    const projectDetails = document.querySelectorAll('.project-detail');
    
    if (projectItems.length > 0) {
        projectItems.forEach(item => {
            item.addEventListener('click', function() {
                const project = this.getAttribute('data-project');
                
                // Remove active class from all items and details
                projectItems.forEach(item => item.classList.remove('active'));
                projectDetails.forEach(detail => detail.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Show corresponding project detail
                const targetDetail = document.getElementById(`project-${project}`);
                if (targetDetail) {
                    targetDetail.classList.add('active');
                }
            });
        });
    }

    // Accordion functionality for About page
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                const content = document.getElementById(target);
                const icon = this.querySelector('.accordion-icon');
                
                // Toggle active class
                this.classList.toggle('active');
                content.classList.toggle('active');
                
                // Update icon
                if (this.classList.contains('active')) {
                    icon.textContent = '−';
                } else {
                    icon.textContent = '+';
                }
                
                // Close other accordions (optional - remove if you want multiple open)
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== this) {
                        const otherTarget = otherHeader.getAttribute('data-target');
                        const otherContent = document.getElementById(otherTarget);
                        const otherIcon = otherHeader.querySelector('.accordion-icon');
                        
                        otherHeader.classList.remove('active');
                        otherContent.classList.remove('active');
                        otherIcon.textContent = '+';
                    }
                });
            });
        });
        
        // Open first accordion by default
        if (accordionHeaders[0]) {
            accordionHeaders[0].click();
        }
    }

    // Skills accordion functionality
    const skillsAccordionHeaders = document.querySelectorAll('.skills-accordion-header');
    
    if (skillsAccordionHeaders.length > 0) {
        skillsAccordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                const content = document.getElementById(target);
                const icon = this.querySelector('.skills-accordion-icon');
                
                // Toggle active class
                this.classList.toggle('active');
                content.classList.toggle('active');
                
                // Update icon
                if (this.classList.contains('active')) {
                    icon.textContent = '−';
                } else {
                    icon.textContent = '+';
                }
                
                // Allow multiple skills sections to be open (no auto-close)
                // Uncomment below if you want only one section open at a time:
                /*
                skillsAccordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== this) {
                        const otherTarget = otherHeader.getAttribute('data-target');
                        const otherContent = document.getElementById(otherTarget);
                        const otherIcon = otherHeader.querySelector('.skills-accordion-icon');
                        
                        otherHeader.classList.remove('active');
                        otherContent.classList.remove('active');
                        otherIcon.textContent = '+';
                    }
                });
                */
            });
        });
        
        // Open first skills section by default
        if (skillsAccordionHeaders[0]) {
            skillsAccordionHeaders[0].click();
        }
    }

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});