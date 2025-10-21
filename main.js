// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create floating hearts for the background
document.addEventListener('DOMContentLoaded', function() {
    const heartBackground = document.querySelector('.heart-background');
    
    // Create 15 floating hearts
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 10 + 's';
        heart.style.opacity = 0.3 + Math.random() * 0.5;
        heart.style.transform = `scale(${0.3 + Math.random() * 0.7})`;
        heartBackground.appendChild(heart);
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    // Button scroll functionality
    const openButton = document.getElementById('open-surprise');
    openButton.addEventListener('click', function() {
        // For now, we'll just scroll to the top since other sections aren't implemented yet
        // Later this will scroll to the next section
        document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Easter egg: Pressing "i" shows a special message
    document.addEventListener('keydown', function(e) {
        if (e.key === 'i' || e.key === 'I') {
            showEasterEgg();
        }
    });
    
    // Easter egg function
    function showEasterEgg() {
        // Check if easter egg already exists
        if (document.querySelector('.easter-egg')) return;
        
        const easterEgg = document.createElement('div');
        easterEgg.classList.add('easter-egg');
        easterEgg.textContent = 'You are my everything, Ibtihal';
        easterEgg.style.position = 'fixed';
        easterEgg.style.top = '20px';
        easterEgg.style.right = '20px';
        easterEgg.style.backgroundColor = 'var(--warm-rose)';
        easterEgg.style.color = 'white';
        easterEgg.style.padding = '10px 20px';
        easterEgg.style.borderRadius = '30px';
        easterEgg.style.zIndex = '1000';
        easterEgg.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        easterEgg.style.animation = 'fadeInOut 3s forwards';
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(easterEgg);
        
        // Remove after animation completes
        setTimeout(() => {
            if (easterEgg.parentNode) {
                easterEgg.parentNode.removeChild(easterEgg);
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }
        }, 3000);
    }
    
    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }), { threshold: 0.1 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // Quotes carousel functionality
    const quotes = [
        "I missed you a lot",
        "I need you more than oxygen",
        "I miss the energy and passion you brought me",
        "My queen you're the cutest",
        "You don't know how much I'm obsessed with you my fairy",
        "I love you my Angel"
    ];
    
    let currentQuoteIndex = 0;
    const quoteTextElement = document.querySelector('.quote-text');
    const prevButton = document.getElementById('prev-quote');
    const nextButton = document.getElementById('next-quote');
    const indicatorsContainer = document.querySelector('.quotes-indicators');
    
    // Initialize indicators
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        quotes.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === currentQuoteIndex) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                showQuote(index);
            });
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    // Show quote with typewriter effect
    function showQuote(index) {
        currentQuoteIndex = index;
        const quote = quotes[index];
        
        // Reset animation
        quoteTextElement.style.animation = 'none';
        quoteTextElement.innerHTML = quote;
        setTimeout(() => {
            quoteTextElement.style.animation = 'typing 4s steps(40, end), blink-caret 0.75s step-end infinite';
        }, 10);
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Next quote
    function nextQuote() {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        showQuote(currentQuoteIndex);
    }
    
    // Previous quote
    function prevQuote() {
        currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
        showQuote(currentQuoteIndex);
    }
    
    // Auto rotate quotes
    let quoteInterval = setInterval(nextQuote, 3000);
    
    // Event listeners for buttons
    nextButton.addEventListener('click', () => {
        clearInterval(quoteInterval);
        nextQuote();
        quoteInterval = setInterval(nextQuote, 5000);
    });
    
    prevButton.addEventListener('click', () => {
        clearInterval(quoteInterval);
        prevQuote();
        quoteInterval = setInterval(nextQuote, 5000);
    });
    
    // Initialize carousel
    createIndicators();
    showQuote(currentQuoteIndex);
    
    // Gallery functionality
    const polaroidCards = document.querySelectorAll('.polaroid-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    // Add click event to each polaroid card
    polaroidCards.forEach(card => {
        card.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const caption = this.getAttribute('data-caption');
            
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        });
    });
    
    // Add click event to timeline images
    const timelineImages = document.querySelectorAll('.timeline-image-placeholder');
    timelineImages.forEach(imageContainer => {
        imageContainer.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const date = this.closest('.timeline-content').querySelector('.timeline-date').textContent;
            const text = this.closest('.timeline-content').querySelector('.timeline-text').textContent;
            
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = `${date}: ${text}`;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        });
    });
    
    // Handle video in timeline
    // Removed custom video handling since we're using native controls
    
    // Close lightbox when clicking on the close button
    closeLightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        
        // Pause any playing video when closing lightbox
        const video = document.querySelector('.video-placeholder video');
        if (video && !video.paused) {
            video.pause();
            document.querySelector('.play-overlay').style.display = 'flex';
        }
    });
    
    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
            
            // Pause any playing video when closing lightbox
            const video = document.querySelector('.video-placeholder video');
            if (video && !video.paused) {
                video.pause();
                document.querySelector('.play-overlay').style.display = 'flex';
            }
        }
    });
    
    // Message reveal functionality
    const revealButton = document.getElementById('revealMessage');
    const messageContent = document.querySelector('.message-content');
    const heartConfetti = document.getElementById('heartConfetti');
    const messageParagraphs = messageContent.querySelectorAll('p');
    
    revealButton.addEventListener('click', function() {
        // Add reveal class to show paragraphs with animation
        messageContent.classList.add('reveal');
        
        // Create heart confetti
        createHeartConfetti();
        
        // Change button text
        revealButton.textContent = 'Message Revealed!';
        revealButton.disabled = true;
        
        // Reveal paragraphs one by one
        messageParagraphs.forEach((p, index) => {
            setTimeout(() => {
                p.style.transitionDelay = '0.2s';
                p.style.opacity = '1';
                p.style.transform = 'translateY(0)';
            }, index * 500);
        });
    });
    
    // Create heart confetti animation
    function createHeartConfetti() {
        // Clear existing confetti
        heartConfetti.innerHTML = '';
        
        // Create 30 heart confetti pieces
        for (let i = 0; i < 30; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '-20px';
            heart.style.opacity = '0';
            heart.style.transform = `scale(${0.3 + Math.random() * 0.7})`;
            heart.style.animation = `confetti-fall ${3 + Math.random() * 4}s linear forwards`;
            heart.style.animationDelay = Math.random() * 2 + 's';
            heartConfetti.appendChild(heart);
        }
    }
    
    // Ending scene functionality
    const starBackground = document.getElementById('starBackground');
    const loveHeart = document.getElementById('love-heart');
    const heartOverlay = document.getElementById('heartOverlay');
    const closeOverlay = document.querySelector('.close-overlay');
    
    // Create star background
    function createStarBackground() {
        starBackground.innerHTML = '';
        const starCount = 100;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = Math.random() * 3 + 1 + 'px';
            star.style.height = star.style.width;
            star.style.animationDelay = Math.random() * 5 + 's';
            starBackground.appendChild(star);
        }
    }
    
    // Initialize star background
    createStarBackground();
    
    // Love heart click event
    loveHeart.addEventListener('click', function() {
        heartOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Close overlay event
    closeOverlay.addEventListener('click', function() {
        heartOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close overlay when clicking outside content
    heartOverlay.addEventListener('click', function(e) {
        if (e.target === heartOverlay) {
            heartOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Add typewriter effect to ending text
    const endingText = document.querySelector('.ending-text');
    const endingTextContent = endingText.textContent;
    endingText.textContent = '';
    
    function typeEndingText() {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < endingTextContent.length) {
                endingText.textContent += endingTextContent.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                // Add glow animation after typing completes
                endingText.style.animation = 'glow 2s infinite alternate';
            }
        }, 100);
    }
    
    // Start typing effect when ending section is in view
    const endingSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeEndingText();
            }
        });
    }, { threshold: 0.5 });
    
    endingSectionObserver.observe(document.getElementById('ending'));
    
    // Lazy loading for images with performance optimization
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.setAttribute('src', src);
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px' // Load images 50px before they're visible
        });
        
        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Accessibility improvements
    // Add aria-labels to interactive elements
    document.querySelectorAll('.polaroid-card').forEach((card, index) => {
        card.setAttribute('aria-label', `Memory ${index + 1}`);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
    });
    
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.setAttribute('aria-label', `Timeline item ${index + 1}`);
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('polaroid-card')) {
                focusedElement.click();
            }
        }
    });
    
    // Performance optimization: Debounced resize handler
    const handleResize = debounce(() => {
        // Reinitialize star background on resize
        createStarBackground();
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Performance optimization: Preload critical assets
    const preloadImages = () => {
        const images = [
            'memory1.jpg', 'memory2.jpg', 'memory3.jpg', 
            'memory4.jpg', 'memory5.jpg', 'memory6.jpg', 'memory7.jpg',
            'video-thumbnail.jpg'
        ];
        
        images.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = src;
            document.head.appendChild(link);
        });
    };
    
    // Preload images when page is loaded
    window.addEventListener('load', preloadImages);
});