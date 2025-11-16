              import { Button } from "@/components/ui/button";
              import Stack from "@/components/ui/stack";
              import { CombinedDivider } from "@/components/ui/spiritual-divider";
              import statueImage from '@assets/stock_images/statue_of_a_person_w_3e2d865e.jpg';
              import deitiesImage from '@assets/stock_images/couple_of_statues_of_ec2b9195.jpg';
              import dancingImage from '@assets/stock_images/painting_of_a_group__84dcabb1.jpg';

              // Spiritual gifting box cards data
              const SPIRITUAL_GIFT_BOXES = [
                {
                  id: 'divine-essentials',
                  image: statueImage,
                  title: 'Divine Essentials Box',
                  description: 'Sacred diya, tulsi beads, and spiritual essentials for daily worship'
                },
                {
                  id: 'wisdom-collection',
                  image: deitiesImage,
                  title: 'Wisdom Collection',
                  description: 'Bhagavad Gita, spiritual texts, and devotional literature for the soul'
                },
                {
                  id: 'meditation-kit',
                  image: deitiesImage,
                  title: 'Meditation & Peace Kit',
                  description: 'Incense, prayer beads, and meditation essentials for inner tranquility'
                },
                {
                  id: 'prasadam-box',
                  image: dancingImage,
                  title: 'Sacred Prasadam Box',
                  description: 'Blessed sweets and spiritual offerings from our temple kitchen'
                }
              ];

              export default function HeroSection() {
                return (
                  <section className="min-h-screen pt-16 relative overflow-hidden floating-petals">
                    {/* Background with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card/30"></div>

                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-card/90 to-background/60"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-8 lg:py-12">

                        {/* Left Side - Card Stack */}
                        <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                          <div className="w-full">
                            <Stack 
                              items={SPIRITUAL_GIFT_BOXES}
                              className=""
                            />
                          </div>
                        </div>

                        {/* Right Side - Hero Content */}
                        <div className="space-y-6 lg:space-y-8 order-1 lg:order-2 text-center lg:text-left fade-in-delayed">
                          <div className="space-y-4 lg:space-y-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight glow-hover" data-testid="text-hero-title">
                              Chakravya Global – 
                              <span className="block text-accent mt-2 peaceful-pulse">A Path of Devotion & Divine Gifting</span>
                            </h1>

                            <h2 className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-medium leading-relaxed" data-testid="text-hero-subtitle">
                              Share the gift of spirituality with loved ones and walk the path of devotion together.
                            </h2>
                          </div>

                          {/* Sloka Block */}
                          <div className="bg-card/90 backdrop-blur-md rounded-xl p-6 lg:p-8 border border-card-border shadow-2xl sacred-glow" data-testid="sloka-block">
                            <div className="space-y-4">
                              <div className="font-serif text-base sm:text-lg lg:text-xl text-center leading-relaxed text-primary">
                                हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।<br />
                                हरे राम हरे राम राम राम हरे हरे ॥
                              </div>
                              <div className="text-center text-muted-foreground italic text-sm lg:text-base">
                                "Chant the holy names and embrace eternal peace."
                              </div>
                            </div>
                          </div>

                          {/* CTA Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button 
                              size="lg" 
                              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                              data-testid="button-explore-gifts"
                            >
                              Explore Spiritual Gifts
                            </Button>
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="border-2 border-accent/60 text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-lg px-8 py-3 rounded-xl backdrop-blur-sm transition-all duration-300"
                              data-testid="button-join-membership"
                            >
                              Join as a Member
                            </Button>
                          </div>

                          {/* Spiritual Divider */}
                          <CombinedDivider size="md" className="my-8" />

                          {/* Additional spiritual quote */}
                          <div className="pt-4 lg:pt-6">
                            <p className="text-muted-foreground text-sm lg:text-base italic">
                              "The supreme destination can be achieved through devotional service"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              }