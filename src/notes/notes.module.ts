import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Category } from 'src/categories/entities/category.entity';
import { CategoryNote } from 'src/category_notes.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Note, Category, CategoryNote]), UsersModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports:[NotesService]
})
export class NotesModule {}
