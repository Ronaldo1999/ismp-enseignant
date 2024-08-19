import { Component, OnInit } from '@angular/core';
import { Soutenance } from 'src/app/class/soutenance';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-soutenance',
  templateUrl: './soutenance.component.html',
  styleUrls: ['./soutenance.component.scss']
})
export class SoutenanceComponent implements OnInit {

  liste: any[] = [];
  soutenances: Soutenance[] = [];
  user: any;
  constructor(
    private api: ApiService,
    private ts: SessionStorageService,
  ) {
    this.user = this.ts.getUser();
  }
  displayGSpinner = false;
  ngOnInit() {
    this.getAllSoutenance();
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

  getDetail(item: Soutenance) {

  }
}
