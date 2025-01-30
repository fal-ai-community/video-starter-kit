import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "$9.99",
    features: [
      "1080p Export",
      "Basic Effects",
      "5GB Cloud Storage",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    price: "$19.99",
    features: [
      "4K Export",
      "Advanced Effects",
      "50GB Cloud Storage",
      "Priority Support",
      "Collaboration Tools",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "8K Export",
      "Custom Effects",
      "Unlimited Storage",
      "24/7 Support",
      "API Access",
      "On-Premise Option",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-8 transition-transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">
                {plan.price}
                <span className="text-sm font-normal text-gray-400">
                  /month
                </span>
              </p>
              <ul className="mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center mb-2">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Choose Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
