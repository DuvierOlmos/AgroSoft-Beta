
 // Carrusel automático
 let slideIndex = 0;
 showSlides();
 
 function showSlides() {
     let slides = document.getElementsByClassName("slide");
     
     // Oculta todas las slides
     for (let i = 0; i < slides.length; i++) {
         slides[i].style.display = "none";  
     }
     
     // Avanza al siguiente slide
     slideIndex++;
     if (slideIndex > slides.length) {slideIndex = 1}
     
     // Muestra el slide actual
     slides[slideIndex-1].style.display = "block";
     
     // Cambia la imagen cada 3 segundos
     setTimeout(showSlides, 3000); 
 }