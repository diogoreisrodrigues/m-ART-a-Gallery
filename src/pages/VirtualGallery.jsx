import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  useTexture, 
  Html, 
  Sparkles, 
  SpotLight, 
  useHelper 
} from "@react-three/drei";
import * as THREE from "three";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../css/VirtualGallery.module.css";
import LoadingScreen from "../components/LoadingScreen";
import PaintingPopup from "../components/PaintingPopup";
import ScrollToTop from "../components/ScrollToTop";
import PaintingsData from "../data/PaintingsData";

function VirtualGallery() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    // Fetch paintings from our serverless function - reusing the same endpoint as Portfolio
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/.netlify/functions/get-paintings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch paintings');
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          setPaintings(data);
        } else {
          // If no paintings from API, use local data
          console.log('No paintings from API, using local data');
          setUsingFallback(true);
          setPaintings(PaintingsData || []);
        }
      } catch (err) {
        console.error('Error fetching paintings:', err);
        setUsingFallback(true);
        // Use local data as fallback
        setPaintings(PaintingsData || []);
      } finally {
        // Add a slight delay to make the loading screen visible even on fast connections
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchPaintings();
    
    // Scroll handler for ScrollToTop component
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScroll]);

  const handlePaintingClick = (painting) => {
    setSelectedPainting(painting);
  };

  const handleClosePopup = () => {
    setSelectedPainting(null);
  };

  const handleInterest = (painting) => {
    const subject = `Interest in your artwork: ${painting.title}`;
    const body = `Hi Marta,\n\nI'm interested in your artwork titled "${painting.title}".\n\nCould you please provide more information about it?\n\nThank you!`;
    
    window.location.href = `mailto:${encodeURIComponent("martavieira142004@gmail.com")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.galleryContainer}>
        <h1 className={styles.galleryTitle}>Virtual Gallery Tour</h1>
        <p className={styles.galleryInstructions}>
          Use your mouse to navigate the gallery. Click and drag to look around, scroll to zoom in/out.
          Click on any painting to view details.
        </p>
        
        {usingFallback && (
          <div className={styles.fallbackMessage}>
            Using sample gallery data - API connection not available
          </div>
        )}
        
        <div className={styles.canvasContainer}>
          <Canvas 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%' 
            }}
            camera={{ position: [0, 1.5, 5], fov: 75 }}
            gl={{ 
              antialias: true,
              alpha: false,
              powerPreference: "high-performance"
            }}
            shadows
          >
            <fog attach="fog" args={['#efeae1', 8, 25]} />
            <color attach="background" args={['#efeae1']} />
            
            <Suspense fallback={<Html center><div className={styles.loading}>Loading 3D Gallery...</div></Html>}>
              <ambientLight intensity={0.3} />
              <GalleryRoom paintings={paintings} usingFallback={usingFallback} onPaintingClick={handlePaintingClick} />
              <Environment preset="apartment" />
              <OrbitControls 
                enableZoom={true} 
                enablePan={true} 
                enableRotate={true} 
                minDistance={1}
                maxDistance={10}
                target={[0, 1, 0]}
                maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below floor
              />
              
              {/* Subtle particle effects */}
              <Sparkles 
                count={50} 
                scale={10} 
                size={0.5} 
                speed={0.2} 
                opacity={0.2}
                color="#ebaaaf"
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
      
      {selectedPainting && (
        <PaintingPopup 
          painting={{
            ...selectedPainting,
            imageSource: usingFallback 
              ? require(`../assets/images/${selectedPainting.path}`) 
              : selectedPainting.image_url
          }}
          onClose={handleClosePopup}
          onInterest={handleInterest}
        />
      )}
      
      <Footer />
      {showScroll && <ScrollToTop />}
    </div>
  );
}

// Gallery Room Component
// In the GalleryRoom component, let's modify how we handle spotlights

function GalleryRoom({ paintings, usingFallback, onPaintingClick }) {
  const { viewport } = useThree();
  
  // Calculate positions for paintings around a circular gallery
  const paintingsWithPositions = paintings.map((painting, index) => {
    const totalPaintings = paintings.length;
    const angle = (index / totalPaintings) * Math.PI * 2;
    const radius = 4;
    
    return {
      ...painting,
      position: [
        Math.sin(angle) * radius,
        1.5, // Height on wall
        Math.cos(angle) * radius
      ],
      rotation: [0, -angle, 0], // Face inward
      // Pre-calculate spotlight positions instead of trying to use getWorldPosition
      spotlightPosition: [
        Math.sin(angle) * (radius - 0.5),
        2.5,
        Math.cos(angle) * (radius - 0.5)
      ]
    };
  });

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Circular Wall */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[5, 5, 3, 32, 1, true]} />
        <meshStandardMaterial color="#efeae1" side={THREE.BackSide} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Central decorative element */}
      <group position={[0, 0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.7, 0.2, 32]} />
          <meshStandardMaterial color="#556477" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.5, 0.2, 32]} />
          <meshStandardMaterial color="#ebaaaf" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>
      
      {/* Central spotlight - simplified */}
      <pointLight position={[0, 2.8, 0]} intensity={0.5} color="#ffffff" castShadow />
      
      {/* Paintings with individual lights */}
      {paintingsWithPositions.map((painting, index) => (
        <React.Fragment key={painting.id || index}>
          <Painting 
            painting={painting}
            usingFallback={usingFallback}
            onClick={() => onPaintingClick(painting)}
          />
          
          {/* Use pointLight instead of SpotLight to avoid targeting issues */}
          <pointLight
            position={painting.spotlightPosition}
            intensity={0.8}
            color="#fff6e6"
            distance={5}
            decay={2}
            castShadow
          />
        </React.Fragment>
      ))}
    </>
  );
}

// Individual Painting Component
function Painting({ painting, usingFallback, onClick }) {
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);
  
  // Get the correct texture URL
  const textureUrl = React.useMemo(() => {
    try {
      return usingFallback 
        ? require(`../assets/images/${painting.path}`)
        : painting.image_url;
    } catch (err) {
      console.error(`Failed to load texture for ${painting.title}:`, err);
      return null;
    }
  }, [painting, usingFallback]);
  
  // Use the simpler form of useTexture
  const texture = useTexture(textureUrl);
  
  // Configure texture after loading
  useEffect(() => {
    if (texture) {
      texture.flipY = false;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.needsUpdate = true;
      setTextureLoaded(true);
    }
    
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture]);
  
  // Calculate aspect ratio for the painting
  const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
  const width = 1.5;
  const height = width / aspectRatio;
  
  // Subtle animation on hover with smoother lerp
  useFrame((state) => {
    if (frameRef.current) {
      if (hovered) {
        frameRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.05);
        // Add subtle floating animation when hovered
        frameRef.current.position.y = painting.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      } else {
        frameRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
        frameRef.current.position.y = painting.position[1];
      }
    }
  });

  return (
    <group 
      position={painting.position} 
      rotation={painting.rotation}
      ref={frameRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Painting Frame with more detailed geometry */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.1]} />
        <meshStandardMaterial 
          color={hovered ? "#ebaaaf" : "#556477"} 
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      
      {/* Frame decorative corners */}
      {[
        [width/2 + 0.03, height/2 + 0.03, 0],
        [-width/2 - 0.03, height/2 + 0.03, 0],
        [width/2 + 0.03, -height/2 - 0.03, 0],
        [-width/2 - 0.03, -height/2 - 0.03, 0]
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.12]} />
          <meshStandardMaterial 
            color={hovered ? "#556477" : "#ebaaaf"} 
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      ))}
      
      {/* Painting Canvas - moved forward to prevent Z-fighting */}
      <mesh position={[0, 0, 0.01]} castShadow>
        <planeGeometry args={[width, height]} />
        {textureLoaded ? (
          <meshStandardMaterial 
            map={texture} 
            toneMapped={false}
            side={THREE.FrontSide}
            depthWrite={true}
            polygonOffset={true}
            polygonOffsetFactor={-1}
          />
        ) : (
          <meshStandardMaterial 
            color="#cccccc"
            depthWrite={true}
            polygonOffset={true}
            polygonOffsetFactor={-1}
          />
        )}
      </mesh>
      
      {/* Title label - only show when hovered */}
      {hovered && (
        <Html position={[0, -height/2 - 0.2, 0]} center>
          <div className={styles.paintingLabel}>
            {painting.title}
          </div>
        </Html>
      )}
    </group>
  );
}

export default VirtualGallery;