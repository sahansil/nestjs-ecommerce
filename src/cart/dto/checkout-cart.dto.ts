import { IsNumber, IsString } from 'class-validator';

export class CheckoutCartDto {
  @IsNumber()
  userId: number;

  @IsString()
  method: string;

  @IsString()
  paymentMethod: string;
  quantity: number;
}