import { EventData, Page, Frame, Observable, ApplicationSettings } from '@nativescript/core';
import { Product, PRODUCTS } from './models/product.model';

let globalAdminFee = Number(ApplicationSettings.getNumber('adminFee', 50)); // Load saved admin fee or use default

export function getAdminFee() {
    return globalAdminFee;
}

class ProductsViewModel extends Observable {
    private _products = this.loadSavedProducts();
    private _tempProducts = [...this._products];
    private _adminFee = globalAdminFee;
    private _emptyRows = Array(10).fill(null).map(() => ({
        code: '',
        name: 'New Product',
        pricePerUnit: 0,
        stockNeeded: 0
    }));

    constructor() {
        super();
        // Add empty rows to temp products
        this._tempProducts = [...this._tempProducts, ...this._emptyRows];
    }

    private loadSavedProducts(): Product[] {
        const savedProducts = ApplicationSettings.getString('products', '');
        if (savedProducts) {
            return JSON.parse(savedProducts);
        }
        return [...PRODUCTS]; // Return default products if no saved data
    }

    private saveProducts(products: Product[]) {
        ApplicationSettings.setString('products', JSON.stringify(products));
    }

    get products() {
        return this._tempProducts;
    }

    get adminFee() {
        return this._adminFee;
    }

    updateAdminFee(args) {
        const value = Number(args.object.text) || 0;
        this._adminFee = value;
        globalAdminFee = value;
        ApplicationSettings.setNumber('adminFee', value);
        this.notifyPropertyChange('adminFee', value);
    }

    updateName(index: number, value: string) {
        this._tempProducts[index].name = value;
    }

    updatePrice(index: number, value: string) {
        const price = Number(value) || 0;
        this._tempProducts[index].pricePerUnit = price;
    }

    updateStock(index: number, value: string) {
        const stock = Number(value) || 0;
        this._tempProducts[index].stockNeeded = stock;
    }

    saveChanges() {
        // Filter out empty rows (where both price and stock are 0)
        const validProducts = this._tempProducts.filter(
            (p, index) => index < this._products.length || (p.pricePerUnit !== 0 || p.stockNeeded !== 0)
        );

        // Update the original products array
        this._products.length = 0; // Clear the array
        this._products.push(...validProducts); // Add all valid products
        
        // Save to persistent storage
        this.saveProducts(this._products);
        
        // Show success message and go back
        alert("Changes saved successfully!");
        const frame = Frame.topmost();
        if (frame) {
            frame.goBack();
        }
    }
}

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new ProductsViewModel();
}

export function goBack() {
    const frame = Frame.topmost();
    if (frame) {
        frame.goBack();
    }
}