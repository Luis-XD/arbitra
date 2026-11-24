export const formations = [
 {title:'Árbitro de Fútbol 11',duration:'6 meses',level:'Inicial / Intermedio',image:'/assets/ball11.jpg',description:'Fundamentos del arbitraje de campo, reglas de juego y toma de decisiones.'},
 {title:'Árbitro de Fútbol 8 y 5',duration:'4 meses',level:'Inicial',image:'/assets/ball8.jpg',description:'Herramientas arbitrales adaptadas a formatos de fútbol reducido.'},
 {title:'Árbitro de Futsal',duration:'3 meses',level:'Inicial',image:'/assets/futsal.jpg',description:'Reglamentación y criterios de arbitraje para futsal.'},
 {title:'Árbitro de Fútbol Playa',duration:'3 meses',level:'Inicial',image:'/assets/beach.jpg',description:'Introducción al arbitraje en superficies de arena.'}
];
export const courses = [
 {title:'Reglamentación IFAB',desc:'Actualización y estudio de las Reglas de Juego.',sessions:'4 clases',image:'/assets/referee.jpg'},
 {title:'Preparación física arbitral',desc:'Entrenamiento específico y planificación.',sessions:'4 clases',image:'/assets/course.jpg'},
 {title:'VAR y nuevas tecnologías',desc:'Aplicación y criterios en la toma de decisiones.',sessions:'3 clases',image:'/assets/campus.jpg'},
 {title:'Gestión y control del partido',desc:'Liderazgo, comunicación y toma de decisiones.',sessions:'4 clases',image:'/assets/about.jpg'}
];
export const faqs = [
 ['¿ARBITRA® forma solamente árbitros de fútbol?','No. ARBITRA® es un Centro de Formación Profesional con enfoque multideportivo. Su proyecto académico contempla árbitros, jueces y oficiales de diferentes disciplinas. La disponibilidad de cursos depende de la programación vigente.'],
 ['¿Necesito experiencia previa?','Sí, existen modalidades con formación virtual. Las prácticas presenciales y sus condiciones varían según la modalidad.'],
 ['¿Todas las modalidades incluyen tutorías?','Las modalidades regulares incluyen tutorías personalizadas semanales o quincenales. Rookie promocional online no las incluye.'],
 ['¿Los cursos habilitan automáticamente para arbitrar competencias oficiales?','No necesariamente. Las designaciones, licencias y habilitaciones dependen de los requisitos de las federaciones, asociaciones u organismos competentes. La información sobre reconocimientos específicos debe verificarse para cada programa.'],
 ['¿Puedo acceder a reglamentos de distintos deportes?','La biblioteca reglamentaria de ARBITRA® está concebida para reunir enlaces a fuentes oficiales y recursos de consulta, organizados por disciplina.'],
 ['¿Qué requisitos necesito para inscribirme?','Los requisitos dependen de la formación. Contactanos para conocer las condiciones vigentes de cada programa.'],
 ['¿Las formaciones son presenciales u online?','La modalidad se confirma al consultar por cada formación.'],
 ['¿Qué certificación otorgan?','La información sobre constancias y certificaciones se comunica antes de la inscripción.'],
 ['¿Puedo realizar más de una formación a la vez?','Consultanos por la disponibilidad y compatibilidad de horarios.'],
 ['¿Cómo accedo al Campus Virtual?','El acceso se habilita a los estudiantes mediante las credenciales proporcionadas por la institución.'],
 ['¿Cuál es la modalidad de evaluación?','Las evaluaciones y condiciones de aprobación se detallan en el programa de cada formación.']
];

export const MODALIDADES_ARBITRAJE = {
  presencial: {
    nameImg: "../../images/home/presencial.png",
    mode: "Modalidad 1",
    title: "Presencial",
    descrip: "Formación integral en cancha. Inversión: $570.000.",
    to: "/contacto",
    items: [
      { id: 1, text: "24 clases teóricas (48 horas)" },
      { id: 2, text: "4 prácticas de campo (12 horas)" },
      { id: 3, text: "3 meses de Seguro Personal" },
      { id: 4, text: "3 meses de Membresía en FECHA LISTA" },
      { id: 5, text: "Membresía Vitalicia a la Comunidad ARBITRA®" },
      { id: 6, text: "10 prácticas rentadas en torneos" },
      { id: 7, text: "Kit Arbitral (remera, short, medias, tarjetas y silbato)" },
      { id: 8, text: "Instructor Certificado" },
    ],
    investment: "ARS $570.000"
  },
  distanciaPresencial: {
    nameImg: "../../images/home/distancia_presencial.png",
    mode: "Modalidad 2",
    title: "Distancia + Presencial",
    descrip: "Teoría online y prácticas en campo. Inversión: $480.000.",
    to: "/contacto",
    items: [
      { id: 1, text: "24 clases teóricas (48 horas)" },
      { id: 2, text: "4 prácticas de campo (12 horas)" },
      { id: 3, text: "3 meses de Seguro Personal" },
      { id: 4, text: "3 meses de Membresía en FECHA LISTA" },
      { id: 5, text: "Membresía Vitalicia a la Comunidad ARBITRA®" },
      { id: 6, text: "10 prácticas rentadas en torneos" },
      { id: 7, text: "Kit Arbitral (remera, short, medias, tarjetas y silbato)" },
      { id: 8, text: "Instructor Certificado" },
    ],
    investment: "ARS $480.000"
  },
  distanciaIntensiva: {
    nameImg: "../../images/home/distancia_intensiva.png",
    mode: "Modalidad 3",
    title: "Distancia + Intensiva",
    descrip: "Teoría online y práctica intensiva. Inversión: $480.000.",
    to: "/contacto",
    items: [
      { id: 1, text: "24 clases teóricas (48 horas)" },
      { id: 2, text: "2 jornadas intensivas de práctica (12 horas)" },
      { id: 3, text: "3 meses de Seguro Personal" },
      { id: 4, text: "3 meses de Membresía en FECHA LISTA" },
      { id: 5, text: "Membresía Vitalicia a la Comunidad ARBITRA®" },
      { id: 6, text: "10 prácticas rentadas en torneos" },
      { id: 7, text: "Kit Arbitral (remera, short, medias, tarjetas y silbato)" },
      { id: 8, text: "Instructor Certificado" },
    ],
    investment: "ARS $480.000"
  },
  online: {
    nameImg: "../../images/home/100_online.png",
    mode: "Modalidad 4",
    title: "100% Online",
    descrip: "Formación flexible, desde donde estés. Inversión: $249.000.",
    to: "/contacto",
    items: [
      { id: 1, text: "24 clases teóricas (48 horas) (online en vivo o grabadas)" },
      { id: 2, text: "4 actividades prácticas supervisadas por video (12 horas)" },
      { id: 3, text: "Material descargable y campus virtual" },
      { id: 4, text: "Membresía Vitalicia a la Comunidad ARBITRA®" },
      { id: 5, text: "Instructor Certificado" },
      { id: 6, text: "Certificado digital con QR verificable" },
    ],
    investment: "ARS $249.000"
  },
};