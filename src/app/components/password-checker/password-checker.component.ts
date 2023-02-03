import {
   Component,
   Input,
   OnChanges,
   SimpleChange,
   Output,
   EventEmitter,
} from '@angular/core';

@Component({
   selector: 'app-password-checker',
   templateUrl: './password-checker.component.html',
   styleUrls: ['./password-checker.component.scss'],
})
export class PasswordCheckerComponent implements OnChanges {
   @Input() public passwordToCheck: string;
   @Output() passwordChecker = new EventEmitter<boolean>();

   bar0: string;
   bar1: string;
   bar2: string;

   private colors = ['red', 'yellow', 'red', 'green'];

   massage: string;
   massageColor: string;

   private static checkStrength(p: any) {
      let force = 0;
      const regex = /[$-/:-?{-~!"^_@`\[\]]/g;

      const lowerLetters = /[a-z]+/.test(p);
      const upperLetters = /[A-Z]+/.test(p);
      const numbers = /[0-9]+/.test(p);
      const symbols = regex.test(p);

      const flags = [symbols, lowerLetters, upperLetters, numbers];

      let passedMatches = 0;
      for (const flag of flags) {
         passedMatches += flag === true ? 1 : 0;
      }

      force += 2 * p.length + (p.length >= 10 ? 1 : 0);
      force += passedMatches * 10;

      // short password
      force = p.length <= 7 ? Math.min(force, 10) : force;

       // poor variety of characters
      force = passedMatches === 1 ? Math.min(force, 10) : force;
      force = passedMatches === 2 ? Math.min(force, 20) : force;
      force = passedMatches === 3 ? Math.min(force, 30) : force;
      force = passedMatches === 4 ? Math.min(force, 40) : force;

      return force;
   }

   ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
      const password = changes.passwordToCheck.currentValue;
      this.setBarColors(4, '#DDD');
      if (password) {
         const c = this.getColor(PasswordCheckerComponent.checkStrength(password)
         );
         this.setBarColors(c.index, c.color);

         const pwdChecker = PasswordCheckerComponent.checkStrength(password);
         pwdChecker === 40
            ? this.passwordChecker.emit(true)
            : this.passwordChecker.emit(false);

         switch (pwdChecker) {
         case 10:
            this.massage = 'Your password is less than 8 characters';
            break;
         case 20:
            this.massage = 'Your password is easy';
            break;
         case 30:
            this.massage = 'Your password is medium';
            break;
         case 40:
            this.massage = 'Your password is strong';
            break;
         }
      } else {
      this.massage = '';
      }
   }

   private getColor(s: any) {
      let index = 0;
      if (s === 10) {
         index = 2;
      } else if (s === 20) {
         index = 0;
      } else if (s === 30) {
         index = 1;
      } else if (s === 40) {
         index = 3;
      } else {
         index = 4;
      }

      this.massageColor = this.colors[index];
      
      return {
         index: index + 1,
         color: this.colors[index],
      };
   }

      private setBarColors(count, col) {
         for (let n = 0; n < count; n++) {
         this['bar' + n] = col;
      }
   }
}
