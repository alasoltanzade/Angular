import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type NewTaskData } from './new-task.model';
import { TaskService } from '../tasks.service';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  @Input({ required: true }) userId!: string;
  @Output()
  close = new EventEmitter<void>();
  @Output() add = new EventEmitter<NewTaskData>();

  enterTitle = '';
  enterSummery = '';
  enterDate = '';

  private taskService = inject(TaskService);

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    this.taskService.addTask(
      {
        title: this.enterTitle,
        summary: this.enterSummery,
        date: this.enterDate,
      },
      this.userId
    );
    this.close.emit();
  }
}
