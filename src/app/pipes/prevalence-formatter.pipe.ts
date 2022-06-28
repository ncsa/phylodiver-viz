import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prevalenceFormatter'
})
/*
 * Formats a prevalence value for display.
 * Usage:
 *   value | prevalenceFormatter
*/
export class PrevalenceFormatterPipe implements PipeTransform {

  /**
   * Formats a prevalence.
   * 
   * Args:
   *     input (number): The relative abundance percentage (i.e., the raw
   *         ratio * 100).
   * 
   * Returns:
   *     string: The formatted prevalence.
   */
  transform(value: number|null): string {
    let returnVal: string;
    if (value === null) {
      returnVal = ''
    } else if (value === 0) {
      returnVal = '0';
    } else if (value < 0.01) {
      returnVal = '<0.01';
    } else if (value < 10) {
      returnVal = value.toFixed(2);
    } else if (value < 100) {
      returnVal = value.toFixed(1);
    } else if (value < 100) {
      returnVal = value.toFixed(1);
    } else if (value === 100) {
      returnVal = '100';
    } else {
      returnVal = '>100';
    }
    return returnVal;
  }
}
