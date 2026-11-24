export const HERO_SLIDES = [
  {
    id: 'institucional',
    variant: 'institutional',
    image: '/assets/hero-arbitra.png',
    image2: '/logo.png',
    // true si /logo.png YA incluye «ARBITRA» y el subtítulo; false si solo contiene el símbolo «A».
    logoIncludesText: false,
    imageAlt: 'Árbitros de distintas disciplinas deportivas en un estadio',
    title: 'ARBITRA',
    subtitle: 'Centro de Formación Profesional',
  },
  {
    id: 'formaciones',
    variant: 'editorial',
    image: '/assets/wwa.png',
    imageAlt: 'Equipo de árbitros de diferentes disciplinas en un estadio',
    eyebrow: 'Centro de Formación Profesional',
    title: 'El deporte',
    highlight: 'también se dirige.',
    description: 'Formación arbitral para quienes quieren ser protagonistas del deporte.',
    button: { label: 'Conocé nuestras formaciones', to: '/formacion' },
  },
];
