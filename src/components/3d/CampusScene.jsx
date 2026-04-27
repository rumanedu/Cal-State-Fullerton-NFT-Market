import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store';
import { CAMPUS_BUILDINGS } from '../../data/buildings';
import BuildingMarker from './BuildingMarker';
import './CampusScene.css';

function CampusModel() {
  const { scene } = useGLTF('/Csuf.glb');
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 10 / maxDim;
      modelRef.current.scale.setScalar(scale);
      modelRef.current.position.sub(center.multiplyScalar(scale));
    }
  }, [scene]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) child.material.envMapIntensity = 0.6;
      }
    });
  }, [scene]);

  return <primitive ref={modelRef} object={scene} />;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
    </mesh>
  );
}

function PlaceholderCampus() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
      </mesh>
      {CAMPUS_BUILDINGS.map((b) => (
        <mesh key={b.id} position={[b.position[0], b.position[1] / 2, b.position[2]]} castShadow>
          <boxGeometry args={[1.2, 1, 1.2]} />
          <meshStandardMaterial color={b.color} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function SelectionRing({ position }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });
  return (
    <mesh ref={meshRef} position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.8, 1.0, 64]} />
      <meshBasicMaterial color="#FF7900" transparent opacity={0.7} />
    </mesh>
  );
}

function GroundGrid() {
  return <gridHelper args={[30, 30, '#FF790010', '#FF790008']} position={[0, -1.45, 0]} />;
}

function Particles() {
  const count = 60;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 8 + 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#FF7900" transparent opacity={0.3} />
    </points>
  );
}

// Invisible ground plane that reports click positions
function PositionPicker({ onPick }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}
      onClick={(e) => { e.stopPropagation(); onPick(e.point); }}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}


export default function CampusScene({ editMode, editSelectedId, buildings, onGroundPick, onBuildingEditSelect, onBuildingSelect }) {
  const { selectedBuilding, hoveredBuilding, setHoveredBuilding, setSelectedBuilding } = useStore();
  const [modelError] = useState(false);

  // Use passed-in buildings when in edit mode, otherwise use store
  const displayBuildings = editMode ? buildings : CAMPUS_BUILDINGS;

  return (
    <div className="campus-scene-container">
      <Canvas
        shadows
        camera={{ position: [8, 7, 8], fov: 55, near: 0.01, far: 1000 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <Sky distance={450000} sunPosition={[1, 0.3, 0]} inclination={0.49} azimuth={0.25} turbidity={8} rayleigh={1.5} />

        <ambientLight intensity={0.8} color="#ffffff" />
        <directionalLight position={[10, 20, 10]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} color="#fff8e6" />
        <directionalLight position={[-10, 8, -10]} intensity={0.5} color="#c8d8ff" />
        <pointLight position={[0, 8, 0]} intensity={0.3} color="#FF7900" distance={30} />

        <Environment preset="park" />

        <Ground />
        <GroundGrid />

        {editMode && <PositionPicker onPick={onGroundPick} />}

        <Suspense fallback={<PlaceholderCampus />}>
          {!modelError ? <CampusModel /> : <PlaceholderCampus />}
        </Suspense>

        <Particles />

        {displayBuildings.map((building) => (
          <BuildingMarker
            key={building.id}
            building={building}
            isSelected={editMode ? building.id === editSelectedId : selectedBuilding?.id === building.id}
            isHovered={hoveredBuilding?.id === building.id}
            onHover={(b) => setHoveredBuilding(b)}
            onSelect={(b) => {
              if (editMode) onBuildingEditSelect(b.id);
              else setSelectedBuilding(selectedBuilding?.id === b.id ? null : b);
            }}
          />
        ))}

        {selectedBuilding && !editMode && <SelectionRing position={selectedBuilding.position} />}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          enablePan={true}
          panSpeed={1.5}
          minDistance={0.5}
          maxDistance={100}
        />
      </Canvas>
    </div>
  );
}