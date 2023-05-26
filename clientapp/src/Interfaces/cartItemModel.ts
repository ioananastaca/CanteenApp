import foodModel from "./foodModel"

export default interface cartItemModel {
    id?: number
    foodId?: number
    food?: foodModel
    quantity?: number
  }