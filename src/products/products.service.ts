import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { UpdateProductdto } from "./dto/update-product.dto";
import { error } from "console";

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    getAllProducts(): Promise<Product[]> {
        try {
            return this.productRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    getOneProduct(id: string): Promise<Product | null> {
        try {
            return this.productRepository.findOneBy({ id });

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    addProduct(createProductDto: CreateProductDto): Promise<Product> {
        try {
            const product = this.productRepository.create(createProductDto);
            return this.productRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async updateproduct(id: string, updateProductdto: UpdateProductdto) {
        try {
            const existingProduct = await this.productRepository.findOneBy({ id });

            if (!existingProduct) {
                throw new NotFoundException('Product not found');
            }

            const updatedProduct = this.productRepository.merge(
                existingProduct,
                updateProductdto,
            );

            return this.productRepository.save(updatedProduct);

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


     async deleteProduct(id: string) {
        try {
            await this.productRepository.delete(id);
            return 'Delete Sucessfully';
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}



