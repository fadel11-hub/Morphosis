// Test Data dan Variabel Global
let currentQuestion = 0;
let answers = [];
let testData = {
    questions: [
        "Anda sering memperkenalkan diri kepada orang baru.",
        "Anda sering tenggelam dalam pemikiran mendalam.",
        "Anda biasanya tetap tenang, bahkan dalam situasi stres.",
        "Anda lebih suka melakukan sesuatu pada menit terakhir daripada merencanakan jauh-jauh hari.",
        "Anda merasa nyaman berada di tengah perhatian.",
        "Anda sering merasa empati terhadap penderitaan orang lain.",
        "Anda lebih suka bekerja dalam tim daripada sendirian.",
        "Anda tidak keberatan menjadi pusat perhatian.",
        "Anda lebih tertarik pada kemungkinan dan potensi daripada fakta yang sudah ada.",
        "Anda biasanya mengikuti hati daripada kepala saat membuat keputusan."
    ],
    personalityTypes: {
        'ENFP': {
            title: 'The Campaigner',
            description: 'ENFP adalah pribadi yang antusias, kreatif, dan sosial. Mereka cenderung melihat kemungkinan-kemungkinan dalam segala hal dan sangat tertarik dengan orang lain. ENFP memiliki energi tinggi dan sering menjadi pusat perhatian dalam kelompok sosial.',
            traits: {
                'Ekstrovert': 75,
                'Intuitif': 82,
                'Perasaan': 68,
                'Perseptif': 71
            }
        },
        'INTJ': {
            title: 'The Architect',
            description: 'INTJ adalah pemikir strategis yang mandiri dan percaya diri. Mereka memiliki visi jangka panjang dan mampu melihat gambaran besar. INTJ sering disebut sebagai "mastermind" karena kemampuan mereka dalam merencanakan dan mengeksekusi ide-ide kompleks.',
            traits: {
                'Introvert': 78,
                'Intuitif': 85,
                'Pemikiran': 72,
                'Penilaian': 80
            }
        },
        'ESFJ': {
            title: 'The Consul',
            description: 'ESFJ adalah pribadi yang hangat, peduli, dan bertanggung jawab. Mereka sangat memperhatikan kebutuhan orang lain dan berusaha menciptakan harmoni dalam hubungan. ESFJ adalah pemimpin natural yang dapat diandalkan.',
            traits: {
                'Ekstrovert': 70,
                'Sensing': 75,
                'Perasaan': 83,
                'Penilaian': 77
            }
        },
        'ISTP': {
            title: 'The Virtuoso',
            description: 'ISTP adalah pribadi yang praktis, fleksibel, dan suka bereksperimen. Mereka ahli dalam memecahkan masalah dan bekerja dengan tangan mereka. ISTP memiliki kemampuan analitis yang kuat dan pendekatan yang logis terhadap kehidupan.',
            traits: {
                'Introvert': 73,
                'Sensing': 79,
                'Pemikiran': 81,
                'Perseptif': 76
            }
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Inisialisasi Website
function initializeWebsite() {
    setupNavigation();
    setupTestInterface();
    setupScrollEffects();
}

// Setup Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mulai Test
function startTest() {
    const testType = document.getElementById('testType').value;
    const duration = document.getElementById('duration').value;
    
    if (!testType || testType === 'Pilih jenis test') {
        alert('Silakan pilih jenis test terlebih dahulu!');
        return;
    }
    
    if (!duration || duration === 'Pilih durasi') {
        alert('Silakan pilih durasi test terlebih dahulu!');
        return;
    }
    
    // Hide hero section and show test interface
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.popular-tests').style.display = 'none';
    document.querySelector('.about-section').style.display = 'none';
    document.getElementById('test-interface').classList.remove('hidden');
    
    // Initialize test
    currentQuestion = 0;
    answers = [];
    updateTestInterface();
}

// Setup Test Interface
function setupTestInterface() {
    const scaleOptions = document.querySelectorAll('.scale-option');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    
    // Setup scale options
    scaleOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            scaleOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store answer
            const value = parseInt(this.dataset.value);
            answers[currentQuestion] = value;
            
            // Enable next button
            nextBtn.disabled = false;
        });
    });
    
    // Next button
    nextBtn.addEventListener('click', function() {
        if (currentQuestion < testData.questions.length - 1) {
            currentQuestion++;
            updateTestInterface();
        } else {
            showResults();
        }
    });
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            updateTestInterface();
        }
    });
}

// Update Test Interface
function updateTestInterface() {
    const questionText = document.getElementById('question-text');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressFill = document.querySelector('.progress-fill');
    const scaleOptions = document.querySelectorAll('.scale-option');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    
    // Update question text
    questionText.textContent = testData.questions[currentQuestion];
    
    // Update question counter
    currentQuestionSpan.textContent = currentQuestion + 1;
    totalQuestionsSpan.textContent = testData.questions.length;
    
    // Update progress bar
    const progress = ((currentQuestion + 1) / testData.questions.length) * 100;
    progressFill.style.width = progress + '%';
    
    // Clear previous selections
    scaleOptions.forEach(option => option.classList.remove('selected'));
    
    // Show previous answer if exists
    if (answers[currentQuestion] !== undefined) {
        const selectedOption = document.querySelector(`[data-value="${answers[currentQuestion]}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            nextBtn.disabled = false;
        }
    } else {
        nextBtn.disabled = true;
    }
    
    // Update navigation buttons
    prevBtn.disabled = currentQuestion === 0;
    
    // Update next button text
    if (currentQuestion === testData.questions.length - 1) {
        nextBtn.textContent = 'Lihat Hasil';
    } else {
        nextBtn.textContent = 'Selanjutnya';
    }
}

// Calculate Personality Type
function calculatePersonalityType() {
    // Simple algorithm to determine personality type based on answers
    let extroversion = 0;
    let sensing = 0;
    let thinking = 0;
    let judging = 0;
    
    answers.forEach((answer, index) => {
        // Different questions contribute to different traits
        switch(index % 4) {
            case 0: // Extroversion questions
                extroversion += answer;
                break;
            case 1: // Sensing questions  
                sensing += answer;
                break;
            case 2: // Thinking questions
                thinking += answer;
                break;
            case 3: // Judging questions
                judging += answer;
                break;
        }
    });
    
    // Determine personality type based on scores
    const avgExtroversion = extroversion / Math.ceil(answers.length / 4);
    const avgSensing = sensing / Math.ceil(answers.length / 4);
    const avgThinking = thinking / Math.ceil(answers.length / 4);
    const avgJudging = judging / Math.ceil(answers.length / 4);
    
    // Simple logic to determine type (this is simplified)
    if (avgExtroversion <= 4 && avgSensing > 4 && avgThinking > 4 && avgJudging <= 4) {
        return 'ENFP';
    } else if (avgExtroversion > 4 && avgSensing <= 4 && avgThinking > 4 && avgJudging > 4) {
        return 'INTJ';
    } else if (avgExtroversion <= 4 && avgSensing <= 4 && avgThinking <= 4 && avgJudging > 4) {
        return 'ESFJ';
    } else {
        return 'ISTP';
    }
}

// Show Results
function showResults() {
    const personalityType = calculatePersonalityType();
    const typeData = testData.personalityTypes[personalityType];
    
    // Hide test interface
    document.getElementById('test-interface').classList.add('hidden');
    
    // Show results section
    document.getElementById('results-section').classList.remove('hidden');
    
    // Update results display
    document.getElementById('personality-badge').textContent = personalityType;
    document.getElementById('personality-title').textContent = typeData.title;
    
    // Update trait bars with animation
    const traitBars = document.querySelectorAll('.trait-bar');
    const traitNames = Object.keys(typeData.traits);
    
    traitBars.forEach((bar, index) => {
        if (traitNames[index]) {
            const traitName = traitNames[index];
            const percentage = typeData.traits[traitName];
            
            bar.querySelector('.trait-name').textContent = traitName;
            bar.querySelector('.trait-percentage').textContent = percentage + '%';
            
            // Animate bar fill
            setTimeout(() => {
                bar.querySelector('.bar-fill').style.width = percentage + '%';
            }, 500 + (index * 200));
        }
    });
    
    // Update description
    document.querySelector('.personality-description p').textContent = typeData.description;
}

// Download Results
function downloadResults() {
    const personalityType = document.getElementById('personality-badge').textContent;
    const personalityTitle = document.getElementById('personality-title').textContent;
    const description = document.querySelector('.personality-description p').textContent;
    
    const resultsText = `
HASIL TEST KEPRIBADIAN ANDA
============================

Tipe Kepribadian: ${personalityType} - ${personalityTitle}

Deskripsi:
${description}

Analisis Trait:
${Array.from(document.querySelectorAll('.trait-bar')).map(bar => {
    const name = bar.querySelector('.trait-name').textContent;
    const percentage = bar.querySelector('.trait-percentage').textContent;
    return `- ${name}: ${percentage}`;
}).join('\n')}

Tanggal Test: ${new Date().toLocaleDateString('id-ID')}
Website: PersonalityHub
    `;
    
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hasil-test-kepribadian-${personalityType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Share Results
function shareResults() {
    const personalityType = document.getElementById('personality-badge').textContent;
    const personalityTitle = document.getElementById('personality-title').textContent;
    
    const shareText = `Saya baru saja menyelesaikan test kepribadian dan hasilnya adalah ${personalityType} - ${personalityTitle}! Coba test kepribadian Anda juga di PersonalityHub.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Hasil Test Kepribadian Saya',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Teks telah disalin ke clipboard! Anda bisa membagikannya di media sosial.');
        }).catch(() => {
            // Final fallback: show share text
            prompt('Salin teks berikut untuk dibagikan:', shareText);
        });
    }
}

// Restart Test
function restartTest() {
    // Reset variables
    currentQuestion = 0;
    answers = [];
    
    // Hide results section
    document.getElementById('results-section').classList.add('hidden');
    
    // Show main sections
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.popular-tests').style.display = 'block';
    document.querySelector('.about-section').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset form
    document.getElementById('testType').value = '';
    document.getElementById('duration').value = '';
}

// Setup Scroll Effects
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#fff';
            navbar.style.backdropFilter = 'none';
        }
        
        // Update active navigation based on scroll position
        updateActiveNavigation();
    });
}

// Update Active Navigation
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Test Card Click Handlers
document.addEventListener('DOMContentLoaded', function() {
    const testCards = document.querySelectorAll('.test-card');
    
    testCards.forEach(card => {
        card.addEventListener('click', function() {
            const testTitle = this.querySelector('h3').textContent;
            
            // Set the test type based on clicked card
            const testSelect = document.getElementById('testType');
            
            switch(testTitle) {
                case 'Test Kepribadian MBTI':
                    testSelect.value = 'advanced';
                    break;
                case 'Test Kepribadian Karir':
                    testSelect.value = 'career';
                    break;
                default:
                    testSelect.value = 'basic';
            }
            
            // Set default duration
            document.getElementById('duration').value = '30';
            
            // Start the test
            startTest();
        });
        
        // Favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.style.color === 'red') {
                this.style.color = '';
                this.textContent = '★';
            } else {
                this.style.color = 'red';
                this.textContent = '❤️';
            }
        });
    });
});

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.test-card, .feature, .stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', animateOnScroll);