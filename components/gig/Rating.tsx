import { FaStar } from "react-icons/fa";
import React, { useState } from "react";

interface RatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

function Rating({ rating, setRating }: RatingProps) {
  const [hover, setHover] = useState<number | null>(null); // hover can be null or the index of the hovered star

  return (
    <div className="flex">
      {[...Array(5)].map((star, index) => {
        const currentRating = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={currentRating}
              onChange={() => setRating(currentRating)} // Use onChange instead of onClick
              checked={currentRating === rating} // Sync the checked state
              hidden
            />
            <FaStar
              className="star text-neutral-200"
              color={
                currentRating <= (hover || rating) ? "yellow" : "lightgray"
              }
              onMouseOver={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
              size={"22px"}
            />
          </label>
        );
      })}
    </div>
  );
}

export default Rating;
