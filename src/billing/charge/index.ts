// Copyright (c) 2016 AlexV <email@data.bg>
// 
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php

import { BillItem } from '../concerns/billItem';
import { Modifier } from '../modifier';
import { IChargeAttributes } from './interface';
import { IModifierAttributes } from '../modifier/interface';

export declare type ModifierOrAttributes = Modifier | IModifierAttributes;

/**
 * 
 * 
 * @export
 * @class Charge
 * @extends {BillItem}
 */
export class Charge extends BillItem {
  /**
   * 
   * 
   * @type {Modifier}
   */
  protected modifier :Modifier;
  /**
   * 
   * 
   * @type {string}
   */
  name :string = '';
  /**
   * 
   * 
   * @type {string}
   */
  description :string;
  /**
   * 
   * 
   * @type {number}
   */
  price :number = 0;
  /**
   * 
   * 
   * @type {number}
   */
  qty :number = 1;

  /**
   * Creates an instance of Charge.
   * 
   * @param {IChargeAttributes} [attributes={}]
   */
  constructor(attributes: IChargeAttributes = {}) {
    super(attributes.bill);
    this.update(attributes);
  }

  getModifier() :Modifier {
    return this.modifier;
  }

  /**
   * 
   * 
   * @returns {number}
   */
  value() :number {
    return (this.qty * this.price);
  }

  /**
   * 
   * 
   * @returns {number}
   */
  finalValue() :number {
    return this.modifier ? this.value() + this.modifier.value() : this.value();
  }

  /**
   * 
   * 
   * @param {IModifierAttributes} [attributes={}]
   * @returns {Modifier}
   */
  modify(modifierOrAttributes: ModifierOrAttributes = {}) :Modifier {
    if (modifierOrAttributes instanceof Modifier) {
      this.modifier = modifierOrAttributes;
    } else {
      let attributes = <IModifierAttributes> modifierOrAttributes;
      attributes.charge = this;
      if (attributes.bill) {
        if (!this.bill) this.bill = attributes.bill;
        else if (attributes.bill !== this.bill) throw new ReferenceError('Charge with modifier belonging to another bill.');
      } else attributes.bill = this.bill;
      if (this.modifier) this.bill.modifiers.remove(this.modifier);
      this.modifier = new Modifier(attributes);
      if (this.bill) {
        this.bill.modifiers.add(this.modifier);
        this.bill.charges.add(this);
      }
    }
    return this.modifier;
  }

  deleteModifier() :boolean {
    // ? delete modifier
    delete this.modifier;
    return true;
  };

  /**
   * 
   * 
   * @returns {Boolean}
   */
  delete():Boolean {
    if (this.bill) this.bill.charges.remove(this);
    return delete this;
  }

  update(attributes: IChargeAttributes = {}) :boolean {
    if (attributes.bill) this.bill = attributes.bill;
    if (attributes.name) this.name = attributes.name;
    if (attributes.description) this.description = attributes.description;
    if (attributes.price) this.price = attributes.price;
    if (attributes.qty) this.qty = attributes.qty;
    if (attributes.modifier) {
      if (attributes.modifier instanceof Modifier) {
        let modifier = <Modifier> attributes.modifier;
        let modifierBill = modifier.getBill();
        if (modifierBill) {
          if (!this.bill) this.bill = modifierBill;
          else if (this.bill !== modifierBill) throw new ReferenceError('Charge with modifier belonging to another bill.');
        } else modifier.update({ bill: this.bill });
        if (modifier.getCharge() !== this) modifier.setCharge(this);
        this.modifier = modifier; 
      } else {
        if (attributes.modifier.bill) {
        if (!this.bill) this.bill = attributes.modifier.bill;
          else if (this.bill !== attributes.modifier.bill) throw new ReferenceError('Charge with modifier belonging to another bill.');
        } else attributes.modifier.bill = this.bill;
        attributes.modifier.charge = this;
        this.modifier = new Modifier(attributes.modifier);
      }
      if (this.bill) this.bill.modifiers.add(this.modifier);
    }
    if (this.bill && !~this.bill.charges.indexOf(this)) this.bill.charges.add(this);
    return true;
  }
}

export { ChargesCollection } from './collection';