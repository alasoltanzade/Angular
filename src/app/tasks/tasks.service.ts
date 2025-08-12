import { Injectable } from '@angular/core';
import { type NewTaskData } from './new-task/new-task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks = [
    {
      id: 't1',
      userId: 'u1',
      title: 'Master Angular',
      summary:
        'Learn all the basic and advanced features of Angular & how to apply them.',
      dueDate: '2025-12-31',
    },
    {
      id: 't2',
      userId: 'u3',
      title: 'Build first prototype',
      summary: 'Build a first prototype of the online shop website',
      dueDate: '2024-05-31',
    },
    {
      id: 't3',
      userId: 'u3',
      title: 'Prepare issue template',
      summary:
        'Prepare and describe an issue template which will help with project management',
      dueDate: '2024-06-15',
    },
  ];

  constructor() {
    const tasks = localStorage.getItem('tasks');

    if (tasks) {
      //if some data was storage overwrite them with localstorage
      this.tasks = JSON.parse(tasks);
    }
  }

  getUserTask(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
    //we filter them for the tasks that belong to the user - filter execute every item in array and receive item
  }

  addTask(taskDate: NewTaskData, userId: string) {
    this.tasks.unshift({
      id: new Date().getTime().toString(),
      userId: userId,
      title: taskDate.title,
      summary: taskDate.summary,
      dueDate: taskDate.date,
    });
    this.saveTask();
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTask();
  }

  private saveTask() {
    //for update
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
