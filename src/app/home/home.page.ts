import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../services/task.service';
import { Task } from '../interfaces/task';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  tasks: Task[] = [];
  task: Task;
  constructor(
    private taskService: TasksService,
    private alertCtrl: AlertController,
    private activateRoute: ActivatedRoute
  ) { }



  ngOnInit() {
    this.getAllTask();
  }

  getAllTask() {
    this.taskService.getAllTasks()
      .subscribe(async tasks => {
        console.log(tasks);
        this.tasks = tasks;
      });
  }

  async openAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva tarea!',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'aqui texto',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Crear',
          handler: (data) => {
            this.createTask(data.title);
            console.log(data);
          }
        }
      ]
    });
    await alert.present();
  }

  createTask(title: string) {
    const task = {
      userId: '1',
      title,
      completed: true
    };
    this.taskService.createTask(task)
      .subscribe(async (newTask) => {
        this.tasks.unshift(newTask);
      });
  }


  getTask(id: string) {
    this.taskService.getTask(id)
      .subscribe(async task => {
        console.log('primer task ' + task.title); 
        this.task = task;
      });
  }

  updateTask(id: string, userId: string, title: string) {
    this.task = {
      id,
      userId,
      title,
      completed: false
    };
    this.taskService.updateTask(this.task)
      .subscribe(async (updateTask) => {
        this.tasks.splice((parseInt(id)-1), 1, updateTask);
        console.log(this.tasks);
      });
  }

  async editAlert(id: string) {
    this.taskService.getTask(id)
      .subscribe(async task => { 
        this.task = task;
        console.log('este es el segundo task' + this.task.title);
        const alert = await this.alertCtrl.create({
          header: 'Editar tarea!',
          inputs: [
            {
              name: 'id',
              type: 'text',
              placeholder: 'id',
              value: 'Task id ' + this.task.id
    
            }, {
              label: 'title',
              name: 'title',
              type: 'text',
              placeholder: 'aqui texto',
              value: this.task.title
    
            },
            {
              name: 'userId',
              type: 'text',
              value: 'UserID ' + this.task.userId,
              disabled: true
            },
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'editar',
              handler: (data) => {
                this.updateTask(data.userId, data.id, data.title);
                console.log(data);
              }
            }
          ]
        });
        await alert.present();
      });

  }

  deleteTask(id: string, index: number) {
    this.taskService.deleteTask(id)
      .subscribe(() => {
        this.tasks.splice(index, 1);
      });
  }


}