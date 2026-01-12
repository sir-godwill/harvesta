import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Chat-specific colors
        chat: {
          bg: "hsl(var(--chat-bg))",
          "bubble-sent": "hsl(var(--chat-bubble-sent))",
          "bubble-received": "hsl(var(--chat-bubble-received))",
          "bubble-system": "hsl(var(--chat-bubble-system))",
          sidebar: "hsl(var(--chat-sidebar))",
          header: "hsl(var(--chat-header))",
          "input-bg": "hsl(var(--chat-input-bg))",
          timestamp: "hsl(var(--chat-timestamp))",
          unread: "hsl(var(--chat-unread))",
          online: "hsl(var(--chat-online))",
          offline: "hsl(var(--chat-offline))",
        },
        // Commerce cards
        offer: {
          DEFAULT: "hsl(var(--offer-card))",
          border: "hsl(var(--offer-card-border))",
        },
        rfq: {
          DEFAULT: "hsl(var(--rfq-card))",
          border: "hsl(var(--rfq-card-border))",
        },
        delivery: {
          DEFAULT: "hsl(var(--delivery-card))",
          border: "hsl(var(--delivery-card-border))",
        },
        // Role badges
        role: {
          buyer: "hsl(var(--role-buyer))",
          seller: "hsl(var(--role-seller))",
          logistics: "hsl(var(--role-logistics))",
          admin: "hsl(var(--role-admin))",
          system: "hsl(var(--role-system))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
