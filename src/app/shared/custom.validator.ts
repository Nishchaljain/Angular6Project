import { AbstractControl } from '@angular/forms';

export class CustomValidators {

    static emailDomainValidator(domainName: string) {
        return (control: AbstractControl): { [key: string]: any } | null => {

            const email: string = control.value;
            const domain = email.substring(email.lastIndexOf('@') + 1);
            if (email === '' || domain.toLowerCase() === domainName) {
                return null;
            }
            else {
                return { ['emailDomain']: true };
            }
        };
    }
}
