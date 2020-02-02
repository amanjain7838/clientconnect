import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	message = '';
	messages = [];
	currentUser = '';
  nickname = '';
  constructor(private socket: Socket, private toastCtrl: ToastController,public router: Router) { }
 
  ngOnInit() {
    this.socket.connect();
 
    this.socket.emit('set-nickname', this.nickname);

    let name = `user-${new Date().getTime()}`;
    this.currentUser = name;
    
    this.socket.emit('set-name', name);
 
    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
 
    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);
    });
  }
 
  sendMessage() {
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }
 
  ionViewWillLeave() {
    this.socket.disconnect();
  }
 joinchat(){
    this.router.navigateByUrl('chat-room');
 }
  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
