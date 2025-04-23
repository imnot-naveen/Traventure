let attractionIndex = 0;

function moveAttractionSlide(direction) {
  const attractions = document.querySelectorAll('.popular-attraction');
  const totalAttractions = attractions.length;
  
  // Update the index with wrapping
  attractionIndex = (attractionIndex + direction + totalAttractions) % totalAttractions;
  
  // Calculate the transform percentage
  const slideWidth = 100 / 3; // Since 3 items are visible
  const offset = -attractionIndex * slideWidth;
  
  const carouselInner = document.querySelector('.carousel-inner');
  carouselInner.style.transform = `translateX(${offset}%)`;
}

// Optional: Add event listeners if not using inline onclick
document.querySelector('.prev').addEventListener('click', () => moveAttractionSlide(-1));
document.querySelector('.next').addEventListener('click', () => moveAttractionSlide(1));
