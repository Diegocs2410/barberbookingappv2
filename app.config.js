/**
 * Expo configuration with environment variable support
 * Permite usar variables de entorno para configuración sensible
 */
export default {
    expo: {
        name: 'BarberBookingApp',
        slug: 'BarberBookingApp',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'automatic',
        scheme: 'barberbooking',
        newArchEnabled: true,
        extra: {
            // Google OAuth Client IDs - obtener de Google Cloud Console
            googleClientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
            googleClientIdIos: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
            googleClientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
            eas: {
                projectId: '51342d61-7735-4d29-80a0-3277e1ad23c4'
            }
        },
        splash: {
            image: './assets/splash-icon.png',
            resizeMode: 'contain',
            backgroundColor: '#1a1a2e',
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.barberbooking.app',
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                CFBundleURLTypes: [
                    {
                        CFBundleURLSchemes: [
                            process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME
                        ]
                    }
                ]
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#1a1a2e',
            },
            package: 'com.barberbooking.app',
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
        },
        web: {
            favicon: './assets/favicon.png',
            bundler: 'metro',
        },
        plugins: [
            'expo-router',
            'expo-font',
            'expo-secure-store',
            [
                'expo-notifications',
                {
                    icon: './assets/icon.png',
                    color: '#e94560',
                },
            ],
        ],
    },
}

