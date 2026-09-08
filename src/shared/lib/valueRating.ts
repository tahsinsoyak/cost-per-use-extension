import { ValueRating } from '../types/calculation';
import { en } from '../locales/en';

export interface RatingDetails {
  rating: ValueRating;
  label: string;
  className: string;
  explanation: string;
}

// Legacy keys retain saved calculation and JSON import compatibility.
// They identify estimated total-use bands, not affordability judgments.
export function getValueRating(totalUses: number): ValueRating {
  if (totalUses >= 200) return 'excellent';
  if (totalUses >= 50) return 'good';
  if (totalUses >= 20) return 'think_twice';
  return 'expensive';
}

export function getRatingDetails(rating: ValueRating): RatingDetails {
  return {
    rating,
    label: en.results.ratingLabels[rating],
    className: 'bg-elevated text-text-secondary border border-border/10',
    explanation: en.results.ratings[rating],
  };
}
