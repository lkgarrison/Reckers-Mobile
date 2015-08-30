angular.module('app').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/order');

	$stateProvider
		.state('root', {
			url: '',
			templateUrl: 'app/views/app-views.html'
		})

		.state('root.order', {
			url: '/order',
			phase: 'order',
			views: {
				'header' : {
					templateUrl: 'app/views/header-footer/header/order/order-header-view.html'
				},
				'content' : {
					templateUrl: 'app/views/order/order-view.html',
					controller: 'orderController',
					controllerAs: 'vm'
				},
				'footer' : {
					templateUrl: 'app/views/header-footer/footer/order/order-footer-view.html'
				}
			}
			
		})

		.state('root.customize-item-order', {
			url: '/customize-item-order/{menuIndex}',
			phase: 'order',
			views: {
				'header' : {
					templateUrl: 'app/views/header-footer/header/order/order-header-view.html'
				},
				'content' : {
					templateUrl: 'app/views/customize-item/customize-item-order/customize-item-order-view.html',
					controller: 'customizeItemOrderController',
					controllerAs: 'vm'
				},
				'footer' : {
					templateUrl: 'app/views/header-footer/footer/order/order-footer-view.html'
				}
			}
		})

		.state('root.checkout', {
			url: '/checkout',
			phase: 'checkout',
			views: {
				'header' : {
					templateUrl: 'app/views/header-footer/header/checkout/checkout-header-view.html'
				},
				'content' : {
					templateUrl: 'app/views/checkout/checkout-view.html',
					controller: 'checkoutController',
					controllerAs: 'vm'
				},
				'footer' : {
					templateUrl: 'app/views/header-footer/footer/checkout/checkout-footer-view.html'
				}
			}
		})

		.state('root.customize-item-checkout', {
			url: '/customize-item-checkout/{cartIndex}',
			phase: 'checkout',
			views: {
				'header' : {
					templateUrl: 'app/views/header-footer/header/customize-item/customize-item-checkout-header-view.html'
				},
				'content' : {
					templateUrl: 'app/views/customize-item/customize-item-checkout/customize-item-checkout-view.html',
					controller: 'customizeItemCheckoutController',
					controllerAs: 'vm'
				},
				'footer' : {
					templateUrl: 'app/views/header-footer/footer/checkout/checkout-footer-view.html'
				}
			}
		});
});