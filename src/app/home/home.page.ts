import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router,NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from '../services/user/user.service';

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

  constructor( private toastCtrl: ToastController,public router: Router,private userservice:UserService) { }
 
  ngOnInit() {
    this.getuserlist();

    // this.socket.connect();
 
    // this.socket.emit('set-nickname', this.nickname);

    // let name = `user-${new Date().getTime()}`;
    this.getcurrentuser();    

    // this.socket.emit('set-name', name);
 
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
    });
  }
  getuserlist(){
    this.userservice.userdata().subscribe(response=>{
      if(response.data.length>0)
        this.userlist.push(response.data);
    });
  }
  sendMessage() {
    // this.socket.emit('send-message', { text: this.message });
    // this.message = '';
  }
 
  ionViewWillLeave() {
    // this.socket.disconnect();
  }
 joinchat(userid,username){
  //  let navigationExtras: NavigationExtras = {
  //   state: {
  //     friendId:userid
  //   }
  // };

    this.router.navigate(['/chat-room',{friendid:userid,friendname:username,userid:this.currentUser}]);
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
