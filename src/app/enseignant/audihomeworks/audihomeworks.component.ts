import { Component, OnInit } from '@angular/core';
import { Soutenance } from 'src/app/class/soutenance';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-audihomeworks',
  templateUrl: './audihomeworks.component.html',
  styleUrls: ['./audihomeworks.component.scss']
})
export class AudihomeworksComponent implements OnInit {

  liste: any[] = [];
  soutenances: Soutenance[] = [];
  audihomeworks: any[] = [];
  user: any;
  constructor(
    private api: ApiService,
    private ts: SessionStorageService,
  ) {
    this.user = this.ts.getUser();
  }
  displayGSpinner = false;
  ngOnInit() {
    this.audihomeworksByEnseignant();
  }

  getAllSoutenance() {
    this.displayGSpinner = true;
    this.soutenances = [];
    this.api.soutenanceListByEnseignant(this.user.idenseignant).subscribe((res: any) => {
      this.soutenances = res;
      this.displayGSpinner = false;
      console.log(res);
    }, error => {
      this.displayGSpinner = false;
    });
  }

  audihomeworksByEnseignant() {
    this.displayGSpinner = true;
    this.audihomeworks = [];
    this.api.listRessourceAudiByEns(this.user.idenseignant).subscribe((res: any) => {
      console.log(res);
      this.audihomeworks = res;
      this.displayGSpinner = false;
    }, error => {
      this.displayGSpinner = false;
    });
  }

  getDetail(item: Soutenance) {

  }

  comparerDates(dateString1: string, dateString2: string) {
    let res = false;
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    if (date1.toDateString() > date2.toDateString()) {
      res = true // Les dates sont égales
    } else {
      res = true; // Date 1 est antérieure à Date 2
    }
    return res;
  }

  onDownload(filename: string): void {
    this.displayGSpinner = true;
    this.api.downloadFile(filename).subscribe(
      (response: Blob) => {
        this.displayGSpinner = false;
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }, (error) => {
        this.displayGSpinner = false;
        console.error('An error occurred while downloading the file:', error);
      }
    );
  }
}
