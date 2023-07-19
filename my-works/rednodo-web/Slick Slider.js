$('.testimonial-slider').slick({
    arrows: true,
    dots: true,
    infinite: true,
  autoplay: true,
autoplaySpeed: 3000,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll:1,
  usetransform: false,
    responsive: [{
        breakpoint: 1024,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: true
        }
    },
    {
        breakpoint: 768,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }]
});