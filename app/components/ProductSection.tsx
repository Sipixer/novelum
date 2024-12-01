import { RadioCard } from "./RadioCard";

type ProductSectionProps = {
  products: {
    name: string;
    price: string;
    features: string[];
    image: string;
  }[];
};

export const ProductSection = ({ products }: ProductSectionProps) => {
  return (
    <section className="py-20 bg-stone-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-stone-800">
          Nos Pépites Rétro
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <RadioCard
              key={index}
              name={product.name}
              price={product.price}
              image={product.image}
              features={product.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
