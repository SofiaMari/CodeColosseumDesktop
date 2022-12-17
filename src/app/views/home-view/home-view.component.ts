import { ASTWithSource } from '@angular/compiler';
import { ThisReceiver } from '@angular/compiler/public_api';
import { Component, OnInit } from '@angular/core';
import { MatchInfo } from 'src/app/services/api.service';
import { ConnectionManagerService } from 'src/app/services/connection-manager.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  gamelist:MatchInfo[]=[];

  loading:boolean = true;

  stateOptions: any[]= [{icon: 'pi pi-bars', value: 'table'}, {icon: 'pi pi-th-large', value: 'card'}];
  view_mode: string = "table";
  hasGames:boolean=true;
/*
  onSuccess(gameList:MatchInfo[]){ 
    this.gamelist = gameList;
    console.log(this.gamelist)
  }

 */
  constructor(private uploadService:UploadService, private connectionManager:ConnectionManagerService) { }

  ngOnInit(): void {

    console.log("[Homeview] Resetting gameplay...")
    this.uploadService.reset()

    let onSuccess = (gameList:MatchInfo[])=>{ 
      this.gamelist = gameList;
      console.log(this.gamelist)
      this.loading=false;
      this.hasGames = this.gamelist.length !== 0;
      for(let i=0;i<this.gamelist.length;i++){
        this.gamelist[i].time=(this.gamelist[i].time-Date.now()/1000);
      }
    }

    this.connectionManager.lobbyList1(onSuccess)
    
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(this.gamelist)


  }





  async lobbyList() {
   
    //Starting the refresh
    this.loading=true;

    //Get lobbyList AND AWAIT FOR THE RESPONSE THIS TOOK ME AGES
    await this.connectionManager.lobbyList();

    // If response is undefined, no games. 
    // !! Assumes that landing in this page means a connection has already
    // !! been established
    this.gamelist = this.connectionManager.lobbylistvar ?? [];
    this.hasGames = this.gamelist.length !== 0;

    // Use remaining time instead of "expiration" time.
    // If this causes problems, can be moved onto HTML template.
    for(let i=0;i<this.gamelist.length;i++){
      this.gamelist[i].time=(this.gamelist[i].time-Date.now()/1000);
    }

    this.loading=false;
  }

  // Clicking on refresh button will refresh results. Would be
  // optimal to have this as "autorefresh every X seconds" instead.
  async onClickRefresh(){

    let onSuccess = (gameList:MatchInfo[])=>{ 
      this.gamelist = gameList;
      this.hasGames = this.gamelist.length !== 0;
      console.log(this.gamelist)
      for(let i=0;i<this.gamelist.length;i++){
        this.gamelist[i].time=(this.gamelist[i].time-Date.now()/1000);
      }

    }
    this.connectionManager.lobbyList1(onSuccess)
    console.log(this.gamelist)

  }
}
