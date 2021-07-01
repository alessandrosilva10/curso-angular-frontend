import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodoService } from './todo.service';
import { Todo } from './todo';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit{
  todos: Todo[] = [];

  form: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(private service: TodoService, private messageService: MessageService){}

  showTopCenter() {
    this.messageService.add({key: 'tc', severity:'warn', summary: 'Warn', detail: 'Message Content'});
  }

  submit(){
    const todo: Todo = { ...this.form.value }
    this.service
      .salvar(todo)
      .subscribe(todo => {
        this.todos.push(todo);
        this.form.reset();
      });
    //console.log(this.form.value.description);
  }

  delete(todo: Todo){
    this.service.deletar(todo.id).subscribe({
      next: (response) => {
        this.listarTodos();
        this.showTopCenter();
      }
    });
  }

  listarTodos(){
    this.service.listar()
      .subscribe(todoList => this.todos = todoList);
  }

  done(todo : Todo){
    this.service.marcarComoConcluido(todo.id).subscribe({
      next: (todoAtualizado) => {
        todo.done = todoAtualizado.done
        todo.doneDate = todoAtualizado.doneDate
      }
    })
  }

  ngOnInit() {
    this.listarTodos();
  }


}
