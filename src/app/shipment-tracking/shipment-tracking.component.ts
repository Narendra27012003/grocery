import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { StockManagementService } from '../services/stock-management.service';

export interface ShipmentItem {
  id: string;
  shipperName: string;
  ['phoneNo.']: string;
  status: string;
  product: string;
  supplier: string;
  quantity: number;
  price: number;
  deliveryDate: string;
  consignee: string;
  destination: string;
  connection: string;
  task: string;
}

@Component({
  selector: 'app-shipment-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './shipment-tracking.component.html',
  styleUrls: ['./shipment-tracking.component.css']
})
export class ShipmentTrackingComponent implements OnInit {
  // Shipment status tabs
  shipmentTabs: string[] = ['all', 'in-transit', 'pending', 'completed', 'failed'];
  selectedTab: string = 'all';

  // Shipments Data
  shipmentsList: ShipmentItem[] = [];
  filteredShipments: ShipmentItem[] = [];

  // Modal properties for creating/editing task (reuse same modal logic)
  showEditModal = false;
  isEditMode = false;
  editData: any = {};

  // Google Maps variables
  displayMap = false;
  center: google.maps.LatLngLiteral = { lat: 28.7041, lng: 77.1025 };
  zoom = 5;
  originMarker: google.maps.LatLngLiteral | null = null;
  destinationMarker: google.maps.LatLngLiteral | null = null;

  constructor(private stockService: StockManagementService) {}

  ngOnInit(): void {
    this.stockService.getShipmentsData().subscribe({
      next: (res) => {
        this.shipmentsList = res.shipmentsList || [];
        this.filteredShipments = [...this.shipmentsList];
        this.applyTabFilter();
      },
      error: (err) => console.error('Error fetching shipments:', err)
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.applyTabFilter();
  }

  applyTabFilter(): void {
    if (this.selectedTab === 'all') {
      this.filteredShipments = [...this.shipmentsList];
    } else {
      this.filteredShipments = this.shipmentsList.filter(
        shipment => shipment.status.toLowerCase() === this.selectedTab
      );
    }
  }

  // When user clicks "View", show a map with random origin and destination markers.
  viewShipment(shipment: ShipmentItem): void {
    this.displayMap = true;
    this.originMarker = this.getRandomLatLng();
    this.destinationMarker = this.getRandomLatLng();
    this.center = this.originMarker;
    this.zoom = 5;
  }

  getRandomLatLng(): google.maps.LatLngLiteral {
    // Generate random lat/lng within a defined range (example: India)
    const lat = 8 + Math.random() * 20;
    const lng = 70 + Math.random() * 15;
    return { lat, lng };
  }

  // Reuse modal functions from your stock management component:
  openEditModal(item?: ShipmentItem): void {
    this.showEditModal = true;
    if (item) {
      this.isEditMode = true;
      this.editData = { ...item };
    } else {
      this.isEditMode = false;
      this.editData = {
        id: '',
        shipperName: '',
        'phoneNo.': '',
        status: 'pending',
        product: '',
        supplier: '',
        quantity: 0,
        price: 0,
        deliveryDate: '',
        consignee: '',
        destination: '',
        connection: '',
        task: ''
      };
    }
  }

  closeModal(): void {
    this.showEditModal = false;
  }

  saveData(): void {
    if (this.isEditMode) {
      const idx = this.shipmentsList.findIndex(s => s.id === this.editData.id);
      if (idx !== -1 && this.editData) {
        this.shipmentsList[idx] = this.editData;
      }
    } else {
      // Generate a simple id for the new shipment; in a real app, you'd use a better method.
      this.editData.id = 'LP-' + Math.floor(Math.random() * 1000000);
      this.shipmentsList.unshift(this.editData);
    }
    this.filteredShipments = [...this.shipmentsList];
    this.applyTabFilter();
    this.showEditModal = false;
  }
}
