# ✂️ BarberBooking App

> Una aplicación moderna de reservas para barberías, diseñada para conectar clientes con sus barberos favoritos de manera fácil y eficiente.

<div align="center">

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Características](#características) • [Instalación](#instalación) • [Uso](#uso) • [Tecnologías](#tecnologías) • [Arquitectura](#arquitectura)

</div>

---

## 📱 Sobre el Proyecto

**BarberBooking** es una aplicación móvil multiplataforma (iOS, Android, Web) que permite a los clientes encontrar y reservar citas en barberías locales, mientras que los dueños de barberías pueden gestionar sus servicios, barberos y citas de manera eficiente.

### 🎯 Público Objetivo

- **Clientes**: Usuarios que buscan reservar citas con barberos
- **Dueños de Barberías**: Propietarios que gestionan sus negocios y citas

---

## ✨ Características

### Para Clientes 💇‍♂️

- 🔍 **Explorar Barberías**: Busca y descubre barberías cercanas
- 📅 **Reservar Citas**: Selecciona servicio, barbero, fecha y hora
- 👤 **Perfil de Usuario**: Gestiona tu información personal
- 📋 **Historial de Reservas**: Ve tus citas pasadas y próximas
- 🔔 **Notificaciones**: Recibe recordatorios de tus citas
- 🌍 **Multiidioma**: Español e Inglés (español por defecto)

### Para Dueños de Barberías 💼

- 📊 **Dashboard Completo**: Vista general de tu negocio
- ✂️ **Gestión de Servicios**: Añade, edita y elimina servicios
- 👨‍💼 **Gestión de Barberos**: Administra tu equipo de barberos
- 📆 **Calendario de Citas**: Ve y gestiona todas las reservas
- ⚙️ **Configuración**: Personaliza la información de tu barbería
- 📈 **Estadísticas**: Visualiza métricas de tu negocio

### Características Generales 🌟

- 🔐 **Autenticación Segura**: Firebase Authentication
- 🎨 **Diseño Moderno**: UI/UX intuitiva y elegante
- 🌐 **Modo Offline**: Funcionalidad básica sin conexión
- 🔄 **Sincronización en Tiempo Real**: Actualizaciones instantáneas
- 📱 **Multiplataforma**: iOS, Android y Web
- 🌍 **Internacionalización**: Español e Inglés completo

---

## 🚀 Instalación

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Para iOS (Opcional)
- [Xcode](https://developer.apple.com/xcode/) (macOS)

### Para Android (Opcional)
- [Android Studio](https://developer.android.com/studio)

---

## 📦 Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/BarberBookingApp.git
cd BarberBookingApp
```

### 2. Instalar Dependencias

```bash
npm install --legacy-peer-deps
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activa Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Copia las credenciales de tu proyecto
5. Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 4. Iniciar la Aplicación

```bash
# Desarrollo general
npm start

# iOS (macOS solamente)
npm run ios

# Android
npm run android

# Web
npm run web
```

### 5. Abrir en Dispositivo Físico

1. Instala [Expo Go](https://expo.dev/client) en tu dispositivo
2. Escanea el QR code que aparece en la terminal
3. ¡Listo! La app se abrirá en tu dispositivo

---

## 🛠️ Tecnologías

### Frontend

| Tecnología | Propósito |
|-----------|-----------|
| **React Native** | Framework de desarrollo móvil |
| **Expo** | Plataforma de desarrollo y despliegue |
| **TypeScript** | Lenguaje de programación tipado |
| **Expo Router** | Navegación basada en archivos |
| **React Native Paper** | Biblioteca de componentes UI |

### Estado y Datos

| Tecnología | Propósito |
|-----------|-----------|
| **Redux Toolkit** | Gestión de estado global |
| **React Redux** | Integración de Redux con React |
| **Firebase Firestore** | Base de datos en tiempo real |
| **Firebase Auth** | Autenticación de usuarios |

### Formularios y Validación

| Tecnología | Propósito |
|-----------|-----------|
| **React Hook Form** | Gestión de formularios |
| **Zod** | Validación de esquemas |
| **@hookform/resolvers** | Integración con validadores |

### Internacionalización

| Tecnología | Propósito |
|-----------|-----------|
| **i18n-js** | Sistema de traducción |
| **expo-localization** | Detección de idioma del dispositivo |

### Utilidades

| Tecnología | Propósito |
|-----------|-----------|
| **Expo Notifications** | Notificaciones push |
| **Expo Image Picker** | Selector de imágenes |
| **Expo Secure Store** | Almacenamiento seguro |

---

## 📁 Estructura del Proyecto

```
BarberBookingApp/
├── app/                          # Rutas y pantallas (Expo Router)
│   ├── (auth)/                   # Pantallas de autenticación
│   │   ├── login.tsx            # Inicio de sesión
│   │   ├── register.tsx         # Registro
│   │   └── role-select.tsx      # Selección de rol
│   ├── (app)/                   # Pantallas principales
│   │   ├── (customer)/          # Funciones de cliente
│   │   │   ├── index.tsx       # Explorar barberías
│   │   │   ├── business/       # Detalles de barbería
│   │   │   └── book/           # Crear reserva
│   │   ├── (owner)/            # Funciones de dueño
│   │   │   ├── dashboard.tsx   # Panel de control
│   │   │   ├── services.tsx    # Gestión de servicios
│   │   │   ├── barbers.tsx     # Gestión de barberos
│   │   │   └── settings.tsx    # Configuración
│   │   ├── profile.tsx         # Perfil de usuario
│   │   └── my-bookings.tsx     # Mis reservas
│   └── _layout.tsx              # Layout principal
│
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                 # Componentes UI básicos
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── avatar.tsx
│   │   └── language-selector.tsx # Selector de idioma
│   │
│   ├── store/                   # Redux Store
│   │   ├── index.ts            # Configuración del store
│   │   ├── hooks.ts            # Hooks tipados
│   │   └── slices/             # Slices de Redux
│   │       ├── auth-slice.ts
│   │       ├── business-slice.ts
│   │       └── booking-slice.ts
│   │
│   ├── services/                # Servicios externos
│   │   ├── firebase.ts         # Configuración de Firebase
│   │   ├── auth-service.ts     # Servicio de autenticación
│   │   ├── business-service.ts # Servicio de barberías
│   │   └── booking-service.ts  # Servicio de reservas
│   │
│   ├── hooks/                   # Custom Hooks
│   │   ├── use-auth.ts         # Hook de autenticación
│   │   ├── use-business.ts     # Hook de barberías
│   │   ├── use-booking.ts      # Hook de reservas
│   │   └── use-translation.ts  # Hook de traducción
│   │
│   ├── types/                   # Definiciones de TypeScript
│   │   ├── user.ts
│   │   ├── business.ts
│   │   └── booking.ts
│   │
│   ├── i18n/                    # Internacionalización
│   │   ├── index.ts            # Configuración i18n
│   │   └── locales/            # Archivos de traducción
│   │       ├── es.ts           # Español
│   │       └── en.ts           # Inglés
│   │
│   └── constants/               # Constantes
│       ├── theme.ts            # Colores y estilos
│       └── config.ts           # Configuración general
│
├── assets/                      # Recursos estáticos
├── .env                         # Variables de entorno
├── app.json                     # Configuración de Expo
├── package.json                 # Dependencias
├── tsconfig.json               # Configuración de TypeScript
└── README.md                    # Este archivo
```

---

## 🏗️ Arquitectura

### Patrones de Diseño

- **Componente Funcional**: Todos los componentes usan hooks
- **Redux Toolkit**: Gestión de estado centralizada
- **Custom Hooks**: Lógica reutilizable encapsulada
- **Service Layer**: Separación de lógica de negocio
- **Type Safety**: TypeScript en todo el proyecto

### Flujo de Datos

```
Component → Custom Hook → Redux Action → Service Layer → Firebase → Redux State → Component
```

### Organización por Características

```
Feature/
├── Screen (UI)
├── Slice (Estado)
├── Service (Lógica)
├── Hook (Integración)
└── Types (Definiciones)
```

---

## 🌍 Internacionalización (i18n)

La aplicación está completamente traducida en **Español** (predeterminado) e **Inglés**.

### Uso Rápido

```typescript
import { useTranslation } from '../src/hooks'

function MyComponent() {
	const { t, locale, setLocale } = useTranslation()
	
	return (
		<>
			<Text>{t('auth.login.title')}</Text>
			<Button onPress={() => setLocale('en')}>English</Button>
			<Button onPress={() => setLocale('es')}>Español</Button>
		</>
	)
}
```

### Agregar Traducciones

1. Edita `src/i18n/locales/es.ts` (Español)
2. Edita `src/i18n/locales/en.ts` (Inglés)
3. Usa `t('tu.nueva.clave')` en tu componente

**Ver `TRANSLATION_SUMMARY.md` para documentación completa.**

---

## 🔐 Autenticación y Autorización

### Roles de Usuario

- **Customer** (Cliente): Puede buscar barberías y crear reservas
- **Owner** (Dueño): Puede gestionar su barbería, servicios y citas
- **Barber** (Barbero): Puede ver sus citas asignadas (futuro)

### Flujo de Autenticación

1. Usuario se registra con email y contraseña
2. Selecciona su rol (Cliente o Dueño)
3. Accede a funcionalidades según su rol
4. La sesión se mantiene con Firebase Auth

---

## 🎨 Guía de Estilo

### Convenciones de Código

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Archivos**: kebab-case (`use-auth.ts`)
- **Variables**: camelCase (`userName`)
- **Constantes**: UPPERCASE (`API_KEY`)
- **Carpetas**: kebab-case (`auth-screens/`)

### TypeScript

- Usar interfaces para objetos
- Definir tipos para props
- Evitar `any`, usar `unknown` si es necesario
- Tipar funciones y retornos

### Estilo de Componentes

```typescript
// ✅ Correcto
import React from 'react'
import { View, StyleSheet } from 'react-native'

interface Props {
	title: string
	onPress: () => void
}

export function MyComponent({ title, onPress }: Props) {
	return (
		<View style={styles.container}>
			{/* contenido */}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
```

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar Expo
npm run ios           # Abrir en simulador iOS
npm run android       # Abrir en emulador Android
npm run web           # Abrir en navegador

# Utilidades
npm run verify-translations  # Verificar traducciones completas
```

---

## 🚢 Despliegue

### Build para Producción

```bash
# Android (APK)
eas build --platform android

# iOS (IPA)
eas build --platform ios

# Ambos
eas build --platform all
```

### Publicar Actualización

```bash
expo publish
```

---

## 🐛 Resolución de Problemas

### La app no inicia

```bash
# Limpiar caché y reinstalar
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

### Errores de Firebase

1. Verifica que el archivo `.env` existe
2. Confirma que las credenciales son correctas
3. Asegúrate de que los servicios están habilitados en Firebase Console

### Errores de Traducción

1. Verifica que las claves existen en ambos idiomas
2. Ejecuta `npm run verify-translations`
3. Revisa la consola para claves faltantes

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación
- Asegúrate de que las traducciones estén completas

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Tu Nombre** - *Trabajo Inicial* - [Tu GitHub](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- [Expo](https://expo.dev/) por la excelente plataforma de desarrollo
- [Firebase](https://firebase.google.com/) por los servicios backend
- [React Native Community](https://reactnative.dev/) por las herramientas y librerías
- Todos los contribuidores que hacen posible este proyecto

---

## 📞 Contacto

¿Preguntas o sugerencias? No dudes en contactarnos:

- **Email**: tu-email@ejemplo.com
- **GitHub Issues**: [Reportar un problema](https://github.com/tu-usuario/BarberBookingApp/issues)
- **LinkedIn**: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

## 🗺️ Roadmap

### Versión 1.0 (Actual) ✅
- [x] Autenticación de usuarios
- [x] Gestión de barberías
- [x] Sistema de reservas
- [x] Dashboard para dueños
- [x] Internacionalización (ES/EN)

### Versión 1.1 (Próximo) 🚧
- [ ] Notificaciones push
- [ ] Sistema de reviews y ratings
- [ ] Chat en tiempo real
- [ ] Pagos integrados
- [ ] Programa de fidelización

### Versión 2.0 (Futuro) 💡
- [ ] App para barberos
- [ ] Análisis avanzados
- [ ] Integración con redes sociales
- [ ] Sistema de referidos
- [ ] Modo oscuro

---

<div align="center">

**¡Hecho con ❤️ en Colombia 🇨🇴!**

[⬆ Volver arriba](#-barberbooking-app)

</div>

