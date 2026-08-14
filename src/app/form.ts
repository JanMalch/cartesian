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
    defaultValue: [
      {
        label: "a",
        values: [
          "false",
          "true",
        ]
      },
      {
        label: "b",
        values: [
          "false",
          "true",
        ]
      },
    ],
    props: {
      addText: 'Add input',
      label: 'Inputs',
    }
  }
];

