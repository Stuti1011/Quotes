// Global Mouse Move Ripple Effect
        document.addEventListener('mousemove', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        // Loader
        window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 1000); // Optional delay
});
        // Theme Toggle
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });

        

        // Quote Carousel
        let quoteCards = document.querySelectorAll('.quote-card');
        let currentQuote = 0;

        function showNextQuote() {
            quoteCards[currentQuote].classList.remove('active');
            currentQuote = (currentQuote + 1) % quoteCards.length;
            quoteCards[currentQuote].classList.add('active');
            filterQuotes();
        }

        function showRandomQuote() {
            quoteCards[currentQuote].classList.remove('active');
            currentQuote = Math.floor(Math.random() * quoteCards.length);
            quoteCards[currentQuote].classList.add('active');
            filterQuotes();
        }

        quoteCards[currentQuote].classList.add('active');
        setInterval(showNextQuote, 7000);

        // Drag-and-Drop
        let dragCard = null;
        const carousel = document.getElementById('quote-carousel');

        function updateQuoteCards() {
            quoteCards = document.querySelectorAll('.quote-card');
            quoteCards.forEach(card => {
                card.addEventListener('dragstart', () => {
                    dragCard = card;
                    setTimeout(() => card.style.opacity = '0.5', 0);
                });

                card.addEventListener('dragend', () => {
                    dragCard.style.opacity = '1';
                    dragCard = null;
                });

                card.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                card.addEventListener('drop', () => {
                    if (dragCard !== card) {
                        const allCards = Array.from(quoteCards);
                        const dragIndex = allCards.indexOf(dragCard);
                        const dropIndex = allCards.indexOf(card);
                        if (dragIndex < dropIndex) {
                            card.after(dragCard);
                        } else {
                            card.before(dragCard);
                        }
                        updateQuoteCards();
                    }
                });
            });
        }

        updateQuoteCards();

        // 3D Tilt Effect
        VanillaTilt.init(document.querySelectorAll('.quote-card'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3
        });

        // Ripple Effect for Buttons
        document.querySelectorAll('.ripple-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
                ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Like Button
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('liked');
                const icon = btn.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                saveQuotes();
            });
        });

        // Share Button
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const quoteCard = btn.closest('.quote-card');
                const quote = quoteCard.dataset.quote;
                const author = quoteCard.dataset.author;
                const text = `"${quote}" - ${author}`;
                if (navigator.share) {
                    navigator.share({ text })
                        .catch(err => console.error('Share failed:', err));
                } else {
                    alert('Copy this quote: ' + text);
                }
            });
        });

        // Star Rating
        function initStarRatings() {
            document.querySelectorAll('.star-rating').forEach(rating => {
                const stars = rating.querySelectorAll('i');
                stars.forEach(star => {
                    star.addEventListener('click', () => {
                        const value = parseInt(star.dataset.value);
                        rating.dataset.rating = value;
                        stars.forEach(s => {
                            s.classList.toggle('rated', parseInt(s.dataset.value) <= value);
                            s.classList.toggle('fas', parseInt(s.dataset.value) <= value);
                            s.classList.toggle('far', parseInt(s.dataset.value) > value);
                        });
                        saveQuotes();
                    });
                });
            });
        }

        initStarRatings();

        // Quote Submission
        function submitQuote() {
            const quoteText = document.getElementById('quote-text').value.trim();
            const quoteAuthor = document.getElementById('quote-author').value.trim();
            const quoteDescription = document.getElementById('quote-description').value.trim();

            if (!quoteText || !quoteAuthor) {
                alert('Please fill in the quote and author fields.');
                return;
            }

            const newQuoteCard = document.createElement('div');
            newQuoteCard.className = 'quote-card';
            newQuoteCard.dataset.quote = quoteText;
            newQuoteCard.dataset.author = quoteAuthor;
            newQuoteCard.draggable = true;
            newQuoteCard.innerHTML = `
                <h2>"${quoteText}"</h2>
                <p>- ${quoteAuthor}</p>
                ${quoteDescription ? `<p>${quoteDescription}</p>` : ''}
                <div class="star-rating" data-rating="0">
                    <i class="far fa-star" data-value="1"></i>
                    <i class="far fa-star" data-value="2"></i>
                    <i class="far fa-star" data-value="3"></i>
                    <i class="far fa-star" data-value="4"></i>
                    <i class="far fa-star" data-value="5"></i>
                </div>
                <div class="quote-actions">
                    <button class="like-btn" aria-label="Like Quote"><i class="far fa-heart"></i></button>
                    <button class="share-btn" aria-label="Share Quote"><i class="fas fa-share-alt"></i></button>
                </div>
            `;
            carousel.appendChild(newQuoteCard);

            // Confetti Animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Rebind Events
            newQuoteCard.querySelector('.like-btn').addEventListener('click', () => {
                const btn = newQuoteCard.querySelector('.like-btn');
                btn.classList.toggle('liked');
                const icon = btn.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                saveQuotes();
            });
            newQuoteCard.querySelector('.share-btn').addEventListener('click', () => {
                const text = `"${quoteText}" - ${quoteAuthor}`;
                if (navigator.share) {
                    navigator.share({ text })
                        .catch(err => console.error('Share failed:', err));
                } else {
                    alert('Copy this quote: ' + text);
                }
            });
            initStarRatings();
            updateQuoteCards();
            VanillaTilt.init(newQuoteCard, {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.3
            });

            document.getElementById('quote-text').value = '';
            document.getElementById('quote-author').value = '';
            document.getElementById('quote-description').value = '';
            updatePreview();
            saveQuotes();
            alert('Quote submitted successfully!');
        }

        // Live Preview
        const quoteTextInput = document.getElementById('quote-text');
        const quoteAuthorInput = document.getElementById('quote-author');
        const quoteDescInput = document.getElementById('quote-description');

        function updatePreview() {
            const quote = quoteTextInput.value.trim() || 'Your quote will appear here...';
            const author = quoteAuthorInput.value.trim() || 'Author';
            const desc = quoteDescInput.value.trim();
            document.getElementById('preview-text').textContent = `"${quote}"`;
            document.getElementById('preview-author').textContent = `- ${author}`;
            document.getElementById('preview-description').textContent = desc;
        }

        quoteTextInput.addEventListener('input', updatePreview);
        quoteAuthorInput.addEventListener('input', updatePreview);
        quoteDescInput.addEventListener('input', updatePreview);

        // Search and Filter
        const searchInput = document.getElementById('quote-search');
        searchInput.addEventListener('input', filterQuotes);

        function filterQuotes() {
            const searchTerm = searchInput.value.toLowerCase();
            quoteCards.forEach(card => {
                const quote = card.dataset.quote.toLowerCase();
                const author = card.dataset.author.toLowerCase();
                if (quote.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                    if (card.classList.contains('active')) {
                        card.classList.remove('active');
                        showNextQuote();
                    }
                }
            });
        }

        // Local Storage
        function saveQuotes() {
            const quotes = Array.from(quoteCards).map(card => ({
                quote: card.dataset.quote,
                author: card.dataset.author,
                description: card.querySelector('p:nth-child(3)')?.textContent || '',
                rating: card.querySelector('.star-rating').dataset.rating,
                liked: card.querySelector('.like-btn').classList.contains('liked')
            }));
            localStorage.setItem('quotes', JSON.stringify(quotes));
        }

        function loadQuotes() {
            const savedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
            savedQuotes.forEach(({ quote, author, description, rating, liked }) => {
                const newQuoteCard = document.createElement('div');
                newQuoteCard.className = 'quote-card';
                newQuoteCard.dataset.quote = quote;
                newQuoteCard.dataset.author = author;
                newQuoteCard.draggable = true;
                newQuoteCard.innerHTML = `
                    <h2>"${quote}"</h2>
                    <p>- ${author}</p>
                    ${description ? `<p>${description}</p>` : ''}
                    <div class="star-rating" data-rating="${rating}">
                        <i class="${parseInt(rating) >= 1 ? 'fas' : 'far'} fa-star" data-value="1"></i>
                        <i class="${parseInt(rating) >= 2 ? 'fas' : 'far'} fa-star" data-value="2"></i>
                        <i class="${parseInt(rating) >= 3 ? 'fas' : 'far'} fa-star" data-value="3"></i>
                        <i class="${parseInt(rating) >= 4 ? 'fas' : 'far'} fa-star" data-value="4"></i>
                        <i class="${parseInt(rating) >= 5 ? 'fas' : 'far'} fa-star" data-value="5"></i>
                    </div>
                    <div class="quote-actions">
                        <button class="like-btn ${liked ? 'liked' : ''}" aria-label="Like Quote"><i class="${liked ? 'fas' : 'far'} fa-heart"></i></button>
                        <button class="share-btn" aria-label="Share Quote"><i class="fas fa-share-alt"></i></button>
                    </div>
                `;
                carousel.appendChild(newQuoteCard);
            });
            updateQuoteCards();
            initStarRatings();
            quoteCards = document.querySelectorAll('.quote-card');
            quoteCards.forEach(card => {
                VanillaTilt.init(card, {
                    max: 15,
                    speed: 400,
                    glare: true,
                    'max-glare': 0.3
                });
                card.querySelector('.like-btn').addEventListener('click', () => {
                    const btn = card.querySelector('.like-btn');
                    btn.classList.toggle('liked');
                    const icon = btn.querySelector('i');
                    icon.classList.toggle('far');
                    icon.classList.toggle('fas');
                    saveQuotes();
                });
                card.querySelector('.share-btn').addEventListener('click', () => {
                    const text = `"${card.dataset.quote}" - ${card.dataset.author}`;
                    if (navigator.share) {
                        navigator.share({ text })
                            .catch(err => console.error('Share failed:', err));
                    } else {
                        alert('Copy this quote: ' + text);
                    }
                });
            });
            if (quoteCards.length > 0) {
                quoteCards[currentQuote].classList.add('active');
            }
        }

        loadQuotes();

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') showNextQuote();
            if (e.key === 'ArrowLeft') {
                quoteCards[currentQuote].classList.remove('active');
                currentQuote = (currentQuote - 1 + quoteCards.length) % quoteCards.length;
                quoteCards[currentQuote].classList.add('active');
                filterQuotes();
            }
            if (e.key === 'Enter' && document.activeElement === quoteTextInput) submitQuote();
        });

        // Scroll Pop-up Effect
        const popUps = document.querySelectorAll('.pop-up');
        const customerCards = document.querySelectorAll('.customer-card');

        function checkScroll() {
            popUps.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    el.classList.add('visible');
                }
            });

            customerCards.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    el.classList.add('visible');
                }
            });
        }

        window.addEventListener('scroll', checkScroll);
        checkScroll();