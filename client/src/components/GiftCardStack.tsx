import { Card, CardContent } from "@/components/ui/card";
import giftBoxImage from "@assets/generated_images/Individual_spiritual_devotional_items_a6b12037.png";

interface GiftCard {
  id: number;
  title: string;
  description: string;
  rotation: string;
  zIndex: number;
  translateX: string;
  translateY: string;
}

const giftCards: GiftCard[] = [
  {
    id: 1,
    title: "Divine Essentials Box",
    description: "Sacred items for daily prayers",
    rotation: "rotate-3",
    zIndex: 30,
    translateX: "translate-x-0",
    translateY: "translate-y-0",
  },
  {
    id: 2,
    title: "Premium Blessings",
    description: "Enhanced spiritual collection",
    rotation: "-rotate-2",
    zIndex: 20,
    translateX: "-translate-x-4",
    translateY: "translate-y-3",
  },
  {
    id: 3,
    title: "Exclusive Grace",
    description: "Complete devotional package",
    rotation: "rotate-1",
    zIndex: 10,
    translateX: "translate-x-2",
    translateY: "translate-y-6",
  },
];

export default function GiftCardStack() {
  return (
    <div className="relative w-full max-w-md mx-auto h-80" data-testid="gift-card-stack">
      {giftCards.map((card) => (
        <Card
          key={card.id}
          className={`absolute w-64 h-72 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${card.rotation} ${card.translateX} ${card.translateY}`}
          style={{ zIndex: card.zIndex }}
          data-testid={`gift-card-${card.id}`}
        >
          <CardContent className="p-0 h-full relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-2/10"></div>
            <img
              src={giftBoxImage}
              alt={card.title}
              className="w-full h-2/3 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm p-4">
              <h3 className="font-serif font-semibold text-foreground" data-testid={`text-title-${card.id}`}>
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1" data-testid={`text-description-${card.id}`}>
                {card.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}