import { atom } from 'jotai';

// Átomo para el contenido de la nota Markdown
export const markdownAtom = atom<string>('# Bienvenido a tu app de notas');