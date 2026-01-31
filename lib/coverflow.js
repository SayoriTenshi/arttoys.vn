/**
 * Coverflow Carousel for TikTok Videos
 * Auto-rotates every 5 seconds, stops when user interacts
 */

$(document).ready(function() {
  const $carousel = $('.coverflow-carousel');
  const $container = $('.coverflow-container');
  const $items = $('.coverflow-item');
  const $dots = $('.coverflow-dot');
  const $prevBtn = $('.coverflow-prev');
  const $nextBtn = $('.coverflow-next');

  const totalItems = $items.length;
  let currentIndex = Math.floor(totalItems / 2); // Start with center item
  let autoRotateInterval = null;
  let isPlaying = false;

  // Position configurations for 5 items
  // Index relative to center: -2, -1, 0, 1, 2
  // x = horizontal offset (percentage), z = depth, scale = size multiplier
  const positions = {
    '-2': { x: -120, z: -350, scale: 0.55, opacity: 0.4, zIndex: 1 },
    '-1': { x: -55, z: -150, scale: 0.75, opacity: 0.7, zIndex: 2 },
    '0':  { x: 0, z: 0, scale: 1, opacity: 1, zIndex: 3 },
    '1':  { x: 55, z: -150, scale: 0.75, opacity: 0.7, zIndex: 2 },
    '2':  { x: 120, z: -350, scale: 0.55, opacity: 0.4, zIndex: 1 }
  };

  /**
   * Update carousel positions
   */
  function updateCarousel() {
    $items.each(function(index) {
      const $item = $(this);
      let relativeIndex = index - currentIndex;

      // Wrap around for infinite effect
      if (relativeIndex > 2) relativeIndex -= totalItems;
      if (relativeIndex < -2) relativeIndex += totalItems;

      // Clamp to visible range
      if (relativeIndex < -2 || relativeIndex > 2) {
        $item.css({
          opacity: 0,
          pointerEvents: 'none'
        });
        return;
      }

      const pos = positions[relativeIndex.toString()];

      $item.css({
        transform: `translateX(${pos.x}%) translateZ(${pos.z}px) scale(${pos.scale})`,
        opacity: pos.opacity,
        zIndex: pos.zIndex,
        pointerEvents: relativeIndex === 0 ? 'auto' : 'auto'
      });

      // Add/remove active class
      $item.toggleClass('active', relativeIndex === 0);
    });

    // Update dots
    $dots.removeClass('active');
    $dots.filter(`[data-index="${currentIndex}"]`).addClass('active');
  }

  /**
   * Go to next slide
   */
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  }

  /**
   * Go to previous slide
   */
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  }

  /**
   * Go to specific slide
   */
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  /**
   * Start auto-rotation
   */
  function startAutoRotate() {
    if (isPlaying) return; // Don't start if video is playing

    stopAutoRotate();
    autoRotateInterval = setInterval(function() {
      nextSlide();
    }, 5000);
  }

  /**
   * Stop auto-rotation
   */
  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  /**
   * Handle video play - stop auto-rotation
   */
  function onVideoPlay() {
    isPlaying = true;
    stopAutoRotate();
  }

  /**
   * Handle video pause/end - resume auto-rotation
   */
  function onVideoStop() {
    isPlaying = false;
    startAutoRotate();
  }

  // Event Listeners

  // Navigation buttons
  $prevBtn.on('click', function() {
    prevSlide();
    stopAutoRotate();
    // Restart after user interaction (unless video is playing)
    setTimeout(startAutoRotate, 10000);
  });

  $nextBtn.on('click', function() {
    nextSlide();
    stopAutoRotate();
    setTimeout(startAutoRotate, 10000);
  });

  // Dot indicators
  $dots.on('click', function() {
    const index = parseInt($(this).data('index'));
    goToSlide(index);
    stopAutoRotate();
    setTimeout(startAutoRotate, 10000);
  });

  // Click on item to center it
  $items.on('click', function() {
    const index = parseInt($(this).data('index'));
    if (index !== currentIndex) {
      goToSlide(index);
      stopAutoRotate();
      setTimeout(startAutoRotate, 10000);
    }
  });

  // Detect video play/pause events (for embedded TikTok videos)
  // TikTok embeds create iframes, so we listen for clicks on the item
  $items.on('click', '.tiktok-placeholder, .tiktok-embed, iframe', function(e) {
    onVideoPlay();
    // Add a class to indicate playing state
    $(this).closest('.coverflow-item').addClass('video-playing');
  });

  // Pause/resume on hover
  $carousel.on('mouseenter', function() {
    stopAutoRotate();
  });

  $carousel.on('mouseleave', function() {
    if (!isPlaying) {
      startAutoRotate();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  $carousel.on('touchstart', function(e) {
    touchStartX = e.originalEvent.touches[0].clientX;
    stopAutoRotate();
  });

  $carousel.on('touchend', function(e) {
    touchEndX = e.originalEvent.changedTouches[0].clientX;
    handleSwipe();
    setTimeout(startAutoRotate, 10000);
  });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Keyboard navigation
  $(document).on('keydown', function(e) {
    if (!$carousel.is(':visible')) return;

    if (e.key === 'ArrowLeft') {
      prevSlide();
      stopAutoRotate();
      setTimeout(startAutoRotate, 10000);
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      stopAutoRotate();
      setTimeout(startAutoRotate, 10000);
    }
  });

  // Initialize
  updateCarousel();
  startAutoRotate();

  // Expose functions globally for potential TikTok embed callbacks
  window.coverflowPause = onVideoPlay;
  window.coverflowResume = onVideoStop;
});
