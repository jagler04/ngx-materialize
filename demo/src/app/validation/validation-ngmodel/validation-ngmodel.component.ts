import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-ngmodel',
  templateUrl: './validation-ngmodel.component.html',
  styleUrls: ['./validation-ngmodel.component.scss'],
})
export class ValidationNgmodelComponent implements OnInit {
  @ViewChild('form') form: FormGroup;

  submitted = false;
  submittedValues: any;

  values = {
    checkbox: false,
    input: '',
    select: null,
    datepicker: '',
    timepicker: '',
  };

  errorMessages = {
    input: {
      required: 'This field is required.',
    },
    select: {
      required: 'This field is required.',
    },
    datepicker: {
      required: 'This field is required.',
    },
    timepicker: {
      required: 'This field is required.',
    },
  };

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    var tabs = $('ul.tabs');
    (tabs as any).tabs.apply(tabs);
    //this.renderer.invokeElementMethod($('ul.tabs'), 'tabs');
  }

  clear() {
    this.form.reset();

    this.values = {
      checkbox: false,
      input: '',
      select: null,
      datepicker: '',
      timepicker: '',
    };
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.submitted = true;
    this.submittedValues = this.form.value;
  }
}
