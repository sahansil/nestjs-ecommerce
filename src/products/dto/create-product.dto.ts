import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";

class variantDto {
    @IsNotEmpty()
    @IsString()
    color: string;

    @IsNotEmpty()
    @IsString()
    size: string;


    @IsNotEmpty()
    @IsNumber()
    stock: number;
}

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    variants: variantDto[];
}

