import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfirmacionService {
    private confirmationData: any;

    setConfirmationData(data: any): void {
        this.confirmationData = data;
    }

    getConfirmationData(): any {
        return this.confirmationData;
    }

    clearConfirmationData(): void {
        this.confirmationData = null;
    }
}
