"use client";

import { useState } from "react";

import type { BookImage } from "./gallery-section";
import { GallerySection } from "./gallery-section";
import type { Review } from "./reviews-section";
import { HeroSection } from "./hero-section";
import { LaunchFooter } from "./launch-footer";
import { LaunchModal } from "./launch-modal";
import { ReviewsSection } from "./reviews-section";

type HomePageProps = {
  bookImages: readonly BookImage[];
  reviews: readonly Review[];
};

export function HomePage({ bookImages, reviews }: HomePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="flex min-h-screen flex-col bg-surface text-on-surface">
      <HeroSection onNotifyClick={openModal} />
      <GallerySection images={bookImages} />
      <ReviewsSection reviews={reviews} />
      <LaunchFooter onJoinClick={openModal} />
      <LaunchModal open={isModalOpen} onClose={closeModal} />
    </main>
  );
}