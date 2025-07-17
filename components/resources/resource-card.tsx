import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ResourceCardProps {
  title: string
  description: string
  count: number
  countLabel?: string
  href: string
  buttonText: string
  icon?: React.ReactNode
}

export function ResourceCard({
  title,
  description,
  count,
  countLabel = "disponibili",
  href,
  buttonText,
  icon,
}: ResourceCardProps) {
  const countText = `${count} ${countLabel}`

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none">
        <div className="flex items-center gap-2">
          {icon && <div className="flex-none">{icon}</div>}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{countText}</p>
      </CardContent>
      <CardFooter className="flex-none pt-6">
        <Button asChild className="w-full">
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
