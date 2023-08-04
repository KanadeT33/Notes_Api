import { Note } from "src/notes/entities/note.entity"

export class CreateCategoryDto {
    id:number
    name:string
    note: Note
}
