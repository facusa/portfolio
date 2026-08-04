// Countdown Timer Logic
const countdown = () => {
    const targetDate = new Date('Oct 24, 2026 20:00:00');
    const now = new Date();
    const gap = targetDate.getTime() - now.getTime();

    // How the time works
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Calculate
    if (gap > 0) {
        const textDayTotal = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.getElementById('days').innerText = textDayTotal.toString().padStart(2, '0');
        document.getElementById('hours').innerText = textHour.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = textMinute.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = textSecond.toString().padStart(2, '0');
    } else {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
    }
};

setInterval(countdown, 1000);

// Envelope & Audio Logic
const envelopeContainer = document.getElementById('envelope-container');
const envelopeScreen = document.getElementById('envelope-screen');
const audioControl = document.getElementById('audioControl');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

// Open envelope on click anywhere on screen
envelopeScreen.addEventListener('click', () => {
    envelopeContainer.classList.add('open');

    bgMusic.play().then(() => {
        isPlaying = true;
        audioControl.classList.add('playing');
        audioControl.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(e => console.log("Audio play error:", e));

    setTimeout(() => {
        envelopeScreen.classList.add('hidden');
        document.body.classList.remove('locked');
        setTimeout(() => {
            envelopeScreen.style.display = 'none';
        }, 1000);
    }, 1500);
}, { once: true });

bgMusic.addEventListener('play', () => {
    isPlaying = true;
    audioControl.classList.add('playing');
    audioControl.innerHTML = '<i class="fas fa-pause"></i>';
});

bgMusic.addEventListener('pause', () => {
    isPlaying = false;
    audioControl.classList.remove('playing');
    audioControl.innerHTML = '<i class="fas fa-music"></i>';
});

audioControl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
        bgMusic.pause();
    } else {
        bgMusic.play();
    }
});

// Toggle Gifts Details
window.toggleGifts = () => {
    const details = document.getElementById('giftsDetails');
    details.classList.toggle('active');
};

// RSVP Form Submission
// RSVP Form Submission & Select Logic
const rsvpForm = document.getElementById('rsvpForm');
const foodSelect = document.getElementById('food');
const otherFoodGroup = document.getElementById('other-food-group');
const otherFoodInput = document.getElementById('other-food');
const rsvpMessage = document.getElementById('rsvp-message');
const rsvpResponseText = document.getElementById('rsvp-response-text');
const submitBtn = document.getElementById('submitBtn');

// Lógica para mostrar/ocultar el campo "Otra"
if (foodSelect) {
    foodSelect.addEventListener('change', function () {
        if (this.value === 'Otra') {
            otherFoodGroup.style.display = 'block';
            otherFoodInput.setAttribute('required', 'required');
        } else {
            otherFoodGroup.style.display = 'none';
            otherFoodInput.removeAttribute('required');
            otherFoodInput.value = ''; // Limpiar el campo si cambian de opción
        }
    });
}

// URL del Google Apps Script (Reemplazar con la URL que obtengas en el paso 4)
const scriptURL = 'https://script.google.com';

if (rsvpForm) {
    rsvpForm.addEventListener('submit', e => {
        e.preventDefault();

        // Cambiar botón a estado de carga
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Obtener valores para el mensaje personalizado
        const attendance = document.querySelector('input[name="Asistencia"]:checked').value;
        const foodValue = foodSelect.value;

        // Preparar los datos a enviar
        let formData = new FormData(rsvpForm);

        // Ajustar el valor de la restricción alimenticia final
        let finalFood = foodValue;
        if (foodValue === 'Otra') {
            finalFood = otherFoodInput.value;
        }
        formData.set('Restriccion', finalFood);
        formData.set('Asistencia', attendance === 'yes' ? 'Sí' : 'No');

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                // 1. Mostrar el cartelito flotante
                rsvpMessage.style.display = 'block';
                // Pequeño delay para que la transición de CSS funcione
                setTimeout(() => { rsvpMessage.style.opacity = '1'; }, 10);

                if (attendance === 'yes') {
                    rsvpResponseText.innerText = '¡Te esperamos!';
                    // Confetti
                    var duration = 500;
                    var end = Date.now() + duration;
                    (function frame() {
                        confetti({ particleCount: 1, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#5f6f4a', '#2e3a22', '#c2cbb6'] });
                        confetti({ particleCount: 1, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#5f6f4a', '#2e3a22', '#c2cbb6'] });
                        if (Date.now() < end) { requestAnimationFrame(frame); }
                    }());
                } else {
                    rsvpResponseText.innerText = 'Gracias por avisarnos, ¡te vamos a extrañar!';
                }

                // 2. Limpiar el formulario y habilitar el botón nuevamente
                rsvpForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar';
                otherFoodGroup.style.display = 'none'; // Ocultar campo "Otra"

                // 3. Ocultar el cartelito después de 2 segundos
                setTimeout(() => {
                    rsvpMessage.style.opacity = '0';
                    setTimeout(() => { rsvpMessage.style.display = 'none'; }, 300);
                }, 3000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar';
                alert('Hubo un problema al enviar. Por favor intentá de nuevo.');
            });
    });
}

// Polaroid Gallery Logic
document.addEventListener('DOMContentLoaded', () => {
    // Start countdown immediately
    countdown();

    // --- Polaroid Gallery ---
    const cards = Array.from(document.querySelectorAll('.polaroid-card'));
    const totalEl = document.getElementById('galleryTotal');
    const currentEl = document.getElementById('galleryCurrentIndex');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const stage = document.getElementById('polaroidStage');

    let current = 0;
    const total = cards.length;

    if (totalEl) totalEl.textContent = total;

    // Pre-assign slight random base rotations per card for variety
    const baseRotations = [2, -3, 1, 4, -2, 3, -4, 1, -1, 3, -3, 2];

    function applyStates() {
        cards.forEach((card, i) => {
            card.classList.remove(
                'state-active', 'state-next-1', 'state-next-2',
                'state-next-3', 'state-hidden', 'state-past'
            );
            const diff = i - current;
            if (diff === 0) {
                card.classList.add('state-active');
            } else if (diff === 1) {
                card.classList.add('state-next-1');
            } else if (diff === 2) {
                card.classList.add('state-next-2');
            } else if (diff === 3) {
                card.classList.add('state-next-3');
            } else if (diff > 3) {
                card.classList.add('state-hidden');
            } else {
                // diff < 0 → already seen
                card.classList.add('state-past');
            }
        });

        if (currentEl) currentEl.textContent = current + 1;

        // Update button states
        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current === total - 1;
    }

    function goNext() {
        if (current >= total - 1) return;

        // Animación rápida de salida para la carta activa
        const activeCard = cards[current];
        activeCard.classList.add('flick-out');

        // ESTE ES EL CAMBIO: Pasamos a la siguiente carta inmediatamente 
        // para que empiece a ponerse recta sin delay
        current++;
        applyStates();

        // Solo dejamos la limpieza de la clase adentro del temporizador
        setTimeout(() => {
            activeCard.classList.remove('flick-out');
        }, 320);
    }

    function goPrev() {
        if (current <= 0) return;
        current--;
        applyStates();
    }

    // Init
    applyStates();

    // Button listeners
    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // Click on active card = advance
    if (stage) {
        stage.addEventListener('click', (e) => {
            const activeCard = cards[current];
            if (e.target.closest('.polaroid-card') === activeCard) {
                goNext();
            }
        });
    }

    // Touch / swipe support
    let touchStartX = 0;
    let touchStartY = 0;
    if (stage) {
        stage.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        stage.addEventListener('touchend', e => {
            const dx = touchStartX - e.changedTouches[0].screenX;
            const dy = Math.abs(touchStartY - e.changedTouches[0].screenY);
            if (Math.abs(dx) > 40 && dy < 60) {
                dx > 0 ? goNext() : goPrev();
            }
        }, { passive: true });
    }

    // --- Navigation Active State Logic ---
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.bottom-nav a');

    const navObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });
});
