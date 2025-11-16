import DomeGallery from "@/components/DomeGallery";

// Extended collection of spiritual ISKCON-themed images for the gallery
const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  }
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-chart-2/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6" data-testid="text-gallery-title">
            Sacred Gallery
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8" data-testid="text-gallery-subtitle">
            Explore our immersive collection of spiritual imagery in an interactive 3D dome experience
          </p>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-card-border inline-block">
            <div className="font-devanagari text-lg text-primary mb-2">
              सर्वं खल्विदं ब्रह्म
            </div>
            <div className="text-sm text-muted-foreground italic">
              "All this is indeed Brahman" - Everything is divine
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Gallery */}
      <div className="relative">
        <div className="h-[80vh] min-h-[600px] bg-gradient-to-b from-background to-chart-2/10">
          <DomeGallery 
            images={GALLERY_IMAGES}
            fit={0.6}
            minRadius={400}
            maxRadius={800}
            overlayBlurColor="#1c1510"
            imageBorderRadius="16px"
            openedImageBorderRadius="20px"
            openedImageWidth="500px"
            openedImageHeight="500px"
            grayscale={false}
            segments={30}
            dragSensitivity={15}
            dragDampening={1.8}
          />
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-card-border">
            <p className="text-sm text-muted-foreground text-center" data-testid="text-gallery-instructions">
              Drag to rotate • Click images to enlarge • Press ESC to close
            </p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-card/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6" data-testid="text-experience-title">
            A Divine Visual Experience
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="text-experience-description">
            This interactive 3D gallery showcases the beauty and serenity of ISKCON's spiritual tradition. 
            Each image represents a facet of devotional life - from sacred temples and deities to 
            meditation practices and devotional items that inspire our spiritual journey.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">Interactive View</h3>
              <p className="text-muted-foreground">Rotate and explore the gallery with intuitive touch and mouse controls</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">Sacred Imagery</h3>
              <p className="text-muted-foreground">Curated collection of spiritual photographs from ISKCON traditions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-10 5h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">Peaceful Experience</h3>
              <p className="text-muted-foreground">Designed to inspire contemplation and spiritual reflection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}