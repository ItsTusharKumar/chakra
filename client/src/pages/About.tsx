import { Card, CardContent } from "@/components/ui/card";
import templeImage from "@assets/generated_images/ISKCON_temple_interior_scene_5c8899ae.png";

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-card via-background to-chart-2/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6" data-testid="text-about-title">
              About Chakravya Global
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="text-about-subtitle">
              Spreading the divine love of Krishna consciousness through authentic spiritual gifts 
              and guided devotional practices worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={templeImage}
                alt="ISKCON Temple Interior"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
                data-testid="img-temple"
              />
            </div>
            
            <div className="space-y-8">
              <Card className="bg-primary/5 border-primary/20" data-testid="mission-card">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-serif font-bold text-primary mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-mission">
                    To make authentic spiritual practice accessible to every home by providing carefully 
                    curated sacred items and guided devotional experiences. We believe that genuine 
                    spiritual growth comes through consistent practice with blessed, authentic materials.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-chart-2/5 border-chart-2/20" data-testid="vision-card">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-serif font-bold text-chart-2 mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-vision">
                    A world where every soul can experience the divine love of Krishna through accessible 
                    spiritual practices. We envision a global community of devotees supporting each other's 
                    spiritual journey with compassion and wisdom.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-16 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card data-testid="founder-card">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6" data-testid="text-founder-title">
                A Message from Our Founder
              </h2>
              
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-founder-message">
                  "After years of spiritual practice in ISKCON temples worldwide, I realized that many 
                  devotees struggle to maintain consistent spiritual practices at home due to lack of 
                  authentic spiritual items and guidance. Chakravya Global was born from this need - 
                  to bridge the gap between temple and home worship."
                </p>
                
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <p className="font-devanagari text-lg text-primary mb-2">
                    श्रद्धावान् लभते ज्ञानं तत्परः संयतेन्द्रियः
                  </p>
                  <p className="text-sm text-muted-foreground italic" data-testid="text-founder-sloka">
                    "One who has faith and is devoted and has controlled the senses, gains knowledge."
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="font-semibold text-foreground" data-testid="text-founder-name">Gopal Das</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-founder-title-role">Founder & Spiritual Guide</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-founder-credentials">25+ Years in ISKCON Service</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-activities-title">
              Our Sacred Activities
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-activities-subtitle">
              Experience the divine through authentic temple practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover-elevate transition-all duration-300" data-testid="activity-card-darshan">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🙏</div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3" data-testid="text-activity-darshan-title">
                  Daily Darshan
                </h3>
                <p className="text-muted-foreground" data-testid="text-activity-darshan-description">
                  Experience the divine presence through sacred viewing and meditation with authentic temple items.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-elevate transition-all duration-300" data-testid="activity-card-bhajan">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3" data-testid="text-activity-bhajan-title">
                  Devotional Singing
                </h3>
                <p className="text-muted-foreground" data-testid="text-activity-bhajan-description">
                  Learn traditional bhajans and kirtans that elevate consciousness and bring inner peace.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-elevate transition-all duration-300" data-testid="activity-card-prasadam">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🍯</div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3" data-testid="text-activity-prasadam-title">
                  Sacred Prasadam
                </h3>
                <p className="text-muted-foreground" data-testid="text-activity-prasadam-description">
                  Receive blessed food offerings that purify the body and mind through divine grace.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}