document.addEventListener('DOMContentLoaded', function () {
    // Select the necessary elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Debug check - ensure elements exist before adding event listeners
   

    menuToggle.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent click from closing the menu immediately
        this.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Log for debugging
        console.log('Menu toggled. Active state:', navLinks.classList.contains('active'));
    });

    // Close menu and handle smooth scrolling on link click
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Close the menu
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');

            // Handle hash links (section navigation)
            if (href.startsWith('#')) {
                e.preventDefault(); // Prevent default jump to the anchor
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetElement.offsetTop - 60, // Adjust for navbar height
                            behavior: 'smooth',
                        });
                    }, 300);
                }
            }
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', function (event) {
        if (
            navLinks.classList.contains('active') &&
            !event.target.closest('.nav-links') &&
            !event.target.closest('.menu-toggle')
        ) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Reset menu state on window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Ensure the mobile menu starts in a closed state
    if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});


// product gallery
document.addEventListener('DOMContentLoaded', function() {
    const mediaContainer = document.querySelector('.media-container');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const view3dButton = document.querySelector('.view-3d-button');
    const scrollUpButton = document.querySelector('.scroll-up');
    const scrollDownButton = document.querySelector('.scroll-down');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    const mainPrevButton = document.querySelector('.main-prev');
    const mainNextButton = document.querySelector('.main-next');
    const mainDisplay = document.querySelector('.main-display');
    
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    
    // Enable touch swiping for mobile/tablet
    mainDisplay.classList.add('swipe-enabled');
    
    // Function to update the main display content
    function updateMainDisplay(thumbnail, direction = null) {
        // Remove all active classes from thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        thumbnail.classList.add('active');
        
        // Get the current index
        currentIndex = Array.from(thumbnails).indexOf(thumbnail);
        
        // Set up slide animation if direction is provided
        let slideClass = '';
        if (direction === 'next') {
            slideClass = 'media-slide-left';
        } else if (direction === 'prev') {
            slideClass = 'media-slide-right';
        }
        
        // Apply slide out animation if needed
        if (slideClass) {
            mediaContainer.classList.add('media-slide-transition');
            mediaContainer.classList.add(slideClass);
            
            // Wait for animation to complete before updating content
            setTimeout(() => {
                updateMediaContent(thumbnail);
                
                // Reset position but keep hidden
                mediaContainer.classList.remove(slideClass);
                mediaContainer.classList.add(direction === 'next' ? 'media-slide-right' : 'media-slide-left');
                
                // Force reflow
                void mediaContainer.offsetWidth;
                
                // Slide in from opposite direction
                mediaContainer.classList.remove('media-slide-right', 'media-slide-left');
                mediaContainer.classList.add('media-slide-center');
                
                // Clean up after transition
                setTimeout(() => {
                    mediaContainer.classList.remove('media-slide-transition', 'media-slide-center');
                }, 300);
            }, 300);
        } else {
            // No animation, just update content
            updateMediaContent(thumbnail);
        }
        
        // Ensure the selected thumbnail is visible
        ensureThumbnailVisible(thumbnail);
    }
    
    // Function to update the media content
    function updateMediaContent(thumbnail) {
        // Clear the media container
        mediaContainer.innerHTML = '';
        
        const mediaType = thumbnail.dataset.type;
        const mediaSrc = thumbnail.dataset.src;
        const modelSrc = thumbnail.dataset.model;
        
        // Update the main display based on media type
        if (mediaType === 'image') {
            const img = document.createElement('img');
            img.src = mediaSrc;
            img.alt = 'Product Image';
            mediaContainer.appendChild(img);
            
            // Reset 3D button state
            view3dButton.classList.remove('active');
            
            // Show navigation buttons
            mainPrevButton.style.display = 'flex';
            mainNextButton.style.display = 'flex';
        } else if (mediaType === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = false;
            video.style.width = '100%';
            video.style.height = 'auto';
            video.style.maxHeight = '100%';
            
            const source = document.createElement('source');
            source.src = mediaSrc;
            source.type = 'video/mp4';
            
            video.appendChild(source);
            mediaContainer.appendChild(video);
            
            // Reset 3D button state
            view3dButton.classList.remove('active');
            
            // Show navigation buttons
            mainPrevButton.style.display = 'flex';
            mainNextButton.style.display = 'flex';
        } else if (mediaType === '3d') {
            showModel(modelSrc);
        }
        
        // Always show 3D button if a model source is available
        view3dButton.style.display = modelSrc ? 'flex' : 'none';
    }

    // Function to show 3D model
    function showModel(modelSrc) {
        try {
            // Create the model viewer element
            const modelViewer = document.createElement('model-viewer');
            modelViewer.src = modelSrc;
            modelViewer.alt = "3D Model";
            modelViewer.setAttribute('camera-controls', '');
            modelViewer.setAttribute('auto-rotate', '');
            modelViewer.setAttribute('shadow-intensity', '1');
            modelViewer.style.width = '100%';
            modelViewer.style.height = '100%';
            
            // Clear and append to media container
            mediaContainer.innerHTML = '';
            mediaContainer.appendChild(modelViewer);
            
            // Set 3D button as active
            view3dButton.classList.add('active');
            
            // Hide navigation buttons in 3D mode
            mainPrevButton.style.display = 'none';
            mainNextButton.style.display = 'none';
        } catch (error) {
            console.error('Error showing 3D model:', error);
            
            // Fallback message
            const errorMsg = document.createElement('div');
            errorMsg.textContent = '3D model viewer not available.';
            errorMsg.style.padding = '20px';
            mediaContainer.appendChild(errorMsg);
        }
    }

    // Function to go to the next image
    function goToNext() {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        updateMainDisplay(thumbnails[currentIndex], 'next');
    }
    
    // Function to go to the previous image
    function goToPrev() {
        currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateMainDisplay(thumbnails[currentIndex], 'prev');
    }
    
    // Function to ensure the active thumbnail is visible
    function ensureThumbnailVisible(thumbnail) {
        const isVertical = window.innerWidth > 768;
        const container = thumbnailsContainer;
        
        if (isVertical) {
            // Vertical scroll
            const thumbTop = thumbnail.offsetTop;
            const thumbBottom = thumbTop + thumbnail.offsetHeight;
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.offsetHeight;
            
            if (thumbTop < containerTop) {
                container.scrollTo({
                    top: thumbTop - 10,
                    behavior: 'smooth'
                });
            } else if (thumbBottom > containerBottom) {
                container.scrollTo({
                    top: thumbBottom - container.offsetHeight + 10,
                    behavior: 'smooth'
                });
            }
        } else {
            // Horizontal scroll for mobile
            const thumbLeft = thumbnail.offsetLeft;
            const thumbRight = thumbLeft + thumbnail.offsetWidth;
            const containerLeft = container.scrollLeft;
            const containerRight = containerLeft + container.offsetWidth;
            
            if (thumbLeft < containerLeft) {
                container.scrollTo({
                    left: thumbLeft - 10,
                    behavior: 'smooth'
                });
            } else if (thumbRight > containerRight) {
                container.scrollTo({
                    left: thumbRight - container.offsetWidth + 10,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Click event for side scroll buttons (up/down or left/right)
    scrollUpButton.addEventListener('click', function() {
        const scrollAmount = window.innerWidth <= 768 ? 150 : 200;
        
        if (window.innerWidth <= 768) {
            // In mobile view, scroll horizontally
            thumbnailsContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            // In desktop view, scroll vertically
            thumbnailsContainer.scrollBy({
                top: -scrollAmount,
                behavior: 'smooth'
            });
        }
    });

    scrollDownButton.addEventListener('click', function() {
        const scrollAmount = window.innerWidth <= 768 ? 150 : 200;
        
        if (window.innerWidth <= 768) {
            // In mobile view, scroll horizontally
            thumbnailsContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        } else {
            // In desktop view, scroll vertically
            thumbnailsContainer.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
    });

    // Click event for thumbnails
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            updateMainDisplay(this);
        });
    });

    // Click event for 3D button
    view3dButton.addEventListener('click', function() {
        const activeThumbnail = document.querySelector('.thumbnail.active');
        
        if (!activeThumbnail) return;
        
        const modelSrc = activeThumbnail.dataset.model;
        
        if (!this.classList.contains('active') && modelSrc) {
            // Switch to 3D view
            showModel(modelSrc);
        } else if (this.classList.contains('active')) {
            // Switch back to regular media
            updateMainDisplay(activeThumbnail);
        }
    });
    
    // Main display navigation buttons
    mainPrevButton.addEventListener('click', goToPrev);
    mainNextButton.addEventListener('click', goToNext);
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Ignore if in 3D mode
        if (view3dButton.classList.contains('active')) return;
        
        if (e.key === 'ArrowRight') {
            goToNext();
        } else if (e.key === 'ArrowLeft') {
            goToPrev();
        }
    });
    
    // Touch swipe functionality for mobile/tablet
    mainDisplay.addEventListener('touchstart', function(e) {
        // Only handle swipes if not in 3D mode
        if (view3dButton.classList.contains('active')) return;
        
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
    }, { passive: true });
    
    mainDisplay.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        
        // Add some visual feedback during swipe
        if (Math.abs(diffX) > 30) {
            if (diffX > 0) {
                // Swiping left (next)
                mediaContainer.style.transform = `translateX(${-diffX/5}px)`;
            } else {
                // Swiping right (prev)
                mediaContainer.style.transform = `translateX(${-diffX/5}px)`;
            }
        }
    }, { passive: true });
    
    mainDisplay.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        isSwiping = false;
        
        // Reset any inline transform
        mediaContainer.style.transform = '';
        
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        
        // Swipe threshold
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left (next)
                goToNext();
            } else {
                // Swipe right (prev)
                goToPrev();
            }
        }
    }, { passive: true });
    
    // Handle window resize to adjust layout
    window.addEventListener('resize', function() {
        // Update scroll button positions and orientation
        if (window.innerWidth <= 768) {
            scrollUpButton.style.transform = 'translateY(-50%) rotate(270deg)';
            scrollUpButton.style.left = '0';
            scrollUpButton.style.top = '50%';
            
            scrollDownButton.style.transform = 'translateY(-50%) rotate(90deg)';
            scrollDownButton.style.right = '0';
            scrollDownButton.style.left = 'auto';
            scrollDownButton.style.top = '50%';
        } else {
            scrollUpButton.style.transform = 'translateX(-50%)';
            scrollUpButton.style.left = '50%';
            scrollUpButton.style.top = '0';
            
            scrollDownButton.style.transform = 'translateX(-50%)';
            scrollDownButton.style.left = '50%';
            scrollDownButton.style.right = 'auto';
            scrollDownButton.style.top = 'auto';
            scrollDownButton.style.bottom = '0';
        }
        
        // Ensure the active thumbnail is visible after resize
        const activeThumbnail = document.querySelector('.thumbnail.active');
        if (activeThumbnail) {
            ensureThumbnailVisible(activeThumbnail);
        }
    });

    // Initialize with the first thumbnail
    updateMainDisplay(thumbnails[0]);
    
    // Trigger a resize event to set initial positions
    window.dispatchEvent(new Event('resize'));
});


