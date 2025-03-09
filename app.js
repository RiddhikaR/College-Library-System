let currentImageIndex = 0;
const images = ['img1.webp', 'img2.jpg', 'img3.jpg']; // Add your image paths here

function changeImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById('slider-img').src = images[currentImageIndex];
}

// Change image every 5 seconds
setInterval(changeImage, 5000);

// Initially hide all sections except Home
const sections = document.querySelectorAll('.page-content');
sections.forEach(section => section.classList.remove('visible'));
document.getElementById('home-section').classList.add('visible');

// Add event listeners for navigation links
document.getElementById('home').addEventListener('click', function() {
    sections.forEach(section => section.classList.remove('visible'));
    document.getElementById('home-section').classList.add('visible');
});

document.getElementById('about-us').addEventListener('click', function() {
    sections.forEach(section => section.classList.remove('visible'));
    document.getElementById('about-us-section').classList.add('visible');
});

document.getElementById('achievements').addEventListener('click', function() {
    sections.forEach(section => section.classList.remove('visible'));
    document.getElementById('achievements-section').classList.add('visible');
});

document.getElementById('events').addEventListener('click', function() {
    sections.forEach(section => section.classList.remove('visible'));
    document.getElementById('events-section').classList.add('visible');
});

document.getElementById('contact-us').addEventListener('click', function() {
    sections.forEach(section => section.classList.remove('visible'));
    document.getElementById('contact-us-section').classList.add('visible');
});

