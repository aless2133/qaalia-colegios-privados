'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { MessageQuestion, DocumentText } from 'iconsax-react'

const FAQS = [
  {
    pregunta: '¿Puedo cambiar de plan en cualquier momento?',
    respuesta: 'Sí. Puedes mejorar o bajar de plan cuando quieras desde esta misma página; el cambio se refleja de inmediato en tu cuenta.',
  },
  {
    pregunta: '¿Qué pasa cuando termina mi prueba de 7 días?',
    respuesta: 'Al finalizar el periodo de prueba se realiza automáticamente el primer cobro con la tarjeta que registraste en el checkout, sin que tengas que hacer nada.',
  },
  {
    pregunta: '¿Puedo cancelar mi suscripción?',
    respuesta: 'Sí, puedes cancelar cuando quieras. Seguirás teniendo acceso hasta el final del periodo ya pagado.',
  },
  {
    pregunta: '¿Cómo se procesan los pagos?',
    respuesta: 'Todos los pagos se procesan de forma segura a través de Paddle, encargado de la facturación y el cumplimiento fiscal en cada país.',
  },
]

export default function Footer() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-center">
          <MessageQuestion size={18} color="currentColor" className="text-muted-foreground" />
          <h2 className="text-base font-bold text-foreground">Preguntas frecuentes</h2>
        </div>

        <Accordion type="single" collapsible className="max-w-2xl mx-auto w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.pregunta} value={`item-${i}`}>
              <AccordionTrigger className="text-sm font-semibold text-foreground text-left">
                {faq.pregunta}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.respuesta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Card className="border border-border bg-accent/40 px-6 py-8 flex flex-col items-center text-center gap-3">
        <DocumentText size={24} color="currentColor" className="text-muted-foreground" />
        <h3 className="text-sm font-bold text-foreground">¿Tienes alguna pregunta?</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          Explora los documentos de ayuda o contacta a nuestro equipo de soporte cuando quieras
        </p>
        <Button variant="outline" className="rounded-2xl font-bold" asChild>
          <a href="/ayuda">Ver documentos de ayuda</a>
        </Button>
      </Card>
    </div>
  )
}