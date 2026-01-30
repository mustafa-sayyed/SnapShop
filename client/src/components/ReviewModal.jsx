import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { Spinner } from "@/components/ui/spinner";

export const ReviewModal = ({ 
  isOpen, 
  onClose, 
  productName, 
  productImage,
  initialRating,
  onSubmit,
  isSubmitting 
}) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }
    onSubmit({ rating, review });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this product
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Product details */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <img 
              src={productImage} 
              alt={productName} 
              className="w-16 h-16 object-cover rounded-md border"
            />
            <div>
              <h4 className="font-medium">{productName}</h4>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating *</label>
            <div className="flex items-center gap-2">
              <StarRating 
                rating={rating} 
                onRatingChange={setRating} 
                interactive={true}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm text-gray-600">
                  ({rating} star{rating !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review (Optional)</label>
            <Textarea
              placeholder="Tell us what you think about this product..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {review.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
