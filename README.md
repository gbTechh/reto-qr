# 📱 Oechsle Product Scanner Challenge

Una aplicación web de alto rendimiento diseñada para escanear códigos de barras o codigos Qr, consultar precios y gestionar un historial de productos en tiempo real. Construida con **Next.js 16**, enfocada en la experiencia de usuario móvil (Mobile First) y la optimización de recursos.

![Status](https://img.shields.io/badge/Status-Completed-success) ![Coverage](https://img.shields.io/badge/Coverage-Vitest-purple) ![Performance](https://img.shields.io/badge/Performance-Optimized-blue)

## 🚀 Características Principales

- **Escáner Universal:** Soporte para cámaras traseras (móviles) y webcams (laptops) con detección automática de hardware.
- **Soporte Multi-Formato:** Lee EAN-13, EAN-8, QR, Code 128 y Code 39.
- **UI Reactiva:** Animaciones fluidas a 60fps utilizando HTML5 Canvas y CSS.
- **Feedback Instantáneo:** Sistema de notificaciones (Toasts) para errores y confirmaciones.
- **Persistencia:** Historial de escaneos reciente mantenido en el estado global.
- **Modo Oscuro Forzado:** Diseño "Dark Mode First" para reducir el consumo de batería en pantallas OLED y mejorar la legibilidad.

## 🛠 Tech Stack

### Core

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - Por su capacidad de SSR y optimización de rutas (App router).
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Tipado estático estricto para reducir bugs en tiempo de ejecución.
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Para un desarrollo rápido y un bundle CSS minúsculo.

### Gestión de Estado & Datos

- **Server State:** [TanStack Query (React Query)](https://tanstack.com/query/latest) - Manejo de caché, reintentos y estados de carga/error asíncronos.
- **Client State:** [Zustand](https://github.com/pmndrs/zustand) - Para el manejo de estado global (historial, drawers) sin el boilerplate de Redux ni los re-renders del Context API.

### UI & Hardware

- **Componentes:** [Shadcn/ui](https://ui.shadcn.com/) (Radix Primitives) - Rápido maquetado, accesibilidad garantizada y personalización total.
- **Cámara:** `html5-qrcode` - Implementación a bajo nivel para control manual del stream de video.
- **Feedback:** `sonner` - Toasts apilables y ligeros.
- **Testing:** `Vitest` + `React Testing Library`.

---

## 🧠 Decisiones Técnicas y Arquitectura

### 1. Manejo de Hardware y "Race Conditions" en la Cámara

**El Reto:** Integrar un escáner en una SPA suele causar errores de `NotFoundError` o `NotAllowedError` al cambiar de rutas o re-renderizar componentes, ya que el navegador no libera la cámara lo suficientemente rápido.

**La Solución:**

- Se implementó una estrategia de **"Clean-up & Fallback"**.
- Uso de `Html5Qrcode.getCameras()` para obtener IDs físicos en lugar de confiar en `facingMode: "environment"`, asegurando que funcione en Androids antiguos y Laptops.
- Implementación de un `setTimeout` estratégico (200ms) al abrir el Drawer para permitir que la animación CSS termine antes de iniciar el proceso pesado de la cámara, evitando el "Jank" (tirones visuales).

### 2. Animaciones de Alto Rendimiento (Canvas vs DOM)

**El Reto:** Crear una animación de "escaneando" que no consuma CPU innecesaria mientras la cámara ya está procesando video.

**La Solución:**

- Se creó el componente `<FlowField />` utilizando **HTML5 Canvas API**.
- A diferencia de animar `divs` con CSS, el Canvas permite renderizar miles de partículas en un solo ciclo de pintado.
- La lógica de animación se desacopló de React (`useRef` para valores mutables) para evitar re-renders de React en cada frame de animación.

### 3. Estado Derivado vs useEffect

**El Reto:** Sincronizar errores de validación local con errores de la API.

**La Solución:**

- Se evitó el antipatrón de usar `useEffect` para copiar props a estado.
- Se optó por **Estado Derivado** (calculado en tiempo de render) y limpieza de estado basada en eventos (`onClick`) en lugar de `setTimeout`, garantizando una "Single Source of Truth".

### 4. React Query para Caché

**Decisión:** Se utilizó `retry: false` en las consultas de producto.

**Por qué:** En un contexto de escaneo en tiempo real, si un código no existe, el usuario necesita saberlo **inmediatamente**. Esperar a 3 reintentos automáticos degradaría la experiencia de usuario (UX) haciéndole creer que la app se congeló.

### 5. Manejo del Store

**Decisión:** Implementación de **Zustand** con middlewares (`persist` y `devtools`).

**Por qué:** Se priorizó el rendimiento y la simplicidad. Con un peso de apenas ~1kB, Zustand elimina la complejidad del boilerplate de Redux y evita los problemas de re-renderizado excesivo del Context API nativo. El middleware `persist` permitió implementar la persistencia del historial en `localStorage` de forma automática y transparente, sin necesidad de escribir lógica de sincronización manual.

### 6. Calidad de Código y Automatización (Husky)

**Decisión:** Implementación de **Husky** para la gestión de Git Hooks.

**Por qué:** Para garantizar la integridad del código fuente antes de que llegue al repositorio. Se configuraron hooks de `pre-commit` (para ejecutar linters y formateo) y `pre-push` (para verificar los tests). Esto adopta la filosofía de **"Shift-Left Testing"**, detectando errores en la máquina del desarrollador en lugar de esperar a que fallen en el pipeline de CI/CD, asegurando así un historial de commits limpio y estable.

### 7. Arquitectura Modular y Atomic Design

**Decisión:** Adopción de una estructura híbrida: **Atomic Design** para componentes de UI compartidos y **Feature-based Architecture** para la lógica de negocio.

**Por qué:**

- **Escalabilidad:** Al encapsular la lógica (stores, hooks, validaciones) dentro de carpetas de dominio (`features/product`), se evita el "spaghetti code" y se facilita la navegación. Si eliminas la funcionalidad de "Producto", sabes exactamente qué carpeta borrar.
- **Reutilización:** La organización en Átomos, Moléculas y Organismos en `shared/components` garantiza que los componentes visuales sean puros, testeables y reutilizables en cualquier parte de la aplicación, desacoplándolos de la lógica de negocio específica.

---

# Instalación y Despliegue

Este proyecto utiliza pnpm para una gestión eficiente de paquetes.

## Clonar el repositorio:

```bash
git clone <repositorio>
cd reto-tecnico
```

## Instalar dependencias:

```bash
pnpm install
```

## Correr en desarrollo:

Abre http://localhost:3000 en tu navegador.

```bash
pnpm dev
```

Ejecutar Tests:

```bash
pnpm vitest run
```

## Build para producción:

```bash
pnpm build
pnpm start
```

✅ Checklist de Requerimientos

[x] Consumo de API con React Query.

[x] State Management con Zustand.

[x] Escáner de código de barras funcional.

[x] Búsqueda manual de productos.

[x] Animaciones (Shadcn + Canvas).

[x] Manejo de errores y estados de carga.

[x] Bonus: Testing unitario con Vitest.
