import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockManagementService, StockItem, SummaryItem } from '../services/stock-management.service';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { HighchartsComponent } from '../highcharts/highcharts.component';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HighchartsChartModule, HighchartsComponent],
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit {
  // Summary data (should be provided in the order: Orders, Profit/Loss, Sales, Customenrs)
  stockSummary: SummaryItem[] = [];

  // Inventory Data
  stockList: StockItem[] = [];
  filteredStockList: StockItem[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  // Sorting & Filtering (for search and column filtering)
  sortColumn: string = 'customentName';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterColumn: string = 'customentName';
  filterText: string = '';
  searchQuery: string = '';

  // Inventory Tabs: Default is 'all'
  selectedInventoryTab: string = 'all';

  // Modal properties (for create/edit task)
  showEditModal = false;
  isEditMode = false;
  editData: Partial<StockItem> = {};

  // Full-screen toggle for inventory table
  showFullTable = false;

  // Highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor(private stockService: StockManagementService) {}

  ngOnInit(): void {
    // Fetch complete data (summary, inventory list, and chart data)
    this.stockService.getStockData().subscribe({
      next: (res) => {
        this.stockSummary = res.stockInventorySummary || [];
        this.stockList = res.stockInventoryList || [];
        this.filteredStockList = [...this.stockList];
        this.applySearchFilter();

        // Load chart data (use dummy data if none is provided)
        const chartData = res.stockInventoryOrdersChartData || [
          { date: '2025-01-01T00:00:00Z', numOfAvailableStock: 100, numOfUnvailableStock: 20 },
          { date: '2025-02-01T00:00:00Z', numOfAvailableStock: 150, numOfUnvailableStock: 30 },
          { date: '2025-03-01T00:00:00Z', numOfAvailableStock: 200, numOfUnvailableStock: 50 }
        ];
        this.loadChart(chartData);
      },
      error: (err) => console.error('Error fetching stock data:', err)
    });
  }

  // Highcharts configuration
  loadChart(chartData: any): void {
    const categories = chartData.map((data: any) => {
      const d = new Date(data.date);
      return d.toLocaleString('default', { month: 'short' });
    });
    this.chartOptions = {
      chart: { type: 'column' },
      title: { text: 'Total Orders' },
      xAxis: { categories },
      yAxis: { title: { text: 'Orders Count' } },
      series: [
        {
          name: 'Available',
          type: 'column',
          data: chartData.map((data: any) => data.numOfAvailableStock)
        },
        {
          name: 'Out of Stock',
          type: 'column',
          data: chartData.map((data: any) => data.numOfUnvailableStock)
        }
      ]
    };
  }

  /* Filtering and Sorting for Inventory */
  applySearchFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    // First, filter based on search query
    let tempList = this.stockList.filter(item =>
      item.customentName.toLowerCase().includes(query) ||
      item.product.toLowerCase().includes(query) ||
      item.cashier.toLowerCase().includes(query)
    );
    // Apply additional column filter if filterText is provided
    if (this.filterText.trim()) {
      tempList = tempList.filter(item => {
        const val = (item as any)[this.filterColumn]?.toString().toLowerCase() || '';
        return val.includes(this.filterText.toLowerCase());
      });
    }
    // Apply inventory tab filter (if not "all")
    if (this.selectedInventoryTab !== 'all') {
      tempList = tempList.filter(item => item.status.toLowerCase() === this.selectedInventoryTab);
    }
    this.filteredStockList = tempList;
    this.applySorting();
    this.currentPage = 1;
  }

  applySorting(): void {
    this.filteredStockList.sort((a, b) => {
      const valA = (a as any)[this.sortColumn];
      const valB = (b as any)[this.sortColumn];
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Inventory Tab Filtering: select a tab to filter inventory by status.
  selectInventoryTab(tab: string): void {
    this.selectedInventoryTab = tab;
    this.applySearchFilter();
  }

  /* Pagination Helpers */
  get totalPages(): number {
    return Math.ceil(this.filteredStockList.length / this.itemsPerPage);
  }

  get pagedData(): StockItem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredStockList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /* Full-Screen Table Toggle */
  toggleViewAll(): void {
    this.showFullTable = !this.showFullTable;
  }

  /* Modal: Create New Task / Edit Task */
  openEditModal(item?: StockItem): void {
    this.showEditModal = true;
    if (item) {
      this.isEditMode = true;
      this.editData = { ...item };
    } else {
      this.isEditMode = false;
      this.editData = {
        customentName: '',
        product: '',
        supplier: '',
        dateOfEntry: '',
        quantity: 0,
        price: 0,
        sellingPrice: 0,
        cashier: '',
        status: 'pending'
      };
    }
  }

  closeModal(): void {
    this.showEditModal = false;
  }

  saveData(): void {
    if (this.isEditMode) {
      const idx = this.stockList.findIndex(
        s => s.customentName === this.editData.customentName && s.product === this.editData.product
      );
      if (idx !== -1 && this.editData) {
        this.stockList[idx] = this.editData as StockItem;
      }
    } else {
      this.stockList.unshift(this.editData as StockItem);
    }
    this.filteredStockList = [...this.stockList];
    this.applySearchFilter();
    this.showEditModal = false;
  }
}
