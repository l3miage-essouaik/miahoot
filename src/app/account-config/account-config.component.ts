import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from 'app/services/data.service';


@Component({
  selector: 'app-account-config',
  templateUrl: './account-config.component.html',
  styleUrls: ['./account-config.component.scss']
})

export class AccountConfigComponent {
  fg: FormGroup<{ name: FormControl<string>; photoURL: FormControl<string>; photoFile: FormControl<File | undefined>; }>;

  constructor(private data: DataService, private fb : FormBuilder ){
    this.fg = this.fb.nonNullable.group({
      name: [""],
      photoURL: [""],
      photoFile: [undefined as File|undefined]
    });

    this.data.obsMiUser.subscribe(user => {
      if (user) {
        this.fg.patchValue({
          name: user.name,
          photoURL: user.photoURL,
        });
      }
      });
    }

    update() {
      const formValue = this.fg.value;
      const { name, photoURL } = formValue;
      const partialUser = { name, photoURL };
      this.data.updateUser(partialUser);
    }


  

}
