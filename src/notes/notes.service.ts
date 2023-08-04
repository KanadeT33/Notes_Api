import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CategoryNote } from 'src/category_notes.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) 
    private repo: Repository<Note>,
    @InjectRepository(Category)
    private catRepo: Repository<Category>,
    @InjectRepository(CategoryNote)
    private catnoterepo: Repository<CategoryNote>,
  ) {}
  async createNoteWithCategories(noteData: any, categoryNames: string[]) {
    //get data and make a new note obj
    const { title, content, user } = noteData;
    let newNote = new Note();
    newNote.title = title;
    newNote.content = content;
    newNote.user = user;
    const note = await this.repo.save(newNote);
    if (categoryNames.length == 0) {
      return note;
    }
    categoryNames.forEach(async (cur_cat) => {
      //get existent cat
      const existent_cat = await this.catRepo.findOneBy({ name: cur_cat });

      if (existent_cat) {
        //cat exists
        //insert relation
        return await this.insertIntoCategoryNote(
          note,
          existent_cat,
        );
      } else {
        //cat doesnt exist
        //insert new cat
        const new_cat = new Category();
        new_cat.name = cur_cat;
        const new_gen_cat = await this.catRepo.save(new_cat);
        //create a new relation
        const inserted_catnote = await this.insertIntoCategoryNote(
          note,
          new_gen_cat,
        );
      }
    });
  }
  async insertIntoCategoryNote(note, cat) {
    const n = new CategoryNote();
    n.note = note;
    n.category = cat;
    const inserted_catnote = await this.catnoterepo.save(n);
    return inserted_catnote;
  }
  async editNoteWithCategories(noteData: any, categoryNames: string[]) {
    //data deconstruction
    const { id: note_id, title, content} = noteData;
    //get data, edit note, save edited note
    const note_to_edit = await this.repo.findOneBy({ id: note_id });
    note_to_edit.title = title;
    note_to_edit.content= content

    await this.repo.update(note_id, note_to_edit);

    //delete all categories that didnt get sent
    const catnot = await this.catnoterepo
      .createQueryBuilder('cn')
      .leftJoinAndSelect('cn.category', 'category')
      .leftJoinAndSelect('cn.note', 'note')
      .where('cn.noteId = :note', { note: note_id })
      .getMany(); 
    const temp = catnot.map((x) => {
      return x.category.name;
    });

    let new_categories = categoryNames.filter((x) => !temp.includes(x));
    let to_remove_categories = temp.filter((x) => !categoryNames.includes(x));

    new_categories.forEach(async (cur_cat) => {
      const new_cat = new Category();
      new_cat.name = cur_cat;
      const new_gen_cat = await this.catRepo.save(new_cat);
      //get new relation


      return await this.insertIntoCategoryNote(note_to_edit, new_gen_cat);
    });
    to_remove_categories.forEach(async (cur_cat) => {
      const relation_remove = catnot.find((x) => {
        return x.category.name == cur_cat;
      });

      this.catnoterepo.delete(relation_remove.id);
    });
  }
  categoriesByNoteId(id): Promise<Note[]>{
    return  this.repo.query(`SELECT name
    FROM category_note cn
    JOIN category c ON cn."categoryId" = c.id 
    WHERE cn."noteId" = $1`, [
      id,
    ]);
  }
  findAllUnArchived() {
    return this.repo.find({where:{archived:false}})
  }
  findAllArchived() {
    return this.repo.find({where:{archived:true}})
  }
  async filter(id) {
    return await this.repo.query(
      `select n.id  from note n
    join category_note cn on cn."noteId"  = n.id
    join category c on c.id  = cn."categoryId" 
    where c.id= $1 and n.archived = false`,
      [id],
    );
  }

  findOne(id: number) {
    return this.repo.findBy({id});
  }
  byCategory(categoryId: number){
    return this.repo.createQueryBuilder('notes').leftJoinAndSelect("notes.category", 'cat').where('cat=:category', {categoryId})
  }
  async changeStatus(id:number){
    const note= await this.repo.findOneBy({id})
    note.archived=!note.archived
    return await this.repo.update(note.id, note)
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    return this.repo.update(id, updateNoteDto)
  }
  remove(id: number) {
    return this.repo.delete(id)
  }
}
