import { Canvas, useFrame } from "@react-three/fiber";
import { forwardRef, useRef, useEffect, useState } from "react";
import type { Group } from "three";

function Dumbbell({ scrollY }: { scrollY: { current: number } }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = scrollY.current * 0.004;
    group.current.rotation.x += (target - group.current.rotation.x) * Math.min(1, delta * 4);
    group.current.rotation.y += delta * 0.4;
    // gentle float
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
  });

  return (
    <group ref={group} rotation={[0.3, 0.5, 0]}>
      {/* Bar */}
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.18, 2.2, 32]} />
        <meshStandardMaterial color="#cfd3d8" metalness={0.95} roughness={0.18} />
      </mesh>
      {/* Knurling rings */}
      {[-0.4, 0.4].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshStandardMaterial color="#8a8f96" metalness={0.9} roughness={0.5} />
        </mesh>
      ))}
      {/* Plates */}
      {[1.15, -1.15].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.45, 48]} />
            <meshStandardMaterial color="hsl(80, 92%, 56%)" metalness={0.55} roughness={0.25} emissive="hsl(80, 92%, 35%)" emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const DumbbellScene = forwardRef<HTMLDivElement>((_props, ref) => {
  const scrollY = useRef(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setEnabled(false);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        scrollY.current = window.scrollY;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return <div ref={ref} />;

  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        camera={{ position: [0, 0, 6], fov: 35 }}
        frameloop="always"
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} color="#cfff5b" />
        <directionalLight position={[-5, -3, -2]} intensity={0.5} color="#ff6b3d" />
        <pointLight position={[0, 0, 4]} intensity={0.6} color="#ffffff" />
        <Dumbbell scrollY={scrollY} />
      </Canvas>
    </div>
  );
});
DumbbellScene.displayName = "DumbbellScene";

export default DumbbellScene;