angular.module("dateaWebApp")
.directive("daVote", 
[
  'Api'
, 'User'
, '$location'
, function (
	  Api
	, User
	, $location
) {
	
	return {
		  restrict    : "E"
		, templateUrl : "/views/vote-button.html"
		, replace		  : true
		, scope: {
			   btnClass  		: '@'
		   , voteObj 			: '@'
		   , voteId  			: '='
		   , voteCallback : '=?'
		   , voteCount    : '='
		}
		, controller : function ($scope, $element, $attrs) {

			var checkHasVoted
				, mouseHasLeft
			;

			$scope.vote              = {};
			$scope.flow              = {};
			$scope.flow.isActive     = false;
			$scope.flow.loading      = false;
			$scope.flow.disabled     = true;
			$scope.flow.hoverEnabled = false;

			$scope.$watch('voteId', function () {
				checkHasVoted();
			});

			checkHasVoted = function () {
				if (User.isSignedIn() && $scope.voteId) {
					Api.vote
					.getVotes( { user : User.data.id, vote_key : $scope.voteObj+'.'+$scope.voteId } )
					.then( function ( response ) {
						$scope.flow.disabled = false;
						$scope.flow.isActive = response.meta.total_count ? true : false;
						$scope.flow.hoverEnabled = true;
						if (response.objects.length) $scope.flow.vote = response.objects[0];
					}, function ( reason ) {
						console.log( reason );
						$scope.flow.disabled  = false;
						$scope.flow.hoverEnabled = true;
					} )
				}else{
					$scope.flow.disabled = false;
					$scope.flow.hoverEnabled = true;
				}
			}

			$scope.flow.doVote = function () {
				if (!User.isSignedIn()) {
					$location.path('/registrate');
					return;
				}
				if ( !$scope.flow.loading && !$scope.flow.disabled && !$scope.flow.isActive) {
					$scope.flow.loading = true;
					Api.vote
					.doVote( { vote_key : $scope.voteObj+'.'+$scope.voteId } )
					.then( function ( response ) {
						console.log( 'doVote', response );
						$scope.voteCount++;
						if (typeof($scope.voteCallback) != 'undefined') $scope.voteCallback(response);
						$scope.flow.loading  = false;
						$scope.flow.isActive = true;
					}, function ( reason ) {
						console.log( reason );
						$scope.flow.loading = false;
					} );
				} 
			}

			$scope.flow.doVote = function () {
				if (!User.isSignedIn()) {
					$location.path('/registrate');
					return;
				}
				if ( !$scope.flow.loading && !$scope.flow.disabled) {
					$scope.flow.loading = true;
					$scope.flow.hoverEnabled = false;
					mouseHasLeft = false;
					// POST
					if (!$scope.flow.isActive) {
						Api.vote
						.doVote( { vote_key : $scope.voteObj+'.'+$scope.voteId } )
						.then( function ( response ) {
							console.log( 'vote', response );
							$scope.voteCount++;
							if (typeof($scope.voteCallback) != 'undefined') $scope.voteCallback(response, 'post');
							$scope.flow.loading  = false;
							$scope.flow.isActive = true;
							$scope.flow.vote = response;
							if (!mouseHasLeft) $scope.flow.hoverEnabled = false;
						}, function ( reason ) {
							console.log( reason );
							$scope.flow.loading = false;
							$scope.flow.hoverEnabled = true;
						} );
					// DELETE
					}else {
						Api.vote
						.deleteVote( { vote_key : $scope.voteObj+'.'+$scope.voteId, id: $scope.flow.vote.id } )
						.then( function ( response ) {
							console.log( 'delete Vote', response );
							$scope.voteCount--;
							if (typeof($scope.voteCallback) != 'undefined') $scope.voteCallback(response, 'delete');
							$scope.flow.loading  = false;
							$scope.flow.isActive = false;
							$scope.flow.vote = null;
							if (!mouseHasLeft) $scope.flow.hoverEnabled = false;
						}, function ( reason ) {
							console.log( reason );
							$scope.flow.loading = false;
							$scope.flow.hoverEnabled = true;
						} );
					}
				} 
			}

			$scope.flow.onMouseLeave = function () {
				//if ($scope.flow.loading === false) {
					mouseHasLeft = true;
					$scope.flow.hoverEnabled = true;
				//}
			}

		}
	}
} ] );
