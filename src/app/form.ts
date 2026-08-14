import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

const inputField: FormlyFieldConfig = {
  fieldGroup: [
    {
      key: 'label',
      type: 'input',
      props: {
        label: 'Label'
      }
    },
    {
      key: 'values',
      type: 'repeat',
      fieldArray: {
        type: 'input',
      },
      props: {
        addText: 'Add value',
        label: 'Values',
      }
    }
  ]
}

export const fields: FormlyFieldConfig[] = [
  {
    key: 'inputs',
    type: 'repeat',
    fieldArray: inputField,
    props: {
      addText: 'Add input',
      label: 'Inputs',
    }
  }
];

