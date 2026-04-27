import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import './BuildingMarker.css';

// Animated beacon beam under each marker
function BeaconBeam({ color, active }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = active
        ? 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3
        : 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const col = new THREE.Color(color);
  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      {/* Reduced beam height from 3 → 1 */}
      <cylinderGeometry args={[0.02, 0.15, 1, 8, 1, true]} />
      <meshBasicMaterial color={col} transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function BuildingMarker({ building, isSelected, isHovered, onHover, onSelect }) {
  const [localHover, setLocalHover] = useState(false);
  const groupRef = useRef();
  const active = isSelected || isHovered || localHover;

  const [px, py, pz] = building.position;
  const markerY = py + 0.5; // reduced from 1.5 → 0.5 to float just above building

  useFrame((state) => {
    if (groupRef.current) {
      const targetY = markerY + (active ? 0.2 : 0); // reduced bounce from 0.3 → 0.2
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.05
      );
    }
  });

  return (
    <group position={[px, 0, pz]}>
      {/* Beacon beam — sits at half of markerY */}
      <group position={[0, markerY / 2, 0]}>
        <BeaconBeam color={building.color} active={active} />
      </group>

      {/* Floating marker group */}
      <group ref={groupRef} position={[0, markerY, 0]}>
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <Html
            center
            distanceFactor={8}
            occlude={false}
            style={{ pointerEvents: 'auto' }}
          >
            <div
              className={`building-marker ${active ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
              style={{ '--marker-color': building.color }}
              onMouseEnter={() => { setLocalHover(true); onHover(building); }}
              onMouseLeave={() => { setLocalHover(false); onHover(null); }}
              onClick={() => onSelect(building)}
            >
              {/* Pulse rings */}
              {isSelected && (
                <>
                  <div className="pulse-ring" style={{ animationDelay: '0s' }} />
                  <div className="pulse-ring" style={{ animationDelay: '0.5s' }} />
                </>
              )}

              {/* Sign body */}
              <div className="marker-sign">
                <div className="marker-code">{building.shortName}</div>
                <div className="marker-name">{building.name}</div>
                <div className="marker-category">{building.category}</div>
                {active && (
                  <div className="marker-cta">
                    <span>View NFTs →</span>
                  </div>
                )}
              </div>
              <div className="marker-pole" />
            </div>
          </Html>
        </Billboard>
      </group>
    </group>
  );
}