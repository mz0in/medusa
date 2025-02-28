import { BigNumberInput, IPaymentModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export type RefundPaymentStepInput = {
  payment_id: string
  created_by?: string
  amount?: BigNumberInput
}

export const refundPaymentStepId = "refund-payment-step"
/**
 * This step refunds a payment.
 */
export const refundPaymentStep = createStep(
  refundPaymentStepId,
  async (input: RefundPaymentStepInput, { container }) => {
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const payment = await paymentModule.refundPayment(input)

    return new StepResponse(payment)
  }
)
