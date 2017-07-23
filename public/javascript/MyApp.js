
app.config(function($routeProvider) {
			$routeProvider
			.when("/", {
				templateUrl : "/views/home.html",
			})
			.when("/dashboard", {
				templateUrl : "/views/dashboard.html",
			})
			.when("/customer", {
				templateUrl : "/views/customer.html",
			})			
			.when("/about", {
				templateUrl : "/views/about.html",
			})
			.when("/contact", {
				templateUrl : "/views/contact.html",
			});
	});

app.controller('mycontroller', function($scope,$http,$sce,$location,$interval) {
	
	$scope.show = 0;
	$scope.myData = [];
	$scope.result = [];
	$http.get('/cmfirstcall').then(function(response){
			$scope.myData.push(response.data);
			console.log("response received");
			
	});	
	
	$scope.send = function(){
        console.log($scope.input.question);
	$scope.myData.push({"question" : $scope.input.question});
	var input =  {"question":$scope.input.question};
	$scope.input.question = " ";
	$http.post('/cmconsecutivecalls',input).then(function(response){
		$scope.input.question = " ";		
		$scope.myData.push(response.data.output);	
		
		if(response.data.context.sms == true)
		{	
			
			$http.post('/send',{message : "Temperature = 30 C and Humidity = 28"});
			
		}
	
		if(response.data.context.sense == true)
		{
			$location.path('dashboard');	
			callAtInterval();
			 $interval(callAtInterval, 10000,10);
			
			
			
				function callAtInterval() {
					console.log("interval");
					$scope.sensordata = [];
					$scope.data1 =[];
					$scope.data2 = [];
					$scope.data = [];
						$http.get('/getdata').then(function(response){
						var labels = [];
						var	 temprature = [];
						var humidity = [];
						for(var i = 0; i<response.data.rows.length && i<= 50; i++)
							if(response.data.rows[i].doc.data)
							{
								labels.push(response.data.rows[i].doc.timestamp.substring(11,19));
								temprature.push(response.data.rows[i].doc.data.d.temp);
								humidity.push(response.data.rows[i].doc.data.d.humidity);
							}
						$scope.labels = labels;
						 $scope.data = [temprature,humidity];
						 $scope.data1 = temprature;
						 $scope.data2 = humidity;
						 console.log($scope.data);
						/*$scope.data = [
						[65, 59, 80, 81, 56, 55, 40],
						[28, 48, 40, 19, 86, 27, 90]
					  ];*/
					});
					}

			
		}
			
	});		
}
		
  $scope.series = ['Series A', 'Series B'];
  
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };
});	

