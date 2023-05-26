import foodModel from "./foodModel";

export default interface orderDetailModel {
  orderDetailId?: number;
  orderHeaderId?: number;
  foodId?: number;
  food?: foodModel;
  quantity?: number;
  foodName?: string;
  price?: number;
}