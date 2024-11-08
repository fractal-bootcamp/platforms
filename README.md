# 3D Platform Connection Visualization

A React-based 3D visualization tool for modeling and connecting elevated platforms with configurable pipe routing.

## 🌟 Features

### Platform Management
- Dynamic 3D platform positioning
- Configurable platform dimensions and spacing
- Interactive hover states and material properties
- Responsive layout adaptation

### Selection System
- Grid-based point selection
- Customizable grid subdivisions
- Visual selection cage with offset controls
- Point management with Zustand state

### Pipe Routing
- Automatic pipe path generation
- Multiple routing strategies
- Collision detection and avoidance
- Debug visualization tools

### Camera Controls
- Axonometric/Perspective view switching
- Orbit controls with angle constraints
- Pan and zoom functionality
- Camera distance adjustment

## 🛠 Tech Stack

- **React** - UI framework
- **Three.js** - 3D rendering engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **Zustand** - State management
- **Leva** - Debug controls and tweaking
- **TypeScript** - Type safety and developer experience

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/platform-visualization.git
```
2. Install Dependices
```bash
npm install
```
3. Start the development server:
``` bash
npm run dev
```
## 🎮 Controls

### Platform Controls
- **Dimensions**: Adjust width, depth, and height
- **Spacing**: Configure horizontal and vertical offsets
- **Colors**: Customize individual platform colors

### Selection Tools
- **Grid Toggle**: Show/hide selection grids
- **Subdivisions**: Adjust grid density
- **Offset**: Control grid boundary offset
- **Point Management**: Add/remove connection points

### View Controls
- **Camera**: Toggle between axonometric and perspective views
- **Pan**: Adjust scene position
- **Orbit**: Rotate around scene (perspective mode only)

## 🏗 Project Structure
src/
├── components/ # React components
│ ├── Platform.tsx # Individual platform
│ ├── Platforms.tsx # Platform container
│ ├── SelectionCage.tsx # Grid selection system
│ └── Controls.tsx # Leva controls setup
├── store/ # State management
│ └── pipeStore.ts # Zustand store
├── types/ # TypeScript definitions
├── utils/ # Helper functions
└── styles/ # CSS styles
## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Three.js community
- React Three Fiber team
- Zustand contributors