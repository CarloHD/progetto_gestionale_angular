import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstCharUppercase',
})
export class FirstCharUppercasePipe implements PipeTransform {
  transform(value: string): string {
    const firstLetterUpper = value.charAt(0).toUpperCase();
    const remainLetters = value.slice(1);
    const fixedString = firstLetterUpper + remainLetters;

    return fixedString;
  }
}
