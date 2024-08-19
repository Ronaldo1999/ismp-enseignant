import { Component, OnInit } from '@angular/core';
import { Soutenance } from 'src/app/class/soutenance';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  liste: any[] = [];
  sessions: Soutenance[] = [];

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.getAllSession();
  }

  getAllSession() {
    this.sessions = [];
    this.api.getAllSession().subscribe((res: any) => {
      this.sessions = res;
      console.log(res);
    });
  }
}
