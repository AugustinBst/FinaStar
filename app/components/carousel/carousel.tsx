interface CarouselProps {
  items: React.ReactNode[];
}
export function Carousel({ items }: CarouselProps) {
  return (
    <div className="carousel carousel-center rounded-box  space-x-4 p-4 bg-base-200">
      {items.map((item, index) => (
        <div className="carousel-item" key={index}>
          {item}
        </div>
      ))}
    </div>
  );
}
