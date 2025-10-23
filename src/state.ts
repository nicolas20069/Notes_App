// Importa la función `atom` desde Jotai para crear unidades de estado global
import { atom } from 'jotai';

/* 
  Átomo que representa la lista completa de notas guardadas.
  Cada nota es un objeto con:
    - id: identificador único generado con `crypto.randomUUID()`
    - title: título de la nota (usualmente la primera línea del contenido)
    - content: texto completo en formato Markdown
    - date: fecha y hora en que se guardó la nota
*/
export const notesAtom = atom<Array<{
  id: string;
  title: string;
  content: string;
  date: string;
}>>([]); // Valor inicial: array vacío

/*
  Átomo que guarda el ID de la nota actualmente seleccionada.
  Se usa para saber cuál nota está activa en el editor y en la vista previa.
*/


export const selectedNoteAtom = atom<string>(''); // Valor inicial: cadena vacía

export const markdownAtom = atom<string>(''); // Estado global del contenido Markdown