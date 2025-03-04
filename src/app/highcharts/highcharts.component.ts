import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.css']
})
export class HighchartsComponent implements OnInit {
  // Expose Highcharts to the template using the correct property name.
  public Highcharts: typeof Highcharts = Highcharts;
  // Define chart options with an explicit series type.
  public chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Sample Line Chart'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
      },
      yAxis: {
        title: {
          text: 'Value'
        }
      },
      series: [{
        name: 'Series 1',
        type: 'line', // Explicitly specify the series type.
        data: [29, 71, 106, 129, 144]
      }]
    };
  }
}
