import { ContactForm } from "~/components/ContactForm";
import { Layout } from "~/components/Layout";

export default function Moderniser() {
  return (
    <Layout>
      <div className="text-center max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Moderniser votre radio</h1>

        <div className="space-y-4 mb-12">
          <p className="text-lg">
            Vous souhaitez donner un nouveau souffle à votre radio ? Nous sommes
            là pour vous accompagner dans la modernisation de votre station.
          </p>

          <p className="text-lg font-medium">
            Pour entamer votre projet de modernisation, il vous suffit de
            remplir le formulaire ci-dessous. Nous vous recontacterons dans les
            plus brefs délais pour échanger sur vos besoins et vous proposer les
            solutions les plus adaptées.
          </p>
        </div>

        <ContactForm />
      </div>
    </Layout>
  );
}
