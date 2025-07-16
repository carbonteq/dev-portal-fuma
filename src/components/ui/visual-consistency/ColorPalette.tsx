'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Button } from '../button'
import { Input } from '../input'
import { XCircle, CircleCheck } from 'lucide-react'

export const ColorPalette: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Inconsistent Colors - Wrong */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            Inconsistent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Username" 
              className="h-9" 
              style={{ color: '#1f2937' }} 
              autoComplete="off"
            />
            <Input 
              type="password" 
              placeholder="Password" 
              className="h-9" 
              style={{ color: '#374151' }} 
              autoComplete="off"
            />
            <Button 
              className="h-9 bg-[#3b82f6] hover:bg-[#2563eb]"
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consistent Colors - Correct */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-400" />
            Consistent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input placeholder="Username" className="h-9 text-foreground" autoComplete="off" />
            <Input type="password" placeholder="Password" className="h-9 text-foreground" autoComplete="off" />
            <Button className="h-9">Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 