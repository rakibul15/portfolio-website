'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'
import type { Points as PointsType } from 'three'

interface StarsProps {
  color: string
  speed?: number
  [key: string]: unknown
}

function Stars({ color, speed = 1, ...props }: StarsProps) {
  const ref = useRef<PointsType>(null)
  const sphere = random.inSphere(new Float32Array(3000), { radius: 1.5 }) as Float32Array

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= (delta / 10) * speed
      ref.current.rotation.y -= (delta / 15) * speed
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={color}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

interface FloatingParticlesProps {
  color: string
  count?: number
  [key: string]: unknown
}

function FloatingParticles({ color, count = 100, ...props }: FloatingParticlesProps) {
  const ref = useRef<PointsType>(null)
  const particles = random.inSphere(new Float32Array(count * 3), { radius: 2 }) as Float32Array

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 4) * 0.2
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 3) * 0.2
    }
  })

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false} {...props}>
      <PointMaterial
        transparent
        color={color}
        size={0.005}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

export function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-linear-to-b from-white via-violet-50/30 to-white dark:from-slate-900 dark:via-violet-950/20 dark:to-slate-900">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars color="#8b5cf6" speed={1} />
        <Stars color="#6366f1" speed={0.7} />
        <FloatingParticles color="#a855f7" count={50} />
        <FloatingParticles color="#3b82f6" count={30} />
      </Canvas>
    </div>
  )
}
