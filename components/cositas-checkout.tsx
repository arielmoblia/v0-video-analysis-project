'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, CreditCard, Loader2 } from 'lucide-react'
import { startCositasCheckout } from '@/app/actions/stripe-cositas'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CositasCheckoutProps {
  selectedCositas: string[]
  total: number
  hasPercentItem: boolean
  storeId?: string
}

export function CositasCheckout({ selectedCositas, total, hasPercentItem, storeId }: CositasCheckoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const fetchClientSecret = useCallback(async () => {
    const clientSecret = await startCositasCheckout(selectedCositas, storeId)
    return clientSecret!
  }, [selectedCositas, storeId])

  const handleContinue = async () => {
    setIsLoading(true)
    setIsOpen(true)
    // Pequeño delay para que el dialog se abra antes de cargar Stripe
    setTimeout(() => {
      setShowCheckout(true)
      setIsLoading(false)
    }, 500)
  }

  const handleClose = () => {
    setIsOpen(false)
    setShowCheckout(false)
  }

  return (
    <>
      <Button 
        size="lg" 
        className="gap-2 bg-gradient-to-r from-[#62162f] to-[#96305a] hover:from-[#330000] hover:to-[#62162f]"
        onClick={handleContinue}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Cargando...
          </>
        ) : (
          <>
            Continuar
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {showCheckout && (
              <div id="checkout" className="min-h-[400px]">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ fetchClientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            )}

            {!showCheckout && isLoading && (
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
