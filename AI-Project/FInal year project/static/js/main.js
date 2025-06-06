document.addEventListener('DOMContentLoaded', function() {
    // Generate random avatars for users without profile pictures
    const defaultProfileImages = document.querySelectorAll('img[src*="default_profile.jpg"]');
    defaultProfileImages.forEach(img => {
        // Get username from alt attribute or data attribute
        const username = img.getAttribute('alt') || 'user';
        // Generate a random avatar using DiceBear API with a unique seed based on username
        img.src = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(username)}.svg`;
    });
    
    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const likeIcon = this.querySelector('i');
            const likeCountElement = this.closest('.post-actions').nextElementSibling.querySelector('.like-count');
            
            fetch(`/like_post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.action === 'liked') {
                        likeIcon.classList.remove('far');
                        likeIcon.classList.add('fas', 'text-danger');
                    } else {
                        likeIcon.classList.remove('fas', 'text-danger');
                        likeIcon.classList.add('far');
                    }
                    
                    likeCountElement.textContent = data.likeCount;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
    
    // Comment button functionality
    const commentButtons = document.querySelectorAll('.comment-btn');
    
    commentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const commentInput = this.closest('.post-card').querySelector('.add-comment input');
            commentInput.focus();
        });
    });
    
    // Profile tabs functionality
    const profileTabs = document.querySelectorAll('.profile-tabs .tab');
    
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            profileTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Image preview for post creation
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.createElement('img');
                    preview.src = e.target.result;
                    preview.style.maxWidth = '100%';
                    preview.style.maxHeight = '300px';
                    preview.style.marginTop = '10px';
                    
                    const previewContainer = document.getElementById('image-preview');
                    if (previewContainer) {
                        previewContainer.innerHTML = '';
                        previewContainer.appendChild(preview);
                    } else {
                        const newPreviewContainer = document.createElement('div');
                        newPreviewContainer.id = 'image-preview';
                        newPreviewContainer.appendChild(preview);
                        imageInput.parentNode.appendChild(newPreviewContainer);
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
});

// Enhanced UI interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Like button animation
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('like-animation');
            setTimeout(() => {
                this.classList.remove('like-animation');
            }, 500);
        });
    });

    // AJAX for like functionality
    document.querySelectorAll('.like-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            const likeBtn = this.querySelector('.like-btn');
            const likeCount = document.querySelector(`#like-count-${postId}`);
            
            fetch(`/like_post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.action === 'liked') {
                        likeBtn.classList.add('active');
                        likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    } else {
                        likeBtn.classList.remove('active');
                        likeBtn.innerHTML = '<i class="far fa-heart"></i>';
                    }
                    likeCount.textContent = data.likeCount;
                }
            });
        });
    });

    // Comment form submission with AJAX
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const commentInput = this.querySelector('input[name="content"]');
            if (!commentInput.value.trim()) {
                e.preventDefault();
                showToast('Comment cannot be empty');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Image preview for post creation
    const imageInput = document.querySelector('#image');
    const imagePreview = document.querySelector('#image-preview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Notification badge pulse animation
    const notificationBadge = document.querySelector('.badge');
    if (notificationBadge) {
        notificationBadge.classList.add('pulse');
    }

    // Custom toast function
    window.showToast = function(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(container);
        }
        
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        document.getElementById('toast-container').appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    }

    // Double-click to like posts
    document.querySelectorAll('.post-image-container').forEach(container => {
        container.addEventListener('dblclick', function() {
            const postId = this.getAttribute('data-post-id');
            const likeForm = document.querySelector(`.like-form[data-post-id="${postId}"]`);
            const likeBtn = likeForm.querySelector('.like-btn');
            
            // Show heart animation
            const heart = document.createElement('div');
            heart.className = 'heart-animation';
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            this.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 1000);
            
            // Trigger like
            if (!likeBtn.classList.contains('active')) {
                likeForm.dispatchEvent(new Event('submit'));
            }
        });
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        let active = false;
        
        const lazyLoad = function() {
            if (active === false) {
                active = true;
                
                setTimeout(function() {
                    lazyImages.forEach(function(lazyImage) {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.classList.remove('lazy');
                            
                            lazyImages = lazyImages.filter(function(image) {
                                return image !== lazyImage;
                            });
                            
                            if (lazyImages.length === 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationChange', lazyLoad);
                            }
                        }
                    });
                    
                    active = false;
                }, 200);
            }
        };
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
});

// Add this to your existing main.js file or create it if it doesn't exist

// Profile picture preview
document.addEventListener('DOMContentLoaded', function() {
    const profilePicInput = document.getElementById('profile_pic');
    const profilePicPreview = document.getElementById('profile-pic-preview');
    
    if (profilePicInput && profilePicPreview) {
        profilePicInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePicPreview.src = e.target.result;
                    profilePicPreview.classList.remove('d-none');
                }
                reader.readAsDataURL(file);
            }
        });
    }
});