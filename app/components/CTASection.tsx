import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

export const CTASection = () => (
  <section className="py-20 bg-primary text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-6">
        Prêt à voyager dans le temps ?
      </h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Découvrez notre collection complète et trouvez la radio parfaite qui
        fera vibrer votre intérieur au rythme du passé et du présent.
      </p>
      <Link to="/radios">
        <Button className="text-primary bg-white hover:text-white" size="lg">
          Explorer la collection
        </Button>
      </Link>
    </div>
  </section>
);
