/**
 * Configuration for Vudrag SuperSplat Experience
 */
import { Color } from 'playcanvas';
import { GALLERIES_DATA } from './data/galleries.js';

/** Environment-based dev mode flag */
export const IS_DEV = import.meta.env.DEV;

/** Main application configuration */
export const CONFIG = {
    splats: [
        {
            name: 'Maska',
            file: 'gs_Maska_Vudrag.sog',
            position: [0, 0.25, 0],
            rotation: [-5, -45, 185],
            scale: 0.80,
            title: 'MASKA',
            subtitle: 'The face beneath the surface',
            number: '01',
            grading: {
                brightness: 1.0, contrast: 1.0, saturation: 1.0,
                exposure: 0.0, gamma: 1.0,
                tintR: 1.0, tintG: 1.0, tintB: 1.0,
                hueShift: 0.0, shadows: 0.0, highlights: 1.0
            }
        },
        {
            name: 'Kapljica',
            file: 'gs_Vudrag_galerija_kapljica.sog',
            position: [0, 0.30, 0],
            rotation: [5, 25, 185],
            scale: 0.85,
            title: 'KAPLJICA',
            subtitle: 'A droplet frozen in time',
            number: '02',
            grading: {
                brightness: 1.0, contrast: 1.0, saturation: 1.0,
                exposure: 0.0, gamma: 1.0,
                tintR: 1.0, tintG: 1.0, tintB: 1.0,
                hueShift: 0.0, shadows: 0.0, highlights: 1.0
            }
        },
        {
            name: 'Romislav',
            file: 'gs_vudrag_romislav.sog',
            position: [0, 0.4, 0],
            rotation: [-175, 30, 0],
            scale: 0.7,
            title: 'ROMISLAV',
            subtitle: 'Echoes of ancient form',
            number: '03',
            grading: {
                brightness: 1.0, contrast: 1.0, saturation: 1.0,
                exposure: 0.0, gamma: 1.0,
                tintR: 1.0, tintG: 1.0, tintB: 1.0,
                hueShift: 0.0, shadows: 0.0, highlights: 1.0
            }
        }
    ],
    galleries: GALLERIES_DATA,
    gallery: {
        orbitSensitivity: 0.3,
        zoomSensitivity: 0.1,
        minZoom: 1.5,
        maxZoom: 6.0,
        autoRotateSpeed: 5.0
    },
    camera: {
        baseDistance: 3.5,
        minDistance: 2.8,
        verticalOffset: 0.4,
        fov: 50
    },
    transition: {
        speed: 3.0,
        plasmaIntensity: 1.5
    },
    colors: {
        background: new Color(0.015, 0.015, 0.025, 1)
    }
};

/** Scroll behavior constants */
export const SCROLL = {
    SNAP_THRESHOLD: 0.4,
    IDLE_TIMEOUT: 150
};
