/**
 * Gallery Data Configuration
 * Defines the collections and sculptures available in the 3D viewing room.
 */

export const GALLERIES_DATA = {
    galleries: [
        {
            id: "showcase",
            name: "Featured Sculptures",
            environment: "environments/rotunda",
            sculptures: [
                {
                    id: "aniche",
                    file: "splats/gs_aniche.sog",
                    title: "Aniche",
                    artist: "Nikola Vudrag",
                    year: "2024",
                    position: [-0.01, -0.3, 0.02],
                    scale: [0.38, 0.38, 0.38],
                    rotation: [180, 45, 0],
                    description: "A delicate exploration of form and void, capturing the ethereal nature of memory.",
                    material: "Bronze & Steel",
                    origin: "Zagreb Studio"
                },
                {
                    id: "apheodita",
                    file: "splats/gs_apheodita.sog",
                    title: "Apheodita",
                    artist: "Nikola Vudrag",
                    year: "2024",
                    position: [0, -0.31, -0.1],
                    scale: [0.36, 0.36, 0.36],
                    rotation: [180, 269, 0],
                    description: "Mythological reimagining through industrial mediums, blending classical beauty with raw materiality.",
                    material: "Polished Bronze",
                    origin: "Varaždin Workshop"
                },
                {
                    id: "franjo",
                    file: "splats/gs_franjo.sog",
                    title: "Franjo",
                    artist: "Nikola Vudrag",
                    year: "2024",
                    position: [0, -0.3, -0.02],
                    scale: [0.4, 0.4, 0.4],
                    rotation: [180, 271, 0],
                    description: "A powerful bust capturing the stoic resilience of the human spirit.",
                    material: "Iron & Patina",
                    origin: "Private Collection"
                },
                {
                    id: "ivo",
                    file: "splats/gs_ivo.sog",
                    title: "Ivo",
                    artist: "Nikola Vudrag",
                    year: "2024",
                    position: [0, -0.3, 0],
                    scale: [0.32, 0.32, 0.32],
                    rotation: [180, 90, 0],
                    description: "Modernist interpretation of identity, fragmented yet cohesive.",
                    material: "Welded Steel",
                    origin: "Artist Archive"
                }
            ]
        }
    ]
};
