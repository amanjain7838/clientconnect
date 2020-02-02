import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

// @IonicPage()
@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
	messages = [];
	nickname = 'aman';
	message = '';
  currentUser = '';
  
	constructor(private navCtrl: NavController, private socket: Socket, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    // this.nickname = this.navParams.get('nickname');
 
    // this.getMessages().subscribe(message => {
    //   this.messages.push(message);
    // });
    this.socket.emit('set-nickname', this.nickname);

    let name = `user-${new Date().getTime()}`;
    this.currentUser = name;
    
    this.socket.emit('set-name', name);
 
    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);
    });
 
    // this.getUsers().subscribe(data => {
    //   let user = data['user'];
    //   if (data['event'] === 'left') {
    //     this.showToast('User left: ' + user);
    //   } else {
    //     this.showToast('User joined: ' + user);
    //   }
    // });

    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
  
  }
 
  sendMessage() {
    // this.socket.emit('add-message', { text: this.message });
    // this.message = '';
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }
 
 
  ionViewWillLeave() {
    this.socket.disconnect();
  }
 
  async showToast(msg) {
    // let toast = this.toastCtrl.create({
    //   message: msg,
    //   duration: 2000
    // });
	const alert = await this.alertCtrl.create({
		message: msg,
		buttons: ['Dismiss']
	});
    await alert.present();
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
	ngOnInit() {
	}

}
