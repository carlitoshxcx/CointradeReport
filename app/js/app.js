"use strict";
var app = angular
    .module('app', [])
    .controller('ctrlApp', ['$scope', '$filter', '$http', function($scope, $filter, $http) {
        $scope.timeseries = [];
        $scope.timeseries.arr = [];

        //Paginação
        $scope.currentPage = 0;
        $scope.pageSize = "10";
        $scope.filterTimeseries = {};

        $scope.timeseriesFiltered = function() {
            return $filter('filter')($scope.timeseries.arr, $scope.filterTimeseries);
        };
        
        $scope.pageNumber = function() {
            return Math.ceil($scope.timeseriesFiltered().length/$scope.pageSize);
        };

        $http.get("/jsondata").then(function(response) {
            $scope.timeseries = response.data;
            var objTimeSeries = $scope.timeseries['Time Series (Daily)'];
            
            // parse to array
            $scope.timeseries.arr = Object.keys(objTimeSeries).map(function(key) {
                var obj = objTimeSeries[key];
                    obj['0. date'] = key;
                return obj;
            });
            $scope.timeseries.arr.map(function(item, index){
                item.index  = index + 1;
            });
        });
    }])
    .directive('timeseries', [function() {
        return {
            template:   '<table class="highlight striped responsive-table timeseries">'+
                            '<thead>'+
                                '<tr>'+
                                    '<td><strong>#</strong></td>'+
                                    '<td><strong>Date</strong></td>'+
                                    '<td><strong>Open</strong></td>'+
                                    '<td><strong>High</strong></td>'+
                                    '<td><strong>Low</strong></td>'+
                                    '<td><strong>Close</strong></td>'+
                                    '<td><strong>Adjusted close</strong></td>'+
                                    '<td><strong>Volume</strong></td>'+
                                    '<td><strong><small>Dividend amount</small></strong></td>'+
                                    '<td><strong><small>Split coefficient</small></strong></td>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<tr ng-repeat="item in timeseries.arr | filter:filterTimeseries | startFrom:currentPage*pageSize | limitTo:pageSize">'+
                                    '<td><strong>{{ item.index}}</strong></td>'+
                                    '<td><strong>{{ item["0. date"]}}</strong></td>'+
                                    '<td>{{ item["1. open"]}}</td>'+
                                    '<td>{{ item["2. high"]}}</td>'+
                                    '<td>{{ item["3. low"]}}</td>'+
                                    '<td>{{ item["4. close"]}}</td>'+
                                    '<td>{{ item["5. adjusted close"]}}</td>'+
                                    '<td>{{ item["6. volume"]}}</td>'+
                                    '<td><small>{{ item["7. dividend amount"]}}</small></td>'+
                                    '<td><small>{{ item["8. split coefficient"]}}</small></td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>',
            replace: true
        };
    }])
    .filter('startFrom', [function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        };  
    }]);
