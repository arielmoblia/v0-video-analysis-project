'use client'

import { useCallback, useState, useEffect } from 'react'
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, CreditCard, Loader2 } from 'lucide-react'
import { startCositasCheckout } from '@/app/actions/stripe-cositas'

interface CositasCheckoutProps {
  selectedCositas: string[]
  total: number
  hasPercentItem: boolean
  storeId?: string
}

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsProcessing(true)
    setErrorMsg('')
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })
    if (error) {
      setErrorMsg(error.message || 'Error al procesar el pago')
      setIsProcessing(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-[#62162f] to-[#96305a] hover:from-[#330000] hover:to-[#62162f]"
      >
        {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Procesando...</> : 'Confirmar pago'}
      </Button>
    </form>
  )
}

export function CositasCheckout({ selectedCositas, total, hasPercentItem, storeId }: CositasCheckoutProps) {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    fetch(window.location.origin + '/api/tolar/stripe/config')
      .then(r => r.json())
      .then(({ publishableKey }) => loadStripe(publishableKey))
      .then(s => setStripeInstance(s))
      .catch(console.error)
  }, [])

  const handleContinue = async () => {
    setIsLoading(true)
    setIsOpen(true)
    try {
      const secret = await startCositasCheckout(selectedCositas, storeId, total)
      setClientSecret(secret)
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setClientSecret(null)
    setSuccess(false)
  }

  return (
    <>
      <Button
        size="lg"
        className="gap-2 bg-gradient-to-r from-[#62162f] to-[#96305a] hover:from-[#330000] hover:to-[#62162f]"
        onClick={handleContinue}
        disabled={isLoading}
      >
        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Cargando...</> : <><ArrowRight className="w-4 h-4" />Continuar</>}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#62162f]" />
              Completar pago
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="bg-[#ff9fc5]/10 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total a pagar:</span>
                <span className="text-2xl font-bold text-[#62162f]">
                  ${total.toLocaleString('es-AR')}
                  {hasPercentItem && ' + 10% por venta'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedCositas.length} cosita{selectedCositas.length > 1 ? 's' : ''} seleccionada{selectedCositas.length > 1 ? 's' : ''}
              </p>
            </div>

            {success ? (
              <div className="text-center py-8">
                <p className="text-green-600 text-xl font-bold">¡Pago exitoso!</p>
                <p className="text-muted-foreground mt-2">Tus cositas fueron activadas.</p>
              </div>
            ) : stripeInstance && clientSecret ? (
              <Elements stripe={stripeInstance} options={{ clientSecret, locale: 'es' }}>
                <CheckoutForm onSuccess={() => setSuccess(true)} />
              </Elements>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#62162f]" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
