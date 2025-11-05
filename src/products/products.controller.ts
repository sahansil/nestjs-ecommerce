import { Body, Controller, ForbiddenException, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, Delete } from "@nestjs/common";
import express from 'express';      
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductsService } from "./products.service";
import { UpdateProductdto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";


@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post('/')
    addProduct(
        @Body() createProductDto: CreateProductDto
    ) {
        return this.productsService.addProduct(createProductDto);
    }

    @Put('/:id')
    updateProduct(
        @Body() updateProductdto: UpdateProductdto,
        @Param('id') id: string) {
        return this.productsService.updateproduct(id, updateProductdto);
    }
    @Get('/')
    getAllProducts(): Promise<Product[]> {
        return this.productsService.getAllProducts();
    }

    @Get('/:id')
    getOneProduct(@Param('id') id: string) {
        return this.productsService.getOneProduct(id);
    }

    @Delete('/:id')
    deleteProduct(@Param('id') id: string) {
        return this.productsService.deleteProduct(id);
    }
// @Post()
// createProduct(
//     @Req() req: express.Request,
//     @Res() res: express.Response,

//     @Body('name') name: string,
//     @Body('price') price: number,
// ): void {
//     console.log(req);
//     console.log(name, price);

//     res.status(HttpStatus.CREATED).send({
//         message: `product ${name} with price ${price} created successfully`,
//     });
// }

// @Post('/create')
// addProduct(@Body() CreateProductDto: CreateProductDto) {
//     console.log(CreateProductDto)
// }

// @Put('/:id')
// updateProduct(@Param('id') id: string, @Query('data') data: string): string {
//     if (id === 'hello') {
//         throw new ForbiddenException('you are not allowed');
//     }
//     return `Hello from put request and id is ${id} and data is ${data}`;
// }

}
