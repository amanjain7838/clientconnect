import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastController,IonContent,IonList,IonGrid } from '@ionic/angular';
import { UserService } from '../services/user/user.service';

// @IonicPage()
@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
	messages;
	nickname = 'aman';
	message = '';
  currentUser;
  friendid: any;
  username: any;
  roomid;
  today=new Date();
  @ViewChild(IonContent,{static: false}) chatpanel: any;
  @ViewChild(IonGrid, {read: ElementRef,static:false}) chatList: ElementRef;
  private mutationObserver: MutationObserver;

	constructor(private navCtrl: NavController, private socket: Socket, private alertCtrl: AlertController, private toastCtrl: ToastController,private router: Router,private route: ActivatedRoute,private userservice:UserService) {

    this.friendid = this.route.snapshot.paramMap.get('friendid');
    this.userservice.userid().subscribe(response=>{
      this.currentUser=response['id'];
      this.socket.connect();
      this.socket.emit('setroom',{"roomowner":this.currentUser});
      let data={userid:this.currentUser,friendid:this.friendid};
      this.socket.emit('get-chathistory',data);
      this.socket.fromEvent('chathistory').subscribe(message => {
        console.log(message)
        this.messages=message;
      });
      this.socket.fromEvent('message').subscribe(message => {
        this.messages.push(message);
        console.log(this.messages)
      });

    });

    
    // this.socket.emit('clientdetails',{"receiverUser":this.userid,"currentUser":this.currentUser});

 
    // this.getUsers().subscribe(data => {
    //   let user = data['user'];
    //   if (data['event'] === 'left') {
    //     this.showToast('User left: ' + user);
    //   } else {
    //     this.showToast('User joined: ' + user);
    //   }
    // });

  
  }
 
  sendMessage() {
    // this.socket.emit('add-message', { text: this.message });
    // this.message = '';
    let data={ text: this.message,sender:this.currentUser,receiver:this.friendid};
    this.socket.emit('send-message',data);
    let subdata={message: this.message,senderId:this.currentUser,receiverId:this.friendid, createdAt: new Date()};
    this.messages.push(subdata);
    this.message = '';
  }
  ionViewDidEnter(){
    this.mutationObserver = new MutationObserver((mutations) => {
        this.chatpanel.scrollToBottom();
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
        childList: true
    });
    this.chatpanel.scrollToBottom();
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
