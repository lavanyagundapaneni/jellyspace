import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  selectedFiles!: FileList;
  fileData:any;
  url:any;
  imgShow:boolean=true;
  imagePath: any;

  constructor(
    private service:AppService,
    private router: Router
  ) { }
  public fieldTextType: boolean = false;
  public fName:any;
  public lName:any;
  public eMail:any;
  public pWord:any;
  public imageUrl:any | undefined;

  ngOnInit(): void {
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  obj1 = {
    status: Boolean,
    message: String,
    data: {}
  }

  getSignUp() {

    const contentType = this.fileData.type;
    const bucket = new S3(
          {
              accessKeyId: 'AKIA2DXB2VTKA7BN2YXP',
              secretAccessKey: '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',
              region: 'us-east-1'
          }
      );
      const file = this.fileData;
      const userId = this.eMail;
      const folderName = 'images';
      const fileName = file.name;
      this.imageUrl=`user/${userId}/${folderName}/${fileName}`;
      const params = {
          Bucket: 'jellyspace-public',
          Key:  this.imageUrl,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      localStorage.setItem('registerEmail', this.eMail);
      localStorage.setItem('freelancerFirstName', this.fName);
      localStorage.setItem('freelancerLastName', this.lName);
      localStorage.setItem('nameOTP', this.fName +' ' + this.lName);
      localStorage.setItem('freelancerEmail', this.eMail);
      localStorage.setItem('freelancerPassword', this.pWord);

      bucket.upload(params, function (err:any,  data:any) {
          if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
          }
          console.log('Successfully uploaded file.', data);
          localStorage.setItem('freelancerImage', data.Location);
          setTimeout(() => {
            window.location.href = "/accounts-link";
          }, 1000);
          return true;
      });

    // this.service.sendOTP(params).subscribe((data: any) => {
    //   if(data.status === true) {
    //     this.router.navigate(['accounts-link'])
    //   } else {
    //     alert(data.message);
    //   }
    // })
  }

  selectFile(event:any) {
    console.log("image upload")
    this.imgShow = false;
    const files = event.target.files;
    if (files.length === 0)
        return;
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
        this.url = reader.result;
    }
    this.fileData= event.target.files[0];

    }
    upload(){
      console.log("this test ")
    }

}
