// Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    // Slider
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[n].classList.add('active');
        currentSlide = n;
    }
    
    function nextSlide() {
        let newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }
    
    function prevSlide() {
        let newIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newIndex);
    }
    
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Auto slide
        setInterval(nextSlide, 5000);
    }
    
    // Check if user is logged in and redirect if trying to access protected pages
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const protectedPages = ['indexusuario.html', 'perfil.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!currentUser) {
            window.location.href = '';
        }
    }
    
    // If user is logged in and tries to access login/register, redirect to user home
    if (currentUser && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'indexusuario.html';
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Carrusel de productos
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    
    let currentIndex = 0;
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    // Posicionar slides
    const setSlidePosition = () => {
        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });
    };
    
    setSlidePosition();
    
    // Mover al slide específico
    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('active');
        targetSlide.classList.add('active');
    };
    
    // Botón siguiente
    nextBtn.addEventListener('click', () => {
        const currentSlide = document.querySelector('.carousel-slide.active');
        const nextSlide = currentSlide.nextElementSibling || slides[0];
        
        moveToSlide(track, currentSlide, nextSlide);
        currentIndex = slides.indexOf(nextSlide);
    });
    
    // Botón anterior
    prevBtn.addEventListener('click', () => {
        const currentSlide = document.querySelector('.carousel-slide.active');
        const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
        
        moveToSlide(track, currentSlide, prevSlide);
        currentIndex = slides.indexOf(prevSlide);
    });
    
    // Auto-avance cada 5 segundos
    setInterval(() => {
        const currentSlide = document.querySelector('.carousel-slide.active');
        const nextSlide = currentSlide.nextElementSibling || slides[0];
        
        moveToSlide(track, currentSlide, nextSlide);
        currentIndex = slides.indexOf(nextSlide);
    }, 5000);
    
    // Funcionalidad del carrito
    const addToCartButtons = document.querySelectorAll('.btn-cart, .btn-add-cart');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            count++;
            cartCount.textContent = count;
            cartCount.style.display = 'flex';
            
            // Animación
            button.textContent = '✓ Añadido';
            button.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                button.textContent = 'Añadir';
                button.style.backgroundColor = '';
            }, 2000);
        });
    });
    
    // Contador de cantidad
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quantityElement = e.target.nextElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = quantity + 1;
        });
    });
    
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quantityElement = e.target.previousElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantityElement.textContent = quantity - 1;
            }
        });
    });
});


