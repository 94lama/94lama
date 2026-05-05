import { animate as animeAnimate, remove as animeRemove } from "animejs";

// Lightweight wrapper for anime.js. Centralize defaults here so future animation changes
// can be adjusted in one place.

export function animate(target: any, params: any) {
  return animeAnimate(target, params);
}

export function remove(target: any) {
  return animeRemove(target);
}
