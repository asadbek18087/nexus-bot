"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Planet {
  id: string;
  name: string;
  color: number;
  size: number;
  orbit: number;
  speed: number;
  icon: string;
  description: string;
}

interface SpatialUniverseProps {
  onNavigate: (view: string) => void;
}

export default function SpatialUniverse({ onNavigate }: SpatialUniverseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const frameRef = useRef<number>();
  const planetsRef = useRef<Planet[]>([]);
  const [hoveredPlanet, setHoveredPlanet] = useState<string>('');

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.02);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 40, 70); // Adjusted for better view
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffaa00, 3, 300);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Sun Mesh
    const sunGeometry = new THREE.SphereGeometry(6, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Sun Glow
    const sunGlowGeometry = new THREE.SphereGeometry(8, 64, 64);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);

    // Helper: Create Text Sprite
    const createTextSprite = (text: string, color: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 256;
      
      if (context) {
        context.font = 'bold 60px Arial';
        const textWidth = context.measureText(text).width;
        
        // Background
        context.fillStyle = 'rgba(0,0,0,0.6)';
        context.beginPath();
        context.roundRect(256 - textWidth/2 - 20, 128 - 40, textWidth + 40, 80, 20);
        context.fill();

        // Text
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 256, 128);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(12, 6, 1);
      return sprite;
    };

    // Planets Config
    const planets: Planet[] = [
      { id: 'games', name: 'GAMES', color: 0x00ff88, size: 3.5, orbit: 20, speed: 0.0002, icon: '🎮', description: 'Play & Earn' },
      { id: 'quiz', name: 'AI QUIZ', color: 0x00ffff, size: 3.2, orbit: 30, speed: 0.00015, icon: '🧠', description: 'Learn' },
      { id: 'battle', name: 'BATTLE', color: 0xff3366, size: 3.4, orbit: 40, speed: 0.00012, icon: '⚔️', description: 'PvP' },
      { id: 'social', name: 'SOCIAL', color: 0xaa00ff, size: 3.8, orbit: 50, speed: 0.0001, icon: '👥', description: 'Connect' },
      { id: 'profile', name: 'PROFILE', color: 0xffaa00, size: 3, orbit: 60, speed: 0.00008, icon: '👤', description: 'Stats' }
    ];

    planetsRef.current = planets;
    const planetGroups: THREE.Group[] = [];

    planets.forEach(data => {
      const group = new THREE.Group();
      
      // Planet Mesh
      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.1,
        shininess: 30
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Label
      const label = createTextSprite(data.name, '#ffffff');
      label.position.set(0, data.size + 2, 0);
      group.add(label);

      // Orbit Path
      const pathGeo = new THREE.RingGeometry(data.orbit - 0.1, data.orbit + 0.1, 128);
      const pathMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
      });
      const path = new THREE.Mesh(pathGeo, pathMat);
      path.rotation.x = Math.PI / 2;
      scene.add(path);

      group.userData = data;
      scene.add(group);
      planetGroups.push(group);
    });

    // Starfield
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = [];
    for(let i=0; i<3000; i++) {
      starsPos.push((Math.random()-0.5)*500, (Math.random()-0.5)*500, (Math.random()-0.5)*500);
    }
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsPos, 3));
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0xffffff, size: 0.3, transparent: true, opacity: 0.6}));
    scene.add(stars);

    // Interaction
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetGroups.map(g => g.children[0]));
      
      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const group = intersects[0].object.parent;
        if (group) {
          setHoveredPlanet(group.userData.name);
          group.scale.setScalar(1.3);
        }
      } else {
        document.body.style.cursor = 'default';
        setHoveredPlanet('');
        planetGroups.forEach(g => g.scale.setScalar(1));
      }
    };

    const onClick = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetGroups.map(g => g.children[0]));
      
      if (intersects.length > 0) {
        const group = intersects[0].object.parent;
        if (group) {
          const map: any = { 'games': 'game-2048', 'quiz': 'quiz', 'battle': 'battle', 'social': 'social', 'profile': 'profile' };
          const view = map[group.userData.id];
          if (view) {
            console.log('Navigating to:', view);
            onNavigate(view);
          }
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = Date.now();
      
      planetGroups.forEach((g, i) => {
        const d = planets[i];
        const angle = t * d.speed;
        g.position.x = Math.cos(angle) * d.orbit;
        g.position.z = Math.sin(angle) * d.orbit;
        g.children[0].rotation.y += 0.005;
      });

      sun.scale.setScalar(1 + Math.sin(t * 0.001) * 0.05);
      stars.rotation.y = t * 0.00002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const mount = mountRef.current;

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (mount && renderer.domElement) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onNavigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute top-8 left-0 right-0 text-center pointer-events-none z-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent mb-2">NEXUS SOLAR</h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase">Explore the Ecosystem</p>
      </div>
      {hoveredPlanet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur px-6 py-3 rounded-xl border border-white/10 text-center"
        >
          <div className="text-white font-bold text-lg">{hoveredPlanet}</div>
          <div className="text-cyan-400 text-xs">Click to Enter</div>
        </motion.div>
      )}
    </div>
  );
}
