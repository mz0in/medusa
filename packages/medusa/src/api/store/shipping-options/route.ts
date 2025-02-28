import { listShippingOptionsForCartWorkflow } from "@medusajs/core-flows"
import { HttpTypes, ICartModuleService } from "@medusajs/types"
import { MedusaError, Modules } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const GET = async (
  req: MedusaRequest<HttpTypes.StoreGetShippingOptionList>,
  res: MedusaResponse<HttpTypes.StoreShippingOptionListResponse>
) => {
  const { cart_id } = req.filterableFields as { cart_id: string }
  if (!cart_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You must provide the cart_id to list shipping options"
    )
  }

  const cartService = req.scope.resolve<ICartModuleService>(Modules.CART)

  const cart = await cartService.retrieveCart(cart_id, {
    select: [
      "id",
      "sales_channel_id",
      "currency_code",
      "shipping_address.city",
      "shipping_address.country_code",
      "shipping_address.province",
    ],
    relations: ["shipping_address"],
  })

  const { result } = await listShippingOptionsForCartWorkflow(req.scope).run({
    input: {
      cart_id: cart.id,
      sales_channel_id: cart.sales_channel_id,
      currency_code: cart.currency_code,
      shipping_address: {
        city: cart.shipping_address?.city,
        country_code: cart.shipping_address?.country_code,
        province: cart.shipping_address?.province,
      },
    },
  })

  res.json({ shipping_options: result })
}
