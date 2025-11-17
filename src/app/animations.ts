// src/app/animations.ts
/**
 * Stunning UI Animations
 * Route transitions, fade effects, slide animations, and micro-interactions
 */

import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  animateChild,
  state,
} from '@angular/animations';

/**
 * Route transition animation
 * Fades between routes with a smooth crossfade effect
 */
export const routeTransitionAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          width: '100%',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    group([
      query(
        ':leave',
        [animate('300ms ease-out', style({ opacity: 0 }))],
        { optional: true }
      ),
      query(
        ':enter',
        [animate('300ms ease-out', style({ opacity: 1 }))],
        { optional: true }
      ),
    ]),
  ]),
]);

/**
 * Fade in animation for elements entering the view
 */
export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
]);

/**
 * Slide up animation for elements entering from below
 */
export const slideUpAnimation = trigger('slideUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate(
      '400ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
]);

/**
 * Scale animation for cards and interactive elements
 */
export const scaleAnimation = trigger('scale', [
  state('normal', style({ transform: 'scale(1)' })),
  state('hovered', style({ transform: 'scale(1.02)' })),
  transition('normal <=> hovered', animate('200ms ease-out')),
]);

/**
 * Stagger animation for lists of items
 * Use with *ngFor and animation delay
 */
export const staggerAnimation = trigger('stagger', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms {{delay}}ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ],
      { optional: true }
    ),
  ]),
]);

/**
 * Dialog open/close animation
 */
export const dialogAnimation = trigger('dialog', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate(
      '300ms ease-out',
      style({ opacity: 1, transform: 'scale(1)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({ opacity: 0, transform: 'scale(0.95)' })
    ),
  ]),
]);

/**
 * Expand/collapse animation for accordions and expandable sections
 */
export const expandCollapseAnimation = trigger('expandCollapse', [
  state('collapsed', style({ height: '0', overflow: 'hidden', opacity: 0 })),
  state('expanded', style({ height: '*', overflow: 'visible', opacity: 1 })),
  transition('collapsed <=> expanded', animate('300ms ease-out')),
]);

/**
 * Button press animation (slight scale down on click)
 */
export const buttonPressAnimation = trigger('buttonPress', [
  state('normal', style({ transform: 'scale(1)' })),
  state('pressed', style({ transform: 'scale(0.98)' })),
  transition('normal <=> pressed', animate('100ms ease-out')),
]);

/**
 * Skeleton loading animation (shimmer effect)
 */
export const shimmerAnimation = trigger('shimmer', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 })),
  ]),
]);
