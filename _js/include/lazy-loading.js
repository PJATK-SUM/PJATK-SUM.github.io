document.addEventListener("DOMContentLoaded", function () {
    
    const getAllLazyImages = () =>
        [].slice.call(document.querySelectorAll("img.lazy"));
    const setDefaultLazyImageParams = (lazyImage) => {
        lazyImage.width = 0;
        lazyImage.height = 0;
        lazyImage.src =
        "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    };
    let lazyImages = getAllLazyImages();
    let active = false;
  
    lazyImages.forEach(setDefaultLazyImageParams);
  
    const lazyLoad = function () {
        if (active === false) {
            active = true;
            setTimeout(function () {
                let lazyImages = getAllLazyImages();
                lazyImages.forEach(function (lazyImage) {
                    setDefaultLazyImageParams(lazyImage);
                    if (
                        lazyImage.getBoundingClientRect().top <= window.innerHeight &&
              lazyImage.getBoundingClientRect().bottom >= 0 &&
              getComputedStyle(lazyImage).display !== "none"
                    ) {
                        const image = new Image();
                        image.onload = function () {
                            lazyImage.src = this.src;
                            if (lazyImage.dataset.srcset) {
                                lazyImage.srcset = lazyImage.dataset.srcset;
                            }
                            lazyImage.classList.remove("lazy");
                            lazyImage.width = this.width;
                            lazyImage.height = this.height;
                        };
  
                        image.src = lazyImage.dataset.src;
  
                        lazyImages = lazyImages.filter(function (image) {
                            return image !== lazyImage;
                        });
  
                        if (lazyImages.length === 0) {
                            document.removeEventListener("scroll", lazyLoad);
                            window.removeEventListener("resize", lazyLoad);
                            window.removeEventListener("orientationchange", lazyLoad);
                        }
                    }
                });
  
                active = false;
            }, 100);
        }
    };
  
    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
    lazyLoad();
});