import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Scolarite } from 'src/app/class/scolarite/scolarite';
import { User } from 'src/app/class/user/user';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-scolarite',
  templateUrl: './scolarite.component.html',
  styleUrls: ['./scolarite.component.scss']
})
export class ScolariteComponent {


  recu= new Scolarite();

  chargement = false;
  user = new User();

  constructor(public translate: TranslateService, private ts: SessionStorageService, public api: ApiService, private router: Router) {
    this.user = this.ts.getUser();
  }

  ngOnInit(): void { this.etatScolarite(); }


  etatScolarite() {
    this.chargement = true;
    this.api.etatScolarite(this.user.idauditeur, this.user.idregroupements).subscribe({
      next: (data: any) => { this.recu = data[0]; console.log(data); },
      error: (error: any) => { console.error(error); this.chargement = false; },
      complete: () => { console.info('complete'); this.chargement = false; }
    });
  }
  //---------------------------------------------------------------------------



}
