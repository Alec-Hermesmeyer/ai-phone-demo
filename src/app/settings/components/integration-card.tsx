"use client"

import { type Control, useWatch, useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Input } from "../../../components/ui/input"

interface IntegrationCardProps {
  integration: {
    id: string
    name: string
    description: string
    providers: string[]
  }
  formControl: Control<any>
}

export function IntegrationCard({ integration, formControl }: IntegrationCardProps) {
  const enabled = useWatch({ control: formControl, name: `${integration.id}.enabled` })
  const { setValue } = useFormContext() || {} // Avoids destructuring undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {integration.name}
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => setValue && setValue(`${integration.id}.enabled`, checked)}
          />
        </CardTitle>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={useWatch({ control: formControl, name: `${integration.id}.provider` })}
              onValueChange={(value) => setValue && setValue(`${integration.id}.provider`, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {integration.providers.map((provider) => (
                  <SelectItem key={provider} value={provider.toLowerCase()}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder="Enter API key"
              value={useWatch({ control: formControl, name: `${integration.id}.apiKey` }) || ""}
              onChange={(e) => setValue && setValue(`${integration.id}.apiKey`, e.target.value)}
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
