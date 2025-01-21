import { Observable, ApplicationSettings } from '@nativescript/core';
import { Product, PRODUCTS } from './models/product.model';
import { getAdminFee } from './products-page';

interface StockItem {
    productName: string;
    stockAmount: string;
    stockPrice: number;
}

interface ClientDetails {
    name: string;
    address: string;
    phone: string;
    email: string;
    dieNie: string;
}

export class HelloWorldModel extends Observable {
    private _products: Product[] = this.loadSavedProducts();
    private _clientName: string = '';
    private _clientAddress: string = '';
    private _clientPhone: string = '';
    private _clientEmail: string = '';
    private _clientDieNie: string = '';
    private _savedClientDetails: ClientDetails | null = null;
    private _days: number = 0;
    private _visibleProducts: number = 1;
    private _selectedIndices: number[] = Array(6).fill(0);
    private _units: Array<number> = Array(6).fill(0);
    
    constructor() {
        super();
        this.calculateTotals();
        // Load saved client details if they exist
        const savedDetails = ApplicationSettings.getString('clientDetails', '');
        if (savedDetails) {
            this._savedClientDetails = JSON.parse(savedDetails);
            this.notifyPropertyChange('savedClientDetails', this._savedClientDetails);
        }
    }

    private loadSavedProducts(): Product[] {
        const savedProducts = ApplicationSettings.getString('products', '');
        if (savedProducts) {
            return JSON.parse(savedProducts);
        }
        return [...PRODUCTS];
    }

    get products(): string[] {
        return this._products.map(p => p.name);
    }

    get visibleProducts(): number {
        return this._visibleProducts;
    }

    get selectedIndices(): number[] {
        return this._selectedIndices;
    }

    get units(): Array<number> {
        return this._units;
    }

    get savedClientDetails(): ClientDetails | null {
        return this._savedClientDetails;
    }

    addProduct() {
        if (this._visibleProducts < 6) {
            this._visibleProducts++;
            this.notifyPropertyChange('visibleProducts', this._visibleProducts);
            this.calculateTotals();
        }
    }

    setSelectedIndex(index: number, value: number) {
        if (this._selectedIndices[index] !== value) {
            this._selectedIndices[index] = value;
            this.notifyPropertyChange('selectedIndices', this._selectedIndices);
            this.calculateTotals();
        }
    }

    setUnits(index: number, value: string) {
        const numValue = Number(value) || 0;
        if (this._units[index] !== numValue) {
            this._units[index] = numValue;
            this.notifyPropertyChange('units', this._units);
            this.calculateTotals();
        }
    }

    getProductCost(index: number): number {
        return this._units[index] * this._products[this._selectedIndices[index]].pricePerUnit;
    }

    getProductStock(index: number): number {
        return this._units[index] * this._products[this._selectedIndices[index]].stockNeeded;
    }

    saveClientDetails() {
        if (!this._clientName && !this._clientAddress && !this._clientPhone && 
            !this._clientEmail && !this._clientDieNie) {
            return; // Don't save if all fields are empty
        }

        this._savedClientDetails = {
            name: this._clientName,
            address: this._clientAddress,
            phone: this._clientPhone,
            email: this._clientEmail,
            dieNie: this._clientDieNie
        };

        // Save to persistent storage
        ApplicationSettings.setString('clientDetails', JSON.stringify(this._savedClientDetails));
        
        // Notify the change
        this.notifyPropertyChange('savedClientDetails', this._savedClientDetails);
        
        // Clear input fields
        this._clientName = '';
        this._clientAddress = '';
        this._clientPhone = '';
        this._clientEmail = '';
        this._clientDieNie = '';
        
        // Notify changes for input fields
        this.notifyPropertyChange('clientName', '');
        this.notifyPropertyChange('clientAddress', '');
        this.notifyPropertyChange('clientPhone', '');
        this.notifyPropertyChange('clientEmail', '');
        this.notifyPropertyChange('clientDieNie', '');
    }

    clearClientDetails() {
        this._savedClientDetails = null;
        ApplicationSettings.remove('clientDetails');
        this.notifyPropertyChange('savedClientDetails', null);
    }

    get clientName(): string { return this._clientName; }
    set clientName(value: string) {
        if (this._clientName !== value) {
            this._clientName = value;
            this.notifyPropertyChange('clientName', value);
        }
    }

    get clientAddress(): string { return this._clientAddress; }
    set clientAddress(value: string) {
        if (this._clientAddress !== value) {
            this._clientAddress = value;
            this.notifyPropertyChange('clientAddress', value);
        }
    }

    get clientPhone(): string { return this._clientPhone; }
    set clientPhone(value: string) {
        if (this._clientPhone !== value) {
            this._clientPhone = value;
            this.notifyPropertyChange('clientPhone', value);
        }
    }

    get clientEmail(): string { return this._clientEmail; }
    set clientEmail(value: string) {
        if (this._clientEmail !== value) {
            this._clientEmail = value;
            this.notifyPropertyChange('clientEmail', value);
        }
    }

    get clientDieNie(): string { return this._clientDieNie; }
    set clientDieNie(value: string) {
        if (this._clientDieNie !== value) {
            this._clientDieNie = value;
            this.notifyPropertyChange('clientDieNie', value);
        }
    }

    get days(): number { return this._days; }
    set days(value: number) {
        const numValue = Number(value) || 0;
        if (this._days !== numValue) {
            this._days = numValue;
            this.notifyPropertyChange('days', numValue);
            this.calculateTotals();
        }
    }

    get laborCost(): number {
        return this._days * 200;
    }

    get productCosts(): number {
        return this._units.reduce((total, _, index) => total + this.getProductCost(index), 0);
    }

    get totalStockNeeded(): number {
        return this._units.reduce((total, _, index) => total + this.getProductStock(index), 0);
    }

    get runningTotal(): number {
        return this.productCosts + this.laborCost;
    }

    get adminCost(): number {
        return getAdminFee();
    }

    get commission(): number {
        return this.runningTotal * 0.10;
    }

    get subtotal(): number {
        return this.runningTotal + this.adminCost + this.commission;
    }

    get vat(): number {
        return this.subtotal * 0.07;
    }

    get finalTotal(): number {
        return this.subtotal + this.vat;
    }

    get totalStockCost(): number {
        return this.getStockBreakdown().reduce((total, item) => total + item.stockPrice, 0);
    }

    getStockBreakdown(): StockItem[] {
        const stockMap = new Map<string, { amount: number, price: number }>();
        
        // Calculate stock needed and price for each product
        for (let i = 0; i < this._visibleProducts; i++) {
            const selectedProduct = this._products[this._selectedIndices[i]];
            if (selectedProduct && this._units[i] > 0) {
                const stockNeeded = this.getProductStock(i);
                if (stockNeeded > 0) {
                    const current = stockMap.get(selectedProduct.name) || { amount: 0, price: 0 };
                    const stockPrice = stockNeeded * selectedProduct.pricePerUnit;
                    stockMap.set(selectedProduct.name, {
                        amount: current.amount + stockNeeded,
                        price: current.price + stockPrice
                    });
                }
            }
        }

        // Convert to array of StockItems
        return Array.from(stockMap.entries())
            .map(([name, { amount, price }]) => ({
                productName: name,
                stockAmount: amount.toFixed(2),
                stockPrice: price
            }))
            .filter(item => parseFloat(item.stockAmount) > 0);
    }

    calculateTotals() {
        this.notifyPropertyChange('laborCost', this.laborCost);
        this.notifyPropertyChange('productCosts', this.productCosts);
        this.notifyPropertyChange('totalStockNeeded', this.totalStockNeeded);
        this.notifyPropertyChange('runningTotal', this.runningTotal);
        this.notifyPropertyChange('adminCost', this.adminCost);
        this.notifyPropertyChange('commission', this.commission);
        this.notifyPropertyChange('subtotal', this.subtotal);
        this.notifyPropertyChange('vat', this.vat);
        this.notifyPropertyChange('finalTotal', this.finalTotal);
        this.notifyPropertyChange('totalStockCost', this.totalStockCost);
        this.notifyPropertyChange('getStockBreakdown', this.getStockBreakdown());
    }
}