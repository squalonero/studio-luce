"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

export type PieceGalleryImage = {
  src: string;
  alt: string;
};

type PieceGalleryProps = {
  title: string;
  images: PieceGalleryImage[];
};

/**
 * Detail gallery. The stage and the thumbnails open the same viewer,
 * which is the navigation menu for the piece's photographs.
 */
export function PieceGallery({ title, images }: PieceGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  function openAt(index: number, event: MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    setOpenIndex(index);
  }

  function closeViewer() {
    setOpenIndex(null);
    opener.current?.focus();
    opener.current = null;
  }

  function step(delta: number) {
    setOpenIndex((current) => {
      if (current === null) {
        return current;
      }
      return (current + delta + images.length) % images.length;
    });
  }

  useEffect(() => {
    if (openIndex === null) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, images.length]);

  const cover = images[0];
  if (!cover) {
    throw new Error("PieceGallery requires at least one image");
  }

  return (
    <div className="piece-gallery">
      <h2 className="piece-gallery-title">Fotografie</h2>
      <button
        type="button"
        className="piece-stage"
        aria-label={`Apri ${cover.alt}`}
        onClick={(event) => openAt(0, event)}
      >
        <img src={cover.src} alt="" />
      </button>
      {images.length > 1 ? (
        <ul className="piece-thumbs">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={(event) => openAt(index, event)}
                aria-label={`Apri la fotografia ${index + 1}`}
              >
                <img src={image.src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {openIndex !== null ? (
        <ImageViewer
          title={title}
          images={images}
          index={openIndex}
          onClose={closeViewer}
          onStep={step}
          onSelect={setOpenIndex}
        />
      ) : null}
    </div>
  );
}

type ImageViewerProps = {
  title: string;
  images: PieceGalleryImage[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
  onSelect: (index: number) => void;
};

/** Full-screen photograph menu: the current image, previous and next, and every thumbnail. */
function ImageViewer({ title, images, index, onClose, onStep, onSelect }: ImageViewerProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const image = images[index];
  if (!image) {
    throw new Error(`Piece gallery has no photograph at index ${index}`);
  }

  useEffect(() => {
    closeButton.current?.focus();
  }, []);

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`Fotografie di ${title}`}>
      {/* Behind the menu, and out of the tab order. The visible close control is the button below. */}
      <button type="button" className="viewer-backdrop" tabIndex={-1} aria-label="Chiudi le fotografie" onClick={onClose} />
      <div className="viewer-bar">
        <p className="viewer-count">
          {index + 1} di {images.length}
        </p>
        <button ref={closeButton} type="button" className="viewer-close" onClick={onClose}>
          Chiudi
        </button>
      </div>
      <div className="viewer-layout">
        {images.length > 1 ? (
          <button type="button" className="viewer-nav" aria-label="Fotografia precedente" onClick={() => onStep(-1)}>
            ‹
          </button>
        ) : null}
        <img key={image.src} src={image.src} alt={image.alt} />
        {images.length > 1 ? (
          <button type="button" className="viewer-nav" aria-label="Fotografia successiva" onClick={() => onStep(1)}>
            ›
          </button>
        ) : null}
      </div>
      {images.length > 1 ? (
        <ul className="viewer-menu" aria-label="Menu delle fotografie">
          {images.map((item, itemIndex) => (
            <li key={item.src}>
              <button
                type="button"
                aria-current={itemIndex === index ? "true" : undefined}
                aria-label={`Fotografia ${itemIndex + 1}`}
                onClick={() => onSelect(itemIndex)}
              >
                <img src={item.src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
