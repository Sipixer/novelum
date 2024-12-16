import { Card } from "@/components/ui/card";
import { Layout } from "~/components/Layout";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "Article 1 - Objet",
      content:
        "Les présentes conditions régissent les ventes par la société Novelum 63 ROUTE DE ROUMEGOUSE 46500 Rignac.",
    },
    {
      title: "Article 2 - Prix",
      content: [
        "Les prix de nos produits sont indiqués en euros toutes taxes comprises (TVA et autres taxes applicables au jour de la commande), sauf indication contraire et hors frais de traitement et d'expédition.",
        "En cas de commande vers un pays autre que la France métropolitaine vous êtes l'importateur du ou des produits concernés. Des droits de douane ou autres taxes locales ou droits d'importation ou taxes d'état sont susceptibles d'être exigibles.",
        "Toutes les commandes quelle que soit leur origine sont payables en euros.",
        "La société Novelum se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande et sous réserve de disponibilité.",
      ],
    },
    {
      title: "Article 3 - Commandes",
      content: [
        "Vous pouvez passer commande sur Internet : https://novelum-radio.fr/",
        "Les informations contractuelles sont présentées en langue française et feront l'objet d'une confirmation au plus tard au moment de la validation de votre commande.",
        "La société Novelum se réserve le droit de ne pas enregistrer un paiement, et de ne pas confirmer une commande pour quelque raison que ce soit.",
      ],
    },
    {
      title: "Article 4 - Validation de votre commande",
      content: [
        "Toute commande figurant sur le site Internet https://novelum-radio.fr/ suppose l'adhésion aux présentes Conditions Générales.",
        "L'ensemble des données fournies et la confirmation enregistrée vaudront preuve de la transaction.",
        "Un récapitulatif des informations de votre commande vous sera communiqué en format PDF via l'adresse e-mail de confirmation.",
      ],
    },
    {
      title: "Article 5 - Paiement",
      content: [
        "Le fait de valider votre commande implique pour vous l'obligation de payer le prix indiqué.",
        "Le règlement de vos achats s'effectue par carte bancaire grâce au système sécurisé Stripe.",
        "Le débit de la carte n'est effectué qu'au moment de l'expédition de la commande.",
      ],
    },
  ];

  const companyInfo = {
    name: "Novelum",
    status: "Société Auto-entrepreneur",
    address: "63 ROUTE DE ROUMEGOUSE 46500 Rignac",
    phone: "+33789253279",
    email: "novelum.radio@gmail.com",
    rcs: "93515067200019",
    responsible: "Robin Larnaudie",
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Conditions Générales de Vente
              </h1>
              <div className="mt-4 text-center text-sm text-gray-600">
                Dernière mise à jour : 16/12/2024
              </div>
            </div>

            {/* Company Information */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">{companyInfo.name}</p>
                  <p>{companyInfo.status}</p>
                  <p>{companyInfo.address}</p>
                </div>
                <div>
                  <p>Tél : {companyInfo.phone}</p>
                  <p>Email : {companyInfo.email}</p>
                  <p>RCS n° {companyInfo.rcs}</p>
                  <p>Responsable de publication : {companyInfo.responsible}</p>
                </div>
              </div>
            </div>

            {/* Terms Content */}
            <div className="px-6 py-6">
              {sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  {Array.isArray(section.content) ? (
                    <div className="space-y-3">
                      {section.content.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="text-gray-700 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Pour toute question concernant ces CGV, veuillez nous contacter
                à{" "}
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {companyInfo.email}
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;
