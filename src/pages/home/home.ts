import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ActionSheetController } from 'ionic-angular'
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private geolocation:Geolocation,
    public camera:Camera,
    public socialSharing:SocialSharing,
    public actionSheetCtrl: ActionSheetController,
    public nativeGeocoder: NativeGeocoder ) {

  }

  location
  base64Image
  message
  address
  lat
  long

  getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.lat=resp.coords.latitude
      this.long=resp.coords.longitude
      this.location=this.lat + ", " + this.long
      this.nativeGeocoder.reverseGeocode(this.lat, this.long)
      .then((result: NativeGeocoderReverseResult) => this.address=JSON.stringify(result))
      .catch((error: any) => console.log(error));
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
  }

  sharePhoto(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'How would you like to share your image?',
      buttons: [
        {
          text: 'Facebook',
          //role: 'destructive',
          handler: () => {
            this.facebookShare();
            //console.log('Destructive clicked');
          }
        },
        {
          text: 'Instagram',
          handler: () => {
            this.instaShare();
            //console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  facebookShare(){
    this.socialSharing.shareViaFacebook("This is awesome", this.base64Image).then(() => {
      // Sharing via email is possible
      this.message="Uploaded to Facebook"
    }).catch(() => {
      // Sharing via email is not possible
    });
  }

  instaShare(){
    this.socialSharing.shareViaInstagram("This is awesome", this.base64Image).then(() => {
      // Sharing via email is possible
      this.message="Uploaded to Instagram"
    }).catch(() => {
      // Sharing via email is not possible
    });
  }


}
