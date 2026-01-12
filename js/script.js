// Import Firebase (initializes on load)
import { app, analytics, storage, ref, getDownloadURL } from './firebase.js';

// Modern portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Firebase connected:', app.name);

    // Load demo videos from Firebase Storage
    loadSTYAV1Video();
    loadSTYAV2Video();
    loadITSupportVideo();
    loadRocketVideo();

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

    // Projects Card Gallery functionality
    const carouselCards = document.querySelectorAll('.carousel-card');
    const projectsCarousel = document.querySelector('.projects-carousel');
    const projectsContent = document.querySelector('.projects-content');
    const projectDetails = document.querySelectorAll('.project-detail');
    const backToProjectsBtn = document.getElementById('backToProjects');
    
    // Function to expand project view
    function expandProject(projectName) {
        // Hide the card gallery
        if (projectsCarousel) {
            projectsCarousel.style.display = 'none';
        }
        
        // Show the projects content area
        if (projectsContent) {
            projectsContent.classList.add('expanded');
        }
        
        // Show the selected project
        projectDetails.forEach(detail => detail.classList.remove('active'));
        const targetDetail = document.getElementById(`project-${projectName}`);
        if (targetDetail) {
            targetDetail.classList.add('active');
        }
        
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Function to collapse back to card gallery
    function collapseToGallery() {
        // Hide the projects content area
        if (projectsContent) {
            projectsContent.classList.remove('expanded');
        }
        
        // Show the card gallery
        if (projectsCarousel) {
            projectsCarousel.style.display = 'flex';
        }
        
        // Clear active project
        projectDetails.forEach(detail => detail.classList.remove('active'));
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Card click handlers - expand to project view
    if (carouselCards.length > 0) {
        carouselCards.forEach(card => {
            card.addEventListener('click', function() {
                const project = this.getAttribute('data-project');
                expandProject(project);
            });
        });
    }
    
    // Back button handler
    if (backToProjectsBtn) {
        backToProjectsBtn.addEventListener('click', function() {
            collapseToGallery();
        });
    }

    // Version Selector functionality (for STYA project)
    const versionCards = document.querySelectorAll('.version-card');
    
    if (versionCards.length > 0) {
        versionCards.forEach(card => {
            card.addEventListener('click', function() {
                const version = this.getAttribute('data-version');
                const parentProject = this.closest('.project-detail');
                
                if (!parentProject) return;
                
                // Get all version cards and contents within this project
                const projectVersionCards = parentProject.querySelectorAll('.version-card');
                const projectVersionContents = parentProject.querySelectorAll('.version-content');
                
                // Remove active class from all cards and contents
                projectVersionCards.forEach(c => {
                    c.classList.remove('active');
                    const status = c.querySelector('.version-status');
                    if (status) {
                        status.innerHTML = '<span class="status-dot"></span>Click to explore';
                    }
                });
                projectVersionContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked card
                this.classList.add('active');
                const thisStatus = this.querySelector('.version-status');
                if (thisStatus) {
                    thisStatus.innerHTML = '<span class="status-dot"></span>Selected';
                }
                
                // Show corresponding version content
                const targetContent = parentProject.querySelector(`.version-content[data-version="${version}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    
                    // Smooth scroll to content
                    setTimeout(() => {
                        targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
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

    // Skills accordion functionality (old)
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
            });
        });
        
        // Open first skills section by default
        if (skillsAccordionHeaders[0]) {
            skillsAccordionHeaders[0].click();
        }
    }

    // New Expandable Skills functionality
    const skillExpandableItems = document.querySelectorAll('.skill-expandable-item');
    
    if (skillExpandableItems.length > 0) {
        skillExpandableItems.forEach(item => {
            const header = item.querySelector('.skill-expandable-header');
            const icon = item.querySelector('.expand-icon');
            
            header.addEventListener('click', function() {
                // Toggle active class on the item
                item.classList.toggle('active');
                
                // Update icon
                if (item.classList.contains('active')) {
                    icon.textContent = '−';
                } else {
                    icon.textContent = '+';
                }
                
                // Close other items (accordion behavior)
                skillExpandableItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherIcon = otherItem.querySelector('.expand-icon');
                        if (otherIcon) otherIcon.textContent = '+';
                    }
                });
            });
        });
        
        // Open first item by default
        if (skillExpandableItems[0]) {
            skillExpandableItems[0].classList.add('active');
            const firstIcon = skillExpandableItems[0].querySelector('.expand-icon');
            if (firstIcon) firstIcon.textContent = '−';
        }
    }

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Function to load STYA V1 video from Firebase Storage
    async function loadSTYAV1Video() {
        const videoElement = document.getElementById('stya-v1-video');
        const loadingElement = document.querySelector('#stya-v1-video-container .video-loading');
        
        if (!videoElement) return; // Not on projects page
        
        try {
            // STYA V1 demo video path in Firebase Storage
            const videoRef = ref(storage, 'copy_5A734217-640E-4BF9-93A9-86915B8A3D69.MOV');
            const videoURL = await getDownloadURL(videoRef);
            
            videoElement.src = videoURL;
            videoElement.style.display = 'block';
            if (loadingElement) loadingElement.style.display = 'none';
            
            console.log('✅ STYA V1 video loaded from Firebase Storage');
        } catch (error) {
            console.error('❌ Error loading video:', error);
            if (loadingElement) {
                loadingElement.innerHTML = `
                    <span>📱</span>
                    <p>Video unavailable</p>
                `;
            }
        }
    }

    // Function to load STYA V2 video from Firebase Storage
    async function loadSTYAV2Video() {
        const videoElement = document.getElementById('stya-v2-video');
        const loadingElement = document.querySelector('#stya-v2-video-container .video-loading');
        
        if (!videoElement) return; // Not on projects page
        
        try {
            // STYA V2 demo video path in Firebase Storage
            const videoRef = ref(storage, 'copy_82D740F0-0A85-477E-B2AB-CF991EBB08EC.MOV');
            const videoURL = await getDownloadURL(videoRef);
            
            videoElement.src = videoURL;
            videoElement.style.display = 'block';
            if (loadingElement) loadingElement.style.display = 'none';
            
            console.log('✅ STYA V2 video loaded from Firebase Storage');
        } catch (error) {
            console.error('❌ Error loading video:', error);
            if (loadingElement) {
                loadingElement.innerHTML = `
                    <span>📱</span>
                    <p>Video unavailable</p>
                `;
            }
        }
    }

    // Function to load IT Support Agent video from Firebase Storage
    async function loadITSupportVideo() {
        const videoElement = document.getElementById('itsupport-video');
        const loadingElement = document.querySelector('#itsupport-video-container .video-loading');
        
        if (!videoElement) return; // Not on projects page
        
        try {
            // IT Support demo video path in Firebase Storage
            const videoRef = ref(storage, 'copy_6B9EE515-4D42-45B2-AB32-0459BE3D5524.MOV');
            const videoURL = await getDownloadURL(videoRef);
            
            videoElement.src = videoURL;
            videoElement.style.display = 'block';
            if (loadingElement) loadingElement.style.display = 'none';
            
            console.log('✅ IT Support video loaded from Firebase Storage');
        } catch (error) {
            console.error('❌ Error loading IT Support video:', error);
            if (loadingElement) {
                loadingElement.innerHTML = `
                    <span>🤖</span>
                    <p>Video unavailable</p>
                `;
            }
        }
    }

    // Function to load Rocket video from Firebase Storage
    async function loadRocketVideo() {
        const videoElement = document.getElementById('rocket-video');
        const loadingElement = document.querySelector('#rocket-video-container .video-loading');
        
        if (!videoElement) return; // Not on projects page
        
        try {
            // Rocket demo video path in Firebase Storage
            const videoRef = ref(storage, 'copy_FC4EB223-05E4-4542-98F3-F5118D27AA98.MOV');
            const videoURL = await getDownloadURL(videoRef);
            
            videoElement.src = videoURL;
            videoElement.style.display = 'block';
            if (loadingElement) loadingElement.style.display = 'none';
            
            console.log('✅ Rocket video loaded from Firebase Storage');
        } catch (error) {
            console.error('❌ Error loading Rocket video:', error);
            if (loadingElement) {
                loadingElement.innerHTML = `
                    <span>🚀</span>
                    <p>Video unavailable</p>
                `;
            }
        }
    }

    // Resume Modal Functionality
    const resumeBtn = document.getElementById('resumeBtn');
    const resumeModal = document.getElementById('resumeModal');
    const resumeIframe = document.getElementById('resumeIframe');
    const resumeModalClose = document.querySelector('.resume-modal-close');
    const resumeModalOverlay = document.querySelector('.resume-modal-overlay');

    if (resumeBtn && resumeModal) {
        // Open modal when Resume button is clicked
        resumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Load the PDF into iframe (lazy load for better performance)
            if (!resumeIframe.src) {
                resumeIframe.src = 'YasmeenJavadi_P.pdf';
            }
            resumeModal.style.display = 'flex';
            // Trigger reflow for animation
            resumeModal.offsetHeight;
            resumeModal.classList.add('active');
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        });

        // Close modal function
        function closeResumeModal() {
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';
            // Hide modal after animation completes
            setTimeout(() => {
                if (!resumeModal.classList.contains('active')) {
                    resumeModal.style.display = 'none';
                }
            }, 300);
        }

        // Close modal when X button is clicked
        if (resumeModalClose) {
            resumeModalClose.addEventListener('click', closeResumeModal);
        }

        // Close modal when clicking outside (on overlay)
        if (resumeModalOverlay) {
            resumeModalOverlay.addEventListener('click', closeResumeModal);
        }

        // Close modal when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
                closeResumeModal();
            }
        });
    }
});