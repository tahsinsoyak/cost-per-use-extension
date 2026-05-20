import { ValueRating } from '../types/calculation';

export interface RatingDetails {
  rating: ValueRating;
  label: string;
  className: string; // for tailwind styling
  explanation: string;
}

export function getValueRating(totalUses: number): ValueRating {
  if (totalUses >= 200) {
    return 'excellent';
  } else if (totalUses >= 50) {
    return 'good';
  } else if (totalUses >= 20) {
    return 'think_twice';
  } else {
    return 'expensive';
  }
}

export function getRatingDetails(rating: ValueRating): RatingDetails {
  switch (rating) {
    case 'excellent':
      return {
        rating,
        label: 'Excellent value',
        className: 'bg-success/10 text-success dark:bg-success/20 dark:text-success',
        explanation: 'Great value. Based on your usage estimate, this product becomes very affordable per use.',
      };
    case 'good':
      return {
        rating,
        label: 'Good value',
        className: 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent',
        explanation: 'Good value. The cost per use is reasonable if your usage estimate is realistic.',
      };
    case 'think_twice':
      return {
        rating,
        label: 'Think twice',
        className: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning',
        explanation: 'Think twice. The product may feel expensive if you do not use it often.',
      };
    case 'expensive':
      return {
        rating,
        label: 'Expensive per use',
        className: 'bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger',
        explanation: 'High cost per use. Consider a cheaper alternative, longer ownership, or more frequent use.',
      };
  }
}
