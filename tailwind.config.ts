
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Nouvelle palette de couleurs basée sur l'infographie
				ocean: {
					50: '#E1F7F6',
					100: '#B5EBE8',
					200: '#88DFDA',
					300: '#5BD2CC',
					400: '#36C7C0', // Turquoise clair
					500: '#01877C', // Turquoise principal
					600: '#017A70',
					700: '#016A61',
					800: '#015A52',
					900: '#003C37',
					950: '#002622',
				},
				aqua: {
					50: '#E5F7FD',
					100: '#CCF0FB',
					200: '#99E0F8',
					300: '#65CFFF', // Bleu clair dans l'iceberg
					400: '#3CAED3', // Bleu moyen dans l'iceberg
					500: '#0082B3',
					600: '#00688F',
					700: '#004E6B',
					800: '#003448',
					900: '#001A24',
					950: '#000D12',
				},
				lime: {
					50: '#F3FCEB',
					100: '#E8F9D7',
					200: '#D0F3AF',
					300: '#B9ED87',
					400: '#A2E65E', // Accent vert lime
					500: '#8BDF36',
					600: '#70B22B',
					700: '#548621',
					800: '#395916',
					900: '#1D2C0B',
					950: '#0F1605',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Georgia', 'serif'],
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				breathe: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				wave: {
					'0%, 100%': { transform: 'translateY(0)' },
					'25%': { transform: 'translateY(-5px)' },
					'50%': { transform: 'translateY(0)' },
					'75%': { transform: 'translateY(5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.6s ease-out',
				'slide-up': 'slideUp 0.6s ease-out',
				'pulse-slow': 'pulse 4s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'breathe': 'breathe 8s ease-in-out infinite',
				'wave': 'wave 10s ease-in-out infinite'
			},
			backgroundImage: {
				'ocean-gradient': 'linear-gradient(180deg, #01877C 0%, #3CAED3 100%)',
				'iceberg-gradient': 'linear-gradient(to bottom, #01877C 0%, #3CAED3 50%, #65CFFF 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
