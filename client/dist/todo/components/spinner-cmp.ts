/**
 * Created by kfraser on 28/04/2017.
 */
'use strict';

import {
  Component,
  Input,
  OnDestroy
} from "@angular/core";

@Component({
  selector: 'my-spinner',
  templateUrl: 'todo/templates/spinner.html',
  styleUrls: ["todo/styles/spinner.css"]
})
export class SpinnerComponent implements OnDestroy {
  private currentTimeout: any;
  private isDelayedRunning: boolean = false;

  @Input()
  public delay: number = 300;

  @Input()
  public set isRunning(value: boolean) {
    if (!value) {
      this.cancelTimeout();
      this.isDelayedRunning = false;
      return;
    }

    if (this.currentTimeout) {
      return;
    }

    this.currentTimeout = setTimeout(() => {
      this.isDelayedRunning = value;
      this.cancelTimeout();
    }, this.delay);
  }

  private cancelTimeout(): void {
    clearTimeout(this.currentTimeout);
    this.currentTimeout = undefined;
  }

  ngOnDestroy(): any {
    this.cancelTimeout();
  }
}
