'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Button } from '../button'
import { Input } from '../input'
import { XCircle, CircleCheck } from 'lucide-react'

export const ShadowsAndLight: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Inconsistent Shadows - Wrong */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Inconsistent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Username" 
              className="h-9" 
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              autoComplete="off"
            />
            <Input 
              type="password" 
              placeholder="Password" 
              className="h-9" 
              style={{ boxShadow: '2px 0 3px rgba(0,0,0,0.1)' }}
              autoComplete="off"
            />
            <Button 
              className="h-9" 
              style={{ boxShadow: '-1px 2px 3px rgba(0,0,0,0.1)' }}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consistent Shadows - Correct */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500" />
            Consistent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input placeholder="Username" className="h-9 shadow-xs" autoComplete="off" />
            <Input type="password" placeholder="Password" className="h-9 shadow-xs" autoComplete="off" />
            <Button className="h-9 shadow-xs">Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 