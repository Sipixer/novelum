import { Layout } from "~/components/Layout";
import HeroImage from "@/assets/images/IMG_9746.jpg";
import { ContactForm } from "~/components/ContactForm";
import { RestaurationCarousel } from "~/components/RestaurationCarousel";
import DemontageImg from "@/assets/images/about/demontage.png";
import RenovationImg from "@/assets/images/about/renovation.png";
import ModernisationImg from "@/assets/images/about/modernisation.png";
import TestImg from "@/assets/images/about/test.png";
import JeremyImg from "@/assets/images/IMG_9740.jpg";
import RobinImg from "@/assets/images/about/robin.jpg";

import { InfoRestaurationSection } from "~/components/InfoRestaurationSection";

export default function Radios() {
  return (
    <Layout>
      <div className="min-h-screen bg-stone-100 pb-40">
        <div className="container mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-14">
            <div className="flex justify-center flex-col gap-4 h-full">
              <h3 className="text-2xl font-bold text-stone-800 italic">
                Nos différentes étapes de restauration
              </h3>
              <p>
                Chaque radio est restaurée à la main par nos soins. En alliant
                savoir-faire traditionnel et technologies modernes, nous
                redonnons vie à ces pièces uniques.
              </p>
            </div>
            <div className="h-full">
              <img
                src={HeroImage}
                alt="Radio Vintage"
                className="rounded-lg shadow-lg max-h-[600px] mx-auto min-h-full"
              />
            </div>
          </div>
          <RestaurationCarousel />
          <div className="flex flex-col gap-8">
            <InfoRestaurationSection
              title="1. Démontage et nettoyage"
              description="Nous démontons soigneusement chaque composant de la radio pour un nettoyage approfondi, garantissant que chaque pièce retrouve son éclat d'origine."
              imageSrc={DemontageImg}
              linkText="Explorer nos radios"
              reversed
            />
            <InfoRestaurationSection
              title="2. Renovation"
              description="Le boitier et les composants sont minutieusement restaurés pour retrouver leur aspect d'origine."
              imageSrc={RenovationImg}
              linkText="Explorer nos radios"
            />
            <InfoRestaurationSection
              title="3. Modernisation"
              description="Nous intégrons les dernières technologies pour une expérience d'écoute inégalée."
              imageSrc={ModernisationImg}
              linkText="Explorer nos radios"
              reversed
            />
            <InfoRestaurationSection
              title="4. Test et contrôle qualité"
              description="Chaque radio est testée et contrôlée pour garantir un fonctionnement optimal."
              imageSrc={TestImg}
              linkText="Explorer nos radios"
            />
          </div>
          <hr className="my-12 border-stone-300" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-14">
            <div className="flex justify-center flex-col gap-4 h-full">
              <h3 className="text-2xl font-bold text-stone-800 italic">
                Quand la Passion Rencontre le Savoir-Faire
              </h3>
              <p>
                Nous sommes Robin et Jérémy, deux frères du Lot, réunis par une
                passion commune : redonner vie aux anciennes radios. Avec nos
                compétences complémentaires, nous restaurons vos appareils en
                leur offrant une nouvelle jeunesse, alliant authenticité et
                modernité.
              </p>
            </div>
            <div className="h-full">
              <img
                src={JeremyImg}
                alt="Radio Vintage"
                className="rounded-lg shadow-lg max-h-[600px] mx-auto min-h-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 mt-20 gap-24">
            <div>
              <img
                src={JeremyImg}
                alt="Jeremy Larnaudie"
                className="rounded-lg shadow-lg  object-cover max-h-[300px] mx-auto"
              />
              <h4 className="text-2xl font-bold text-stone-800 mt-12 mb-8">
                Jérémy : le travail du bois dans les mains
              </h4>
              <p>
                Je suis Jérémy, et mon truc, c’est le travail manuel. Avec une
                formation chez les Compagnons du Devoir et une expérience en
                ébénisterie, je m’occupe de toute la restauration des caisses en
                bois. Chaque radio est unique, et je prends soin de lui redonner
                tout son charme d’époque, avec une finition soignée et
                respectueuse de son histoire.
              </p>
            </div>
            <div>
              <img
                src={RobinImg}
                alt="Robin Larnaudie"
                className="rounded-lg shadow-lg  object-cover max-h-[300px] mx-auto"
              />
              <h4 className="text-2xl font-bold text-stone-800 mt-12 mb-8">
                Robin : la technologie dans l’âme
              </h4>
              <p>
                Moi, c’est Robin. Je travaille au CEA et je suis passionné
                d’électronique. Mon rôle ? Moderniser l’intérieur des radios
                tout en gardant leur authenticité. J’ajoute des systèmes
                Bluetooth et optimise le son pour qu’elles soient aussi
                pratiques qu’esthétiques. L’idée, c’est de vous offrir un objet
                rétro qui s’intègre parfaitement dans votre vie moderne.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ContactForm />
    </Layout>
  );
}
