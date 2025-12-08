# Desktop POS Application

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Electron](https://img.shields.io/badge/Electron-Latest-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Vite](https://img.shields.io/badge/Vite-Latest-646cff)
![Status](https://img.shields.io/badge/Status-Active-success)

A professional, offline-capable Desktop Point of Sale (POS) application built with modern web technologies. Designed for reliability, speed, and ease of use, this application provides a robust solution for managing sales and products without requiring an active internet connection.

## 🚀 Features

### Core Functionality
- **Offline-First Architecture**: Fully functional without an internet connection. Data persists locally using LowDB.
- **Product Management**: 
  - Add, update, and remove products.
  - Manage inventory with real-time updates.
  - Image support for visual product identification.
- **Point of Sale Interface**:
  - Fast product search and filtering.
  - Interactive cart management (add, remove, adjust quantities).
  - Real-time total calculation.
  - Seamless checkout process.

### UI/UX Design
- **Premium Aesthetic**: Modern dark theme with carefully selected blue accents.
- **Responsive Layout**: Fluid grid systems that adapt to different window sizes.
- **Micro-interactions**: Smooth transitions and hover effects for a polished feel.

## 🛠️ Technology Stack

- **[Electron](https://www.electronjs.org/)**: For cross-platform desktop application encapsulation.
- **[React](https://react.dev/)**: For building a dynamic and responsive user interface.
- **[Vite](https://vitejs.dev/)**: For lightning-fast development and building.
- **[LowDB](https://github.com/typicode/lowdb)**: For lightweight, local JSON-based database management.
- **Vanilla CSS**: For high-performance, custom styling without framework overhead.

## 📂 Project Structure

```bash
mobile-pos/
├── electron/          # Main process & database logic
│   ├── main.js        # App entry point
│   ├── preload.js     # Secure IPC bridge
│   └── db.js          # LowDB setup
├── src/               # Renderer process (React App)
│   ├── components/    # Reusable UI components
│   ├── pages/         # Application views (POS, Products)
│   └── index.css      # Global styles & tokens
└── package.json       # Dependencies & scripts
```

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mobile-pos.git
   cd mobile-pos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running Locally

To start the application in development mode with hot-reloading:

```bash
npm run dev
```

This will launch the Electron window and start the Vite dev server.

### Building for Production

To create a distributable executable for your operating system:

```bash
npm run electron:build
```

The output files will be generated in the `dist` directory.

## 🤝 Contributing

Contributions are welcome! This project is open source, and we encourage you to fork, modify, and improve it.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

**You are free to:**
- **Use** this software commercially.
- **Modify** the source code.
- **Distribute** compiled versions.
- **Sublicense** and **Sell** copies of the software.

This project is explicitly designed to be a foundation for anyone to build upon and monetize.

---

*Note: This project serves as a comprehensive template for building offline-first Electron applications with React.*
