import { IsOptional, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  status?: string;
  
  @IsOptional()
  deliveryDate?: Date;
}
 