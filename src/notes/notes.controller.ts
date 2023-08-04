import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Post()
  async createNoteWithCategoriesController(@Body() body, res: Response) {
    try {
      const { noteData, categoryNames } = body;

      const newNoteWithCategories =
        await this.notesService.createNoteWithCategories(
          noteData,
          categoryNames,
        );

    } catch (error) {
      console.error('Error creating note with categories:', error);
    }
  }
  @Get('unarchived')
  findAllUnarchived() {
    return this.notesService.findAllUnArchived();
  }
  @Get('archived')
  findAllArchived() {
    return this.notesService.findAllArchived();
  }
  @Get('categories/:id')
  categoriesByNote(@Param('id') id:number){
    return this.notesService.categoriesByNoteId(id)
  }

  @Get('changestatus/:id')
  async changeStatus(@Param('id') id: number){
    return this.notesService.changeStatus(id)
  }
  @Get('category/:category')
  GetByCategory(@Param('category') category:number){
    return this.notesService.byCategory(category)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }
  @Get('filter/:id')
  filter(@Param('id') id:number){
    return this.notesService.filter(id)
  }
  @Patch()
  async editNoteWithCategoriesController(@Body() body, res: Response) {
    try {
      const { noteData, categoryNames } = body;
      const newNoteWithCategories =
        await this.notesService.editNoteWithCategories(noteData, categoryNames);
      return newNoteWithCategories;
    } catch (error) {
      console.error('Error creating note with categories:', error);
    }
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
