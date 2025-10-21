"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  title?: string
  inputMode?: boolean
  onClick?: () => void
}

export function GeneralModal({ isOpen, onClose, children, title, inputMode=true, onClick }: ModalProps) {
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    onClose()
    setIsLoading(true)
    interface Project {
      projectId:string
      success:boolean
      message:string
    
    }
try{
  const response = await axios.post<Project>("/api/v1/infra/project/create", { name: projectName, description:description })
  if(response.data.success){
    setIsLoading(false)
    toast({
      title: "Success",
      description: response.data.message,
      variant: "default",
     })
    onClose()
  }else{
    setIsLoading(false)
    toast({
      title: "Error",
      description: response.data.message,
      variant: "destructive",
    })
  }

}
catch(e){
  setIsLoading(false)
  toast({
    title: "Error",
    description: "Something went wrong",
    variant: "destructive",
  })

}
   
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-full max-w-md p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        {children}
{inputMode && (
  <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description (optional)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">{isLoading ? "Creating..." : "Create Project"}</Button>
          </div>
        </form>
)}      </Card>
    </div>
  )
}
