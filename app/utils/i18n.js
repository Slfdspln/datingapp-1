import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Set up translations
const translations = {
  en: {
    // General
    appName: 'Dating App',
    
    // Tabs
    discover: 'Discover',
    matches: 'Matches',
    messages: 'Messages',
    profile: 'Profile',
    
    // Actions
    like: 'Like',
    pass: 'Pass',
    edit: 'Edit Profile',
    changePhoto: 'Change Photo',
    
    // Filters
    filters: 'Filters',
    filterMatches: 'Filter Matches',
    ageRange: 'Age Range',
    distance: 'Distance (miles)',
    interests: 'Interests',
    apply: 'Apply',
    min: 'Min',
    max: 'Max',
    
    // Profile
    bio: 'Bio',
    about: 'About',
    noMatches: 'No users found. Adjust your filters to see more matches.',
    
    // Camera
    takePhoto: 'Take Photo',
    retake: 'Retake',
    usePhoto: 'Use Photo',
    gallery: 'Gallery',
    
    // Notifications
    newMatch: '💘 New Match!',
    matchMessage: 'You and {name} have matched! Say hello!',
    newMessage: '💬 New message from {name}',
    newLike: '❤️ New Like!',
    likeMessage: 'Someone liked your profile! Open the app to find out who.',
  },
  es: {
    // General
    appName: 'App de Citas',
    
    // Tabs
    discover: 'Descubrir',
    matches: 'Coincidencias',
    messages: 'Mensajes',
    profile: 'Perfil',
    
    // Actions
    like: 'Me gusta',
    pass: 'Pasar',
    edit: 'Editar Perfil',
    changePhoto: 'Cambiar Foto',
    
    // Filters
    filters: 'Filtros',
    filterMatches: 'Filtrar Coincidencias',
    ageRange: 'Rango de Edad',
    distance: 'Distancia (millas)',
    interests: 'Intereses',
    apply: 'Aplicar',
    min: 'Mín',
    max: 'Máx',
    
    // Profile
    bio: 'Biografía',
    about: 'Acerca de',
    noMatches: 'No se encontraron usuarios. Ajusta tus filtros para ver más coincidencias.',
    
    // Camera
    takePhoto: 'Tomar Foto',
    retake: 'Volver a tomar',
    usePhoto: 'Usar Foto',
    gallery: 'Galería',
    
    // Notifications
    newMatch: '💘 ¡Nueva Coincidencia!',
    matchMessage: '¡Tú y {name} han coincidido! ¡Dile hola!',
    newMessage: '💬 Nuevo mensaje de {name}',
    newLike: '❤️ ¡Nuevo Me gusta!',
    likeMessage: 'A alguien le gustó tu perfil! Abre la app para descubrir quién.',
  },
  // Add more languages as needed
};

// Create i18n instance
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app from device settings
// Make sure we have a valid locale string
const deviceLocale = Localization.locale || 'en';
i18n.locale = deviceLocale.split('-')[0]; // Use just the language code (e.g., 'en' from 'en-US')

// When a value is missing from a language it'll fallback to another language with the key present
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
