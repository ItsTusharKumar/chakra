import { Button } from "@/components/ui/button";
import { CombinedDivider } from "@/components/ui/spiritual-divider";
import Stack from "@/components/ui/stack";
import { ChevronRight } from "lucide-react";

// Import the new ISKCON-themed images
import radhaKrishna1 from '../assets/iskcon_images/radha_krishna_painting_1.jpg';
import radhaKrishna2 from '../assets/iskcon_images/radha_krishna_painting_2.jpg';
import radhaKrishna3 from '../assets/iskcon_images/radha_krishna_painting_3.jpg';
import templeExterior from '../assets/iskcon_images/iskcon_temple_exterior.jpg';

// Spiritual gifting box cards data - Updated with new images
const SPIRITUAL_GIFT_BOXES = [
  {
    id: 'divine-essentials',
    image: radhaKrishna1,
    title: 'Divine Essentials Box',
    description: 'Sacred diya, tulsi beads, and spiritual essentials for daily worship'
  },
  {
    id: 'wisdom-collection',
    image: radhaKrishna2,
    title: 'Wisdom Collection',
    description: 'Bhagavad Gita, spiritual texts, and devotional literature for the soul'
  },
  {
    id: 'meditation-kit',
    image: radhaKrishna3,
    title: 'Meditation & Peace Kit',
    description: 'Incense, prayer beads, and meditation essentials for inner tranquility'
  },
  {
    id: 'prasadam-box',
    image: templeExterior, // Using the temple image for one card
    title: 'Sacred Prasadam Box',
    description: 'Blessed sweets and spiritual offerings from our temple kitchen'
  }
];

export default function HeroSection() {
  return (
    <section className="min-h-screen pt-16 relative overflow-hidden bg-white dark:bg-background">
      {/* Subtle Background Texture/Pattern for Spiritual Feel */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('/path/to/subtle-spiritual-pattern.svg')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-4rem)] py-12 lg:py-24">

          {/* Left Side - Hero Content (Modern, Clean, Spiritual Typography) */}
          <div className="space-y-8 text-center lg:text-left fade-in-delayed">
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-900 dark:text-white leading-tight" data-testid="text-hero-title">
                Chakravya Global – 
                <span className="block text-4xl sm:text-5xl lg:text-6xl mt-2 text-yellow-700 dark:text-yellow-500 peaceful-pulse">A Path of Devotion & Divine Gifting</span>
              </h1>

              <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed" data-testid="text-hero-subtitle">
                Share the gift of spirituality with loved ones and walk the path of devotion together.
              </h2>
            </div>

            {/* Sloka Block - Clean, Elegant Design */}
            <div className="bg-white dark:bg-card/70 backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-gray-200 dark:border-card-border shadow-lg sacred-glow">
              <div className="space-y-4">
                <div className="font-serif text-xl sm:text-2xl lg:text-3xl text-center leading-relaxed text-blue-800 dark:text-blue-300">
                  हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।<br />
                  हरे राम हरे राम राम राम हरे हरे ॥
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400 italic text-sm lg:text-base">
                  "Chant the holy names and embrace eternal peace."
                </div>
              </div>
            </div>

            {/* CTA Buttons - Gold and Deep Blue/Accent */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="bg-yellow-700 hover:bg-yellow-800 text-white font-bold text-lg px-10 py-4 rounded-full shadow-xl transition-all duration-300 group"
                data-testid="button-explore-gifts"
              >
                Explore Spiritual Gifts 
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-800 dark:border-blue-300 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300"
                data-testid="button-join-membership"
              >
                Join as a Member
              </Button>
            </div>
          </div>

          {/* Right Side - Image Slider (Stack) with Modern Framing */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg p-4 bg-white dark:bg-card/50 rounded-3xl shadow-2xl border-4 border-yellow-700/50 dark:border-yellow-500/50 transform hover:scale-[1.02] transition-transform duration-700">
              <Stack 
                items={SPIRITUAL_GIFT_BOXES}
                className="rounded-2xl overflow-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
