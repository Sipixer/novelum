import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import CarouselImage1 from "@/assets/images/about/IMG_9851.jpg";
import CarouselImage2 from "@/assets/images/about/IMG_9860.jpg";
import CarouselImage3 from "@/assets/images/about/IMG_9875.jpg";
import CarouselImage4 from "@/assets/images/about/IMG_9880.jpg";
import CarouselImage5 from "@/assets/images/about/IMG_9882.jpg";
import CarouselImage6 from "@/assets/images/about/IMG_9958.jpg";
import CarouselImage8 from "@/assets/images/about/IMG_9993.jpg";
import Autoplay from "embla-carousel-autoplay";

const images = [
  CarouselImage1,
  CarouselImage2,
  CarouselImage3,
  CarouselImage4,
  CarouselImage5,
  CarouselImage6,
  CarouselImage8,
];

export const RestaurationCarousel = () => {
  return (
    <Carousel
      className="py-20"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="sm:basis-2/4 xl:basis-1/4">
            <img
              loading="lazy"
              src={image}
              alt={`Restauration ${index + 1}`}
              className="rounded-lg shadow-lg h-[200px] w-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
