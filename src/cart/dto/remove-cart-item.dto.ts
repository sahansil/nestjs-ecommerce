import { IsInt } from 'class-validator';

export class RemoveCartItemDto {
  @IsInt()
  productId: number;
}
