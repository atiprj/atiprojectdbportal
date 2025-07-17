"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getGalleryImages, getConfigValue } from "@/utils/config-utils"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GalleryPage() {
  const [galleryTitle, setGalleryTitle] = useState<string>("")
  const [galleryDescription, setGalleryDescription] = useState<string>("")
  const [images, setImages] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<any>(null)

  useEffect(() => {
    setGalleryTitle(getConfigValue("gallery.title", "Galleria del Progetto"))
    setGalleryDescription(getConfigValue("gallery.description", ""))
    const allImages = getGalleryImages()
    setImages(allImages)
    if (allImages.length > 0) {
      const featured = allImages.find((img) => img.featured) || allImages[0]
      setSelectedImage(featured)
    }
  }, [])

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">{galleryTitle}</h1>
            <p className="text-muted-foreground">{galleryDescription}</p>
          </div>

          <Tabs defaultValue="grid" className="mb-8">
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="grid">Griglia</TabsTrigger>
                <TabsTrigger value="featured">In evidenza</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <Dialog key={image.id}>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={image.path || "/placeholder.svg"}
                            alt={image.alt || image.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-1">{image.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{image.description}</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{image.title}</DialogTitle>
                        <DialogDescription>{image.description}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <img
                          src={image.path || "/placeholder.svg"}
                          alt={image.alt || image.title}
                          className="w-full rounded-md"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured">
              {selectedImage && (
                <div className="max-w-4xl mx-auto">
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img
                      src={selectedImage.path || "/placeholder.svg"}
                      alt={selectedImage.alt || selectedImage.title}
                      className="w-full"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                  <p className="text-muted-foreground">{selectedImage.description}</p>

                  <div className="grid grid-cols-4 gap-4 mt-8">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className={`aspect-video rounded-md overflow-hidden cursor-pointer ${
                          selectedImage.id === image.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image.path || "/placeholder.svg"}
                          alt={image.alt || image.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
