import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router,NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from '../services/user/user.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	message = '';
	messages = [];
	currentUser;
  nickname = '';
  userlist=[];
  newmessage=[];
  constructor( private toastCtrl: ToastController,public router: Router,private userservice:UserService, private socket: Socket) { }
 
  ngOnInit() {

    // this.socket.connect();
 
    // this.socket.emit('set-nickname', this.nickname);

    // let name = `user-${new Date().getTime()}`;
    this.getcurrentuser();    

    // this.socket.emit('set-name', name);

     this.socket.fromEvent('notifyusermessage').subscribe(message => {
        const index: number = this.newmessage.indexOf(message['senderId']);
        if (index=== -1)
          this.newmessage.push(message['senderId']);
      });
    // this.socket.fromEvent('users-changed').subscribe(data => {
    //   let user = data['user'];
    //   if (data['event'] === 'left') {
    //     this.showToast('User left: ' + user);
    //   } else {
    //     this.showToast('User joined: ' + user);
    //   }
    // });
 
    // this.socket.fromEvent('message').subscribe(message => {
    //   this.messages.push(message);
    // });
  }
  getcurrentuser(){
    this.userservice.userid().subscribe(response=>{
      this.currentUser=response['id'];
      console.log(this.currentUser)
      this.socket.connect();
      this.socket.emit('setroom',{"roomowner":this.currentUser});
      
      this.getuserlist();
    });
  }
  getuserlist(){
    this.userservice.userdata().subscribe(response=>{
      if(response.data.length>0)
        this.userlist.push(response.data);
      console.log(response.data)
    });
  }
  sendMessage() {
    // this.socket.emit('send-message', { text: this.message });
    // this.message = '';
  }
 
  ionViewWillLeave() {
    // this.socket.disconnect();
  }
 joinchat(data){
  //  let navigationExtras: NavigationExtras = {
  //   state: {
  //     friendId:userid
  //   }
  // };
  let userdetails;
  if(data.muserid.id!=this.currentUser)
    userdetails=data.muserid;
  else
    userdetails=data.sfriendid;
    let senderid=this.currentUser!=data.muserid.id?data.muserid.id:data.sfriendid.id;
    const index: number = this.newmessage.indexOf(senderid);
    if (index !== -1) {
        this.newmessage.splice(index, 1);
    }
    this.router.navigate(['/chat-room',{friendid:userdetails.id,friendname:userdetails.name,userid:this.currentUser}]);
    // this.router.navigate(['chat-room'],navigationExtras);
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
