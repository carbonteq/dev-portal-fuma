'use client'

import React from 'react'
import CustomCard from '../CustomCard'

export const Layers: React.FC = () => {
  return (
    <div className="my-12">
      <div className="space-y-4 max-w-3xl mx-auto">
        <div 
          className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
          onClick={() => document.getElementById('layer-6-styled-components')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <CustomCard style={{ 
            background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)', 
            borderLeft: '6px solid #8b5cf6',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-purple-800 tracking-tight">Layer 6: Styled Components</div>
                <div className="text-purple-600 mt-2 font-medium">React components with full integration</div>
              </div>
              <div className="text-3xl opacity-60 transition-all duration-300 hover:opacity-100 hover:scale-110">⚛️</div>
            </div>
          </CustomCard>
        </div>
        
        <div className="flex justify-center">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-300 to-pink-300 rounded-full transition-all duration-300 hover:w-2"></div>
        </div>
        
        <div 
          className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
          onClick={() => document.getElementById('layer-5-variants')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <CustomCard style={{ 
            background: 'linear-gradient(135deg, #fff0f5 0%, #fce7f3 100%)', 
            borderLeft: '6px solid #ec4899',
            boxShadow: '0 4px 20px rgba(236, 72, 153, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-pink-800 tracking-tight">Layer 5: Variants</div>
                <div className="text-pink-600 mt-2 font-medium">Dynamic component APIs with state management</div>
              </div>
              <div className="text-3xl opacity-60 transition-all duration-300 hover:opacity-100 hover:scale-110">🎛️</div>
            </div>
          </CustomCard>
        </div>
        
        <div className="flex justify-center">
          <div className="w-1 h-6 bg-gradient-to-b from-pink-300 to-green-300 rounded-full transition-all duration-300 hover:w-2"></div>
        </div>
        
        <div 
          className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
          onClick={() => document.getElementById('layer-4-recipes')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <CustomCard style={{ 
            background: 'linear-gradient(135deg, #f0fff0 0%, #dcfce7 100%)', 
            borderLeft: '6px solid #22c55e',
            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-green-800 tracking-tight">Layer 4: Recipes</div>
                <div className="text-green-600 mt-2 font-medium">Reusable style compositions and patterns</div>
              </div>
              <div className="text-3xl opacity-60 transition-all duration-300 hover:opacity-100 hover:scale-110">📜</div>
            </div>
          </CustomCard>
        </div>
        
        <div className="flex justify-center">
          <div className="w-1 h-6 bg-gradient-to-b from-green-300 to-orange-300 rounded-full transition-all duration-300 hover:w-2"></div>
        </div>
        
        <div 
          className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
          onClick={() => document.getElementById('layer-3-atomic-utilities')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <CustomCard style={{ 
            background: 'linear-gradient(135deg, #fff2e8 0%, #fed7aa 100%)', 
            borderLeft: '6px solid #f97316',
            boxShadow: '0 4px 20px rgba(249, 115, 22, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-orange-800 tracking-tight">Layer 3: Atomic Utilities</div>
                <div className="text-orange-600 mt-2 font-medium">Single-purpose styling primitives</div>
              </div>
              <div className="text-3xl opacity-60 transition-all duration-300 hover:opacity-100 hover:scale-110">🔧</div>
            </div>
          </CustomCard>
        </div>
        
        <div className="flex justify-center">
          <div className="w-1 h-6 bg-gradient-to-b from-orange-300 to-blue-300 rounded-full transition-all duration-300 hover:w-2"></div>
        </div>
        
        <div 
          className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
          onClick={() => document.getElementById('layer-2-design-tokens')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <CustomCard style={{ 
            background: 'linear-gradient(135deg, #e8f4fd 0%, #dbeafe 100%)', 
            borderLeft: '6px solid #3b82f6',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-blue-800 tracking-tight">Layer 2: Design Tokens</div>
                <div className="text-blue-600 mt-2 font-medium">Colors, spacing, typography, sizes</div>
              </div>
              <div className="text-3xl opacity-60 transition-all duration-300 hover:opacity-100 hover:scale-110">🎨</div>
            </div>
          </CustomCard>
        </div>
        
        <div className="flex justify-center">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-300 to-gray-400 rounded-full transition-all duration-300 hover:w-2"></div>
        </div>
        
        <div 
          className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
          onClick={() => document.getElementById('layer-1-literal-foundation')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <CustomCard style={{ 
            background: 'linear-gradient(135deg, #f9f9f9 0%, #f3f4f6 100%)', 
            borderLeft: '6px solid #6b7280',
            boxShadow: '0 4px 20px rgba(107, 114, 128, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-800 tracking-tight">Layer 1: Literal Foundation</div>
                <div className="text-gray-600 mt-2 font-medium">Natural CSS syntax in TypeScript</div>
              </div>
              <div className="text-3xl opacity-60 transition-all duration-300 hover:opacity-100 hover:scale-110">⚡</div>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  )
}
