import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

// Spiritual ISKCON-themed images for the gallery
const SPIRITUAL_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1641913625440-158406784a9f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Devotional spiritual art'
  },
  {
    src: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Sacred temple architecture'
  },
  {
    src: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Meditation and spirituality'
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Sacred mountain landscape'
  },
  {
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Golden temple spiritual scene'
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Spiritual lotus flower'
  },
  {
    src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.1',
    alt: 'Ancient spiritual texts'
  }
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el: Element, name: string, fallback: number) => {
  const attr = (el as any).dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool: Array<{ src: string; alt: string } | string>, seg: number) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }));
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' };
    }
    return { src: image.src || '', alt: image.alt || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  // Shuffle to avoid repetition
  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt
  }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

interface DomeGalleryProps {
  images?: Array<{ src: string; alt: string } | string>;
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
}

export default function DomeGallery({
  images = SPIRITUAL_IMAGES,
  fit = 0.9,
  fitBasis = 'auto',
  minRadius = 300,
  maxRadius = Infinity,
  padFactor = 0.15,
  overlayBlurColor = 'rgba(6, 0, 16, 0.8)',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 0.6,
  openedImageWidth = '80vmin',
  openedImageHeight = '80vmin',
  imageBorderRadius = '16px',
  openedImageBorderRadius = '20px',
  grayscale = false
}: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const focusedElRef = useRef<HTMLElement | null>(null);
  const originalTilePositionRef = useRef<any>(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const cancelTapRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef<number | null>(null);
  const pointerTypeRef = useRef('mouse');
  const tapTargetRef = useRef<HTMLElement | null>(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add('dg-scroll-lock');
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
    scrollLockedRef.current = false;
    document.body.classList.remove('dg-scroll-lock');
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  const lockedRadiusRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);
      const aspect = w / h;

      let basis;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }

      let radius = basis * fit;
      const heightGuard = h * 0.8; // More conservative height guard
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));

      // Set CSS custom properties
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(100%)' : 'none');
      root.style.setProperty('--segments', `${segments}`);

      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });

    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    segments
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx: number, vy: number) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);

      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();

        pointerTypeRef.current = (event as any).pointerType || 'mouse';
        if (pointerTypeRef.current === 'touch') event.preventDefault();
        if (pointerTypeRef.current === 'touch') lockScroll();
        draggingRef.current = true;
        cancelTapRef.current = false;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: (event as any).clientX, y: (event as any).clientY };
        const potential = (event.target as any).closest?.('.item-image');
        tapTargetRef.current = potential || null;
      },
      onDrag: ({ event, last, velocity: velArr = [0, 0], direction: dirArr = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;

        if (pointerTypeRef.current === 'touch') event.preventDefault();

        const dxTotal = (event as any).clientX - startPosRef.current.x;
        const dyTotal = (event as any).clientY - startPosRef.current.y;

        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
          if (dist2 > 16) movedRef.current = true;
        }

        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = startRotRef.current.y + dxTotal / dragSensitivity;

        const cur = rotationRef.current;
        if (cur.x !== nextX || cur.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }

        if (last) {
          draggingRef.current = false;
          let isTap = false;

          if (startPosRef.current) {
            const dx = (event as any).clientX - startPosRef.current.x;
            const dy = (event as any).clientY - startPosRef.current.y;
            const dist2 = dx * dx + dy * dy;
            const TAP_THRESH_PX = pointerTypeRef.current === 'touch' ? 10 : 6;
            if (dist2 <= TAP_THRESH_PX * TAP_THRESH_PX) {
              isTap = true;
            }
          }

          let [vMagX, vMagY] = velArr;
          const [dirX, dirY] = dirArr;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;

          if (!isTap && Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement;
            vx = (mx / dragSensitivity) * 0.02;
            vy = (my / dragSensitivity) * 0.02;
          }

          if (!isTap && (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)) {
            startInertia(vx, vy);
          }
          startPosRef.current = null;
          cancelTapRef.current = !isTap;

          if (isTap && tapTargetRef.current && !focusedElRef.current) {
            openItemFromElement(tapTargetRef.current);
          }
          tapTargetRef.current = null;

          if (cancelTapRef.current) setTimeout(() => (cancelTapRef.current = false), 120);
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
          if (pointerTypeRef.current === 'touch') unlockScroll();
        }
      }
    },
    { target: mainRef, eventOptions: { passive: false } }
  );

  const openItemFromElement = (el: HTMLElement) => {
    if (!el || cancelTapRef.current || openingRef.current) return;

    openingRef.current = true;
    openStartedAtRef.current = performance.now();
    lockScroll();

    const parent = el.parentElement!;
    focusedElRef.current = el;

    const overlay = document.createElement('div');
    overlay.className = 'enlarge-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      opacity: 0;
      transition: opacity ${enlargeTransitionMs}ms ease;
      cursor: pointer;
    `;

    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
      max-width: ${openedImageWidth};
      max-height: ${openedImageHeight};
      width: 90vw;
      height: 90vh;
      border-radius: ${openedImageBorderRadius};
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      transform: scale(0.8);
      transition: transform ${enlargeTransitionMs}ms ease;
    `;

    const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
    const rawAlt = parent.dataset.alt || el.querySelector('img')?.alt || '';
    const img = document.createElement('img');
    img.src = rawSrc;
    img.alt = rawAlt;
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: ${grayscale ? 'grayscale(100%)' : 'none'};
    `;

    imgContainer.appendChild(img);
    overlay.appendChild(imgContainer);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      imgContainer.style.transform = 'scale(1)';
      rootRef.current?.setAttribute('data-enlarging', 'true');
    });

    // Close on click
    overlay.addEventListener('click', () => {
      overlay.style.opacity = '0';
      imgContainer.style.transform = 'scale(0.8)';

      setTimeout(() => {
        overlay.remove();
        focusedElRef.current = null;
        rootRef.current?.removeAttribute('data-enlarging');
        openingRef.current = false;
        unlockScroll();
      }, enlargeTransitionMs);
    });
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('dg-scroll-lock');
    };
  }, []);

  const cssStyles = `
    .dome-gallery-root {
      --radius: 400px;
      --viewer-pad: 32px;
      --segments: ${segments};
      --circ: calc(var(--radius) * 3.14159);
      --item-angle: calc(360deg / var(--segments));
      --item-width: calc(var(--circ) / var(--segments));
      --item-height: calc(var(--circ) / var(--segments));
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }

    .dome-gallery-root * {
      box-sizing: border-box;
    }

    .dome-stage {
      width: 100%;
      height: 100%;
      perspective: calc(var(--radius) * 2.5);
      perspective-origin: 50% 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .dome-sphere {
      transform-style: preserve-3d;
      transform: translateZ(calc(var(--radius) * -1));
      will-change: transform;
      position: relative;
      width: 0;
      height: 0;
    }

    .dome-item {
      position: absolute;
      width: calc(var(--item-width) * var(--size-x, 1));
      height: calc(var(--item-height) * var(--size-y, 1));
      transform-style: preserve-3d;
      transform-origin: center center;
      backface-visibility: hidden;
      left: calc(var(--item-width) * var(--size-x, 1) / -2);
      top: calc(var(--item-height) * var(--size-y, 1) / -2);
    }

    .item-image {
      position: absolute;
      inset: 4px;
      border-radius: var(--tile-radius, 16px);
      overflow: hidden;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(2px);
      transition: transform 300ms ease, box-shadow 300ms ease;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    .item-image:hover {
      transform: scale(1.05) translateZ(10px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      pointer-events: none;
      filter: var(--image-filter, none);
      transition: filter 300ms ease;
    }

    .dome-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(
        circle at center,
        transparent 50%,
        var(--overlay-blur-color, rgba(6, 0, 16, 0.8)) 85%
      );
      z-index: 5;
    }

    .dome-gradient-top,
    .dome-gradient-bottom {
      position: absolute;
      left: 0;
      right: 0;
      height: 20%;
      pointer-events: none;
      z-index: 6;
    }

    .dome-gradient-top {
      top: 0;
      background: linear-gradient(
        to bottom,
        var(--overlay-blur-color, rgba(6, 0, 16, 0.8)),
        transparent
      );
    }

    .dome-gradient-bottom {
      bottom: 0;
      background: linear-gradient(
        to top,
        var(--overlay-blur-color, rgba(6, 0, 16, 0.8)),
        transparent
      );
    }

    body.dg-scroll-lock {
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
      touch-action: none !important;
      overscroll-behavior: contain !important;
    }

    .enlarge-overlay {
      backdrop-filter: blur(10px);
    }

    @media (max-width: 768px) {
      .dome-gallery-root {
        --radius: 300px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div
        ref={rootRef}
        className="dome-gallery-root"
      >
        <main
          ref={mainRef}
          className="dome-stage"
          style={{ touchAction: 'none' }}
        >
          <div ref={sphereRef} className="dome-sphere">
            {items.map((item, index) => {
              const baseRotation = computeItemBaseRotation(item.x, item.y, item.sizeX, item.sizeY, segments);
              const transform = `
                rotateY(${baseRotation.rotateY}deg)
                rotateX(${baseRotation.rotateX}deg)
                translateZ(var(--radius))
              `;

              return (
                <div
                  key={`${item.x}-${item.y}-${index}`}
                  className="dome-item"
                  data-src={item.src}
                  data-alt={item.alt}
                  data-offset-x={item.x}
                  data-offset-y={item.y}
                  data-size-x={item.sizeX}
                  data-size-y={item.sizeY}
                  style={{
                    transform,
                    '--size-x': item.sizeX,
                    '--size-y': item.sizeY
                  } as React.CSSProperties}
                >
                  <div
                    className="item-image"
                    onClick={() => {
                      if (performance.now() - lastDragEndAt.current > 100) {
                        openItemFromElement(document.querySelector(`[data-src="${item.src}"] .item-image`) as HTMLElement);
                      }
                    }}
                  >
                    {item.src && (
                      <img
                        src={item.src}
                        alt={item.alt}
                        draggable={false}
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overlay gradients */}
          <div className="dome-overlay" />
          <div className="dome-gradient-top" />
          <div className="dome-gradient-bottom" />
        </main>

        <div ref={viewerRef} style={{ display: 'none' }}>
          <div ref={frameRef} />
          <div ref={scrimRef} />
        </div>
      </div>
    </>
  );
}