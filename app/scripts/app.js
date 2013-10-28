'use strict';

var datea = angular.module( 'dateaWebApp', [ 'ngResource' ] )
	.config( [ '$routeProvider', '$httpProvider',
	function ( $routeProvider, $httpProvider ) {

		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		$routeProvider
		.when( '/' , { templateUrl : 'views/main.html'
		             , controller  : 'MainCtrl'
		             } )
		.otherwise( { redirectTo : '/' } );

	} ] );

datea.factory( 'User', [ '$http', '$resource', '$log',
	function ( $http, $resource, $log ) {
	var url
	  , defaults
	  , actions
	  ;

	url = 'http://192.168.1.37:8000/api/v2/create_user/:Bio';

	defaults = { bio: '@Bio' }

	actions = { 'update': { method: 'PUT' } }

	return $resource( url, defaults, actions )

} ] )