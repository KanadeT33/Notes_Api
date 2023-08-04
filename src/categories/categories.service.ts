import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category)
  private repo: Repository<Category>
  ){}
  create(createCategoryDto: CreateCategoryDto) {
    return this.repo.save(createCategoryDto)
  }

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return this.repo.findOneBy({id})
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.repo.update(id, updateCategoryDto)
  }

  remove(id: number) {
    return this.repo.delete(id)
  }
}
