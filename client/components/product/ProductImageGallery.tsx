import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  badge?: string;
}

export function ProductImageGallery({ images, productName, badge }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Use the main image for all thumbnails for now
  const galleryImages = images.length > 1 ? images : [images[0], images[0], images[0]];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
        <img
          src={galleryImages[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {badge && (
          <Badge className="absolute top-4 left-4" variant="secondary">
            {badge}
          </Badge>
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex space-x-2">
        {galleryImages.slice(0, 3).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "w-20 h-20 rounded-md border-2 transition-all duration-300 overflow-hidden bg-muted",
              "hover:border-gold hover:scale-105",
              selectedImage === index 
                ? "border-gold ring-2 ring-gold/30 scale-105" 
                : "border-transparent"
            )}
          >
            <img
              src={image}
              alt={`${productName} view ${index + 1}`}
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
