'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Button } from '../button'
import { Input } from '../input'
import { XCircle, CircleCheck } from 'lucide-react'

export const ControlHeights: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Inconsistent Heights - Wrong */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Inconsistent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input placeholder="Username" className="h-9" autoComplete="off" />
            <Input type="password" placeholder="Password" className="h-9" autoComplete="off" />
            <Button className="h-10">Login</Button>
          </div>
        </CardContent>
      </Card>

      {/* Consistent Heights - Correct */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500" />
            Consistent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input placeholder="Username" className="h-9" autoComplete="off" />
            <Input type="password" placeholder="Password" className="h-9" autoComplete="off" />
            <Button className="h-9">Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 