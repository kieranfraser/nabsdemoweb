import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule, FormBuilder } from "@angular/forms";
import { BrowserModule  } from "@angular/platform-browser";
import { App }   from "./app";
import { TodoCmp }   from "./todo/components/todo-cmp";
import { todoRouting } from "./todo/components/todo-route";
import { TodoService }   from "./todo/services/todo-service";


import { AngularFireModule } from 'angularfire2';
import {HomeCmp} from "./home/components/home-cmp";
import {HomeService} from "./home/services/home-service";
import {homeRouting} from "./home/components/home-route";
import {SpinnerComponent} from "./todo/components/spinner-cmp";



import { ModalModule, CollapseModule } from 'ngx-bootstrap';
import {SimService} from "./sim/services/sim-service";
import {SimCmp} from "./sim/components/sim-cmp";
import {simRouting} from "./sim/components/sim-route";
import {SpeechRecognitionService} from "./sim/services/speech-recognition-service";
import {ControlCmp} from "./sim/components/control-cmp";

export const config = {
  apiKey: "AIzaSyBuH2Fjok4gt7ouDB2tz39DU51DFEaYcY0",
  authDomain: "nabsdemo.firebaseapp.com",
  databaseURL: "https://nabsdemo.firebaseio.com",
  projectId: "nabsdemo",
  storageBucket: "nabsdemo.appspot.com",
  messagingSenderId: "968367753735"
};

@NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      todoRouting,
      homeRouting,
      simRouting,
      AngularFireModule.initializeApp(config),
      FormsModule,
      ModalModule.forRoot(),
      CollapseModule.forRoot(),
    ],
    declarations: [
      App,
      HomeCmp,
      TodoCmp,
      SimCmp,
      ControlCmp,
      SpinnerComponent,
    ],
    providers: [
      TodoService,
      HomeService,
      SimService,
      SpeechRecognitionService,
    ],
    bootstrap: [
      App,
    ],
})
export class AppModule {}
