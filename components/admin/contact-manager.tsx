"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  CheckCircle,
  XCircle,
  Trash2,
  Reply,
  Instagram,
  Facebook,
  Save,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ContactManagerProps {
  storeId: string
  subdomain: string
  storeName: string
}

interface Message {
  id: string
  nombre: string
  email: string
  asunto: string
  mensaje: string
  leido: boolean
  respondido: boolean
  created_at: string
}

interface ContactInfo {
  email: string
  telefono: string
  whatsapp: string
  direccion: string
  ciudad: string
  horarios: string
  instagram: string
  facebook: string
  mostrar_formulario: boolean
  mostrar_mapa: boolean
}

export function ContactManager({ storeId, subdomain, storeName }: ContactManagerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    telefono: "",
    whatsapp: "",
    direccion: "",
    ciudad: "",
    horarios: "Lunes a Viernes 9:00 - 18:00",
    instagram: "",
    facebook: "",
    mostrar_formulario: true,
    mostrar_mapa: false
  })

  useEffect(() => {
    loadMessages()
    loadContactInfo()
  }, [])

  async function loadMessages() {
    try {
      const response = await fetch(`/api/admin/contact/messages?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Error loading messages:", error)
      // Mensajes de ejemplo
      setMessages([
        {
          id: "1",
          nombre: "Maria Garcia",
          email: "maria@ejemplo.com",
          asunto: "Consulta sobre envios",
          mensaje: "Hola! Queria saber si hacen envios a Cordoba capital y cuanto demora aproximadamente. Gracias!",
          leido: false,
          respondido: false,
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          nombre: "Juan Perez",
          email: "juan@ejemplo.com",
          asunto: "Problema con mi pedido",
          mensaje: "Buenas tardes, hice un pedido hace 3 dias y todavia no me llego el numero de seguimiento. Pueden ayudarme?",
          leido: true,
          respondido: false,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "3",
          nombre: "Laura Martinez",
          email: "laura@ejemplo.com",
          asunto: "Mayorista",
          mensaje: "Hola! Me gustaria saber si tienen precios mayoristas para reventa. Tengo un local en Buenos Aires.",
          leido: true,
          respondido: true,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  async function loadContactInfo() {
    try {
      const response = await fetch(`/api/admin/contact/info?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.info) {
          setContactInfo(data.info)
        }
      }
    } catch (error) {
      console.error("Error loading contact info:", error)
    }
  }

  async function saveContactInfo() {
    setSaving(true)
    try {
      await fetch(`/api/admin/contact/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, ...contactInfo })
      })
      alert("Informacion guardada!")
    } catch (error) {
      console.error("Error saving contact info:", error)
      alert("Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  async function markAsRead(messageId: string) {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, leido: true } : m
    ))
  }

  async function deleteMessage(messageId: string) {
    if (!confirm("Eliminar este mensaje?")) return
    setMessages(messages.filter(m => m.id !== messageId))
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null)
    }
  }

  async function sendReply() {
    if (!selectedMessage || !replyText.trim()) return
    setSending(true)
    try {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessages(messages.map(m => 
        m.id === selectedMessage.id ? { ...m, respondido: true } : m
      ))
      setReplyText("")
      alert("Respuesta enviada!")
    } catch (error) {
      alert("Error al enviar")
    } finally {
      setSending(false)
    }
  }

  const unreadCount = messages.filter(m => !m.leido).length
  const pendingCount = messages.filter(m => !m.respondido).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contacto</h2>
          <p className="text-muted-foreground">Gestiona los mensajes y la informacion de contacto de tu tienda</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} sin leer</Badge>
          )}
          {pendingCount > 0 && (
            <Badge variant="outline">{pendingCount} sin responder</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="mensajes">
        <TabsList>
          <TabsTrigger value="mensajes" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Mensajes
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="configuracion" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Configuracion
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Vista Previa
          </TabsTrigger>
        </TabsList>

        {/* Tab Mensajes */}
        <TabsContent value="mensajes" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Lista de mensajes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bandeja de entrada</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">Cargando...</div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No hay mensajes todavia</p>
                  </div>
                ) : (
                  <div className="divide-y max-h-[500px] overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => {
                          setSelectedMessage(message)
                          markAsRead(message.id)
                        }}
                        className={cn(
                          "p-4 cursor-pointer hover:bg-slate-50 transition-colors",
                          selectedMessage?.id === message.id && "bg-slate-100",
                          !message.leido && "bg-blue-50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn("font-medium", !message.leido && "font-bold")}>
                                {message.nombre}
                              </span>
                              {!message.leido && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                              {message.respondido && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-slate-700 truncate">{message.asunto}</p>
                            <p className="text-sm text-muted-foreground truncate">{message.mensaje}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(message.created_at).toLocaleDateString("es-AR")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteMessage(message.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detalle del mensaje */}
            <Card>
              <CardContent className="p-4">
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{selectedMessage.asunto}</h3>
                        {selectedMessage.respondido ? (
                          <Badge className="bg-green-100 text-green-700">Respondido</Badge>
                        ) : (
                          <Badge variant="outline">Pendiente</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        De: {selectedMessage.nombre} ({selectedMessage.email})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedMessage.created_at).toLocaleString("es-AR")}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedMessage.mensaje}</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Responder</Label>
                      <Textarea
                        placeholder="Escribe tu respuesta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                      />
                      <Button 
                        onClick={sendReply} 
                        disabled={sending || !replyText.trim()}
                        className="w-full"
                      >
                        {sending ? (
                          "Enviando..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar respuesta a {selectedMessage.email}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Reply className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>Selecciona un mensaje para ver los detalles</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Configuracion */}
        <TabsContent value="configuracion" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Informacion de Contacto
                </CardTitle>
                <CardDescription>
                  Esta informacion se mostrara en tu pagina de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="contacto@tutienda.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefono</Label>
                  <Input
                    placeholder="+54 11 1234-5678"
                    value={contactInfo.telefono}
                    onChange={(e) => setContactInfo({ ...contactInfo, telefono: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    placeholder="+54 9 11 1234-5678"
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Direccion</Label>
                  <Input
                    placeholder="Av. Corrientes 1234"
                    value={contactInfo.direccion}
                    onChange={(e) => setContactInfo({ ...contactInfo, direccion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ciudad</Label>
                  <Input
                    placeholder="Buenos Aires, Argentina"
                    value={contactInfo.ciudad}
                    onChange={(e) => setContactInfo({ ...contactInfo, ciudad: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horarios de Atencion</Label>
                  <Input
                    placeholder="Lunes a Viernes 9:00 - 18:00"
                    value={contactInfo.horarios}
                    onChange={(e) => setContactInfo({ ...contactInfo, horarios: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="w-5 h-5" />
                  Redes Sociales
                </CardTitle>
                <CardDescription>
                  Links a tus redes sociales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    placeholder="@tutienda"
                    value={contactInfo.instagram}
                    onChange={(e) => setContactInfo({ ...contactInfo, instagram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    placeholder="facebook.com/tutienda"
                    value={contactInfo.facebook}
                    onChange={(e) => setContactInfo({ ...contactInfo, facebook: e.target.value })}
                  />
                </div>

                <div className="border-t pt-4 mt-4 space-y-4">
                  <h4 className="font-medium">Opciones de la pagina</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mostrar formulario de contacto</Label>
                      <p className="text-sm text-muted-foreground">Los clientes pueden enviarte mensajes</p>
                    </div>
                    <Switch
                      checked={contactInfo.mostrar_formulario}
                      onCheckedChange={(checked) => setContactInfo({ ...contactInfo, mostrar_formulario: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mostrar mapa</Label>
                      <p className="text-sm text-muted-foreground">Muestra tu ubicacion en Google Maps</p>
                    </div>
                    <Switch
                      checked={contactInfo.mostrar_mapa}
                      onCheckedChange={(checked) => setContactInfo({ ...contactInfo, mostrar_mapa: checked })}
                    />
                  </div>
                </div>

                <Button onClick={saveContactInfo} disabled={saving} className="w-full mt-4">
                  {saving ? "Guardando..." : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Configuracion
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Vista Previa */}
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista previa de la pagina de contacto</CardTitle>
              <CardDescription>
                Asi se vera tu pagina de contacto para los clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold">Contactanos</h1>
                    <p className="text-muted-foreground mt-2">
                      Estamos para ayudarte. Escribinos y te respondemos a la brevedad.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {contactInfo.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-slate-500" />
                          <span>{contactInfo.email}</span>
                        </div>
                      )}
                      {contactInfo.telefono && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-slate-500" />
                          <span>{contactInfo.telefono}</span>
                        </div>
                      )}
                      {contactInfo.direccion && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-slate-500" />
                          <span>{contactInfo.direccion}, {contactInfo.ciudad}</span>
                        </div>
                      )}
                      {contactInfo.horarios && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-slate-500" />
                          <span>{contactInfo.horarios}</span>
                        </div>
                      )}
                      {contactInfo.instagram && (
                        <div className="flex items-center gap-3">
                          <Instagram className="w-5 h-5 text-slate-500" />
                          <span>{contactInfo.instagram}</span>
                        </div>
                      )}
                    </div>

                    {contactInfo.mostrar_formulario && (
                      <div className="space-y-3">
                        <Input placeholder="Tu nombre" disabled />
                        <Input placeholder="Tu email" disabled />
                        <Textarea placeholder="Tu mensaje..." rows={3} disabled />
                        <Button disabled className="w-full">Enviar mensaje</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
