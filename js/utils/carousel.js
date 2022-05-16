function setupCarousel(carousel) {
    const imagesDiv =  carousel.getElementsByClassName("ns-carousel-images")[0];
    const images = imagesDiv.getElementsByTagName("img");
    const image_count = images.length;
    carousel.nsCarouselCount = image_count;
    const points = carousel.getElementsByClassName("ns-carousel-points");
    for (let point of points) {
        for (let i = 0; i < image_count; i++) {
            const point_div = document.createElement("div");
            point_div.classList.add("ns-carousel-point");
            point_div.topCarousel = carousel;
            point_div.nsCarouselIndex = i;
            point_div.addEventListener("click", (evt) => {
                setCarouselActiveElements(evt.currentTarget.topCarousel, evt.currentTarget.nsCarouselIndex)
            }, false);
            point.appendChild(point_div);
        }
    }
    for (let i = 0; i < image_count; i++) {
        images[i].topCarousel = carousel;
        images[i].nsCarouselIndex = i;
        images[i].addEventListener("click", (evt) => {
            setCarouselActiveElements(evt.currentTarget.topCarousel, evt.currentTarget.nsCarouselIndex)
        }, false);
    }
    setCarouselActiveElements(carousel, 0);
}

function setCarouselActiveElements(carousel, index) {
    if (carousel.nsCarouselCount <= index) return;

    const imagesDiv =  carousel.getElementsByClassName("ns-carousel-images")[0];
    const images = imagesDiv.getElementsByTagName("img");
    for (let image of images) {
        image.classList.remove("ns-carousel-1");
        image.classList.remove("ns-carousel-2");
        image.classList.remove("ns-carousel-3");
        image.classList.remove("ns-carousel-off");
        image.classList.add("ns-carousel-off");
    }
    images[index].classList.add("ns-carousel-2");
    images[index].classList.remove("ns-carousel-off");
    images[(index === 0 ? images.length : index) - 1].classList.add("ns-carousel-1");
    images[(index === 0 ? images.length : index) - 1].classList.remove("ns-carousel-off");
    images[(index + 1 < carousel.nsCarouselCount) ? (index + 1) : 0].classList.add("ns-carousel-3");
    images[(index + 1 < carousel.nsCarouselCount) ? (index + 1) : 0].classList.remove("ns-carousel-off");

    const points = carousel.getElementsByClassName("ns-carousel-points");
    for (let point of points) {
        const points = point.children;
        for (let i = 0; i < points.length; i++) {
            points[i].classList.remove("ns-carousel-point-active");
            if (i === index) points[i].classList.add("ns-carousel-point-active");
        }
    }
}