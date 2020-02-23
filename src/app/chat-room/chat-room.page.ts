import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
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
  currentUser;
  friendid: any;
  username: any;
  roomid;
	constructor(private navCtrl: NavController, private socket: Socket, private alertCtrl: AlertController, private toastCtrl: ToastController,private router: Router,private route: ActivatedRoute) {
    // this.nickname = this.navParams.get('nickname');
 
    // this.getMessages().subscribe(message => {
    //   this.messages.push(message);
    // });

    // this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.dataparam = this.router.getCurrentNavigation().extras.state.userid;
    //   console.log(this.dataparam)
    //   }
    // });
    this.friendid = this.route.snapshot.paramMap.get('friendid');
    this.username = this.route.snapshot.paramMap.get('friendname');
    
    // console.log(this.userid)
    this.socket.connect();
    this.currentUser=this.route.snapshot.paramMap.get('userid');

    this.socket.emit('setroom',{"friendid":this.friendid,"userid":this.currentUser});
    
    // this.socket.emit('clientdetails',{"receiverUser":this.userid,"currentUser":this.currentUser});

    this.socket.fromEvent('listenroomid').subscribe(result => {
      this.roomid=result['content'];
    });    
    this.socket.fromEvent('message').subscribe(message => {
      console.log(message)
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
    let data={ text: this.message,sender:this.currentUser,receiver:this.friendid,roomid:this.roomid};
    this.socket.emit('send-message',data);
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
