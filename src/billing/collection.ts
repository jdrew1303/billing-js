// Copyright (c) 2016 AlexV <email@data.bg>
// 
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php

import { Bill } from './bill';
import { IBillAttributes } from './interface';

export class Bills extends Array<Bill> {
  new(attributes: IBillAttributes = {}) :Bill {
    let bill = new Bill(attributes);
    if (!~this.indexOf(bill))this.push(bill);
    return bill;
  }
}