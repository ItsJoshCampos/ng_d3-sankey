import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  ngOnInit(): void {
      this.DrawChart();
  }

  private DrawChart() {

      var svg = d3.select("#sankey"),
          width = +svg.attr("width"),
          height = +svg.attr("height");

      var formatNumber = d3.format(",.0f"),
          format = function (d: any) { return formatNumber(d) + " series"; },
          color = d3.scaleOrdinal(d3.schemeCategory10);

      var sankey = d3Sankey.sankey()
          .nodeWidth(15)
          .nodePadding(10)
          .extent([[1, 1], [width - 1, height - 6]]);

      var link = svg.append("g")
          .attr("class", "links")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.2)
          .selectAll("path");

      var node = svg.append("g")
          .attr("class", "nodes")
          .attr("font-family", "tahoma")
          .attr("font-size", 10)
          .selectAll("g");

      d3.json("../assets/data.json", function (error, data: any) {
          if (error) throw error;

          sankey(data);

          link = link
              .data(data.links)
              .enter().append("path")
              .attr("d", d3Sankey.sankeyLinkHorizontal())
              .attr("stroke-width", function (d: any) { return Math.max(1, d.width); });

          link.append("title")
              .text(function (d: any) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

          node = node
              .data(data.nodes)
              .enter().append("g");

          node.append("rect")
              .attr("x", function (d: any) { return d.x0; })
              .attr("y", function (d: any) { return d.y0; })
              .attr("height", function (d: any) { return d.y1 - d.y0; })
              .attr("width", function (d: any) { return d.x1 - d.x0; })
              .attr("fill", function (d: any) { return color(d.name.replace(/ .*/, "")); })
              .attr("stroke", "#000");

          node.append("text")
              .attr("x", function (d: any) { return d.x0 - 6; })
              .attr("y", function (d: any) { return (d.y1 + d.y0) / 2; })
              .attr("dy", "0.35em")
              .attr("text-anchor", "end")
              .text(function (d: any) { return d.name; })
              .filter(function (d: any) { return d.x0 < width / 2; })
              .attr("x", function (d: any) { return d.x1 + 6; })
              .attr("text-anchor", "start");

          node.append("title")
              .text(function (d: any) { return d.name + "\n" + format(d.value); });
      });
    };
}
