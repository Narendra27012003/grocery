import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockItem {
  customentName: string;
  product: string;
  supplier: string;
  dateOfEntry: string;
  quantity: number;
  price: number;
  sellingPrice: number;
  cashier: string;
  status: string;
}

export interface SummaryItem {
  title: string;
  units: number;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {
  // URL to your JSON file; adjust the path if necessary.
  private dataUrl = '/stock-management.json';
  private shipmentsUrl = '/shipments.json';

  constructor(private http: HttpClient) {}

  // Fetch complete data (summary and inventory list, plus chart data if available)
  getStockData(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
  getShipmentsData(): Observable<any> {
    return this.http.get<any>(this.shipmentsUrl);
  }
}
